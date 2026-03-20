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
    },
    ja: {
        "main-title": "AI動物顔診断",
        "main-subtitle": "あなたはどの動物에 似ていますか？ 🐶🐱",
        "security-msg": "🛡️ 写真はサーバーに送信されません。",
        "btn-start": "診断スタート! ✨",
        "btn-retry": "もう一度! 🐾",
        "loading-msg": "AIがあなたの顔を分析中...",
        "result-title": "分析結果",
        "animal-dog": "犬顔",
        "animal-cat": "猫顔",
        "how-to-title": "🐾 使い方",
        "feature-analysis-title": "✨ なぜその結果に？ (観상分析)",
        "footer-privacy": "プライバシーポリシー",
        "desc-dog": "あなたは親しみやすく、優しい印象の「犬顔」です！周囲에 安心感を与え、誰からも好かれる魅力的な顔立ちをしています。 🐶",
        "desc-cat": "あなたは洗練された、クールな魅力あふれる「猫顔」です！ミステリアスな雰囲気で、人々を惹きつける魅力を持っています. 🐱",
        "result-text": "あなたは{percent}% {animal}です!",
        "feat-dog-1": "丸くて優しい目元をしていますね！",
        "feat-dog-2": "柔らかな輪郭が親しみやすい印象を与えます。",
        "feat-dog-3": "明るい笑顔と可愛い雰囲気が溢れています！",
        "feat-cat-1": "目尻が少し上がった魅力的な目元！",
        "feat-cat-2": "シャープで洗練された顔立ちが際立っています。",
        "feat-cat-3": "クールで都会的な雰囲기를 醸し出しています！"
    },
    zh: {
        "main-title": "AI 动物脸测试",
        "main-subtitle": "你长得像哪种小可爱？ 🐶🐱",
        "security-msg": "🛡️ 照片不会发送到服务器，请放心！",
        "btn-start": "开始分析! ✨",
        "btn-retry": "重新测试! 🐾",
        "loading-msg": "AI 正在努力为您分析中...",
        "result-title": "分析结果",
        "animal-dog": "犬系脸",
        "animal-cat": "猫系脸",
        "how-to-title": "🐾 如何使用？",
        "feature-analysis-title": "✨ 为什么长得像它？ (面部分析)",
        "footer-privacy": "隐私政策",
        "desc-dog": "你拥有一张超级可爱的犬系脸！散发着让人感到幸福的温和能量. 🐶",
        "desc-cat": "你拥有一张充满魅力的猫系脸！高冷又神秘的气质真的太酷了. 🐱",
        "result-text": "你是 {percent}% {animal}!",
        "feat-dog-1": "你拥有圆润且温和的眼神！",
        "feat-dog-2": "柔和的下颌线给人一种亲切感. ",
        "feat-dog-3": "散发着明亮又可爱的少女/少年感！",
        "feat-cat-1": "眼角微扬，拥有一双迷人的眼睛！",
        "feat-cat-2": "清爽干练的面部轮廓非常出众. ",
        "feat-cat-3": "流露出高冷又时髦的气质！"
    },
    es: {
        "main-title": "Test de Cara de Animal IA",
        "main-subtitle": "¿Qué mascota eres tú? 🐶🐱",
        "security-msg": "🛡️ ¡Las fotos nunca se guardan en el servidor!",
        "btn-start": "¡Empezar Análisis! ✨",
        "btn-retry": "¡Intentar de Nuevo! 🐾",
        "loading-msg": "¡La IA está buscando tus resultados!",
        "result-title": "Resultados",
        "animal-dog": "Cara de Perro",
        "animal-cat": "Cara de Gato",
        "how-to-title": "🐾 ¿Cómo usar?",
        "feature-analysis-title": "✨ ¿Por qué te ves así? (Análisis)",
        "footer-privacy": "Política de Privacidad",
        "desc-dog": "¡Tienes una cara de perro adorable! Irradias una energía amable que hace feliz a todos. 🐶",
        "desc-cat": "¡Tienes una cara de gato encantadora! Tienes un aire elegante y misterioso. 🐱",
        "result-text": "¡Eres un {animal} al {percent}%!",
        "feat-dog-1": "¡Tienes ojos redondos y de aspecto amable!",
        "feat-dog-2": "Tu mandíbula suave da una impresión amigable.",
        "feat-dog-3": "¡Tienes un aura brillante y linda!",
        "feat-cat-1": "¡Las esquinas de tus ojos están encantadoramente hacia arriba!",
        "feat-cat-2": "Tu línea facial afilada destaca.",
        "feat-cat-3": "¡Transmitas un aire elegante y sofisticado!"
    },
    fr: {
        "main-title": "Test de Visage d'Animal IA",
        "main-subtitle": "Quel animal es-tu ? 🐶🐱",
        "security-msg": "🛡️ Les photos ne sont jamais stockées sur le serveur !",
        "btn-start": "Démarrer l'Analyse ! ✨",
        "btn-retry": "Réessayer ! 🐾",
        "loading-msg": "L'IA recherche vos résultats...",
        "result-title": "Résultats",
        "animal-dog": "Visage de Chien",
        "animal-cat": "Visage de Chat",
        "how-to-title": "🐾 Comment utiliser ?",
        "feature-analysis-title": "✨ Pourquoi ce look ? (Analyse)",
        "footer-privacy": "Confidentialité",
        "desc-dog": "Vous avez un adorable visage de chien ! Vous dégagez une énergie bienveillante. 🐶",
        "desc-cat": "Vous avez un charmant visage de chat ! Vous avez une aura chic et mystérieuse. 🐱",
        "result-text": "Vous êtes à {percent}% un {animal} !",
        "feat-dog-1": "Vous avez des yeux ronds et d'apparence gentille !",
        "feat-dog-2": "Votre mâchoire douce donne une impression amicale.",
        "feat-dog-3": "Vous avez une aura brillante et mignonne !",
        "feat-cat-1": "Les coins de vos yeux sont charmamment relevés !",
        "feat-cat-2": "Votre ligne de visage nette se démarque.",
        "feat-cat-3": "Vous dégagez une ambiance chic et sophistiquée !"
    },
    de: {
        "main-title": "KI-Tiergesichtstest",
        "main-subtitle": "Welches Tier bist du? 🐶🐱",
        "security-msg": "🛡️ Fotos werden niemals auf dem Server gespeichert!",
        "btn-start": "Analyse Starten! ✨",
        "btn-retry": "Nochmal Versuchen! 🐾",
        "loading-msg": "KI sucht nach deinen Ergebnissen...",
        "result-title": "Ergebnisse",
        "animal-dog": "Hundegesicht",
        "animal-cat": "Katzengesicht",
        "how-to-title": "🐾 Wie benutzt man es?",
        "feature-analysis-title": "✨ Warum siehst du so aus?",
        "footer-privacy": "Datenschutz",
        "desc-dog": "Du hast ein reizendes Hundegesicht! Du strahlst gütige Energie aus. 🐶",
        "desc-cat": "Du hast ein charmantes Katzengesicht! Du hast eine schicke Ausstrahlung. 🐱",
        "result-text": "Du bist zu {percent}% ein {animal}!",
        "feat-dog-1": "Du hast runde und freundlich aussehende Augen!",
        "feat-dog-2": "Deine weiche Kieferpartie wirkt freundlich.",
        "feat-dog-3": "Du hast eine strahlende und süße Aura!",
        "feat-cat-1": "Deine Augenwinkel sind charmant nach oben gezogen!",
        "feat-cat-2": "Deine scharfe Gesichtslinie sticht hervor.",
        "feat-cat-3": "Du versprühst eine schicke Atmosphäre!"
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
    
    // If result is shown, update its text
    if (resultContainer.style.display !== 'none') {
        const lastAnimal = document.getElementById("result-title").getAttribute('data-last-animal');
        const lastPercent = document.getElementById("result-title").getAttribute('data-last-percent');
        if (lastAnimal && lastPercent) renderResult(lastAnimal, lastPercent);
    }
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
    
    renderResult(top.className, percent);

    prediction.forEach(p => {
        const pVal = (p.probability * 100).toFixed(0);
        const type = p.className === "강아지" ? "dog" : "cat";
        document.getElementById(`${type}-bar`).style.width = pVal + "%";
        document.getElementById(`${type}-percent`).innerText = pVal + "%";
    });
}

function renderResult(className, percent) {
    const titleEl = document.getElementById("result-title");
    titleEl.setAttribute('data-last-animal', className);
    titleEl.setAttribute('data-last-percent', percent);

    const animalName = className === "강아지" ? i18n[currentLang]["animal-dog"] : i18n[currentLang]["animal-cat"];
    titleEl.innerText = i18n[currentLang]["result-text"]
        .replace("{percent}", percent)
        .replace("{animal}", animalName);
    
    document.getElementById("result-description").innerText = className === "강아지" 
        ? i18n[currentLang]["desc-dog"] : i18n[currentLang]["desc-cat"];

    const featureList = document.getElementById("feature-list");
    featureList.innerHTML = "";
    const prefix = className === "강아지" ? "feat-dog-" : "feat-cat-";
    for(let i=1; i<=3; i++) {
        const li = document.createElement("li");
        li.innerText = i18n[currentLang][prefix + i];
        featureList.appendChild(li);
    }
}

// SNS Sharing Functions
if (typeof Kakao !== 'undefined') {
    try {
        Kakao.init('617415170f3f6e8a4a50d24f0c620436'); 
    } catch(e) { console.warn("Kakao init failed"); }
}

function shareKakao() {
    const title = document.getElementById("result-title").innerText;
    const url = window.location.href;
    
    if (Kakao.isInitialized()) {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: '나의 AI 동물상 결과는?',
                description: title + '\n지금 바로 확인해보세요! 🐾',
                imageUrl: 'https://product-builder-lecture-2ii.pages.dev/og-image.png',
                link: {
                    mobileWebUrl: url,
                    webUrl: url,
                },
            },
            buttons: [
                {
                    title: '테스트 하러가기',
                    link: {
                        mobileWebUrl: url,
                        webUrl: url,
                    },
                },
            ],
        });
    } else {
        copyLink();
    }
}

function shareTwitter() {
    const title = document.getElementById("result-title").innerText;
    const url = window.location.href;
    const text = "나의 AI 동물상 결과: " + title + " 🐾\n지금 테스트해보세요! ✨\n#동물상테스트 #AI테스트 #AnimalFace\n";
    window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(url));
}

function shareFacebook() {
    const url = window.location.href;
    window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url));
}

function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert("링크가 복사되었습니다! 친구들에게 공유해보세요. 🐾");
    }).catch(err => {
        const t = document.createElement("textarea");
        document.body.appendChild(t);
        t.value = url;
        t.select();
        document.execCommand('copy');
        document.body.removeChild(t);
        alert("링크가 복사되었습니다! 🐾");
    });
}

const savedLang = localStorage.getItem('animalFaceLang') || (i18n[navigator.language.split('-')[0]] ? navigator.language.split('-')[0] : 'ko');
langSelect.value = savedLang;
updateLanguage(savedLang);
setupWebcam();
