document.addEventListener('DOMContentLoaded', function() {
    // 顯示和隱藏對話框的元素
    const aboutLink = document.getElementById('about-link');
    const helpLink = document.getElementById('help-link');
    const aboutModal = document.getElementById('about-modal');
    const helpModal = document.getElementById('help-modal');
    const closeButtons = document.querySelectorAll('.modal-close-btn');
    
    // 文件上傳預覽相關元素
    const dataFilesInput = document.getElementById('data-files');
    const dataFilesPreview = document.getElementById('data-files-preview');
    const dataFilesList = document.getElementById('data-files-list');
    const imageFilesInput = document.getElementById('image-files');
    const imageFilesPreview = document.getElementById('image-files-preview');
    const imageFilesList = document.getElementById('image-files-list');
    
    // 按鈕元素
    const generateReportBtn = document.getElementById('generate-report-btn');
    const downloadReportBtn = document.getElementById('download-report-btn');
    const newAnalysisBtn = document.getElementById('new-analysis-btn');
    
    // 頁面區塊
    const loadingSection = document.getElementById('loading-section');
    const resultSection = document.getElementById('result-section');
    const resultContent = document.getElementById('result-content');
    
    // 存儲上傳的文件
    let uploadedDataFiles = [];
    let uploadedImageFiles = [];
    
    // 處理模態對話框的顯示和隱藏
    aboutLink.addEventListener('click', function(e) {
        e.preventDefault();
        aboutModal.classList.remove('hidden');
    });
    
    helpLink.addEventListener('click', function(e) {
        e.preventDefault();
        helpModal.classList.remove('hidden');
    });
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            aboutModal.classList.add('hidden');
            helpModal.classList.add('hidden');
        });
    });
    
    // 點擊模態對話框外部時關閉
    window.addEventListener('click', function(e) {
        if (e.target === aboutModal) {
            aboutModal.classList.add('hidden');
        }
        if (e.target === helpModal) {
            helpModal.classList.add('hidden');
        }
    });
    
    // 處理數據文件上傳預覽
    dataFilesInput.addEventListener('change', function() {
        uploadedDataFiles = Array.from(this.files);
        updateDataFilesList();
    });
    
    // 處理圖片文件上傳預覽
    imageFilesInput.addEventListener('change', function() {
        uploadedImageFiles = Array.from(this.files);
        updateImageFilesList();
    });
    
    // 更新數據文件列表顯示
    function updateDataFilesList() {
        if (uploadedDataFiles.length > 0) {
            dataFilesPreview.classList.remove('hidden');
            dataFilesList.innerHTML = '';
            uploadedDataFiles.forEach(file => {
                const li = document.createElement('li');
                li.textContent = file.name;
                dataFilesList.appendChild(li);
            });
        } else {
            dataFilesPreview.classList.add('hidden');
        }
    }
    
    // 更新圖片文件列表顯示
    function updateImageFilesList() {
        if (uploadedImageFiles.length > 0) {
            imageFilesPreview.classList.remove('hidden');
            imageFilesList.innerHTML = '';
            uploadedImageFiles.forEach(file => {
                const div = document.createElement('div');
                div.className = 'relative';
                
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.className = 'w-full h-24 object-cover rounded border border-gray-300';
                img.alt = file.name;
                
                const span = document.createElement('span');
                span.className = 'block text-xs text-center mt-1 truncate';
                span.textContent = file.name;
                
                div.appendChild(img);
                div.appendChild(span);
                imageFilesList.appendChild(div);
            });
        } else {
            imageFilesPreview.classList.add('hidden');
        }
    }
    
    // 處理生成報告按鈕點擊
    generateReportBtn.addEventListener('click', function() {
        if (uploadedDataFiles.length === 0) {
            alert('請上傳至少一個數據文件');
            return;
        }
        
        // 顯示載入區塊
        loadingSection.classList.remove('hidden');
        
        // 收集表單數據
        const experimentData = {
            compoundName: document.getElementById('compound-name').value,
            targetProtein: document.getElementById('target-protein').value,
            cellType: document.getElementById('cell-type').value,
            treatmentTime: document.getElementById('treatment-time').value,
            experimentDescription: document.getElementById('experiment-description').value
        };
        
        // 準備表單數據
        const formData = new FormData();
        formData.append('experimentData', JSON.stringify(experimentData));
        
        // 添加所有數據文件
        uploadedDataFiles.forEach(file => {
            formData.append('dataFiles', file);
        });
        
        // 添加所有圖片文件
        uploadedImageFiles.forEach(file => {
            formData.append('imageFiles', file);
        });
        
        // 發送到 Colab API
        connectToColabAPI(formData);
    });
    
    // 連接到 Colab API
    function connectToColabAPI(formData) {
        // 更新載入訊息
        const loadingMessage = document.getElementById('loading-message');
        loadingMessage.textContent = '連接到分析伺服器中...';
        
        // Colab API 端點
        const colabAPIEndpoint = 'https://cellpainting-api.james-chang-04c.workers.dev/analyze';
        
        // 注釋掉模擬代碼
        /*
        setTimeout(() => {
            loadingMessage.textContent = '正在分析數據...';
            
            setTimeout(() => {
                loadingMessage.textContent = '生成報告中...';
                
                setTimeout(() => {
                    loadingSection.classList.add('hidden');
                    resultSection.classList.remove('hidden');
                    
                    displayDummyResults();
                }, 3000);
            }, 5000);
        }, 2000);
        */
        
        // 啟用實際API調用代碼
        fetch(colabAPIEndpoint, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('伺服器回應錯誤: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // 隱藏載入區塊，顯示結果區塊
            loadingSection.classList.add('hidden');
            resultSection.classList.remove('hidden');
            
            // 處理並顯示結果
            displayResults(data);
        })
        .catch(error => {
            console.error('錯誤:', error);
            loadingSection.classList.add('hidden');
            alert('分析過程中發生錯誤: ' + error.message);
        });
    }
    
    // 顯示 API 返回的結果
function displayResults(data) {
    const compoundName = document.getElementById('compound-name').value;
    const targetProtein = document.getElementById('target-protein').value;
    
    // 構建 HTML 內容
    let resultsHTML = `
        <div class="mb-4 p-4 bg-green-100 border-l-4 border-green-500 rounded">
            <p class="text-lg"><i class="fas fa-check-circle text-green-600 mr-2"></i>${data.message || '報告已成功生成!'}</p>
        </div>
        <div class="mb-4">
            <h3 class="font-medium text-lg mb-2">報告摘要</h3>
            <p>我們完成了對 ${compoundName} 在 ${targetProtein} 表達上的影響分析。報告包含三個主要部分：氣流率分析、顆粒分布均勻性分析以及濃度-響應分析。</p>
        </div>`;
    
    // 添加圖表預覽（如果有）
    if (data.chartPreviews && data.chartPreviews.length > 0) {
        resultsHTML += `
        <div class="mb-4">
            <h3 class="font-medium text-lg mb-2">分析圖表</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">`;
        
        data.chartPreviews.forEach(chart => {
            resultsHTML += `
                <div class="border rounded-md p-2">
                    <img src="${chart.image}" alt="${chart.caption}" class="w-full h-auto">
                    <p class="text-sm text-center mt-2">${chart.caption}</p>
                </div>`;
        });
        
        resultsHTML += `
            </div>
        </div>`;
    }
    
    // 添加報告預覽
    if (data.reportPreview) {
        resultsHTML += `
        <div class="mb-4">
            <h3 class="font-medium text-lg mb-2">報告預覽</h3>
            <div class="border border-gray-300 rounded-md p-4 bg-gray-50 whitespace-pre-line">
                ${data.reportPreview}
                <div class="mt-2 text-center text-gray-500">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        </div>`;
    }
    
    // 更新 DOM
    resultContent.innerHTML = resultsHTML;
    
    // 設置下載按鈕的事件處理程序
    if (data.reportPath) {
        downloadReportBtn.onclick = function() {
            // 獲取 Colab API 下載端點的基礎 URL
            const apiBaseUrl = new URL(colabAPIEndpoint).origin;
            // 構建完整的下載 URL
            const downloadUrl = `${apiBaseUrl}/download/${data.reportPath}`;
            // 打開下載鏈接
            window.open(downloadUrl, '_blank');
        };
        downloadReportBtn.disabled = false;
    } else {
        downloadReportBtn.disabled = true;
    }
}
    
    // 下載報告
    downloadReportBtn.addEventListener('click', function() {
        alert('報告下載功能將在連接到實際API後啟用');
    });
    
    // 開始新分析
    newAnalysisBtn.addEventListener('click', function() {
        // 重置文件上傳
        dataFilesInput.value = '';
        imageFilesInput.value = '';
        uploadedDataFiles = [];
        uploadedImageFiles = [];
        updateDataFilesList();
        updateImageFilesList();
        
        // 隱藏結果區塊
        resultSection.classList.add('hidden');
    });
});
