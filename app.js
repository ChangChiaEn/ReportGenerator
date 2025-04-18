document.addEventListener('DOMContentLoaded', function() {
    // 現有的元素選擇器
    const aboutLink = document.getElementById('about-link');
    const helpLink = document.getElementById('help-link');
    const aboutModal = document.getElementById('about-modal');
    const helpModal = document.getElementById('help-modal');
    const closeButtons = document.querySelectorAll('.modal-close-btn');
    
    // 頁面頁籤切換相關元素
    const mainTab = document.getElementById('main-tab');
    const particleTab = document.getElementById('particle-tab');
    const mainSection = document.getElementById('main-section');
    const particleSection = document.getElementById('particle-section');
    
    // 文件上傳預覽相關元素
    const dataFilesInput = document.getElementById('data-files');
    const dataFilesPreview = document.getElementById('data-files-preview');
    const dataFilesList = document.getElementById('data-files-list');
    const imageFilesInput = document.getElementById('image-files');
    const imageFilesPreview = document.getElementById('image-files-preview');
    const imageFilesList = document.getElementById('image-files-list');
    
    // 粒子分析相關元素
    const particleDataFilesInput = document.getElementById('particle-data-files');
    const particleDataFilesPreview = document.getElementById('particle-data-files-preview');
    const particleDataFilesList = document.getElementById('particle-data-files-list');
    const particleImageFilesInput = document.getElementById('particle-image-files');
    const particleImageFilesPreview = document.getElementById('particle-image-files-preview');
    const particleImageFilesList = document.getElementById('particle-image-files-list');
    
    // 按鈕元素
    const generateReportBtn = document.getElementById('generate-report-btn');
    const analyzeParticleBtn = document.getElementById('analyze-particle-btn');
    const downloadReportBtn = document.getElementById('download-report-btn');
    const newAnalysisBtn = document.getElementById('new-analysis-btn');
    
    // 頁面區塊
    const loadingSection = document.getElementById('loading-section');
    const resultSection = document.getElementById('result-section');
    const resultContent = document.getElementById('result-content');
    
    // 存儲上傳的文件
    let uploadedDataFiles = [];
    let uploadedImageFiles = [];
    let uploadedParticleDataFiles = [];
    let uploadedParticleImageFiles = [];
    
    // API 端點 - 修改為 Render 部署的 API 地址
    let reportGeneratorAPIEndpoint = 'https://report-generator-api-mnft.onrender.com';
    let particleDistributionAPIEndpoint = 'https://particle-distribution-api.onrender.com';
    
    // 初始化下載按鈕 - 開始時禁用
    downloadReportBtn.disabled = true;
    
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
    
    // 頁籤切換功能
    function switchToMainTab() {
        // 更新卡片樣式
        mainTab.classList.add('active');
        mainTab.classList.add('border-blue-500');
        mainTab.classList.remove('border-transparent');
        
        // 確保主頁籤圖標使用正確顏色
        const mainIcon = mainTab.querySelector('div:first-child');
        mainIcon.classList.remove('bg-gray-100', 'text-gray-600');
        mainIcon.classList.add('bg-blue-100', 'text-blue-600');
        
        // 更新另一個卡片
        particleTab.classList.remove('active');
        particleTab.classList.remove('border-blue-500');
        particleTab.classList.add('border-transparent');
        
        // 確保另一個頁籤圖標使用灰色
        const particleIcon = particleTab.querySelector('div:first-child');
        particleIcon.classList.remove('bg-blue-100', 'text-blue-600');
        particleIcon.classList.add('bg-gray-100', 'text-gray-600');
        
        // 顯示對應區塊
        mainSection.classList.remove('hidden');
        particleSection.classList.add('hidden');
        
        // 行動裝置選單
        document.getElementById('mobile-menu').classList.add('hidden');
    }
    
    function switchToParticleTab() {
        // 更新卡片樣式
        particleTab.classList.add('active');
        particleTab.classList.add('border-blue-500');
        particleTab.classList.remove('border-transparent');
        
        // 確保粒子頁籤圖標使用正確顏色
        const particleIcon = particleTab.querySelector('div:first-child');
        particleIcon.classList.remove('bg-gray-100', 'text-gray-600');
        particleIcon.classList.add('bg-blue-100', 'text-blue-600');
        
        // 更新另一個卡片
        mainTab.classList.remove('active');
        mainTab.classList.remove('border-blue-500');
        mainTab.classList.add('border-transparent');
        
        // 確保另一個頁籤圖標使用灰色
        const mainIcon = mainTab.querySelector('div:first-child');
        mainIcon.classList.remove('bg-blue-100', 'text-blue-600');
        mainIcon.classList.add('bg-gray-100', 'text-gray-600');
        
        // 顯示對應區塊
        particleSection.classList.remove('hidden');
        mainSection.classList.add('hidden');
        
        // 行動裝置選單
        document.getElementById('mobile-menu').classList.add('hidden');
    }
    
    mainTab.addEventListener('click', function(e) {
        e.preventDefault();
        switchToMainTab();
    });
    
    particleTab.addEventListener('click', function(e) {
        e.preventDefault();
        switchToParticleTab();
    });
    
    // 處理數據文件上傳預覽
    dataFilesInput.addEventListener('change', function() {
        uploadedDataFiles = Array.from(this.files);
        updateFilesList(uploadedDataFiles, dataFilesPreview, dataFilesList);
    });
    
    // 處理圖片文件上傳預覽
    imageFilesInput.addEventListener('change', function() {
        uploadedImageFiles = Array.from(this.files);
        updateImageList(uploadedImageFiles, imageFilesPreview, imageFilesList);
    });
    
    // 處理粒子分析數據文件上傳預覽
    particleDataFilesInput.addEventListener('change', function() {
        uploadedParticleDataFiles = Array.from(this.files);
        updateFilesList(uploadedParticleDataFiles, particleDataFilesPreview, particleDataFilesList);
    });
    
    // 處理粒子分析圖片文件上傳預覽
    particleImageFilesInput.addEventListener('change', function() {
        uploadedParticleImageFiles = Array.from(this.files);
        updateImageList(uploadedParticleImageFiles, particleImageFilesPreview, particleImageFilesList);
    });
    
    // 更新文件列表顯示
    function updateFilesList(files, previewElement, listElement) {
        if (files.length > 0) {
            previewElement.classList.remove('hidden');
            listElement.innerHTML = '';
            files.forEach(file => {
                const li = document.createElement('li');
                li.textContent = file.name;
                listElement.appendChild(li);
            });
        } else {
            previewElement.classList.add('hidden');
        }
    }
    
    // 更新圖片列表顯示
    function updateImageList(files, previewElement, listElement) {
        if (files.length > 0) {
            previewElement.classList.remove('hidden');
            listElement.innerHTML = '';
            files.forEach(file => {
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
                listElement.appendChild(div);
            });
        } else {
            previewElement.classList.add('hidden');
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
        document.querySelector('.loading-progress').style.width = '5%';
        
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
        
        // 模擬載入進度
        simulateProgress();
        
        // 發送到 API
        connectToAPI(formData, reportGeneratorAPIEndpoint);
    });
    
    // 處理粒子分析按鈕點擊
    analyzeParticleBtn.addEventListener('click', function() {
        if (uploadedParticleImageFiles.length === 0) {
            alert('請上傳至少一個粒子分布圖片');
            return;
        }
        
        // 顯示載入區塊
        loadingSection.classList.remove('hidden');
        document.querySelector('.loading-progress').style.width = '5%';
        
        // 收集表單數據
        const experimentData = {
            experimentDescription: document.getElementById('particle-experiment-description').value
        };
        
        // 準備表單數據
        const formData = new FormData();
        formData.append('experimentData', JSON.stringify(experimentData));
        formData.append('channel', document.getElementById('particle-channel').value);
        
        // 添加所有數據文件
        uploadedParticleDataFiles.forEach(file => {
            formData.append('dataFiles', file);
        });
        
        // 添加所有圖片文件
        uploadedParticleImageFiles.forEach(file => {
            formData.append('imageFiles', file);
        });
        
        // 模擬載入進度
        simulateProgress();
        
        // 發送到 API
        connectToAPI(formData, particleDistributionAPIEndpoint);
    });
    
    // 模擬載入進度
    function simulateProgress() {
        const progressBar = document.querySelector('.loading-progress');
        let width = 5;
        
        // 更新進度顯示的函數
        function updateProgress(newWidth, message = null) {
            width = newWidth;
            progressBar.style.width = width + '%';
            if (message) {
                document.getElementById('loading-message').textContent = message;
            }
        }
        
        // 初始階段 - 準備數據
        updateProgress(5, '準備數據中...');
        
        // 記錄開始時間
        const startTime = Date.now();
        
        // 定時更新進度
        const interval = setInterval(() => {
            const elapsedTime = (Date.now() - startTime) / 1000; // 轉換為秒
            
            if (elapsedTime < 5) {
                // 0-5 秒：數據處理階段
                updateProgress(10 + (elapsedTime * 5), '處理數據中...');
            } else if (elapsedTime < 20) {
                // 5-20 秒：分析階段
                updateProgress(35 + ((elapsedTime - 5) * 1.5), '分析數據中...');
            } else if (elapsedTime < 40) {
                // 20-40 秒：生成報告階段
                updateProgress(60 + ((elapsedTime - 20) * 1), '生成報告中...');
            } else if (elapsedTime < 70) {
                // 40-70 秒：等待完成階段
                updateProgress(80 + ((elapsedTime - 40) * 0.3), '完成報告生成...');
            } else if (width < 90) {
                // 超過 70 秒：慢速進度
                width += 0.1;
                updateProgress(width, '伺服器處理中，請耐心等待...');
            }
            
            // 超過 3 分鐘顯示提示
            if (elapsedTime > 180 && width >= 90) {
                updateProgress(95, '伺服器響應時間較長，處理中...');
            }
        }, 1000);
        
        return interval;
    }
    
    // 連接到 API
    function connectToAPI(formData, endpoint) {
        // 更新載入訊息
        const loadingMessage = document.getElementById('loading-message');
        loadingMessage.textContent = '連接到分析伺服器中...';
        
        // 添加粒子分析 ID，用於跨服務參照
        if (endpoint === reportGeneratorAPIEndpoint && window.lastParticleAnalysisId) {
            formData.append('particleAnalysisId', window.lastParticleAnalysisId);
        }
        
        // 創建 AbortController 以支持超時設置
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 180000); // 設置 3 分鐘超時
        
        // 使用實際 API 調用並增加超時處理
        fetch(endpoint, {
            method: 'POST',
            body: formData,
            signal: controller.signal // 使用 AbortController 信號
        })
        .then(response => {
            clearTimeout(timeoutId); // 清除超時計時器
            if (!response.ok) {
                throw new Error('伺服器回應錯誤: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // 更新載入訊息
            loadingMessage.textContent = '處理完成';
            document.querySelector('.loading-progress').style.width = '100%';
            
            // 如果是粒子分析結果，保存分析ID以便在報告生成時使用
            if (endpoint === particleDistributionAPIEndpoint && data.analysisId) {
                window.lastParticleAnalysisId = data.analysisId;
            }
            
            // 延遲隱藏載入區塊，顯示結果區塊
            setTimeout(() => {
                loadingSection.classList.add('hidden');
                resultSection.classList.remove('hidden');
                
                // 處理並顯示結果
                displayResults(data, endpoint);
            }, 500);
        })
        .catch(error => {
            clearTimeout(timeoutId); // 清除超時計時器
            console.error('錯誤:', error);
            loadingSection.classList.add('hidden');
            
            let errorMessage = error.message;
            if (error.name === 'AbortError') {
                errorMessage = '請求超時，伺服器回應時間過長，請稍後再試或聯絡管理員';
            }
            
            alert('分析過程中發生錯誤: ' + errorMessage);
        });
    }
    
    // 顯示 API 返回的結果
    function displayResults(data, endpoint) {
        // 識別當前的分析類型
        const isParticleAnalysis = endpoint === particleDistributionAPIEndpoint;
        
        // 依據分析類型獲取相應的數據
        let compoundName, targetProtein;
        
        if (isParticleAnalysis) {
            compoundName = "粒子分析";
            targetProtein = "";
        } else {
            compoundName = document.getElementById('compound-name').value;
            targetProtein = document.getElementById('target-protein').value;
        }
        
        // 構建 HTML 內容
        let resultsHTML = `
            <div class="mb-6 p-4 bg-green-100 border-l-4 border-green-500 rounded">
                <p class="text-lg flex items-center">
                    <i class="fas fa-check-circle text-green-600 mr-2"></i>
                    ${data.message || '報告已成功生成!'}
                </p>
            </div>
            <div class="mb-6">
                <h3 class="text-xl font-medium text-gray-800 mb-3">報告摘要</h3>`;
        
        if (isParticleAnalysis) {
            resultsHTML += `<p class="text-gray-600">我們完成了粒子分布均勻性分析。報告包含各樣本的變異係數(CV)分析，可用於評估霧化均勻性。</p>`;
        } else {
            resultsHTML += `<p class="text-gray-600">我們完成了對 ${compoundName} 在 ${targetProtein} 表達上的影響分析。報告包含三個主要部分：氣流率分析、顆粒分布均勻性分析以及濃度-響應分析。</p>`;
        }
        
        resultsHTML += `</div>`;
        
        // 添加圖表預覽（如果有）
        if (data.chartPreviews && data.chartPreviews.length > 0) {
            resultsHTML += `
            <div class="mb-6">
                <h3 class="text-xl font-medium text-gray-800 mb-3">分析圖表</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">`;
            
            data.chartPreviews.forEach(chart => {
                resultsHTML += `
                    <div class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                        <img src="${chart.image}" alt="${chart.caption}" class="w-full h-auto">
                        <p class="text-sm text-center p-3 text-gray-600">${chart.caption}</p>
                    </div>`;
            });
            
            resultsHTML += `
                </div>
            </div>`;
        }
        
        // 添加報告預覽
        if (data.reportPreview) {
            resultsHTML += `
            <div class="mb-6">
                <h3 class="text-xl font-medium text-gray-800 mb-3">報告預覽</h3>
                <div class="border border-gray-300 rounded-lg p-6 bg-gray-50 whitespace-pre-line text-gray-700">
                    ${data.reportPreview}
                    <div class="mt-4 text-center text-gray-400">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            </div>`;
        }
        
        // 如果是粒子分析，添加分析ID資訊
        if (isParticleAnalysis && data.analysisId) {
            resultsHTML += `
            <div class="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p class="text-gray-700 flex items-center">
                    <i class="fas fa-info-circle text-blue-600 mr-2"></i>
                    若要在報告生成中使用此粒子分析結果，請點擊「開始新分析」後選擇一般分析頁籤。系統將自動加入此分析結果。
                </p>
            </div>`;
        }
        
        // 更新 DOM
        resultContent.innerHTML = resultsHTML;
        
        // 設置下載按鈕的事件處理程序
        if (data.reportPath) {
            // 清除之前的事件處理程序
            downloadReportBtn.onclick = null;
            
            // 設置新的事件處理程序
            downloadReportBtn.onclick = function() {
                // 獲取相應 API 端點的基礎 URL
                const apiBaseUrl = new URL(endpoint).origin;
                // 構建完整的下載 URL
                const downloadUrl = `${apiBaseUrl}/download/${data.reportPath}`;
                // 打開下載鏈接
                window.open(downloadUrl, '_blank');
            };
            
            // 啟用下載按鈕
            downloadReportBtn.disabled = false;
        } else {
            // 禁用下載按鈕
            downloadReportBtn.disabled = true;
        }
    }
    
    // 開始新分析按鈕事件處理
    newAnalysisBtn.addEventListener('click', function() {
        // 重置文件上傳
        dataFilesInput.value = '';
        imageFilesInput.value = '';
        particleDataFilesInput.value = '';
        particleImageFilesInput.value = '';
        
        uploadedDataFiles = [];
        uploadedImageFiles = [];
        uploadedParticleDataFiles = [];
        uploadedParticleImageFiles = [];
        
        updateFilesList(uploadedDataFiles, dataFilesPreview, dataFilesList);
        updateImageList(uploadedImageFiles, imageFilesPreview, imageFilesList);
        updateFilesList(uploadedParticleDataFiles, particleDataFilesPreview, particleDataFilesList);
        updateImageList(uploadedParticleImageFiles, particleImageFilesPreview, particleImageFilesList);
        
        // 隱藏結果區塊
        resultSection.classList.add('hidden');
        
        // 禁用下載按鈕
        downloadReportBtn.disabled = true;
        downloadReportBtn.onclick = null;
        
        // 返回到對應的頁籤
        if (!particleSection.classList.contains('hidden')) {
            switchToParticleTab();
        } else {
            switchToMainTab();
        }
    });


    // 在 app.js 中添加後端健康檢查函數
function checkAPIStatus() {
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
        loadingMessage.textContent = '檢查分析伺服器連接狀態...';
    }
    
    // 檢查報告生成 API
    fetch(`${reportGeneratorAPIEndpoint}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`報告生成 API 狀態: ${response.status}`);
        }
        console.log('報告生成 API 連接正常');
        return response.json();
    })
    .catch(error => {
        console.error('報告生成 API 連接錯誤:', error);
        const statusElement = document.createElement('div');
        statusElement.className = 'mt-4 p-2 bg-red-100 text-red-700 rounded';
        statusElement.innerHTML = `<i class="fas fa-exclamation-triangle mr-2"></i>報告生成伺服器連接異常，某些功能可能受限`;
        document.querySelector('main .container').prepend(statusElement);
    });
    
    // 檢查粒子分析 API
    fetch(`${particleDistributionAPIEndpoint}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`粒子分析 API 狀態: ${response.status}`);
        }
        console.log('粒子分析 API 連接正常');
        return response.json();
    })
    .catch(error => {
        console.error('粒子分析 API 連接錯誤:', error);
        const statusElement = document.createElement('div');
        statusElement.className = 'mt-4 p-2 bg-red-100 text-red-700 rounded';
        statusElement.innerHTML = `<i class="fas fa-exclamation-triangle mr-2"></i>粒子分析伺服器連接異常，某些功能可能受限`;
        document.querySelector('main .container').prepend(statusElement);
    });
}
    
    // 初始化頁面
    function initializePage() {
        // 檢查 URL 參數是否有指定的 API 端點
        const urlParams = new URLSearchParams(window.location.search);
        const reportApiEndpoint = urlParams.get('reportApi');
        const particleApiEndpoint = urlParams.get('particleApi');
        
        if (reportApiEndpoint) {
            // 如果在 URL 中找到報告生成 API 端點，就更新變數
            reportGeneratorAPIEndpoint = decodeURIComponent(reportApiEndpoint);
            console.log('使用 URL 參數中的報告生成 API 端點:', reportGeneratorAPIEndpoint);
        }
        
        if (particleApiEndpoint) {
            // 如果在 URL 中找到粒子分析 API 端點，就更新變數
            particleDistributionAPIEndpoint = decodeURIComponent(particleApiEndpoint);
            console.log('使用 URL 參數中的粒子分析 API 端點:', particleDistributionAPIEndpoint);
        }
        
        // 可選：顯示連接狀態
        if (reportApiEndpoint || particleApiEndpoint) {
            const statusElement = document.createElement('div');
            statusElement.className = 'mt-4 p-2 bg-blue-100 text-blue-700 rounded';
            statusElement.innerHTML = `<i class="fas fa-info-circle mr-2"></i>已連接到自定義 API 端點`;
            document.querySelector('main .container').prepend(statusElement);
        }
        
        // 初始化跨服務資料傳遞變數
        window.lastParticleAnalysisId = null;
    }

    checkAPIStatus();
    // 頁面載入後執行初始化
    initializePage();
});
