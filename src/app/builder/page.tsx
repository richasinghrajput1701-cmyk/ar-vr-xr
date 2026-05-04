'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, TransformControls, Grid, Environment } from '@react-three/drei';
import { XR, createXRStore } from '@react-three/xr';
import * as THREE from 'three';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ArrowLeft, PenLine, CloudUpload, Boxes, Pointer, Move, RotateCw, Maximize, 
  Cuboid, Zap, Wand2, Users, Glasses, MessageSquare, ChevronLeft, ChevronRight, 
  Layers, Settings, Camera, Search, Plus, Eye, EyeOff, Component, QrCode, X
} from 'lucide-react';

function Scene({ activeTool, selectedObject, setSelectedObject, globalIllumination, transform, setTransform }: any) {
  const [mesh, setMesh] = useState<THREE.Mesh | null>(null);
  const showTransform = selectedObject === 'Cube_01' && ['move', 'rotate', 'scale'].includes(activeTool);
  const mode = activeTool === 'move' ? 'translate' : activeTool;

  // Sync TransformControls changes back to React state
  useEffect(() => {
    if (mesh) {
      mesh.position.set(transform.pos[0], transform.pos[1], transform.pos[2]);
      mesh.rotation.set(
        THREE.MathUtils.degToRad(transform.rot[0]), 
        THREE.MathUtils.degToRad(transform.rot[1]), 
        THREE.MathUtils.degToRad(transform.rot[2])
      );
      mesh.scale.set(transform.scale[0], transform.scale[1], transform.scale[2]);
    }
  }, [transform, mesh]);

  return (
    <>
      <ambientLight intensity={globalIllumination / 100} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
      <Environment preset="city" />
      
      <Grid infiniteGrid fadeDistance={50} cellColor="#3f3f46" sectionColor="#18181b" sectionSize={5} />
      
      <mesh 
        ref={setMesh}
        position={[0, 1, 0]} 
        onClick={(e) => { e.stopPropagation(); setSelectedObject('Cube_01'); }}
        onPointerMissed={() => setSelectedObject(null)}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2, 2, 2]} />
        <meshPhysicalMaterial 
          color={selectedObject === 'Cube_01' ? "#3b82f6" : "#64748b"} 
          roughness={0.2} 
          metalness={0.8} 
          clearcoat={0.5}
        />
      </mesh>

      {showTransform && mesh && (
        <TransformControls 
          object={mesh} 
          mode={mode as any} 
          onObjectChange={() => {
            if (!mesh) return;
            setTransform({
              pos: [mesh.position.x, mesh.position.y, mesh.position.z],
              rot: [
                THREE.MathUtils.radToDeg(mesh.rotation.x), 
                THREE.MathUtils.radToDeg(mesh.rotation.y), 
                THREE.MathUtils.radToDeg(mesh.rotation.z)
              ],
              scale: [mesh.scale.x, mesh.scale.y, mesh.scale.z]
            });
          }}
        />
      )}
      <OrbitControls makeDefault />
    </>
  );
}

const store = createXRStore();

export default function SpatialBuilder() {
  const router = useRouter();
  
  // State
  const [activeTool, setActiveTool] = useState('select');
  const [activeTab, setActiveTab] = useState('lighting');
  const [showCollab, setShowCollab] = useState(false);
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);
  const [selectedObject, setSelectedObject] = useState<string | null>('Cube_01');
  const [projectName, setProjectName] = useState('Modern Art Gallery');
  const [showDevicePairing, setShowDevicePairing] = useState(false);
  
  // Transform State for selected object
  const [transform, setTransform] = useState({
    pos: [0, 1, 0],
    rot: [0, 0, 0],
    scale: [1, 1, 1]
  });
  
  // Environment State
  const [globalIllumination, setGlobalIllumination] = useState(75);
  const [timeOfDay, setTimeOfDay] = useState(14);
  const [skybox, setSkybox] = useState('Midday Clear');
  const [isPublishing, setIsPublishing] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Can we move the spawn point closer to the entrance? It feels disorienting.", isSelf: false },
    { id: 2, text: "Done. Updating the nav mesh right now. Let me know if that's better.", isSelf: true }
  ]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-zinc-950 font-sans text-slate-200">
      
      {/* Main 3D Viewport Area - reacts to panel state implicitly by taking available space */}
      <div 
        className="absolute inset-0 transition-all duration-300"
        style={{
          left: isLeftOpen ? '320px' : '80px',
          right: isRightOpen ? '340px' : '0px'
        }}
        onPointerDown={(e) => {
          // Change tool to interact normally if trying to use OrbitControls with select tool
          if (activeTool === 'select' && e.button !== 0) {
            // allows orbit with right click
          }
        }}
      >
        <Canvas shadows camera={{ position: [8, 8, 8], fov: 45 }}>
          <XR store={store}>
            <color attach="background" args={['#09090b']} />
            <Scene 
              activeTool={activeTool} 
              selectedObject={selectedObject} 
              setSelectedObject={setSelectedObject} 
              globalIllumination={globalIllumination}
              transform={transform}
              setTransform={setTransform}
            />
          </XR>
        </Canvas>
      </div>

      {/* Top Navbar */}
      <nav className="absolute top-4 left-4 right-4 h-16 bg-zinc-900/60 backdrop-blur-2xl border border-white/5 shadow-2xl rounded-2xl flex justify-between items-center px-4 z-40">
        <div className="flex-1 flex items-center gap-4">
          <button 
            onClick={() => router.push('/')}
            className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
        </div>
        
        <div className="flex-1 flex justify-center">
          <div 
            className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-xl cursor-text transition-colors group"
            onClick={() => {
              const newName = prompt('Enter new project name:', projectName);
              if (newName) {
                setProjectName(newName);
                toast.success('Project name updated');
              }
            }}
          >
            <span className="font-semibold text-white tracking-wide">{projectName}</span>
            <PenLine size={14} className="text-slate-500 group-hover:text-slate-300" />
          </div>
        </div>
        
        <div className="flex-1 flex justify-end items-center gap-4">
          <div 
            onClick={() => setShowCollab(!showCollab)}
            className="flex items-center -space-x-2 cursor-pointer hover:scale-105 transition-transform p-1 rounded-full hover:bg-white/5"
            title="Team Collaboration"
          >
            <img src="https://i.pravatar.cc/100?img=33" className="w-8 h-8 rounded-full border-2 border-zinc-900 z-30" alt="User 1"/>
            <img src="https://i.pravatar.cc/100?img=47" className="w-8 h-8 rounded-full border-2 border-zinc-900 z-20" alt="User 2"/>
            <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-900 z-10 flex text-xs items-center justify-center font-bold">+2</div>
          </div>
          <div className="flex gap-2 cursor-not-allowed">
            <button 
              disabled
              onClick={() => setShowDevicePairing(true)}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-100/50 rounded-xl text-sm font-medium transition-all pointer-events-none"
            >
              <QrCode size={16} /> Launch in Headset
            </button>
          </div>
          
          <button 
            disabled
            onClick={() => router.push('/preview')}
            className="flex items-center gap-2 px-4 py-2 border border-white/5 bg-white/5 rounded-xl text-sm font-medium transition-colors text-slate-500 cursor-not-allowed"
          >
            <Glasses size={16} /> Preview XR
          </button>
          
          <button 
            onClick={() => {
              setIsPublishing(true);
              const promise = new Promise((resolve) => setTimeout(resolve, 2000));
              toast.promise(promise, {
                loading: 'Compiling VR package & generating lighting data...',
                success: 'Project published successfully! Link copied to clipboard.',
                error: 'Failed to publish project',
              });
              promise.then(() => setIsPublishing(false));
            }}
            disabled={isPublishing}
            className="flex items-center gap-2 px-5 py-2 hidden sm:flex bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium shadow-[0_4px_15px_rgba(59,130,246,0.3)] transition-all active:scale-95 disabled:opacity-50"
          >
            <CloudUpload size={16} className={isPublishing ? 'animate-bounce' : ''} />
            {isPublishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </nav>

      {/* LEFT PANEL : Toolbar & Scene Graph (Outliner) */}
      <aside 
        className={`absolute top-24 bottom-4 left-4 bg-zinc-900/60 backdrop-blur-2xl border border-white/5 shadow-2xl rounded-2xl flex transition-all duration-300 z-30 overflow-hidden ${isLeftOpen ? 'w-80' : 'w-16'}`}
      >
        {/* Tool Column */}
        <div className="w-16 shrink-0 flex flex-col items-center py-4 border-r border-white/5 gap-2">
          <button onClick={() => setIsLeftOpen(!isLeftOpen)} className="p-2 hover:bg-white/10 rounded-xl text-slate-400 mb-2 transition-colors">
            <Layers size={20} className={isLeftOpen ? 'text-blue-400' : ''} />
          </button>
          <div className="w-8 h-px bg-white/5 my-1"></div>
          
          <ToolButton icon={<Pointer size={18}/>} active={activeTool === 'select'} onClick={() => setActiveTool('select')} title="Selection Tool (V)" />
          <ToolButton icon={<Move size={18}/>} active={activeTool === 'move'} onClick={() => setActiveTool('move')} title="Translate Tool (T)" />
          <ToolButton icon={<RotateCw size={18}/>} active={activeTool === 'rotate'} onClick={() => setActiveTool('rotate')} title="Rotate Tool (R)" />
          <ToolButton icon={<Maximize size={18}/>} active={activeTool === 'scale'} onClick={() => setActiveTool('scale')} title="Scale Tool (S)" />
          
          <div className="w-8 h-px bg-white/5 my-1"></div>
          
          <ToolButton icon={<Boxes size={18}/>} active={activeTool === 'build'} onClick={() => setActiveTool('build')} title="Architecture (B)" />
          <ToolButton icon={<Cuboid size={18}/>} active={activeTool === 'object'} onClick={() => setActiveTool('object')} title="3D Assets (O)" />
          <ToolButton icon={<Zap size={18}/>} active={activeTool === 'interact'} onClick={() => setActiveTool('interact')} title="Interactions (I)" />
        </div>

        {/* Scene Graph Column */}
        <div className={`flex-1 flex flex-col min-w-0 transition-opacity duration-300 ${isLeftOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className="px-4 py-3 flex justify-between items-center border-b border-white/5">
            <h3 className="font-medium text-sm text-slate-300">Scene Graph</h3>
            <button className="text-slate-400 hover:text-white"><Plus size={16}/></button>
          </div>
          <div className="px-3 py-2 border-b border-white/5">
            <div className="bg-black/40 border border-white/10 rounded-lg flex items-center px-3 py-1.5 focus-within:border-blue-500 transition-colors">
              <Search size={14} className="text-slate-500 mr-2" />
              <input type="text" placeholder="Search objects..." className="bg-transparent text-sm text-white w-full focus:outline-none" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 text-sm select-none">
            {/* Outliner Items */}
            <OutlinerItem icon={<Camera size={14}/>} name="Main Camera" />
            <OutlinerItem icon={<Zap size={14} className="text-yellow-400" />} name="Directional Light" />
            <OutlinerItem icon={<Boxes size={14}/>} name="Floor_Mesh" />
            <OutlinerItem 
              icon={<Component size={14}/>} 
              name="Cube_01" 
              active={selectedObject === 'Cube_01'} 
              onClick={() => setSelectedObject('Cube_01')}
            />
          </div>
        </div>
      </aside>

      {/* RIGHT PANEL : Properties & Environment */}
      <aside 
        className={`absolute top-24 bottom-4 right-4 bg-zinc-900/60 backdrop-blur-2xl border border-white/5 shadow-2xl rounded-2xl flex flex-col transition-all duration-300 z-30 ${isRightOpen ? 'w-80' : 'w-0 translate-x-8 opacity-0 pointer-events-none'}`}
      >
        {selectedObject ? (
          // Object Properties Mode
          <>
            <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center bg-zinc-800/20">
              <h3 className="font-medium text-sm text-white flex items-center gap-2">
                <Settings size={16}/> Object Properties
              </h3>
              <button onClick={() => setSelectedObject(null)} className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 rounded">Deselect</button>
            </div>
            <div className="p-5 overflow-y-auto space-y-6">
              <div className="space-y-4">
                <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Transform</h4>
                <TransformField 
                  label="Position" 
                  value={transform.pos} 
                  onChange={(idx: number, val: number) => {
                    const newPos = [...transform.pos]; newPos[idx] = val;
                    setTransform({...transform, pos: newPos});
                  }} 
                />
                <TransformField 
                  label="Rotation" 
                  value={transform.rot}
                  onChange={(idx: number, val: number) => {
                    const newRot = [...transform.rot]; newRot[idx] = val;
                    setTransform({...transform, rot: newRot});
                  }} 
                />
                <TransformField 
                  label="Scale" 
                  value={transform.scale}
                  onChange={(idx: number, val: number) => {
                    const newScale = [...transform.scale]; newScale[idx] = val;
                    setTransform({...transform, scale: newScale});
                  }} 
                />
              </div>
              <div className="h-px bg-white/5"></div>
              <div className="space-y-4">
                <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Material</h4>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded border border-white/10 bg-blue-500"></div>
                  <span className="text-sm">Mat_Glass_Blue</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Environment Controls Mode
          <>
            <div className="p-4 border-b border-white/5 bg-zinc-800/20">
              <h3 className="font-medium text-sm">Environment Settings</h3>
            </div>
            
            <div className="flex border-b border-white/5">
              <Tab label="Lighting" active={activeTab === 'lighting'} onClick={() => setActiveTab('lighting')} />
              <Tab label="Skybox" active={activeTab === 'skybox'} onClick={() => setActiveTab('skybox')} />
              <Tab label="Audio" active={activeTab === 'audio'} onClick={() => setActiveTab('audio')} />
            </div>
            
            <div className="p-5 flex-1 overflow-y-auto space-y-6">
              {/* AI Suggestion */}
              <div className="bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-xl flex gap-3">
                <Wand2 size={20} className="text-indigo-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-indigo-300 mb-1">AI Suggestion</h4>
                  <p className="text-xs text-indigo-200/80 mb-2 leading-relaxed">
                    Based on your gallery layout, consider adding soft track lighting over the central exhibits.
                  </p>
                  <button 
                    onClick={() => {
                      setGlobalIllumination(85);
                      toast.success('AI Lighting Profile "Gallery Soft" applied');
                    }}
                    className="text-xs px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-200 rounded-lg transition-colors font-medium"
                  >
                    Apply Lighting
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm text-slate-400 flex justify-between">
                  <span>Global Illumination</span> <span className="text-white">{globalIllumination}%</span>
                </label>
                <input 
                  type="range" 
                  value={globalIllumination}
                  onChange={(e) => setGlobalIllumination(parseInt(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer h-1.5 bg-white/10 rounded-full appearance-none outline-none" 
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-sm text-slate-400 flex justify-between">
                  <span>Sun Position (Time)</span> <span className="text-white">{timeOfDay}:00</span>
                </label>
                <input 
                  type="range" 
                  min="0" max="24" 
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(parseInt(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer h-1.5 bg-white/10 rounded-full appearance-none outline-none" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Skybox</label>
                <select 
                  value={skybox}
                  onChange={(e) => {
                    setSkybox(e.target.value);
                    toast.info(`Skybox changed to ${e.target.value}`);
                  }}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="Midday Clear">Midday Clear</option>
                  <option value="Sunset Warm">Sunset Warm</option>
                  <option value="Cyberpunk Night">Cyberpunk Night</option>
                </select>
              </div>
            </div>
          </>
        )}
      </aside>

      {/* Floating Toggle for Right Panel */}
      <button 
        onClick={() => setIsRightOpen(!isRightOpen)}
        className="absolute top-1/2 right-4 -translate-y-1/2 p-2 bg-zinc-900/40 backdrop-blur border border-white/10 rounded-full text-slate-400 hover:text-white hover:bg-white/10 z-40 transition-colors hidden md:block"
      >
        {isRightOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>


      {/* Collab Overlay */}
      {showCollab && (
        <div className="absolute top-24 right-80 mr-6 bottom-4 w-80 bg-zinc-900/80 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl flex flex-col z-50 animate-in slide-in-from-right-8 duration-200">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-zinc-800/30">
            <h3 className="font-medium text-sm flex items-center gap-2 text-white"><Users size={16} className="text-blue-400" /> Team Workspace</h3>
            <button onClick={() => setShowCollab(false)} className="text-slate-400 hover:text-white p-1 hover:bg-white/10 rounded"><ChevronRight size={16} /></button>
          </div>
          <div className="flex-1 p-5 overflow-y-auto flex flex-col justify-end gap-4 text-sm scroll-smooth">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.isSelf ? 'flex-row-reverse' : ''}`}>
                {!msg.isSelf && <img src="https://i.pravatar.cc/100?img=47" className="w-8 h-8 rounded-full border border-zinc-700" />}
                <div className={`${msg.isSelf ? 'bg-blue-600 rounded-tr-sm text-white' : 'bg-white/5 border border-white/5 rounded-tl-sm text-slate-200'} p-3 rounded-2xl shadow-sm whitespace-pre-wrap`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <form 
            className="p-4 border-t border-white/10 bg-zinc-800/30 flex gap-2 items-center"
            onSubmit={(e) => {
              e.preventDefault();
              if (chatInput.trim()) {
                setMessages([...messages, { id: Date.now(), text: chatInput, isSelf: true }]);
                setChatInput('');
              }
            }}
          >
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..." 
              className="flex-1 bg-black/50 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-white placeholder-slate-500 transition-colors" 
            />
            <button 
              type="submit"
              className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-500 text-white shrink-0 shadow-lg transition-transform active:scale-90"
            >
              <MessageSquare size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

/* Helper Components */

function ToolButton({ icon, active, onClick, title }: { icon: React.ReactNode, active: boolean, onClick: () => void, title: string }) {
  return (
    <button 
      onClick={onClick}
      title={title}
      className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center transition-all duration-200 ${
        active 
          ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' 
          : 'text-slate-400 hover:bg-white/10 hover:text-white'
      }`}
    >
      {icon}
    </button>
  );
}

function OutlinerItem({ icon, name, active = false, onClick = () => {} }: { icon: React.ReactNode, name: string, active?: boolean, onClick?: () => void }) {
  const [visible, setVisible] = useState(true);
  
  return (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${active ? 'bg-blue-500/20 text-blue-300' : 'hover:bg-white/5 text-slate-300'}`}
    >
      <div className="flex items-center gap-2">
        <span className={`opacity-70 ${active ? 'text-blue-400' : ''}`}>{icon}</span>
        <span className="truncate max-w-[140px]">{name}</span>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); setVisible(!visible); }} 
        className="text-slate-500 hover:text-white"
      >
        {visible ? <Eye size={14} /> : <EyeOff size={14} className="opacity-50" />}
      </button>
    </div>
  );
}

function TransformField({ label, value, onChange }: { label: string, value: number[], onChange: (idx: number, val: number) => void }) {
  // Store local string states so users can type '-' and '.' without immediate parsing errors
  const [localValues, setLocalValues] = useState<string[]>([
    value[0].toFixed(2),
    value[1].toFixed(2),
    value[2].toFixed(2)
  ]);

  // Sync incoming value to local string state, but only if we aren't actively editing
  useEffect(() => {
    setLocalValues([
      value[0].toFixed(2),
      value[1].toFixed(2),
      value[2].toFixed(2)
    ]);
  }, [value[0], value[1], value[2]]);

  const handleBlur = (idx: number) => {
    const parsed = parseFloat(localValues[idx]);
    if (!isNaN(parsed)) {
      onChange(idx, parsed);
      // Format cleanly on blur
      const newVals = [...localValues];
      newVals[idx] = parsed.toFixed(2);
      setLocalValues(newVals);
    } else {
      // Revert if invalid
      const newVals = [...localValues];
      newVals[idx] = value[idx].toFixed(2);
      setLocalValues(newVals);
    }
  };

  const handleChange = (idx: number, newStr: string) => {
    const newVals = [...localValues];
    newVals[idx] = newStr;
    setLocalValues(newVals);
    
    // Live update if valid number
    if (newStr !== '-' && newStr !== '' && newStr !== '.') {
        const parsed = parseFloat(newStr);
        if(!isNaN(parsed)) {
            onChange(idx, parsed);
        }
    }
  };

  return (
    <div>
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <div className="flex gap-2">
        <div className="flex-1 bg-black/40 border border-white/10 rounded-md flex items-center px-2 py-1.5 focus-within:border-red-500/50">
          <span className="text-red-400 text-xs font-mono mr-2">X</span>
          <input 
            type="text" 
            value={localValues[0]} 
            onChange={(e) => handleChange(0, e.target.value)}
            onBlur={() => handleBlur(0)}
            onKeyDown={(e) => e.key === 'Enter' && handleBlur(0)}
            className="w-full bg-transparent text-xs text-white focus:outline-none" 
          />
        </div>
        <div className="flex-1 bg-black/40 border border-white/10 rounded-md flex items-center px-2 py-1.5 focus-within:border-green-500/50">
          <span className="text-green-400 text-xs font-mono mr-2">Y</span>
          <input 
            type="text" 
            value={localValues[1]} 
            onChange={(e) => handleChange(1, e.target.value)}
            onBlur={() => handleBlur(1)}
            onKeyDown={(e) => e.key === 'Enter' && handleBlur(1)}
            className="w-full bg-transparent text-xs text-white focus:outline-none" 
          />
        </div>
        <div className="flex-1 bg-black/40 border border-white/10 rounded-md flex items-center px-2 py-1.5 focus-within:border-blue-500/50">
          <span className="text-blue-400 text-xs font-mono mr-2">Z</span>
          <input 
            type="text" 
            value={localValues[2]} 
            onChange={(e) => handleChange(2, e.target.value)}
            onBlur={() => handleBlur(2)}
            onKeyDown={(e) => e.key === 'Enter' && handleBlur(2)}
            className="w-full bg-transparent text-xs text-white focus:outline-none" 
          />
        </div>
      </div>
    </div>
  );
}

function Tab({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex-1 text-center py-3 text-sm cursor-pointer border-b-2 transition-all duration-200 ${
        active 
          ? 'border-blue-500 text-white font-medium bg-blue-500/5 shadow-[inset_0_-1px_0_rgba(59,130,246,0.5)]' 
          : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {label}
    </div>
  );
}
