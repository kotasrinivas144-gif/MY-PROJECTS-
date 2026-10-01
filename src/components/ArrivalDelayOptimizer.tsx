import React, { useState } from 'react';
import { 
  Train, 
  Station, 
  PacingRouteOption,
  TrackSegment
} from '../types/railway';
import { 
  CheckCircle, 
  Clock, 
  Gauge, 
  Zap, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  Send,
  Sparkles,
  TrainTrack,
  Info
} from 'lucide-react';

interface ArrivalDelayOptimizerProps {
  trains: Train[];
  stations: Station[];
  trackSegments: TrackSegment[];
  selectedTrainId: string;
  onSelectTrain: (trainId: string) => void;
  onApplyRoute: (trainId: string, routeId: string) => void;
  onHighlightRoute: (segmentIds: string[]) => void;
}

export const ArrivalDelayOptimizer: React.FC<ArrivalDelayOptimizerProps> = ({
  trains,
  stations,
  trackSegments,
  selectedTrainId,
  onSelectTrain,
  onApplyRoute,
  onHighlightRoute
}) => {
  const currentTrain = trains.find((t) => t.id === selectedTrainId) || trains[0];
  const [selectedRouteId, setSelectedRouteId] = useState<string>(
    currentTrain.assignedRouteId || currentTrain.routeOptions[0]?.id || ''
  );
  const [customDelayOffset, setCustomDelayOffset] = useState<number>(currentTrain.targetPacingDelayMin);
  const [transmissionSuccess, setTransmissionSuccess] = useState<boolean>(false);

  const originStation = stations.find((s) => s.id === currentTrain.originStationId);
  const destinationStation = stations.find((s) => s.id === currentTrain.destinationStationId);

  const handleTrainChange = (trainId: string) => {
    onSelectTrain(trainId);
    const newTrain = trains.find((t) => t.id === trainId);
    if (newTrain) {
      const best = newTrain.routeOptions.find((r) => r.recommended) || newTrain.routeOptions[0];
      setSelectedRouteId(best?.id || '');
      setCustomDelayOffset(newTrain.targetPacingDelayMin);
      if (best) {
        onHighlightRoute(best.pathSegmentIds);
      }
    }
  };

  const handleSelectRouteOption = (route: PacingRouteOption) => {
    setSelectedRouteId(route.id);
    onHighlightRoute(route.pathSegmentIds);
    setTransmissionSuccess(false);
  };

  const handleTransmitPacing = () => {
    if (selectedRouteId) {
      onApplyRoute(currentTrain.id, selectedRouteId);
      setTransmissionSuccess(true);
      setTimeout(() => setTransmissionSuccess(false), 3500);
    }
  };

  const activeRoute = currentTrain.routeOptions.find((r) => r.id === selectedRouteId) || currentTrain.routeOptions[0];

  return (
    <div className="space-y-6">
      
      {/* Executive Philosophy Banner for Busy Indian Station Bottlenecks */}
      <div className="relative overflow-hidden rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 p-5 lg:p-6 backdrop-blur-md">
        <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400"></span>
              <span className="font-mono text-xs uppercase tracking-wider text-cyan-300">
                Indian Railways Mission Raftaar & Kavach Pacing Objective
              </span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-white">
              Dynamic Time-of-Arrival (TOA) Pacing & Anti-Gridlock Routing
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              At New Delhi Railway Station (NDLS) and Yamuna River Bridge, trains speeding full throttle into occupied terminal platforms end up stranded at outer red signals for 30–45 minutes, blocking oncoming trains behind them. 
              By computing the optimal route and cruise speed to <strong className="text-cyan-300">deliberately delay arrival by +16 minutes</strong>, the train glides without halting right as Platform 1 vacates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-4 py-2 text-center">
              <div className="text-[11px] font-mono text-emerald-300">Outer Signal Halts Averted</div>
              <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">98.2%</div>
            </div>
            <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/30 px-4 py-2 text-center">
              <div className="text-[11px] font-mono text-cyan-300">Delhi Throat Congestion</div>
              <div className="text-xl font-bold font-mono text-cyan-400 tabular-nums">-44.6%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Train Selector Tabs for Indian Trains */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Select Active Inbound Train on Delhi Corridor
          </label>
          <span className="text-xs text-slate-500">
            Targeting platform slot synchronization at NDLS & NZM
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {trains.map((train) => {
            const isSelected = train.id === currentTrain.id;

            return (
              <button
                key={train.id}
                onClick={() => handleTrainChange(train.id)}
                className={`flex flex-col items-start p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/50'
                    : 'border-slate-800 bg-[#0a0f19] hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className="font-mono text-xs font-bold text-white">
                    {train.callsign}
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                    train.type === 'vande_bharat' ? 'border-cyan-500/40 text-cyan-300 bg-cyan-950/50' :
                    train.type === 'rajdhani_express' ? 'border-rose-500/40 text-rose-300 bg-rose-950/50' :
                    train.type === 'freight_boxn' ? 'border-amber-500/40 text-amber-300 bg-amber-950/50' :
                    'border-emerald-500/40 text-emerald-300 bg-emerald-950/50'
                  }`}>
                    {train.type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="text-xs font-medium text-slate-200 truncate w-full mb-1">
                  {train.name}
                </div>

                <div className="text-[10.5px] text-slate-400 truncate w-full mb-2">
                  {train.assignedPlatform || 'Platform TBD'}
                </div>

                <div className="flex items-center justify-between w-full text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
                  <span>Speed: {Math.round(train.speedKmh)} km/h</span>
                  <span className={`font-semibold ${train.targetPacingDelayMin > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {train.targetPacingDelayMin > 0 ? `+${train.targetPacingDelayMin}m Pacing` : 'Standard'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottleneck Analysis & Paced Arrival Calculation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Train Rake Telemetry */}
        <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <span className="text-xs font-mono uppercase text-slate-400">Rake Telemetry</span>
            <span className="text-xs font-mono text-cyan-400">{currentTrain.callsign}</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Section Run:</span>
              <span className="font-mono text-slate-200">{originStation?.name} → {destinationStation?.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Rake Configuration:</span>
              <span className="font-mono text-slate-300">{currentTrain.rakeType}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Target Kavach Speed:</span>
              <span className="font-mono font-bold text-emerald-400">{currentTrain.targetPacingSpeedKmh} km/h (Optimal Glide)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Passenger / Freight Load:</span>
              <span className="font-mono text-slate-300">{currentTrain.tonnageOrPassengers}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Downstream Conflict:</span>
              <span className="font-mono text-rose-400 font-semibold">NDLS Platform 1 Occupied</span>
            </div>
          </div>
        </div>

        {/* The Bottleneck & Pacing Mathematics */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-[#090d16] p-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-mono uppercase text-slate-300">
                NDLS Platform 1 Clearance Window
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              Vacates at 14:21 (Kalka Shatabdi Departure)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 space-y-1">
              <div className="text-[10px] font-mono text-rose-300 uppercase">Unpaced Rush ETA</div>
              <div className="text-lg font-bold font-mono text-rose-400">{currentTrain.scheduledArrival}</div>
              <div className="text-[11px] text-rose-300/80 leading-tight">
                Arrives 16 min too early. Trapped at Yamuna Bridge red signal.
              </div>
            </div>

            <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 space-y-1">
              <div className="text-[10px] font-mono text-cyan-300 uppercase">Calculated Delay Buffer</div>
              <div className="text-lg font-bold font-mono text-cyan-400">+{currentTrain.targetPacingDelayMin} Minutes</div>
              <div className="text-[11px] text-cyan-300/80 leading-tight">
                Intentional delay time stretch to clear downstream conflict.
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 space-y-1">
              <div className="text-[10px] font-mono text-emerald-300 uppercase">Paced Arrival Target</div>
              <div className="text-lg font-bold font-mono text-emerald-400">{currentTrain.estimatedArrival}</div>
              <div className="text-[11px] text-emerald-300/80 leading-tight">
                Touches Platform 1 smoothly without a single signal stop.
              </div>
            </div>
          </div>

          {/* Dynamic Slider */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5 text-cyan-400" />
                Adjust Arrival Delay Buffer:
              </span>
              <span className="font-mono text-cyan-300 font-bold">+{customDelayOffset} min buffer</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={customDelayOffset}
              onChange={(e) => setCustomDelayOffset(Number(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0m (Full Rush - High Risk Halt)</span>
              <span>16m (Algorithm Optimum)</span>
              <span>25m (Siding Loop Hold)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Candidate Route Comparison Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              Evaluated Routes to Delay Time of Arrival & De-Congest Tracks
            </h3>
            <p className="text-xs text-slate-400">
              Compare speed pacing, Sahibabad loop siding, and Anand Vihar bypass routes.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {currentTrain.routeOptions.length} Strategies Generated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {currentTrain.routeOptions.map((route) => {
            const isSelected = selectedRouteId === route.id;
            const isRecommended = route.recommended;

            return (
              <div
                key={route.id}
                onClick={() => handleSelectRouteOption(route)}
                className={`relative flex flex-col justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-cyan-400 bg-[#0d1525] shadow-[0_0_20px_rgba(6,182,212,0.2)] ring-1 ring-cyan-400'
                    : 'border-slate-800 bg-[#080d16] hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                {isRecommended && (
                  <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-[10px] font-mono px-2 py-0.5 rounded shadow">
                    BEST DELAY ROUTE
                  </div>
                )}

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span 
                      className="font-mono text-xs font-bold uppercase tracking-wider"
                      style={{ color: route.colorHex }}
                    >
                      {route.strategy.replace('_', ' ')}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      {route.totalDistanceKm} km
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white leading-snug">
                    {route.name}
                  </h4>

                  <p className="text-xs text-slate-400 leading-relaxed min-h-[48px]">
                    {route.summary}
                  </p>

                  <div className="space-y-1.5 py-2.5 border-y border-slate-800/80 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Arrival Delay Added:</span>
                      <span className="font-bold text-cyan-300">+{route.deliberateDelayMin} mins</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Paced Travel Duration:</span>
                      <span className="text-slate-200">{route.pacedDurationMin} mins</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Traction Energy Saved:</span>
                      <span className="text-emerald-400 font-semibold">{route.energySavingsKWh} kWh</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Throat Congestion Cut:</span>
                      <span className="text-cyan-400 font-semibold">-{route.congestionReductionPercent}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Outer Bridge Conflict:</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                        route.downstreamConflictAverted 
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-600/40' 
                          : 'bg-rose-950/60 text-rose-300 border border-rose-600/40'
                      }`}>
                        {route.downstreamConflictAverted ? 'AVERTED' : 'FATAL HALT'}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800">
                    <span className="text-slate-400 font-semibold">Section Control: </span>
                    {route.advisoryNote}
                  </div>
                </div>

                <div className="pt-4 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectRouteOption(route);
                    }}
                    className={`w-full py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 shadow hover:bg-cyan-400'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {isSelected ? <CheckCircle className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                    <span>{isSelected ? 'Route Selected' : 'Select This Route'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transmit Command */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-[#090d16]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Send className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              Delhi Division Control Office · Cab Signaling Transmission
            </div>
            <div className="text-xs text-slate-400">
              Transmit calculated arrival delay pacing profile (+{activeRoute?.deliberateDelayMin}m) to {currentTrain.callsign} via Kavach Loco Device.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {transmissionSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono animate-fade-in">
              <CheckCircle className="h-4 w-4" />
              <span>Speed Profile Transmitted to Loco Pilot!</span>
            </div>
          )}
          <button
            onClick={handleTransmitPacing}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:from-cyan-400 hover:to-emerald-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="h-4 w-4 text-slate-950" />
            <span>Lock & Enforce Best Delay Route</span>
          </button>
        </div>
      </div>

    </div>
  );
};
