const URL = "https://teachablemachine.withgoogle.com/models/otKuKorme/";

let model, webcam, maxPredictions;
let isCaptured = false;

// Elements
const webcamContainer = document.getElementById("webcam-container");
const loading = document.getElementById("loading");
const resultContainer = document.getElementById("result-container");
const btnCaptureStart = document.getElementById("btn-capture-start");
const btnWebcamRetry = document.getElementById("btn-webcam-retry");
const countdownOverlay = document.getElementById("countdown-overlay");

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
    webcam.stop(); // 화면 멈춤
    
    loading.style.display = "block";
    await predict(webcam.canvas);
    loading.style.display = "none";
    resultContainer.style.display = "block";
    btnWebcamRetry.style.display = "inline-block";
}

// Retry Logic
btnWebcamRetry.addEventListener("click", async () => {
    isCaptured = false;
    resultContainer.style.display = "none";
    btnWebcamRetry.style.display = "none";
    
    // Reset progress bars
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
    
    if (topResult.className === "강아지") {
        resultTitle.innerText = `당신은 귀여운 강아지상입니다! 🐶`;
    } else if (topResult.className === "고양이") {
        resultTitle.innerText = `당신은 시크한 고양이상입니다! 🐱`;
    } else {
        resultTitle.innerText = `당신은 ${topResult.className}상입니다! ✨`;
    }

    prediction.forEach(p => {
        const percent = (p.probability * 100).toFixed(0);
        if (p.className === "강아지") {
            document.getElementById("dog-bar").style.width = percent + "%";
            document.getElementById("dog-percent").innerText = percent + "%";
        } else if (p.className === "고양이") {
            document.getElementById("cat-bar").style.width = percent + "%";
            document.getElementById("cat-percent").innerText = percent + "%";
        }
    });
}

// Start app on load
setupWebcam();
