const URL = "https://teachablemachine.withgoogle.com/models/otKuKorme/";

let model, webcam, maxPredictions;
let isWebcamMode = false;
let isCaptured = false;

// Elements
const imageUpload = document.getElementById("image-upload");
const imagePreview = document.getElementById("image-preview");
const imagePreviewContainer = document.getElementById("image-preview-container");
const uploadArea = document.getElementById("upload-area");
const webcamArea = document.getElementById("webcam-area");
const loading = document.getElementById("loading");
const resultContainer = document.getElementById("result-container");
const btnModeUpload = document.getElementById("btn-mode-upload");
const btnModeWebcam = document.getElementById("btn-mode-webcam");
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

// Mode Switching
btnModeUpload.addEventListener("click", () => {
    isWebcamMode = false;
    btnModeUpload.classList.add("active");
    btnModeWebcam.classList.remove("active");
    uploadArea.style.display = "block";
    webcamArea.style.display = "none";
    imagePreviewContainer.style.display = "none";
    resultContainer.style.display = "none";
    if (webcam) {
        webcam.stop();
        const container = document.getElementById("webcam-container");
        if (container.querySelector('canvas')) container.removeChild(container.querySelector('canvas'));
    }
});

btnModeWebcam.addEventListener("click", async () => {
    isWebcamMode = true;
    isCaptured = false;
    btnModeWebcam.classList.add("active");
    btnModeUpload.classList.remove("active");
    uploadArea.style.display = "none";
    webcamArea.style.display = "block";
    btnCaptureStart.style.display = "inline-block";
    btnWebcamRetry.style.display = "none";
    imagePreviewContainer.style.display = "none";
    resultContainer.style.display = "none";
    
    await setupWebcam();
});

// Setup Webcam
async function setupWebcam() {
    loading.style.display = "block";
    await initModel();
    
    try {
        const flip = true;
        webcam = new tmImage.Webcam(300, 300, flip);
        await webcam.setup();
        await webcam.play();
        
        const container = document.getElementById("webcam-container");
        // Clear previous canvas if any
        const oldCanvas = container.querySelector('canvas');
        if (oldCanvas) container.removeChild(oldCanvas);
        
        container.appendChild(webcam.canvas);
        loading.style.display = "none";
        
        window.requestAnimationFrame(webcamLoop);
    } catch (error) {
        console.error("카메라 설정 실패:", error);
        alert("카메라를 사용할 수 없습니다.");
        loading.style.display = "none";
    }
}

async function webcamLoop() {
    if (!isWebcamMode || isCaptured) return;
    webcam.update();
    window.requestAnimationFrame(webcamLoop);
}

// Countdown and Capture Logic
btnCaptureStart.addEventListener("click", async () => {
    btnCaptureStart.style.display = "none";
    countdownOverlay.style.display = "block";
    
    let count = 3;
    countdownOverlay.innerText = count;
    
    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownOverlay.innerText = count;
        } else {
            clearInterval(interval);
            countdownOverlay.style.display = "none";
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

btnWebcamRetry.addEventListener("click", async () => {
    isCaptured = false;
    resultContainer.style.display = "none";
    btnWebcamRetry.style.display = "none";
    btnCaptureStart.style.display = "inline-block";
    await setupWebcam();
});

// Handle Image Upload
imageUpload.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
        imagePreview.src = event.target.result;
        imagePreviewContainer.style.display = "block";
        uploadArea.style.display = "none";
        loading.style.display = "block";
        resultContainer.style.display = "none";

        imagePreview.onload = async () => {
            await initModel();
            await predict(imagePreview);
            loading.style.display = "none";
            resultContainer.style.display = "block";
        };
    };
    reader.readAsDataURL(file);
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

initModel();
