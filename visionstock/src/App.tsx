import React, { useState, useRef, useEffect } from 'react';

function App() {
  const [mode, setMode] = useState<'list' | 'register' | 'scan'>('list');
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera access failed:", err);
      setStatus('카메라 접근 권한이 필요합니다.');
    }
  };

  useEffect(() => {
    if (mode !== 'list') startCamera();
    if (mode === 'list') fetchItems();
  }, [mode]);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/items');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Fetch items failed:", err);
    }
  };

  const captureAndAction = async (action: 'register' | 'identify') => {
    if (!canvasRef.current || !videoRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0, 224, 224);
    
    const blob = await new Promise<Blob | null>(res => canvasRef.current?.toBlob(res, 'image/jpeg', 0.8));
    if (!blob) return;

    setStatus('AI가 분석 중...');
    const formData = new FormData();
    formData.append('image', blob);
    if (action === 'register') formData.append('name', name);

    const endpoint = action === 'register' ? '/api/register' : '/api/identify';
    const res = await fetch(endpoint, { method: 'POST', body: formData });
    const result = await res.json();

    setStatus(result.message || (result.success ? '완료!' : '실패'));
    if (result.success && action === 'identify') {
      alert(`인식: ${result.item.name} | 재고: ${result.item.stock}`);
      setMode('list');
    } else if (result.success && action === 'register') {
      setMode('list');
      setName('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans text-slate-800">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-black text-blue-700 tracking-tight">VisionStock</h1>
        <p className="text-sm font-medium text-slate-400">AI Inventory Tracker MVP</p>
      </header>

      {mode === 'list' ? (
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button onClick={() => setMode('register')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95">
              새 물건 등록
            </button>
            <button onClick={() => setMode('scan')} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95">
              재고 스캔
            </button>
          </div>
          
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-50 bg-slate-50/50">
              <h2 className="font-bold text-slate-500 text-xs uppercase tracking-wider">현재 재고 목록</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {items.length === 0 ? (
                <p className="p-8 text-center text-slate-400">등록된 물건이 없습니다.</p>
              ) : items.map(item => (
                <div key={item.id} className="flex justify-between items-center p-5 hover:bg-slate-50 transition-colors">
                  <span className="font-bold text-slate-700">{item.name}</span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-black">{item.stock}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto relative">
          <div className="overflow-hidden rounded-3xl bg-black shadow-2xl aspect-square relative mb-6">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 border-2 border-white/20 pointer-events-none rounded-3xl m-4"></div>
            <canvas ref={canvasRef} width="224" height="224" className="hidden" />
          </div>
          
          <div className="space-y-4">
            {mode === 'register' && (
              <input 
                type="text" 
                placeholder="물건의 이름을 입력하세요" 
                className="w-full bg-white border-2 border-slate-100 rounded-2xl p-4 text-lg font-medium focus:border-blue-500 outline-none transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            
            <div className="text-center py-2">
              <p className="font-bold text-blue-600 animate-pulse">{status}</p>
            </div>

            <button 
              onClick={() => captureAndAction(mode === 'register' ? 'register' : 'identify')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xl py-5 rounded-2xl shadow-xl transition-all active:scale-95 disabled:bg-slate-300"
              disabled={mode === 'register' && !name}
            >
              {mode === 'register' ? '사진 찍어 등록' : '물체 인식하기'}
            </button>
            
            <button onClick={() => { setMode('list'); setStatus(''); }} className="w-full py-3 text-slate-400 font-bold">
              돌아가기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
