const URL = "https://teachablemachine.withgoogle.com/models/otKuKorme/";

let model, webcam, maxPredictions;
let isCaptured = false;
let currentLang = 'ko';

const i18n = {
    ko: {
        "nav-how-to": "사용법",
        "nav-faq": "FAQ",
        "main-title": "AI 동물상 테스트",
        "main-subtitle": "나의 얼굴은 어떤 동물의 매력을 가졌을까요?",
        "security-msg": "🛡️ 개인정보 보호: 사진은 서버로 전송되지 않습니다.",
        "btn-start": "테스트 시작하기",
        "btn-retry": "다시 하기",
        "loading-msg": "AI가 당신의 관상을 정밀 분석 중입니다...",
        "result-title": "분석 결과",
        "animal-dog": "강아지상",
        "animal-cat": "고양이상",
        "how-to-title": "테스트 이용 방법",
        "step-1": "카메라 권한을 허용하고 얼굴이 잘 보이도록 조절하세요.",
        "step-2": "'테스트 시작' 버튼을 누르고 3초간 기다려주세요.",
        "step-3": "AI가 분석한 나의 동물상과 상세 특징을 확인하세요.",
        "faq-title": "자주 묻는 질문 (FAQ)",
        "faq-q1": "Q. 사진이 서버에 저장되나요?",
        "faq-a1": "A. 아니요! 모든 분석은 사용자의 브라우저 내에서 처리되며 사진은 어디로도 전송되지 않습니다.",
        "footer-privacy": "개인정보처리방침",
        "footer-terms": "이용약관",
        "desc-dog": "당신은 보는 사람마저 기분 좋게 만드는 선하고 부드러운 인상의 '강아지상'입니다! 다정다감하고 친근한 분위기를 풍기며, 주변 사람들에게 신뢰감을 주는 매력적인 관상을 가지고 계시네요.",
        "desc-cat": "당신은 세련되고 도도한 매력이 넘치는 '고양이상'입니다! 시크하면서도 신비로운 분위기를 풍기며, 첫인상은 차가워 보일 수 있지만 알수록 빠져드는 치명적인 매력을 가진 관상을 가지고 계시네요.",
        "result-text": "당신은 {animal}상입니다!"
    },
    en: {
        "nav-how-to": "How to Use",
        "nav-faq": "FAQ",
        "main-title": "AI Animal Face Test",
        "main-subtitle": "What animal do you look like?",
        "security-msg": "🛡️ Privacy: Photos are not sent to any server.",
        "btn-start": "Start Test",
        "btn-retry": "Try Again",
        "loading-msg": "AI is analyzing your face...",
        "result-title": "Result",
        "animal-dog": "Dog Face",
        "animal-cat": "Cat Face",
        "how-to-title": "How to Use",
        "step-1": "Allow camera access and center your face.",
        "step-2": "Click 'Start Test' and wait for 3 seconds.",
        "step-3": "Check your AI-analyzed animal face result.",
        "faq-title": "FAQ",
        "faq-q1": "Q. Are photos stored on the server?",
        "faq-a1": "A. No! All analysis is done in your browser, and no data is uploaded.",
        "footer-privacy": "Privacy Policy",
        "footer-terms": "Terms",
        "desc-dog": "You have a 'Dog Face' with a kind and gentle impression! You give off a friendly vibe and have a charming face that builds trust with others.",
        "desc-cat": "You have a 'Cat Face' full of sophisticated and chic charm! You have a mysterious aura that draws people in.",
        "result-text": "You are a {animal}!"
    },
    ja: {
        "nav-how-to": "使い方",
        "nav-faq": "FAQ",
        "main-title": "AI動物顔診断",
        "main-subtitle": "あなたはどの動物に似ていますか？",
        "security-msg": "🛡️ プライバシー：写真はサーバーに送信されません。",
        "btn-start": "診断スタート",
        "btn-retry": "もう一度",
        "loading-msg": "AIがあなたの顔を分析中...",
        "result-title": "分析結果",
        "animal-dog": "犬顔",
        "animal-cat": "猫顔",
        "how-to-title": "使い方",
        "step-1": "カメラへのアクセスを許可し、顔を中央に合わせます。",
        "step-2": "「診断スタート」をクリックし、3秒間待ちます。",
        "step-3": "AIが分析したあなたの動物顔の結果を確認します。",
        "faq-title": "よくある質問",
        "faq-q1": "Q. 写真はサーバーに保存されますか？",
        "faq-a1": "A. いいえ！すべての分析はブラウザ内で行われ、データはアップロードされません。",
        "footer-privacy": "プライバシーポリシー",
        "footer-terms": "利用規約",
        "desc-dog": "あなたは親しみやすく、優しい印象の「犬顔」です！周囲に安心感を与え、誰からも好かれる魅力的な顔立ちをしています。",
        "desc-cat": "あなたは洗練された、クールな魅力あふれる「猫顔」です！ミステリアスな雰囲気で、人々を惹きつける魅力を持っています。",
        "result-text": "あなたは{animal}です！"
    },
    zh: {
        "nav-how-to": "使用方法",
        "nav-faq": "常见问题",
        "main-title": "AI 动物脸测试",
        "main-subtitle": "你长得像哪种动物？",
        "security-msg": "🛡️ 隐私保护：照片不会发送到服务器。",
        "btn-start": "开始测试",
        "btn-retry": "重新测试",
        "loading-msg": "AI 正在分析您的面部...",
        "result-title": "分析结果",
        "animal-dog": "犬系脸",
        "animal-cat": "猫系脸",
        "how-to-title": "使用方法",
        "step-1": "允许访问摄像头，并将脸部对准中心。",
        "step-2": "点击“开始测试”并等待3秒。",
        "step-3": "查看 AI 分析的动物脸结果。",
        "faq-title": "常见问题",
        "faq-q1": "Q. 照片会存储在服务器上吗？",
        "faq-a1": "A. 不！所有分析都在您的浏览器中完成，不会上传任何数据。",
        "footer-privacy": "隐私政策",
        "footer-terms": "使用条款",
        "desc-dog": "你拥有一张温柔、亲切的“犬系脸”！你给人一种友好、值得信赖的感觉，非常有魅力。",
        "desc-cat": "你拥有一张充满高级感和冷艳魅力的“猫系脸”！你有一种神秘的气质，让人忍不住想靠近。",
        "result-text": "你是{animal}！"
    }
};

// Elements
const webcamContainer = document.getElementById("webcam-container");
const loading = document.getElementById("loading");
const resultContainer = document.getElementById("result-container");
const btnCaptureStart = document.getElementById("btn-capture-start");
const btnWebcamRetry = document.getElementById("btn-webcam-retry");
const langSelect = document.getElementById("lang-select");

// Language Handling
function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('animalFaceLang', lang);
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[lang][key]) {
            el.innerText = i18n[lang][key];
        }
    });

    // If already has result, update description
    if (resultContainer.style.display !== 'none') {
        const lastResult = document.getElementById("result-title").getAttribute('data-last-animal');
        if (lastResult) updateResultUI(lastResult);
    }
}

langSelect.addEventListener('change', (e) => updateLanguage(e.target.value));

function initLang() {
    const savedLang = localStorage.getItem('animalFaceLang');
    const browserLang = navigator.language.split('-')[0];
    const defaultLang = savedLang || (i18n[browserLang] ? browserLang : 'ko');
    langSelect.value = defaultLang;
    updateLanguage(defaultLang);
}

// Initialize the model
async function initModel() {
    if (model) return;
    try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
    } catch (error) {
        console.error("Model load failed:", error);
    }
}

// Setup and Start Webcam
async function setupWebcam() {
    loading.style.display = "block";
    btnCaptureStart.style.display = "none";
    await initModel();
    
    try {
        const flip = true;
        webcam = new tmImage.Webcam(320, 320, flip);
        await webcam.setup();
        await webcam.play();
        
        webcamContainer.innerHTML = `<div id="countdown-overlay" style="display: none;">3</div>`;
        webcamContainer.appendChild(webcam.canvas);
        
        loading.style.display = "none";
        btnCaptureStart.style.display = "inline-block";
        window.requestAnimationFrame(webcamLoop);
    } catch (error) {
        console.error("Camera setup failed:", error);
        loading.style.display = "none";
    }
}

async function webcamLoop() {
    if (isCaptured) return;
    webcam.update();
    window.requestAnimationFrame(webcamLoop);
}

btnCaptureStart.addEventListener("click", () => {
    btnCaptureStart.style.display = "none";
    const overlay = document.getElementById("countdown-overlay");
    overlay.style.display = "block";
    let count = 3;
    overlay.innerText = count;
    
    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            overlay.innerText = count;
        } else {
            clearInterval(interval);
            overlay.style.display = "none";
            captureAndPredict();
        }
    }, 1000);
});

async function captureAndPredict() {
    isCaptured = true;
    webcam.stop();
    loading.style.display = "block";
    await predict(webcam.canvas);
    loading.style.display = "none";
    resultContainer.style.display = "block";
    btnWebcamRetry.style.display = "inline-block";
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

btnWebcamRetry.addEventListener("click", async () => {
    isCaptured = false;
    resultContainer.style.display = "none";
    btnWebcamRetry.style.display = "none";
    document.getElementById("dog-bar").style.width = "0%";
    document.getElementById("cat-bar").style.width = "0%";
    await setupWebcam();
});

async function predict(inputElement) {
    if (!model) return;
    const prediction = await model.predict(inputElement);
    const sortedPrediction = [...prediction].sort((a, b) => b.probability - a.probability);
    const topResult = sortedPrediction[0];
    
    updateResultUI(topResult.className);
    
    prediction.forEach(p => {
        const percent = (p.probability * 100).toFixed(0);
        const barId = p.className === "강아지" ? "dog-bar" : "cat-bar";
        const textId = p.className === "강아지" ? "dog-percent" : "cat-percent";
        const bar = document.getElementById(barId);
        const text = document.getElementById(textId);
        if (bar && text) {
            bar.style.width = percent + "%";
            text.innerText = percent + "%";
        }
    });
}

function updateResultUI(animalClassName) {
    const resultTitle = document.getElementById("result-title");
    const resultDesc = document.getElementById("result-description");
    
    const animalKey = animalClassName === "강아지" ? "animal-dog" : "animal-cat";
    const descKey = animalClassName === "강아지" ? "desc-dog" : "desc-cat";
    
    const translatedAnimal = i18n[currentLang][animalKey];
    resultTitle.innerText = i18n[currentLang]["result-text"].replace("{animal}", translatedAnimal);
    resultTitle.setAttribute('data-last-animal', animalClassName);
    resultDesc.innerText = i18n[currentLang][descKey];
}

initLang();
setupWebcam();
