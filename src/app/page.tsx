'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  Box, 
  MountainSnow, 
  Warehouse, 
  Plus, 
  X,
  History,
  LayoutGrid,
  Tent,
  Gamepad2,
  GraduationCap
} from 'lucide-react';

export default function HomeDashboard() {
  const router = useRouter();
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Museums', 'Events', 'Game Worlds', 'Education'];

  return (
    <div className="relative w-full h-screen flex flex-col items-center overflow-y-auto pt-16 px-8">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 h-16 flex justify-between items-center px-8 border-b border-white/5 bg-zinc-900/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3 font-bold text-xl">
          <Box className="text-blue-500" /> SPATIAL
        </div>
        <div className="flex items-center gap-4">


          <div 
            onClick={() => toast.info('Profile settings coming soon')}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-zinc-900 cursor-pointer hover:opacity-80 transition-opacity" 
          />
        </div>
      </header>

      <main className="w-full max-w-6xl flex flex-col gap-12 mt-12 pb-24">
        {/* Hero */}
        <section className="flex justify-between items-center p-12 rounded-2xl border border-white/10 bg-zinc-900/50 bg-[radial-gradient(circle_at_right,_rgba(59,130,246,0.15)_0%,_transparent_50%)] relative overflow-hidden">
          <div className="z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Craft immersive worlds.</h1>
            <p className="text-slate-400 max-w-lg mb-8">
              The professional spatial design platform for creating, editing, and publishing virtual environments.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowWorkspaceModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all active:scale-95"
              >
                <Plus size={20} /> Create New Project
              </button>
            </div>
          </div>
          
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=1000')"}}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-transparent"></div>
        </section>

        {/* Recent Projects */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <History size={20} className="text-slate-400" />
            <h2 className="text-xl font-semibold">Recent Projects</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProjectCard 
              title="Modern Art Gallery" 
              time="2 hours ago" 
              img="https://images.unsplash.com/photo-1541123437800-1bb1317bc20f?auto=format&fit=crop&q=80&w=600" 
            />
            <ProjectCard 
              title="Tech Conference Hall" 
              time="Yesterday" 
              img="https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=600" 
            />
            <ProjectCard 
              title="Sci-Fi Outpost" 
              time="3 days ago" 
              img="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=600" 
            />
          </div>
        </section>

        {/* Environment Explorer */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <LayoutGrid size={20} className="text-slate-400" />
            <h2 className="text-xl font-semibold">Environment Explorer</h2>
          </div>
          
          <div className="flex gap-6 mb-6 border-b border-white/10 pb-2 text-sm">
            {categories.map(cat => (
              <span 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`cursor-pointer transition-colors pb-2 ${activeCategory === cat ? 'text-white font-medium border-b-2 border-blue-500 relative top-[9px]' : 'text-slate-400 hover:text-white'}`}
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(activeCategory === 'All' || activeCategory === 'Museums') && <TemplateItem icon={<Box size={32} />} title="Classical Museum" />}
            {(activeCategory === 'All' || activeCategory === 'Events') && <TemplateItem icon={<Tent size={32} />} title="Expo Booth" />}
            {(activeCategory === 'All' || activeCategory === 'Game Worlds') && <TemplateItem icon={<Gamepad2 size={32} />} title="Cyberpunk City" />}
            {(activeCategory === 'All' || activeCategory === 'Education') && <TemplateItem icon={<GraduationCap size={32} />} title="Virtual Classroom" />}
          </div>
        </section>
      </main>

      {/* Workspace Modal */}
      {showWorkspaceModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowWorkspaceModal(false);
          }}
        >
          <div className="glass-panel w-full max-w-4xl p-10 relative animate-in slide-in-from-bottom-10 duration-300">
            <button 
              onClick={() => setShowWorkspaceModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-3xl font-bold mb-2">Start a New Project</h2>
            <p className="text-slate-400 mb-10">Choose a starting environment layout or begin with a blank canvas.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <WorkspaceCard 
                icon={<Box size={40} />} 
                title="Blank Canvas" 
                desc="Start from scratch with an infinite 3D grid." 
                onClick={() => {
                  toast.success('Initializing Blank Canvas workspace...');
                  setTimeout(() => router.push('/builder'), 800);
                }}
              />
              <WorkspaceCard 
                icon={<MountainSnow size={40} />} 
                title="Outdoor Plaza" 
                desc="Open air environment with natural lighting." 
                onClick={() => {
                  toast.success('Loading Outdoor Plaza template...');
                  setTimeout(() => router.push('/builder'), 800);
                }}
              />
              <WorkspaceCard 
                icon={<Warehouse size={40} />} 
                title="Warehouse Space" 
                desc="Large indoor area with an industrial feel." 
                onClick={() => {
                  toast.success('Loading Warehouse Space template...');
                  setTimeout(() => router.push('/builder'), 800);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ title, time, img }: { title: string, time: string, img: string }) {
  const router = useRouter();
  return (
    <div 
      onClick={() => {
        toast.loading('Loading project...', { duration: 1000 });
        setTimeout(() => router.push('/builder'), 1000);
      }}
      className="glass-panel overflow-hidden cursor-pointer group hover:-translate-y-1 transition-transform duration-300"
    >
      <div 
        className="h-40 bg-cover bg-center border-b border-white/5 relative"
        style={{ backgroundImage: `url(${img})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-400 transition-colors">{title}</h3>
        <p className="text-sm text-slate-400">Edited {time}</p>
      </div>
    </div>
  );
}

function TemplateItem({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div 
      onClick={() => toast.info(`Template '${title}' selected. Click 'Create New Project' to use it.`)}
      className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors text-center active:scale-95"
    >
      <div className="text-blue-500 opacity-80">{icon}</div>
      <span className="font-medium text-sm">{title}</span>
    </div>
  );
}

function WorkspaceCard({ icon, title, desc, onClick }: { icon: React.ReactNode, title: string, desc: string, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500 rounded-xl p-8 text-center cursor-pointer transition-all hover:-translate-y-1 group active:scale-95"
    >
      <div className="w-20 h-20 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{desc}</p>
    </div>
  );
}
