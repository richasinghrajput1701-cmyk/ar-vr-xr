'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LogOut, Activity, Boxes, ScanQrCode } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import { XR, createXRStore } from '@react-three/xr';

const store = createXRStore();

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
      <Environment preset="city" />
      <Grid infiniteGrid fadeDistance={40} cellColor="#3f3f46" sectionColor="#18181b" sectionSize={5} />
      
      {/* Sample Scene Geometry */}
      <mesh position={[0, 1, -3]} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshPhysicalMaterial color="#3b82f6" roughness={0.2} metalness={0.8} />
      </mesh>
      
      <mesh position={[-3, 1.5, -5]} castShadow receiveShadow>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshPhysicalMaterial color="#ef4444" roughness={0.1} metalness={0.9} />
      </mesh>
      
      <mesh position={[4, 2, -4]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 4, 32]} />
        <meshPhysicalMaterial color="#10b981" roughness={0.4} metalness={0.1} />
      </mesh>

      <OrbitControls makeDefault />
    </>
  );
}

export default function PreviewWalkthrough() {
  const router = useRouter();
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    // Basic mobile/headset detection
    const checkViewport = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-zinc-950 font-sans text-slate-200">
      
      {/* Real 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [0, 2, 5], fov: 60 }}>
          <XR store={store}>
            <color attach="background" args={['#050505']} />
            <Scene />
          </XR>
        </Canvas>
      </div>

      {/* Heatmap Overlay (UI FX) */}
      <div className={`heatmap absolute inset-0 z-10 transition-opacity duration-500 pointer-events-none ${!showHeatmap && 'opacity-0'}`}></div>

      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50 pointer-events-none z-10">
        <div className="w-4 h-px bg-white/50 absolute top-1/2 -ml-2"></div>
        <div className="w-px h-4 bg-white/50 absolute left-1/2 -mt-2"></div>
      </div>

      {/* HUD Overlay */}
      <div className="absolute inset-6 pointer-events-none flex flex-col justify-between z-20">
        
        {/* Top HUD */}
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="flex gap-4">
            
            {!isMobileView ? (
              <div 
                className="bg-black/80 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/20 flex items-center gap-3 text-white max-w-sm cursor-help shadow-2xl"
                onClick={() => toast.info('Scan the QR Code in the Builder to test natively on a headset.')}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <ScanQrCode size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Testing Mode</h4>
                  <p className="text-xs text-slate-400 leading-tight">For full immersion, scan the QR code in the Builder to open on your headset.</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => store.enterAR()}
                  className="bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-full border-2 border-indigo-400/50 flex items-center justify-center gap-3 text-white font-bold text-lg transition-all shadow-[0_0_30px_rgba(99,102,241,0.5)] active:scale-95"
                >
                  <Boxes size={24} /> ENTER AR
                </button>

                <button 
                  onClick={() => store.enterVR()}
                  className="bg-purple-600 hover:bg-purple-500 px-8 py-4 rounded-full border-2 border-purple-400/50 flex items-center justify-center gap-3 text-white font-bold text-lg transition-all shadow-[0_0_30px_rgba(168,85,247,0.5)] active:scale-95"
                >
                  <Boxes size={24} /> ENTER VR
                </button>
              </div>
            )}
            
          </div>

          <button 
            onClick={() => {
              toast.info('Exiting testing environment...');
              setTimeout(() => router.push('/builder'), 500);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 text-red-100 rounded-xl font-medium transition-all active:scale-95"
          >
            <LogOut size={16} /> Exit Editor
          </button>
        </div>

        {/* Analytics Panel */}
        <div className="w-64 glass-panel p-5 pointer-events-auto">
          <h3 className="flex items-center gap-2 font-semibold mb-4 text-sm text-slate-300">
            <Activity size={16} /> Edge Analytics
          </h3>
          
          <div className="space-y-3 mb-5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">FPS</span>
              <span className="font-mono text-green-400 font-medium tracking-wide">90</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Draw Calls</span>
              <span className="font-mono text-white tracking-wide">12</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Triangles</span>
              <span className="font-mono text-white tracking-wide">140k</span>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 flex items-center justify-between">
            <span className="text-sm text-slate-300 flex items-center gap-2">Show Heatmap</span>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={showHeatmap}
                onChange={(e) => {
                  setShowHeatmap(e.target.checked);
                  toast.info(e.target.checked ? 'Player gaze heatmap enabled' : 'Heatmap disabled');
                }}
              />
              <div className="w-10 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}
