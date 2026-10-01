import React from 'react';
import { 
  TrainTrack, 
  Map, 
  Clock, 
  GitFork, 
  BarChart3, 
  AlertTriangle, 
  Play, 
  Pause, 
  RotateCcw,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface TopNavProps {
  activeTab: 'map' | 'optimizer' | 'routes' | 'analytics' | 'incidents';
  setActiveTab: (tab: 'map' | 'optimizer' | 'routes' | 'analytics' | 'incidents') => void;
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;
  simSpeed: number;
  setSimSpeed: (speed: number) => void;
  dynamicPacingActive: boolean;
  setDynamicPacingActive: (active: boolean) => void;
  preventedBottlenecksCount: number;
  activeIncidentsCount: number;
  onResetSimulation: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  isSimulating,
  setIsSimulating,
  simSpeed,
  setSimSpeed,
  dynamicPacingActive,
  setDynamicPacingActive,
  preventedBottlenecksCount,
  activeIncidentsCount,
  onResetSimulation
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#070b12]/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <TrainTrack className="h-5 w-5" />
          </div>
          <button 
            onClick={() => setActiveTab('map')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              RailPace
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-mono text-cyan-400/80">
              TOA Optimization System
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'map'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Map className="h-3.5 w-3.5" />
            <span>Network Heatmap</span>
          </button>

          <button
            onClick={() => setActiveTab('optimizer')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'optimizer'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Arrival Delay Optimizer</span>
            <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
              Core
            </span>
          </button>

          <button
            onClick={() => setActiveTab('routes')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'routes'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <GitFork className="h-3.5 w-3.5" />
            <span>Live Traffic Routes</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'analytics'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Predictive Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('incidents')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'incidents'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            <span>Incidents Sandbox</span>
            {activeIncidentsCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {activeIncidentsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Actions & Live Simulation Controls */}
        <div className="flex items-center gap-2 lg:gap-3">
          
          {/* Dynamic Pacing Engine Toggle */}
          <button
            onClick={() => setDynamicPacingActive(!dynamicPacingActive)}
            title="Toggle Dynamic Arrival Delay & Speed Pacing"
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              dynamicPacingActive
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}
          >
            <Zap className={`h-3.5 w-3.5 ${dynamicPacingActive ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">Pacing Engine:</span>
            <span>{dynamicPacingActive ? 'ACTIVE' : 'OFF'}</span>
          </button>

          {/* Simulation Controls */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title={isSimulating ? 'Pause Network Simulation' : 'Resume Network Simulation'}
            >
              {isSimulating ? (
                <Pause className="h-3.5 w-3.5 text-amber-400" />
              ) : (
                <Play className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
              )}
            </button>
            <button
              onClick={() => {
                const speeds = [1, 2, 4];
                const nextIdx = (speeds.indexOf(simSpeed) + 1) % speeds.length;
                setSimSpeed(speeds[nextIdx]);
              }}
              className="px-2 py-1 text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition-colors"
              title="Change simulation speed multiplier"
            >
              {simSpeed}x
            </button>
            <button
              onClick={onResetSimulation}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="Reset Simulation State"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Prevented Deadlocks badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-300 font-mono">
            <CheckCircle2 className="h-3 w-3 text-cyan-400" />
            <span>Deadlocks Averted:</span>
            <span className="font-bold text-cyan-200">{preventedBottlenecksCount}</span>
          </div>

        </div>

      </div>

      {/* Mobile nav drawer strip */}
      <div className="flex md:hidden border-t border-slate-800/80 px-2 py-1.5 overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('map')}
          className={`px-2.5 py-1 text-xs whitespace-nowrap rounded ${
            activeTab === 'map' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
          }`}
        >
          Heatmap
        </button>
        <button
          onClick={() => setActiveTab('optimizer')}
          className={`px-2.5 py-1 text-xs whitespace-nowrap rounded ${
            activeTab === 'optimizer' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400'
          }`}
        >
          Delay Optimizer
        </button>
        <button
          onClick={() => setActiveTab('routes')}
          className={`px-2.5 py-1 text-xs whitespace-nowrap rounded ${
            activeTab === 'routes' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
          }`}
        >
          Live Routes
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-2.5 py-1 text-xs whitespace-nowrap rounded ${
            activeTab === 'analytics' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
          }`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('incidents')}
          className={`px-2.5 py-1 text-xs whitespace-nowrap rounded ${
            activeTab === 'incidents' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
          }`}
        >
          Incidents
        </button>
      </div>
    </header>
  );
};
