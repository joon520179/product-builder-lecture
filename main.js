const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({
    log: true,
    corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
});

document.addEventListener('DOMContentLoaded', async () => {
    const videoUpload = document.getElementById('video-upload');
    const videoGallery = document.getElementById('video-gallery');
    const statusContainer = document.getElementById('status');
    const statusText = document.getElementById('status-text');
    const progressBar = document.getElementById('progress');

    let ffmpegLoaded = false;

    // FFmpeg 로드 시작
    async function loadFFmpeg() {
        if (ffmpegLoaded) return;
        statusContainer.style.display = 'block';
        statusText.innerText = 'FFmpeg 라이브러리 로드 중...';
        
        try {
            await ffmpeg.load();
            ffmpegLoaded = true;
            statusText.innerText = '준비 완료! 동영상을 선택해 주세요.';
            setTimeout(() => {
                if (!videoUpload.files.length) {
                    statusContainer.style.display = 'none';
                }
            }, 2000);
        } catch (error) {
            console.error('FFmpeg load error:', error);
            statusText.innerText = '라이브러리 로드 실패. 페이지를 새로고침해 주세요.';
        }
    }

    loadFFmpeg();

    videoUpload.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!ffmpegLoaded) {
            await loadFFmpeg();
        }

        const inputName = 'input_' + file.name;
        const outputName = 'output_shortform.mp4';

        statusContainer.style.display = 'block';
        statusText.innerText = '동영상 처리 중... 잠시만 기다려 주세요.';
        progressBar.style.display = 'block';
        progressBar.value = 0;

        ffmpeg.setProgress(({ ratio }) => {
            progressBar.value = ratio * 100;
            statusText.innerText = `편집 중... (${Math.round(ratio * 100)}%)`;
        });

        try {
            // FFmpeg 가상 파일 시스템에 파일 쓰기
            await ffmpeg.writeFile(inputName, await fetchFile(file));

            // 숏폼(9:16) 크롭 명령 실행
            // 원본의 높이를 기준으로 가로를 9:16 비율로 자름 (중앙 정렬)
            await ffmpeg.run(
                '-i', inputName,
                '-vf', "crop=ih*9/16:ih",
                '-c:v', 'libx264',
                '-preset', 'ultrafast',
                '-crf', '28',
                '-c:a', 'copy',
                outputName
            );

            // 결과 읽기
            const data = await ffmpeg.readFile(outputName);
            const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
            const videoUrl = URL.createObjectURL(videoBlob);

            // 갤러리에 추가
            addVideoToGallery(videoUrl, file.name);

            statusText.innerText = '편집 완료!';
            progressBar.style.display = 'none';
            
            // 임시 파일 삭제
            await ffmpeg.deleteFile(inputName);
            await ffmpeg.deleteFile(outputName);

        } catch (error) {
            console.error('Processing error:', error);
            statusText.innerText = '처리 중 오류가 발생했습니다.';
        }
    });

    function addVideoToGallery(url, originalName) {
        const container = document.createElement('div');
        container.className = 'video-item';

        const video = document.createElement('video');
        video.src = url;
        video.controls = true;
        video.className = 'shortform-preview';

        const downloadBtn = document.createElement('a');
        downloadBtn.href = url;
        downloadBtn.download = `shortform_${originalName}`;
        downloadBtn.className = 'download-button';
        downloadBtn.innerText = '다운로드';

        container.appendChild(video);
        container.appendChild(downloadBtn);
        videoGallery.prepend(container);
    }
});
