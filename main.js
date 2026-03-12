const URL = "https://teachablemachine.withgoogle.com/models/otKuKorme/";

let model, labelContainer, maxPredictions;

// Load the image model
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    console.log("모델 로드 완료");
}

// Handle image upload and prediction
const imageUpload = document.getElementById("image-upload");
const imagePreview = document.getElementById("image-preview");
const imagePreviewContainer = document.getElementById("image-preview-container");
const uploadArea = document.getElementById("upload-area");
const loading = document.getElementById("loading");
const resultContainer = document.getElementById("result-container");

imageUpload.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = async (event) => {
        imagePreview.src = event.target.result;
        imagePreviewContainer.style.display = "block";
        uploadArea.style.display = "none";
        loading.style.display = "block";
        resultContainer.style.display = "none";

        // Wait for image to load before predicting
        imagePreview.onload = async () => {
            await predict();
            loading.style.display = "none";
            resultContainer.style.display = "block";
        };
    };
    reader.readAsDataURL(file);
});

// Run prediction on the image
async function predict() {
    if (!model) await init();

    const prediction = await model.predict(imagePreview);
    
    // Sort predictions to find the top result
    prediction.sort((a, b) => b.probability - a.probability);
    
    const topResult = prediction[0];
    const resultTitle = document.getElementById("result-title");
    
    if (topResult.className === "강아지") {
        resultTitle.innerText = `당신은 귀여운 강아지상입니다! 🐶`;
    } else if (topResult.className === "고양이") {
        resultTitle.innerText = `당신은 시크한 고양이상입니다! 🐱`;
    } else {
        resultTitle.innerText = `당신은 ${topResult.className}상입니다! ✨`;
    }

    // Update Progress Bars
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

// Initialize on page load
init();
