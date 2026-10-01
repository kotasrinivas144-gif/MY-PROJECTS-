import React, { useState } from 'react';
import { RouteCorridor, TrackSegment, Train } from '../types/railway';
import { 
  GitFork, 
  Gauge, 
  TrainTrack, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Activity,
  Layers
} from 'lucide-react';

interface LiveTrafficRoutesProps {
  corridors: RouteCorridor[];
  trackSegments: TrackSegment[];
  trains: Train[];
  onHighlightRoute: (segmentIds: string[]) => void;
  onSelectTrain: (trainId: string) => void;
  onSwitchToOptimizer: (trainId: string) => void;
}

export const LiveTrafficRoutes: React.FC<LiveTrafficRoutesProps> = ({
  corridors,
  trackSegments,
  trains,
  onHighlightRoute,
  onSelectTrain,
  onSwitchToOptimizer
}) => {
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>(corridors[0].id);

  const selectedCorridor = corridors.find((c) => c.id === selectedCorridorId) || corridors[0];

  const handleCorridorClick = (corridor: RouteCorridor) => {
    setSelectedCorridorId(corridor.id);
    onHighlightRoute(corridor.trackSegmentIds);
  };

  const corridorSegments = trackSegments.filter((seg) =>
    selectedCorridor.trackSegmentIds.includes(seg.id)
  );

  const activeTrainsOnCorridor = trains.filter((t) =>
    selectedCorridor.trackSegmentIds.includes(t.currentSegmentId)
  );

  return (
    <div className="space-y-6">
      
      {/* Header Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <GitFork className="h-5 w-5 text-cyan-400" />
            Live Traffic Corridors & Dynamic Track Allocation
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-corridor telemetry. Monitor train density, track saturation heat levels, and divert trains to slower bypasses to delay arrivals.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          <span>4 Active Corridors Synced</span>
        </div>
      </div>

      {/* Corridors Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {corridors.map((corr) => {
          const isSelected = corr.id === selectedCorridorId;
          const isHeavy = corr.densityScore >= 75;
          const isModerate = corr.densityScore >= 45 && corr.densityScore < 75;

          return (
            <div
              key={corr.id}
              onClick={() => handleCorridorClick(corr)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-cyan-400 bg-[#0d1627] shadow-[0_0_15px_rgba(6,182,212,0.2)] ring-1 ring-cyan-400/60'
                  : 'border-slate-800 bg-[#080d16] hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span 
                  className="font-mono text-xs font-bold px-2 py-0.5 rounded border"
                  style={{ 
                    borderColor: `${corr.color}50`, 
                    backgroundColor: `${corr.color}15`,
                    color: corr.color 
                  }}
                >
                  {corr.code}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${
                    isHeavy ? 'bg-rose-500 animate-ping' :
                    isModerate ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}></span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    {corr.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-white mb-1">
                {corr.name}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                {corr.description}
              </p>

              {/* Density Bar */}
              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Track Density:</span>
                  <span className={`font-bold ${isHeavy ? 'text-rose-400' : isModerate ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {corr.densityScore}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${corr.densityScore}%`,
                      backgroundColor: isHeavy ? '#f43f5e' : isModerate ? '#f59e0b' : '#10b981'
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                <span>{corr.lengthKm} km</span>
                <span className="text-slate-300 font-bold">{corr.activeTrainsCount} Trains</span>
                <span>Avg: {corr.currentAverageSpeed} km/h</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Corridor Deep Dive & Segment-by-Segment Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Corridor Key Bottleneck & Overview */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-[#090d16] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono uppercase text-slate-400">Corridor Performance</span>
              <span className="font-mono text-xs font-bold" style={{ color: selectedCorridor.color }}>
                {selectedCorridor.code}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs text-slate-400 mb-1">Key Bottleneck Warning Point:</div>
                <div className="text-xs font-mono font-medium text-rose-300 bg-rose-950/30 p-2 rounded border border-rose-500/30">
                  {selectedCorridor.keyBottleneckPoint}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">TOTAL SPAN</div>
                  <div className="text-slate-200 font-bold text-sm">{selectedCorridor.lengthKm} km</div>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">AVG SPEED</div>
                  <div className="text-emerald-400 font-bold text-sm">{selectedCorridor.currentAverageSpeed} km/h</div>
                </div>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded border border-slate-800">
                <span className="text-cyan-400 font-semibold">Dynamic Pacing Benefit: </span>
                Slowing train entries onto this corridor delays arrivals by an average of +12 minutes, preventing 88% of signal aspect red stops.
              </div>
            </div>
          </div>

          {/* Active Trains on this Corridor */}
          <div className="rounded-xl border border-slate-800 bg-[#090d16] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono uppercase text-slate-400">Active Trains in Transit</span>
              <span className="font-mono text-xs text-cyan-400">{activeTrainsOnCorridor.length} Present</span>
            </div>

            {activeTrainsOnCorridor.length === 0 ? (
              <div className="text-xs text-slate-500 py-3 text-center">
                No trains currently occupying this corridor.
              </div>
            ) : (
              <div className="space-y-2">
                {activeTrainsOnCorridor.map((t) => (
                  <div 
                    key={t.id}
                    className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors"
                  >
                    <div>
                      <div className="font-mono text-xs font-bold text-white">{t.callsign}</div>
                      <div className="text-[11px] text-slate-400">{t.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-cyan-300">{Math.round(t.speedKmh)} km/h</div>
                        <div className="text-[10px] font-mono text-emerald-400">
                          {t.targetPacingDelayMin > 0 ? `+${t.targetPacingDelayMin}m Pace` : 'Direct'}
                        </div>
                      </div>
                      <button
                        onClick={() => onSwitchToOptimizer(t.id)}
                        className="p-1 rounded bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors"
                        title="Optimize Arrival Delay for this train"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Segment-by-Segment Track Block Table */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-[#090d16] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">
                Track Block Telemetry & Signal Aspects ({corridorSegments.length} Segments)
              </h3>
              <p className="text-xs text-slate-400">
                Real-time block occupancy, speed limits, and signal states.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Live Interlocking Feed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="pb-2.5 font-medium">Segment Name</th>
                  <th className="pb-2.5 font-medium">Span</th>
                  <th className="pb-2.5 font-medium">Speed (Max/Paced)</th>
                  <th className="pb-2.5 font-medium">Saturation</th>
                  <th className="pb-2.5 font-medium">Signal Aspect</th>
                  <th className="pb-2.5 font-medium">Siding Loop</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {corridorSegments.map((seg) => {
                  const isHighSat = seg.saturationPercent >= 80;
                  const isMedSat = seg.saturationPercent >= 50 && seg.saturationPercent < 80;

                  return (
                    <tr key={seg.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 font-semibold text-slate-200">
                        {seg.name}
                        {seg.isBypassRoute && (
                          <span className="ml-1.5 text-[9px] px-1 rounded bg-purple-950 text-purple-300 border border-purple-800">
                            BYPASS
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-slate-400">
                        {seg.distanceKm} km
                      </td>
                      <td className="py-3">
                        <span className="text-slate-300 font-bold">{seg.currentSpeedLimitKmh}</span>
                        <span className="text-slate-500"> / {seg.maxSpeedKmh} km/h</span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${seg.saturationPercent}%`,
                                backgroundColor: isHighSat ? '#f43f5e' : isMedSat ? '#f59e0b' : '#10b981'
                              }}
                            ></div>
                          </div>
                          <span className={isHighSat ? 'text-rose-400 font-bold' : isMedSat ? 'text-amber-400' : 'text-emerald-400'}>
                            {seg.saturationPercent}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                          seg.signalAspect === 'green' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                          seg.signalAspect === 'yellow' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          seg.signalAspect === 'double_yellow' ? 'bg-yellow-950 text-yellow-300 border border-yellow-800' :
                          'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            seg.signalAspect === 'green' ? 'bg-emerald-400' :
                            seg.signalAspect === 'yellow' ? 'bg-amber-400' :
                            seg.signalAspect === 'double_yellow' ? 'bg-yellow-400' :
                            'bg-rose-400'
                          }`}></span>
                          {seg.signalAspect.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400">
                        {seg.hasSidingLoop ? (
                          <span className="text-emerald-400 font-medium">
                            {seg.sidingName || 'Available'}
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
