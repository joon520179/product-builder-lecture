document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('api-key');
    const saveKeyBtn = document.getElementById('save-key');
    const setupSection = document.getElementById('setup-section');
    const uploadSection = document.getElementById('upload-section');
    const resultSection = document.getElementById('result-section');
    const cameraInput = document.getElementById('camera-input');
    const fileInput = document.getElementById('file-input');
    const imagePreview = document.getElementById('image-preview');
    const loading = document.getElementById('loading');
    const analysisResult = document.getElementById('analysis-result');
    const resetBtn = document.getElementById('reset-btn');

    let geminiApiKey = localStorage.getItem('gemini_api_key');

    // 초기 상태 설정
    if (geminiApiKey) {
        setupSection.classList.add('hidden');
        uploadSection.classList.remove('hidden');
    }

    // API 키 저장
    saveKeyBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        if (key) {
            localStorage.setItem('gemini_api_key', key);
            geminiApiKey = key;
            setupSection.classList.add('hidden');
            uploadSection.classList.remove('hidden');
            alert('API 키가 저장되었습니다.');
        } else {
            alert('올바른 API 키를 입력하세요.');
        }
    });

    // 이미지 파일 선택 이벤트
    cameraInput.addEventListener('change', handleImageUpload);
    fileInput.addEventListener('change', handleImageUpload);

    async function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        // UI 전환
        uploadSection.classList.add('hidden');
        resultSection.classList.remove('hidden');
        loading.classList.remove('hidden');
        analysisResult.classList.add('hidden');
        analysisResult.innerHTML = '';
        
        // 미리보기 표시
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);

        try {
            // 이미지 최적화 (크기 줄이기)
            const optimizedImage = await optimizeImage(file);
            await analyzeFood(optimizedImage.base64, optimizedImage.type);
        } catch (error) {
            console.error('Error:', error);
            loading.classList.add('hidden');
            analysisResult.classList.remove('hidden');
            analysisResult.innerHTML = `<p style="color: #e74c3c;">오류 발생: ${error.message}</p>`;
        }
    }

    // 이미지 리사이징 및 Base64 변환
    function optimizeImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // 최대 가로/세로 800px로 제한하여 API 부하 감소
                    const max_size = 800;
                    if (width > height) {
                        if (width > max_size) {
                            height *= max_size / width;
                            width = max_size;
                        }
                    } else {
                        if (height > max_size) {
                            width *= max_size / height;
                            height = max_size;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    resolve({
                        base64: dataUrl.split(',')[1],
                        type: 'image/jpeg'
                    });
                };
            };
        });
    }

    async function analyzeFood(base64Data, mimeType) {
        if (!geminiApiKey) {
            throw new Error('API 키가 설정되지 않았습니다.');
        }

        const prompt = "이 이미지의 음식을 분석해서 다음 정보를 한국어로 알려줘:\n1. 음식 이름\n2. 예상 칼로리 (1인분 기준)\n3. 주요 영양소 (탄수화물, 단백질, 지방 등)\n4. 건강하게 먹는 팁\n\n결과는 보기 좋게 문단으로 나누어서 제목은 '### [음식 이름]'으로 시작해줘.";
        
        // 모델을 gemini-1.5-flash로 고정하여 안정성 확보
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: mimeType,
                                data: base64Data
                            }
                        }
                    ]
                }]
            })
        });

        const resultData = await response.json();

        if (!response.ok) {
            const errorMsg = resultData.error ? resultData.error.message : '알 수 없는 API 오류';
            throw new Error(`API 오류: ${errorMsg}`);
        }

        if (!resultData.candidates || resultData.candidates.length === 0) {
            throw new Error('음식을 분석할 수 없습니다. 다른 사진으로 시도해 주세요.');
        }

        const text = resultData.candidates[0].content.parts[0].text;
        displayResult(text);
    }

    function displayResult(text) {
        loading.classList.add('hidden');
        analysisResult.classList.remove('hidden');
        
        // 마크다운 형식 텍스트를 HTML로 변환
        const formattedText = text
            .replace(/### (.*)\n/g, '<h2>$1</h2>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // 굵게 처리
            .replace(/\n/g, '<br>');
            
        analysisResult.innerHTML = `<div class="result-text">${formattedText}</div>`;
    }

    resetBtn.addEventListener('click', resetUI);

    function resetUI() {
        resultSection.classList.add('hidden');
        uploadSection.classList.remove('hidden');
        cameraInput.value = '';
        fileInput.value = '';
        imagePreview.src = '';
        analysisResult.innerHTML = '';
        analysisResult.classList.add('hidden');
    }
});
