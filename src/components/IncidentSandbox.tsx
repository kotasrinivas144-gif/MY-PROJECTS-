import React from 'react';
import { CongestionIncident, Train } from '../types/railway';
import { 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Zap, 
  Clock, 
  Sliders, 
  Flame, 
  ShieldCheck,
  Send
} from 'lucide-react';

interface IncidentSandboxProps {
  incidents: CongestionIncident[];
  onToggleIncident: (incidentId: string) => void;
  trains: Train[];
  onApplyMassPacing: () => void;
  onResetIncidents: () => void;
  dynamicPacingActive: boolean;
  onTogglePacing: (active: boolean) => void;
}

export const IncidentSandbox: React.FC<IncidentSandboxProps> = ({
  incidents,
  onToggleIncident,
  trains,
  onApplyMassPacing,
  onResetIncidents,
  dynamicPacingActive,
  onTogglePacing
}) => {
  const activeCount = incidents.filter((i) => i.active).length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-xl border border-slate-800 bg-[#080d16]">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sliders className="h-5 w-5 text-amber-400" />
            Network Incident Injection & Dispatch Resilience Sandbox
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulate realistic track bottlenecks, platform delays, and interlocking failures to observe how dynamic arrival delay routing neutralizes cascading deadlocks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onApplyMassPacing}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow flex items-center gap-1.5"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Auto-Pace All Trains</span>
          </button>

          <button
            onClick={onResetIncidents}
            className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Clear Incidents</span>
          </button>
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>SELECT INCIDENTS TO TOGGLE IN REAL-TIME</span>
          <span>{activeCount} of {incidents.length} Hazards Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {incidents.map((inc) => {
            const isCritical = inc.severity === 'critical';
            const isMajor = inc.severity === 'major';

            return (
              <div
                key={inc.id}
                onClick={() => onToggleIncident(inc.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  inc.active
                    ? 'border-amber-500/70 bg-[#16120d] shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/50'
                    : 'border-slate-800 bg-[#080d16] hover:border-slate-700 hover:bg-slate-850 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    isCritical ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                    isMajor ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  }`}>
                    {inc.severity} HAZARD
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${inc.active ? 'bg-amber-400 animate-ping' : 'bg-slate-600'}`}></span>
                    <span className="text-[11px] font-mono font-bold text-slate-300">
                      {inc.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white mb-1">
                  {inc.title}
                </h3>

                <div className="text-xs font-mono text-cyan-400 mb-2">
                  {inc.locationName}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {inc.description}
                </p>

                <div className="flex items-center justify-between text-xs font-mono text-slate-300 pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400">Added Delay Buffer:</span>
                  <span className="font-bold text-amber-400">+{inc.addedDelayMin} Minutes</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-Time Operational Playbook & Recovery Matrix */}
      <div className="rounded-xl border border-slate-800 bg-[#090d16] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Dynamic Pacing Recovery Protocol
            </h3>
            <p className="text-xs text-slate-400">
              How the algorithmic delay calculator responds when an incident is active.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
            Autonomous Safety Protocol
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="text-cyan-400 font-bold">1. Downstream Delay Detection</div>
            <div className="text-slate-400 font-sans">
              System identifies that Grand Central Platform 3 departure is held by +11 mins.
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="text-emerald-400 font-bold">2. Upstream Speed Pacing</div>
            <div className="text-slate-400 font-sans">
              Transmits 82 km/h cruise profile to incoming IC-402, delaying arrival by +13 min.
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="text-purple-400 font-bold">3. Siding & Bypass Relief</div>
            <div className="text-slate-400 font-sans">
              Diverts freight FRT-709 into River Siding 4-B, preventing cargo stall on main track.
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
