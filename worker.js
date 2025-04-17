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

  // 獲取請求 URL
  const url = new URL(request.url);
  const pathname = url.pathname;

  // 處理 POST 請求（分析功能）
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
      
      // 根據請求路徑選擇合適的 Colab 端點
      let colabUrl;
      
      if (pathname === '/analyze-particle') {
        // 粒子分析 API 端點
        colabUrl = PARTICLE_API_URL; // 從環境變量獲取
        console.log("使用粒子分析 API 端點:", colabUrl);
      } else {
        // 默認 API 端點（一般分析）
        colabUrl = COLAB_API_URL; // 從環境變量獲取
        console.log("使用一般分析 API 端點:", colabUrl);
      }
      
      // 創建新的 FormData 對象來傳遞到 Colab
      const colabFormData = new FormData();
      
      // 添加實驗參數
      colabFormData.append('experimentData', experimentDataJson);
      
      // 如果是粒子分析，添加通道參數
      if (pathname === '/analyze-particle') {
        const channel = formData.get('channel') || 'red';
        colabFormData.append('channel', channel);
      }
      
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
  
  // 處理 GET 請求（下載功能）
  if (request.method === 'GET') {
    try {
      // 檢查 URL 是否包含 download 路徑
      if (url.pathname.startsWith('/download/')) {
        // 從路徑中提取檔案名
        const filename = url.pathname.split('/download/')[1];
        
        // 構建轉發到 Colab 的請求
        // 根據請求來源選擇合適的 Colab 下載端點
        let colabBaseUrl;
        
        // 從 referer 檢查請求來源
        const referer = request.headers.get('referer') || '';
        if (referer.includes('particle')) {
          colabBaseUrl = PARTICLE_API_URL.split('/analyze')[0];
        } else {
          colabBaseUrl = COLAB_API_URL.split('/analyze')[0];
        }
        
        const downloadUrl = `${colabBaseUrl}/download/${filename}`;
        
        console.log(`Forwarding download request to ${downloadUrl}`);
        
        // 轉發請求到 Colab
        const response = await fetch(downloadUrl);
        
        if (!response.ok) {
          return new Response(JSON.stringify({ 
            error: `Colab server responded with status: ${response.status}`,
            url: downloadUrl
          }), {
            status: response.status,
            headers: {
              ...corsHeaders(),
              'Content-Type': 'application/json',
            }
          });
        }
        
        // 從 Colab 獲取檔案並轉發給使用者
        const fileContent = await response.arrayBuffer();
        
        // 取得原始回應的 headers
        const headers = new Headers();
        response.headers.forEach((value, key) => {
          headers.append(key, value);
        });
        
        // 添加 CORS headers
        Object.entries(corsHeaders()).forEach(([key, value]) => {
          headers.set(key, value);
        });
        
        // 確保設置正確的 Content-Disposition
        if (!headers.has('Content-Disposition')) {
          headers.set('Content-Disposition', `attachment; filename="${filename}"`);
        }
        
        // 返回檔案內容
        return new Response(fileContent, {
          status: 200,
          headers
        });
      }
    } catch (error) {
      console.error('Download error:', error);
      
      return new Response(JSON.stringify({ 
        error: 'Download failed', 
        details: error.message 
      }), {
        status: 500,
        headers: {
          ...corsHeaders(),
          'Content-Type': 'application/json',
        }
      });
    }
  }
  
  // 處理不支持的 HTTP 方法或路徑
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: {
      ...corsHeaders(),
      'Content-Type': 'application/json',
      'Allow': 'GET, POST, OPTIONS'
    },
  });
}

// 註冊事件監聽器
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
