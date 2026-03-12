import React, { useState, useRef, useEffect } from 'react';

function App() {
  const [mode, setMode] = useState<'list' | 'register' | 'scan'>('list');
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 카메라 시작
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    if (videoRef.current) videoRef.current.srcObject = stream;
  };

  useEffect(() => {
    if (mode !== 'list') startCamera();
    if (mode === 'list') fetchItems();
  }, [mode]);

  const fetchItems = async () => {
    const res = await fetch('/api/items');
    const data = await res.json();
    setItems(data);
  };

  const captureAndAction = async (action: 'register' | 'identify') => {
    if (!canvasRef.current || !videoRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0, 224, 224); // 224x224로 리사이징 (비용 절감)
    
    const blob = await new Promise<Blob | null>(res => canvasRef.current?.toBlob(res, 'image/jpeg', 0.8));
    if (!blob) return;

    setStatus('처리 중...');
    const formData = new FormData();
    formData.append('image', blob);
    if (action === 'register') formData.append('name', name);

    const endpoint = action === 'register' ? '/api/register' : '/api/identify';
    const res = await fetch(endpoint, { method: 'POST', body: formData });
    const result = await res.json();

    setStatus(result.message || (result.success ? '성공!' : '실패'));
    if (result.success && action === 'identify') {
      alert(`인식된 물건: ${result.item.name}\n현재 재고: ${result.item.stock}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-blue-600">VisionStock MVP</h1>
        <p className="text-sm text-gray-500">AI 무바코드 재고관리</p>
      </header>

      {mode === 'list' ? (
        <div>
          <div className="mb-4 flex gap-2">
            <button onClick={() => setMode('register')} className="flex-1 rounded-lg bg-blue-500 p-3 text-white">물건 등록</button>
            <button onClick={() => setMode('scan')} className="flex-1 rounded-lg bg-green-500 p-3 text-white">재고 스캔</button>
          </div>
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex justify-between rounded-bg border bg-white p-4 shadow-sm">
                <span className="font-medium">{item.name}</span>
                <span className="text-blue-600">재고: {item.stock}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative">
          <video ref={videoRef} autoPlay playsInline className="h-64 w-full rounded-lg bg-black object-cover" />
          <canvas ref={canvasRef} width="224" height="224" className="hidden" />
          
          <div className="mt-4 space-y-4">
            {mode === 'register' && (
              <input 
                type="text" 
                placeholder="물건 이름 입력" 
                className="w-full rounded-lg border p-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <p className="text-center font-bold text-blue-500">{status}</p>
            <button 
              onClick={() => captureAndAction(mode === 'register' ? 'register' : 'identify')}
              className="w-full rounded-lg bg-blue-600 p-4 text-xl text-white shadow-lg"
            >
              {mode === 'register' ? '사진 찍어 등록하기' : '인식하기'}
            </button>
            <button onClick={() => setMode('list')} className="w-full text-gray-500">취소</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
