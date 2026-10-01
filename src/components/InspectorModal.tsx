import React from 'react';
import { Train, TrackSegment, Station } from '../types/railway';
import { 
  X, 
  Gauge, 
  Clock, 
  MapPin, 
  CheckCircle, 
  ShieldAlert, 
  ArrowRight,
  TrendingDown,
  Zap,
  Layers
} from 'lucide-react';

interface InspectorModalProps {
  train: Train | null;
  segment: TrackSegment | null;
  stations: Station[];
  onClose: () => void;
  onOpenOptimizer: (trainId: string) => void;
}

export const InspectorModal: React.FC<InspectorModalProps> = ({
  train,
  segment,
  stations,
  onClose,
  onOpenOptimizer
}) => {
  if (!train && !segment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-xl border border-slate-700 bg-[#0a0f1a] p-6 shadow-2xl space-y-4">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {train && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold text-sm">
                {train.callsign.split('-')[0]}
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{train.callsign}</span>
                  <span className="text-xs font-normal text-slate-400">({train.name})</span>
                </h3>
                <div className="text-xs font-mono text-cyan-400 uppercase">
                  {train.type} · Priority Level {train.priority}
                </div>
              </div>
            </div>

            {/* Grid Telemetry */}
            <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-500 text-[10px]">CURRENT SPEED</div>
                <div className="text-base font-bold text-white">{Math.round(train.speedKmh)} km/h</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-500 text-[10px]">PACING TARGET</div>
                <div className="text-base font-bold text-emerald-400">
                  {train.targetPacingSpeedKmh} km/h (Glide)
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-500 text-[10px]">SCHEDULED ARRIVAL</div>
                <div className="text-sm font-semibold text-slate-300">{train.scheduledArrival}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-500 text-[10px]">OPTIMIZED PACED ETA</div>
                <div className="text-sm font-bold text-cyan-300">
                  {train.estimatedArrival} (+{train.targetPacingDelayMin}m)
                </div>
              </div>
            </div>

            {/* Payload & Route */}
            <div className="space-y-2 text-xs border-y border-slate-800 py-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Payload Load:</span>
                <span className="font-mono text-slate-200">{train.tonnageOrPassengers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Pacing Strategy:</span>
                <span className="font-mono text-emerald-400 font-semibold">
                  {train.targetPacingDelayMin > 0 ? `Dynamic Speed Pacing (+${train.targetPacingDelayMin} min buffer)` : 'Direct Standard'}
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenOptimizer(train.id);
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2"
              >
                <span>Open Arrival Delay Optimizer</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {segment && !train && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">{segment.name}</h3>
              <div className="text-xs font-mono text-cyan-400">
                Segment ID: {segment.id} · {segment.distanceKm} km
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-500 text-[10px]">TRACK SATURATION</div>
                <div className={`text-base font-bold ${
                  segment.saturationPercent >= 80 ? 'text-rose-400' :
                  segment.saturationPercent >= 50 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {segment.saturationPercent}%
                </div>
              </div>

              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-500 text-[10px]">SIGNAL ASPECT</div>
                <div className="text-sm font-bold text-slate-200 uppercase">
                  {segment.signalAspect.replace('_', ' ')}
                </div>
              </div>

              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-500 text-[10px]">SPEED LIMIT</div>
                <div className="text-sm font-bold text-slate-200">{segment.currentSpeedLimitKmh} km/h</div>
              </div>

              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-500 text-[10px]">CAPACITY</div>
                <div className="text-sm font-bold text-slate-200">{segment.activeTrainIds.length} / {segment.capacityTrains} Trains</div>
              </div>
            </div>

            <div className="text-xs text-slate-300 bg-slate-900 p-3 rounded border border-slate-800">
              {segment.hasSidingLoop ? (
                <span className="text-emerald-400 font-medium">
                  Dynamic siding loop available ({segment.sidingName}). Trains can be routed here to absorb arrival delays.
                </span>
              ) : (
                <span className="text-slate-400">
                  Continuous mainline corridor without intermediate siding loops. Dynamic speed pacing recommended.
                </span>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
