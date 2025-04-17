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
    const mainSection = document.querySelector('.bg-white.rounded-lg.shadow-md.p-6.mb-6:not(#particle-section)');
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
    
    // API 端點
    const colabAPIEndpoint = 'https://cellpainting-api.james-chang-04c.workers.dev/analyze';
    const particleAPIEndpoint = 'https://cellpainting-api.james-chang-04c.workers.dev/analyze-particle';
    
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
    mainTab.addEventListener('click', function(e) {
        e.preventDefault();
        mainTab.classList.add('bg-blue-700');
        particleTab.classList.remove('bg-blue-700');
        mainSection.classList.remove('hidden');
        particleSection.classList.add('hidden');
    });
    
    particleTab.addEventListener('click', function(e) {
        e.preventDefault();
        particleTab.classList.add('bg-blue-700');
        mainTab.classList.remove('bg-blue-700');
        particleSection.classList.remove('hidden');
        mainSection.classList.add('hidden');
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
    
    // 處理粒子分析數據文件上傳預覽
    particleDataFilesInput.addEventListener('change', function() {
        uploadedParticleDataFiles = Array.from(this.files);
        updateParticleDataFilesList();
    });
    
    // 處理粒子分析圖片文件上傳預覽
    particleImageFilesInput.addEventListener('change', function() {
        uploadedParticleImageFiles = Array.from(this.files);
        updateParticleImageFilesList();
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
    
    // 更新粒子分析數據文件列表顯示
    function updateParticleDataFilesList() {
        if (uploadedParticleDataFiles.length > 0) {
            particleDataFilesPreview.classList.remove('hidden');
            particleDataFilesList.innerHTML = '';
            uploadedParticleDataFiles.forEach(file => {
                const li = document.createElement('li');
                li.textContent = file.name;
                particleDataFilesList.appendChild(li);
            });
        } else {
            particleDataFilesPreview.classList.add('hidden');
        }
    }
    
    // 更新粒子分析圖片文件列表顯示
    function updateParticleImageFilesList() {
        if (uploadedParticleImageFiles.length > 0) {
            particleImageFilesPreview.classList.remove('hidden');
            particleImageFilesList.innerHTML = '';
            uploadedParticleImageFiles.forEach(file => {
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
                particleImageFilesList.appendChild(div);
            });
        } else {
            particleImageFilesPreview.classList.add('hidden');
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
        connectToColabAPI(formData, colabAPIEndpoint);
    });
    
    // 處理粒子分析按鈕點擊
    analyzeParticleBtn.addEventListener('click', function() {
        if (uploadedParticleImageFiles.length === 0) {
            alert('請上傳至少一個粒子分布圖片');
            return;
        }
        
        // 顯示載入區塊
        loadingSection.classList.remove('hidden');
        
        // 收集表單數據
        const experimentData = {
            compoundName: document.getElementById('particle-compound-name').value,
            targetProtein: document.getElementById('particle-target-protein').value,
            cellType: document.getElementById('particle-cell-type').value,
            treatmentTime: document.getElementById('particle-treatment-time').value,
            experimentDescription: document.getElementById('particle-experiment-description').value,
            channel: document.getElementById('particle-channel').value
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
        
        // 發送到 粒子分析 API
        connectToColabAPI(formData, particleAPIEndpoint);
    });
    
    // 連接到 Colab API
    function connectToColabAPI(formData, endpoint) {
        // 更新載入訊息
        const loadingMessage = document.getElementById('loading-message');
        loadingMessage.textContent = '連接到分析伺服器中...';
        
        // 使用實際 API 調用
        fetch(endpoint, {
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
            // 更新載入訊息
            loadingMessage.textContent = '處理完成';
            
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
        // 識別當前的分析類型
        const isParticleAnalysis = !mainSection.classList.contains('hidden');
        
        // 依據分析類型獲取相應的數據
        let compoundName, targetProtein;
        
        if (isParticleAnalysis) {
            compoundName = document.getElementById('particle-compound-name').value;
            targetProtein = document.getElementById('particle-target-protein').value;
        } else {
            compoundName = document.getElementById('compound-name').value;
            targetProtein = document.getElementById('target-protein').value;
        }
        
        // 構建 HTML 內容
        let resultsHTML = `
            <div class="mb-4 p-4 bg-green-100 border-l-4 border-green-500 rounded">
                <p class="text-lg"><i class="fas fa-check-circle text-green-600 mr-2"></i>${data.message || '報告已成功生成!'}</p>
            </div>
            <div class="mb-4">
                <h3 class="font-medium text-lg mb-2">報告摘要</h3>`;
        
        if (isParticleAnalysis) {
            resultsHTML += `<p>我們完成了對 ${compoundName} 在流道中的粒子分布均勻性分析。報告包含各樣本的變異係數(CV)分析，可用於評估霧化均勻性。</p>`;
        } else {
            resultsHTML += `<p>我們完成了對 ${compoundName} 在 ${targetProtein} 表達上的影響分析。報告包含三個主要部分：氣流率分析、顆粒分布均勻性分析以及濃度-響應分析。</p>`;
        }
        
        resultsHTML += `</div>`;
        
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
            // 清除之前的事件處理程序
            downloadReportBtn.onclick = null;
            
            // 設置新的事件處理程序
            downloadReportBtn.onclick = function() {
                // 獲取 Colab API 下載端點的基礎 URL
                const apiBaseUrl = new URL(isParticleAnalysis ? particleAPIEndpoint : colabAPIEndpoint).origin;
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
        
        updateDataFilesList();
        updateImageFilesList();
        updateParticleDataFilesList();
        updateParticleImageFilesList();
        
        // 隱藏結果區塊
        resultSection.classList.add('hidden');
        
        // 禁用下載按鈕
        downloadReportBtn.disabled = true;
        downloadReportBtn.onclick = null;
        
        // 返回到對應的頁籤
        if (mainSection.classList.contains('hidden')) {
            particleTab.click();
        } else {
            mainTab.click();
        }
    });
    
    // 初始化頁面
    function initializePage() {
        // 檢查 URL 參數是否有指定的 API 端點
        const urlParams = new URLSearchParams(window.location.search);
        const apiEndpoint = urlParams.get('api');
        const particleApi = urlParams.get('particleApi');
        
        if (apiEndpoint) {
            // 如果在 URL 中找到 API 端點，就更新 colabAPIEndpoint 變數
            colabAPIEndpoint = decodeURIComponent(apiEndpoint);
            console.log('使用 URL 參數中的 API 端點:', colabAPIEndpoint);
        }
        
        if (particleApi) {
            // 如果在 URL 中找到粒子分析 API 端點，就更新 particleAPIEndpoint 變數
            particleAPIEndpoint = decodeURIComponent(particleApi);
            console.log('使用 URL 參數中的粒子分析 API 端點:', particleAPIEndpoint);
        }
        
        // 可選：顯示連接狀態
        if (apiEndpoint || particleApi) {
            const statusElement = document.createElement('div');
            statusElement.className = 'mt-4 p-2 bg-blue-100 text-blue-700 rounded';
            statusElement.innerHTML = `<i class="fas fa-info-circle mr-2"></i>已連接到自定義 API 端點`;
            document.querySelector('main .container').prepend(statusElement);
        }
    }
    
    // 頁面載入後執行初始化
    initializePage();
});
