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
        
        // 미리보기 표시
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);

        try {
            const base64Image = await fileToBase64(file);
            await analyzeFood(base64Image);
        } catch (error) {
            console.error(error);
            alert('분석 중 오류가 발생했습니다.');
            resetUI();
        }
    }

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
        });
    }

    async function analyzeFood(base64Data) {
        const prompt = "이 이미지에 있는 음식을 식별하고, 예상 칼로리와 간단한 영양 정보(탄수화물, 단백질, 지방), 그리고 건강한 섭취 팁을 한국어로 알려줘. JSON 형식이 아닌 친절한 설명 형식으로 작성해줘. 제목은 '### [음식 이름]' 형식으로 시작해줘.";
        
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
                                mime_type: "image/jpeg",
                                data: base64Data
                            }
                        }
                    ]
                }]
            })
        });

        if (!response.ok) {
            throw new Error('API 호출 실패');
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        displayResult(text);
    }

    function displayResult(text) {
        loading.classList.add('hidden');
        analysisResult.classList.remove('hidden');
        
        // 마크다운 형태의 텍스트를 간단히 HTML로 변환하여 표시
        const formattedText = text
            .replace(/### (.*)\n/g, '<h2>$1</h2>')
            .replace(/\n/g, '<br>');
            
        analysisResult.innerHTML = `
            <div class="result-text">${formattedText}</div>
        `;
    }

    resetBtn.addEventListener('click', resetUI);

    function resetUI() {
        resultSection.classList.add('hidden');
        uploadSection.classList.remove('hidden');
        cameraInput.value = '';
        fileInput.value = '';
        imagePreview.src = '';
        analysisResult.innerHTML = '';
    }
});
