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
        
        // 這裡是模擬API調用，實際應用需要替換為真實API端點
        const colabAPIEndpoint = 'https://cellpainting-api.james-chang-04c.workers.dev/analyze';
        
        // 模擬API調用延遲
        setTimeout(() => {
            loadingMessage.textContent = '正在分析數據...';
            
            // 模擬處理時間
            setTimeout(() => {
                loadingMessage.textContent = '生成報告中...';
                
                // 模擬報告生成完成
                setTimeout(() => {
                    // 隱藏載入區塊，顯示結果區塊
                    loadingSection.classList.add('hidden');
                    resultSection.classList.remove('hidden');
                    
                    // 顯示模擬結果
                    displayDummyResults();
                }, 3000);
            }, 5000);
        }, 2000);
        
        // 實際API調用代碼（已注釋掉）
        /*
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
        */
    }
    
    // 顯示模擬結果
    function displayDummyResults() {
        const compoundName = document.getElementById('compound-name').value;
        const targetProtein = document.getElementById('target-protein').value;
        
        resultContent.innerHTML = `
            <div class="mb-4 p-4 bg-green-100 border-l-4 border-green-500 rounded">
                <p class="text-lg"><i class="fas fa-check-circle text-green-600 mr-2"></i>報告已成功生成!</p>
            </div>
            <div class="mb-4">
                <h3 class="font-medium text-lg mb-2">報告摘要</h3>
                <p>我們完成了對 ${compoundName} 在 ${targetProtein} 表達上的影響分析。報告包含三個主要部分：氣流率分析、顆粒分布均勻性分析以及濃度-響應分析。</p>
            </div>
            <div class="mb-4">
                <h3 class="font-medium text-lg mb-2">主要發現</h3>
                <ul class="list-disc pl-6">
                    <li>氣流率分析表明霧化器能有效模擬新生兒呼吸頻率</li>
                    <li>顆粒分布分析證實了給藥均勻性</li>
                    <li>${compoundName} 能有效提高 ${targetProtein} 的表達水平</li>
                </ul>
            </div>
            <div class="mb-4">
                <h3 class="font-medium text-lg mb-2">報告預覽</h3>
                <div class="border border-gray-300 rounded-md p-4 bg-gray-50">
                    <h4 class="font-medium">摘要</h4>
                    <p class="text-sm text-gray-700">本研究評估了霧化給藥系統在模擬新生兒給藥方案中的可行性，並分析了${compoundName}對${targetProtein}表達的影響...</p>
                    <h4 class="font-medium mt-2">引言</h4>
                    <p class="text-sm text-gray-700">${compoundName}是一種重要的肺表面活性劑，在新生兒呼吸窘迫症候群的治療中具有重要作用...</p>
                    <div class="mt-2 text-center text-gray-500">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            </div>
        `;
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
