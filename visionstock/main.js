const URL = "https://teachablemachine.withgoogle.com/models/otKuKorme/";

let model, webcam, maxPredictions;
let isCaptured = false;
let currentLang = 'ko';

const i18n = {
    ko: {
        "main-title": "AI 동물상 테스트",
        "main-subtitle": "나는 어떤 멍냥이와 닮았을까? 🐶🐱",
        "security-msg": "🛡️ 사진은 서버에 저장되지 않으니 안심하세요!",
        "btn-start": "두근두근 분석 시작! ✨",
        "btn-retry": "한 번 더 해볼래! 🐾",
        "loading-msg": "AI 친구들이 열심히 분석 중이에요!",
        "result-title": "분석 결과",
        "animal-dog": "강아지상",
        "animal-cat": "고양이상",
        "how-to-title": "🐾 어떻게 하는 건가요?",
        "feature-analysis-title": "✨ 왜 그렇게 생겼을까? (관상 분석)",
        "footer-privacy": "개인정보처리방침",
        "desc-dog": "정말 사랑스러운 강아지상이시네요! 보는 사람을 행복하게 만드는 선한 에너지가 넘쳐나요. 🐶",
        "desc-cat": "치명적인 매력의 고양이상이시네요! 시크하면서도 신비로운 분위기가 정말 멋져요. 🐱",
        "result-text": "당신은 {percent}% {animal}!",
        "feat-dog-1": "둥글둥글하고 선한 눈매를 가지셨네요!",
        "feat-dog-2": "부드러운 턱선이 친근한 인상을 줘요.",
        "feat-dog-3": "미소가 밝고 귀여운 분위기가 뿜뿜!",
        "feat-cat-1": "눈꼬리가 살짝 올라간 매력적인 눈매!",
        "feat-cat-2": "날렵하고 샤프한 얼굴 라인이 돋보여요.",
        "feat-cat-3": "도도하면서도 세련된 분위기를 풍기네요!"
    },
    en: {
        "main-title": "AI Animal Face Test",
        "main-subtitle": "Which pup or kitty are you? 🐶🐱",
        "security-msg": "🛡️ Photos are never stored on our server!",
        "btn-start": "Start Analysis! ✨",
        "btn-retry": "Try Again! 🐾",
        "loading-msg": "AI is sniffing out your results!",
        "result-title": "Results",
        "animal-dog": "Puppy Face",
        "animal-cat": "Kitty Face",
        "how-to-title": "🐾 How to use?",
        "feature-analysis-title": "✨ Why do you look like this?",
        "footer-privacy": "Privacy Policy",
        "desc-dog": "You have a lovely puppy face! You radiate kind energy that makes everyone happy. 🐶",
        "desc-cat": "You have a charming cat face! You have a chic and mysterious vibe. 🐱",
        "result-text": "You are {percent}% {animal}!",
        "feat-dog-1": "You have round and kind-looking eyes!",
        "feat-dog-2": "Your soft jawline gives a friendly impression.",
        "feat-dog-3": "You have a bright and cute aura!",
        "feat-cat-1": "Your eye corners are charmingly upturned!",
        "feat-cat-2": "Your sharp face line stands out.",
        "feat-cat-3": "You give off a chic and sophisticated vibe!"
    }
};

// Elements
const webcamContainer = document.getElementById("webcam-container");
const loading = document.getElementById("loading");
const resultContainer = document.getElementById("result-container");
const btnCaptureStart = document.getElementById("btn-capture-start");
const btnWebcamRetry = document.getElementById("btn-webcam-retry");
const langSelect = document.getElementById("lang-select");

function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('animalFaceLang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[lang] && i18n[lang][key]) el.innerText = i18n[lang][key];
    });
}

langSelect.addEventListener('change', (e) => updateLanguage(e.target.value));

async function initModel() {
    if (model) return;
    try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
    } catch (error) {
        console.error("Model load failed", error);
    }
}

async function setupWebcam() {
    loading.style.display = "block";
    btnCaptureStart.style.display = "none";
    await initModel();
    try {
        webcam = new tmImage.Webcam(320, 320, true);
        await webcam.setup();
        await webcam.play();
        webcamContainer.innerHTML = `<div id="countdown-overlay" style="display: none;">3</div>`;
        webcamContainer.appendChild(webcam.canvas);
        loading.style.display = "none";
        btnCaptureStart.style.display = "inline-block";
        window.requestAnimationFrame(webcamLoop);
    } catch (e) { console.error(e); }
}

function webcamLoop() {
    if (isCaptured) return;
    webcam.update();
    window.requestAnimationFrame(webcamLoop);
}

btnCaptureStart.addEventListener("click", () => {
    btnCaptureStart.style.display = "none";
    const overlay = document.getElementById("countdown-overlay");
    overlay.style.display = "flex";
    let count = 3;
    overlay.innerText = count;
    const interval = setInterval(() => {
        count--;
        if (count > 0) overlay.innerText = count;
        else {
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
    await setupWebcam();
});

async function predict(input) {
    const prediction = await model.predict(input);
    const sorted = [...prediction].sort((a,b) => b.probability - a.probability);
    const top = sorted[0];
    
    const percent = (top.probability * 100).toFixed(0);
    const animalName = top.className === "강아지" ? i18n[currentLang]["animal-dog"] : i18n[currentLang]["animal-cat"];
    
    document.getElementById("result-title").innerText = i18n[currentLang]["result-text"]
        .replace("{percent}", percent)
        .replace("{animal}", animalName);
    
    document.getElementById("result-description").innerText = top.className === "강아지" 
        ? i18n[currentLang]["desc-dog"] : i18n[currentLang]["desc-cat"];

    // Features
    const featureList = document.getElementById("feature-list");
    featureList.innerHTML = "";
    const prefix = top.className === "강아지" ? "feat-dog-" : "feat-cat-";
    for(let i=1; i<=3; i++) {
        const li = document.createElement("li");
        li.innerText = i18n[currentLang][prefix + i];
        featureList.appendChild(li);
    }

    prediction.forEach(p => {
        const pVal = (p.probability * 100).toFixed(0);
        const type = p.className === "강아지" ? "dog" : "cat";
        document.getElementById(`${type}-bar`).style.width = pVal + "%";
        document.getElementById(`${type}-percent`).innerText = pVal + "%";
    });
}

const savedLang = localStorage.getItem('animalFaceLang') || 'ko';
langSelect.value = savedLang;
updateLanguage(savedLang);
setupWebcam();
