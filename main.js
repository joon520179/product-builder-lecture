const URL = "https://teachablemachine.withgoogle.com/models/otKuKorme/";

let model, webcam, maxPredictions;
let isWebcamMode = false;

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
        document.getElementById("webcam-container").innerHTML = "";
    }
});

btnModeWebcam.addEventListener("click", async () => {
    isWebcamMode = true;
    btnModeWebcam.classList.add("active");
    btnModeUpload.classList.remove("active");
    uploadArea.style.display = "none";
    webcamArea.style.display = "block";
    imagePreviewContainer.style.display = "none";
    resultContainer.style.display = "block";
    
    await setupWebcam();
});

// Setup Webcam
async function setupWebcam() {
    loading.style.display = "block";
    await initModel();
    
    try {
        const flip = true;
        webcam = new tmImage.Webcam(300, 300, flip);
        await webcam.setup(); // 카메라 권한 요청
        await webcam.play();
        
        document.getElementById("webcam-container").innerHTML = "";
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        loading.style.display = "none";
        
        window.requestAnimationFrame(webcamLoop);
    } catch (error) {
        console.error("카메라 설정 실패:", error);
        alert("카메라를 사용할 수 없습니다. 권한을 확인해주세요.");
        loading.style.display = "none";
    }
}

async function webcamLoop() {
    if (!isWebcamMode) return;
    webcam.update();
    await predict(webcam.canvas);
    window.requestAnimationFrame(webcamLoop);
}

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
    
    // 결과를 확률 높은 순으로 정렬
    const sortedPrediction = [...prediction].sort((a, b) => b.probability - a.probability);
    const topResult = sortedPrediction[0];
    
    const resultTitle = document.getElementById("result-title");
    
    // 최고 결과에 따른 텍스트 설정
    if (topResult.probability > 0.1) {
        if (topResult.className === "강아지") {
            resultTitle.innerText = `당신은 귀여운 강아지상입니다! 🐶`;
        } else if (topResult.className === "고양이") {
            resultTitle.innerText = `당신은 시크한 고양이상입니다! 🐱`;
        } else {
            resultTitle.innerText = `당신은 ${topResult.className}상입니다! ✨`;
        }
    }

    // 모든 클래스의 퍼센트 바 업데이트
    prediction.forEach(p => {
        const percent = (p.probability * 100).toFixed(0);
        if (p.className === "강아지") {
            const bar = document.getElementById("dog-bar");
            const txt = document.getElementById("dog-percent");
            if (bar && txt) {
                bar.style.width = percent + "%";
                txt.innerText = percent + "%";
            }
        } else if (p.className === "고양이") {
            const bar = document.getElementById("cat-bar");
            const txt = document.getElementById("cat-percent");
            if (bar && txt) {
                bar.style.width = percent + "%";
                txt.innerText = percent + "%";
            }
        }
    });
}

// 초기 모델 로드 (백그라운드)
initModel();
