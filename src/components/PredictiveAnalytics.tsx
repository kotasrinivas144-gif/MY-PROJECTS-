import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingDown, 
  Clock, 
  Zap, 
  ShieldAlert, 
  CheckCircle, 
  Calendar,
  Layers,
  Flame
} from 'lucide-react';
import { Train, TrackSegment } from '../types/railway';

interface PredictiveAnalyticsProps {
  trains: Train[];
  trackSegments: TrackSegment[];
  dynamicPacingActive: boolean;
  onTogglePacing: (active: boolean) => void;
}

export const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({
  trains,
  trackSegments,
  dynamicPacingActive,
  onTogglePacing
}) => {
  const [timeHorizonMin, setTimeHorizonMin] = useState<number>(30);

  const horizons = [15, 30, 45, 60];

  const unpacedCongestion = Math.min(98, 70 + timeHorizonMin * 0.5);
  const pacedCongestion = dynamicPacingActive 
    ? Math.max(30, 44 - timeHorizonMin * 0.12) 
    : unpacedCongestion;

  const preventedDeadlocks = dynamicPacingActive ? Math.round(timeHorizonMin * 0.5) : 0;
  const energySavingsMWh = dynamicPacingActive ? (timeHorizonMin * 0.16).toFixed(1) : '0.0';
  const delayMinutesAbsorbed = dynamicPacingActive ? Math.round(timeHorizonMin * 3.2) : 0;

  // Real-world busy Indian station platform schedule: New Delhi Railway Station (NDLS)
  const ndlsPlatformSlots = [
    {
      platform: 'Platform 1 (VIP Bay)',
      train1: { code: '12012 Kalka Shatabdi', from: '13:40', to: '14:20', status: 'delayed', color: '#f59e0b' },
      train2: { 
        code: 'VB-22436 Vande Bharat', 
        from: dynamicPacingActive ? '14:21' : '14:05', 
        to: dynamicPacingActive ? '14:55' : '14:35', 
        status: dynamicPacingActive ? 'paced_glide' : 'conflict_stop', 
        color: dynamicPacingActive ? '#00f0ff' : '#f43f5e' 
      }
    },
    {
      platform: 'Platform 2 (Executive Concourse)',
      train1: { code: 'SHT-12004 Swarna Shatabdi', from: '13:58', to: '14:25', status: 'normal', color: '#3b82f6' },
      train2: { code: '12423 Dibrugarh Rajdhani', from: '14:30', to: '15:10', status: 'normal', color: '#3b82f6' }
    },
    {
      platform: 'Platform 3 (Superfast Bay)',
      train1: { code: '12952 Mumbai Tejas Rajdhani', from: '14:00', to: '14:35', status: 'normal', color: '#ef4444' },
      train2: { code: '12414 Jammu Pooja Express', from: '14:40', to: '15:20', status: 'normal', color: '#ef4444' }
    },
    {
      platform: 'Platform 4 (Main Intercity)',
      train1: { code: '12417 Prayagraj Express', from: '14:10', to: '14:45', status: 'normal', color: '#10b981' },
      train2: { code: '14006 Lichchavi Express', from: '14:50', to: '15:30', status: 'normal', color: '#10b981' }
    },
    {
      platform: 'Platform 11 (Suburban Local Island)',
      train1: { code: 'EMU-64402 Ghaziabad Commuter', from: '14:15', to: '14:35', status: 'normal', color: '#10b981' },
      train2: { code: 'EMU-64410 Palwal Commuter', from: '14:40', to: '15:00', status: 'normal', color: '#10b981' }
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Predictive Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-xl border border-slate-800 bg-[#080d16]">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            Predictive Headway Analytics: Delhi Railway Terminal Network
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulate forward network evolution across Ghaziabad – Tilak Bridge – NDLS. Observe how deliberate arrival delay pacing prevents cascading blockades.
          </p>
        </div>

        {/* Time Horizon Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Forecast Horizon:</span>
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            {horizons.map((h) => (
              <button
                key={h}
                onClick={() => setTimeHorizonMin(h)}
                className={`px-3 py-1 text-xs font-mono font-medium rounded transition-colors ${
                  timeHorizonMin === h
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                +{h}m
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Comparison Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Track Saturation Meter */}
        <div className="p-4 rounded-xl border border-slate-800 bg-[#090d16] space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span>DELHI THROAT SATURATION</span>
            <Flame className={`h-4 w-4 ${dynamicPacingActive ? 'text-emerald-400' : 'text-rose-400'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${dynamicPacingActive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {Math.round(pacedCongestion)}%
            </span>
            <span className="text-xs font-mono text-slate-500 line-through">
              {Math.round(unpacedCongestion)}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${dynamicPacingActive ? 'bg-emerald-400' : 'bg-rose-500'}`}
              style={{ width: `${pacedCongestion}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-400">
            {dynamicPacingActive ? 'Fluid entry into NDLS PF 1-16' : 'Severe gridlock at Yamuna River Bridge'}
          </p>
        </div>

        {/* Prevented Deadlocks */}
        <div className="p-4 rounded-xl border border-slate-800 bg-[#090d16] space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span>OUTER SIGNAL HALTS AVERTED</span>
            <CheckCircle className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-300">
            {preventedDeadlocks} Express Rakes
          </div>
          <p className="text-[11px] text-slate-400">
            No emergency brake stops at Tilak Bridge outer signals.
          </p>
        </div>

        {/* Energy Conservation */}
        <div className="p-4 rounded-xl border border-slate-800 bg-[#090d16] space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span>TRACTION POWER SAVED</span>
            <Zap className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300">
            {energySavingsMWh} MWh
          </div>
          <p className="text-[11px] text-slate-400">
            Eliminating 110→0 km/h stops saves 40%+ 25kV OHE traction power.
          </p>
        </div>

        {/* Delay Buffer Absorption */}
        <div className="p-4 rounded-xl border border-slate-800 bg-[#090d16] space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span>DELAY BUFFER ABSORPTION</span>
            <Clock className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300">
            {delayMinutesAbsorbed} Train-Min
          </div>
          <p className="text-[11px] text-slate-400">
            Intentional delay smoothly paced along Ghaziabad – Delhi approach.
          </p>
        </div>

      </div>

      {/* Platform Occupancy Gantt Chart & Conflict Visualizer */}
      <div className="rounded-xl border border-slate-800 bg-[#090d16] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-cyan-400" />
              New Delhi Railway Station (NDLS) Platform Occupancy & Conflict Resolution
            </h3>
            <p className="text-xs text-slate-400">
              Demonstrates why delaying Vande Bharat 22436 arrival by +16 minutes clears Platform 1 conflict with delayed Kalka Shatabdi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Pacing Mode:</span>
            <button
              onClick={() => onTogglePacing(!dynamicPacingActive)}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                dynamicPacingActive 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {dynamicPacingActive ? 'KAVACH PACING ENGAGED' : 'UNPACED RUSH'}
            </button>
          </div>
        </div>

        {/* Gantt Timeline */}
        <div className="space-y-3 pt-2">
          {ndlsPlatformSlots.map((slot) => (
            <div key={slot.platform} className="grid grid-cols-1 md:grid-cols-4 items-center gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="text-xs font-mono font-bold text-slate-300">
                {slot.platform}
              </div>

              <div className="md:col-span-3 flex flex-wrap items-center gap-2 font-mono text-xs">
                {/* Train 1 */}
                <div 
                  className="px-3 py-1.5 rounded border flex items-center gap-2"
                  style={{ 
                    backgroundColor: `${slot.train1.color}15`,
                    borderColor: `${slot.train1.color}50`,
                    color: slot.train1.color
                  }}
                >
                  <span className="font-bold">{slot.train1.code}</span>
                  <span className="text-[11px] text-slate-400">({slot.train1.from} - {slot.train1.to})</span>
                  {slot.train1.status === 'delayed' && (
                    <span className="text-[10px] px-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      DELAYED SHUNTING
                    </span>
                  )}
                </div>

                <span className="text-slate-600">→</span>

                {/* Train 2 */}
                {slot.train2 ? (
                  <div 
                    className={`px-3 py-1.5 rounded border flex items-center gap-2 ${
                      slot.train2.status === 'conflict_stop' 
                        ? 'bg-rose-950/40 border-rose-500/60 text-rose-400 animate-pulse' 
                        : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    }`}
                  >
                    <span className="font-bold">{slot.train2.code}</span>
                    <span className="text-[11px] text-slate-400">({slot.train2.from} - {slot.train2.to})</span>
                    {slot.train2.status === 'conflict_stop' ? (
                      <span className="text-[10px] px-1 rounded bg-rose-500/30 text-rose-200 border border-rose-500">
                        COLLISION CONFLICT (HALTED AT YAMUNA RED)
                      </span>
                    ) : (
                      <span className="text-[10px] px-1 rounded bg-emerald-500/30 text-emerald-200 border border-emerald-500">
                        PACED ARRIVAL (+16m) · GREEN WAVE
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-500 italic">Open Arrival Slot Available</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Operational Context */}
        <div className="flex items-start gap-3 p-3.5 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-xs text-slate-300">
          <div className="p-1 rounded bg-cyan-500/20 text-cyan-300 shrink-0">
            <Clock className="h-4 w-4" />
          </div>
          <div className="leading-relaxed">
            <strong className="text-white">Why Pacing Arrival Time Solves the Indian Railways Chokepoint: </strong>
            At New Delhi Station (NDLS), Platform 1 is held by Kalka Shatabdi until 14:20. If incoming Vande Bharat 22436 charges at 110 km/h to arrive at 14:05, it must halt dead at Yamuna Bridge Outer Cabin signal. That stop blocks following local EMUs, creates massive passenger panic, and burns megawatts of power to re-accelerate. 
            By instructing the driver to <span className="text-cyan-300 font-semibold">glide at 62 km/h (+16m delay)</span>, Vande Bharat hits Platform 1 at 14:21 without ever applying brakes.
          </div>
        </div>
      </div>

    </div>
  );
};
