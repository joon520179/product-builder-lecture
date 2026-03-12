const URL = "https://teachablemachine.withgoogle.com/models/otKuKorme/";

let model, webcam, maxPredictions;
let isCaptured = false;

// Elements
const webcamContainer = document.getElementById("webcam-container");
const loading = document.getElementById("loading");
const resultContainer = document.getElementById("result-container");
const btnCaptureStart = document.getElementById("btn-capture-start");
const btnWebcamRetry = document.getElementById("btn-webcam-retry");

const animalDescriptions = {
    "강아지": "당신은 보는 사람마저 기분 좋게 만드는 선하고 부드러운 인상의 '강아지상'입니다! 다정다감하고 친근한 분위기를 풍기며, 주변 사람들에게 신뢰감을 주는 매력적인 관상을 가지고 계시네요.",
    "고양이": "당신은 세련되고 도도한 매력이 넘치는 '고양이상'입니다! 시크하면서도 신비로운 분위기를 풍기며, 첫인상은 차가워 보일 수 있지만 알수록 빠져드는 치명적인 매력을 가진 관상을 가지고 계시네요."
};

// Initialize the model
async function initModel() {
    if (model) return;
    try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log("AI 모델 로드 완료");
    } catch (error) {
        console.error("모델 로드 실패:", error);
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
        console.error("카메라 설정 실패:", error);
        alert("카메라를 사용할 수 없습니다. 권한을 확인해주세요.");
        loading.style.display = "none";
    }
}

async function webcamLoop() {
    if (isCaptured) return;
    webcam.update();
    window.requestAnimationFrame(webcamLoop);
}

// Countdown and Capture Logic
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
    
    // Scroll to result
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

// Retry Logic
btnWebcamRetry.addEventListener("click", async () => {
    isCaptured = false;
    resultContainer.style.display = "none";
    btnWebcamRetry.style.display = "none";
    document.getElementById("dog-bar").style.width = "0%";
    document.getElementById("cat-bar").style.width = "0%";
    await setupWebcam();
});

// Prediction Logic
async function predict(inputElement) {
    if (!model) return;
    const prediction = await model.predict(inputElement);
    const sortedPrediction = [...prediction].sort((a, b) => b.probability - a.probability);
    const topResult = sortedPrediction[0];
    
    const resultTitle = document.getElementById("result-title");
    const resultDesc = document.getElementById("result-description");
    
    const animalName = topResult.className;
    resultTitle.innerText = `당신은 ${animalName}상입니다!`;
    resultDesc.innerText = animalDescriptions[animalName] || "분석된 동물상의 특징을 확인해보세요.";

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

setupWebcam();
