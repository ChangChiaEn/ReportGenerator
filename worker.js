// Cloudflare Worker 用於連接前端與 Colab 後端
// 部署到 Cloudflare Workers 平台

// 定義 CORS 頭部函數
function corsHeaders() {
    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
  }
  
  // 處理 OPTIONS 請求（CORS 預檢）
  async function handleOptions() {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(),
    });
  }
  
  // 主要處理函數
  async function handleRequest(request) {
    // 處理 CORS 預檢
    if (request.method === 'OPTIONS') {
      return handleOptions();
    }
  
    if (request.method === 'POST') {
      try {
        // 讀取請求表單數據
        const formData = await request.formData();
        
        // 從表單數據中提取實驗參數
        const experimentDataJson = formData.get('experimentData');
        let experimentData;
        try {
          experimentData = JSON.parse(experimentDataJson);
        } catch (e) {
          return new Response(JSON.stringify({ error: 'Invalid experiment data format' }), {
            status: 400,
            headers: {
              ...corsHeaders(),
              'Content-Type': 'application/json',
            },
          });
        }
        
        // 處理數據文件
        const dataFiles = formData.getAll('dataFiles');
        // 處理圖片文件
        const imageFiles = formData.getAll('imageFiles');
        
        // 這裡構建發送到 Colab 的請求
        // 要將請求發送到公開的 Colab 服務器地址
        const colabUrl = COLAB_API_URL; // 從環境變量獲取
        
        // 創建新的 FormData 對象來傳遞到 Colab
        const colabFormData = new FormData();
        
        // 添加實驗參數
        colabFormData.append('experimentData', experimentDataJson);
        
        // 添加所有文件
        for (const file of dataFiles) {
          colabFormData.append('dataFiles', file);
        }
        
        for (const file of imageFiles) {
          colabFormData.append('imageFiles', file);
        }
        
        // 發送請求到 Colab 服務器
        const colabResponse = await fetch(colabUrl, {
          method: 'POST',
          body: colabFormData,
        });
        
        // 檢查 Colab 響應
        if (!colabResponse.ok) {
          throw new Error(`Colab server responded with status: ${colabResponse.status}`);
        }
        
        // 從 Colab 獲取結果
        const colabResult = await colabResponse.json();
        
        // 返回結果給前端
        return new Response(JSON.stringify(colabResult), {
          headers: {
            ...corsHeaders(),
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Error processing request:', error);
        
        // 返回錯誤響應
        return new Response(JSON.stringify({ 
          error: 'Failed to process request',
          details: error.message 
        }), {
          status: 500,
          headers: {
            ...corsHeaders(),
            'Content-Type': 'application/json',
          },
        });
      }
    }
    
    // 處理不支持的 HTTP 方法
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        ...corsHeaders(),
        'Content-Type': 'application/json',
      },
    });
  }
  
  // 註冊事件監聽器
  addEventListener('fetch', (event) => {
    event.respondWith(handleRequest(event.request));
  });
