import React, { useState, useEffect } from 'react';
import { 
  Station, 
  TrackSegment, 
  Train, 
  CongestionIncident, 
  RouteCorridor 
} from './types/railway';
import { 
  INDIAN_STATIONS, 
  INDIAN_TRACK_SEGMENTS, 
  INDIAN_TRAINS, 
  INDIAN_CORRIDORS, 
  INDIAN_INCIDENTS 
} from './data/railwayData';
import { TopNav } from './components/TopNav';
import { NetworkMap } from './components/NetworkMap';
import { ArrivalDelayOptimizer } from './components/ArrivalDelayOptimizer';
import { LiveTrafficRoutes } from './components/LiveTrafficRoutes';
import { PredictiveAnalytics } from './components/PredictiveAnalytics';
import { IncidentSandbox } from './components/IncidentSandbox';
import { InspectorModal } from './components/InspectorModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'map' | 'optimizer' | 'routes' | 'analytics' | 'incidents'>('map');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [dynamicPacingActive, setDynamicPacingActive] = useState<boolean>(true);

  // Indian Railways Delhi Hub entities state
  const [stations] = useState<Station[]>(INDIAN_STATIONS);
  const [trackSegments, setTrackSegments] = useState<TrackSegment[]>(INDIAN_TRACK_SEGMENTS);
  const [trains, setTrains] = useState<Train[]>(INDIAN_TRAINS);
  const [corridors] = useState<RouteCorridor[]>(INDIAN_CORRIDORS);
  const [incidents, setIncidents] = useState<CongestionIncident[]>(INDIAN_INCIDENTS);

  // Active train selection (default: Vande Bharat 22436)
  const [selectedTrainId, setSelectedTrainId] = useState<string>('tr-22436');
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [highlightedPathSegments, setHighlightedPathSegments] = useState<string[]>([
    'seg-gzb-sbb-up',
    'seg-sbb-ymb-up',
    'seg-ymb-tkj-up',
    'seg-tkj-ndls-up'
  ]);

  // Modal inspection
  const [inspectingTrain, setInspectingTrain] = useState<Train | null>(null);
  const [inspectingSegment, setInspectingSegment] = useState<TrackSegment | null>(null);

  // Cumulative performance telemetry
  const [preventedBottlenecksCount, setPreventedBottlenecksCount] = useState<number>(18);

  // Smooth, glitch-free simulation step loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setTrains((prevTrains) => {
        return prevTrains.map((train) => {
          let currentSpeed = train.speedKmh;
          if (dynamicPacingActive) {
            // Smoothly target optimal cruise pacing speed
            const target = train.targetPacingSpeedKmh;
            currentSpeed = currentSpeed * 0.96 + target * 0.04;
          } else {
            // Unpaced rush: accelerate to maximum, but if approaching Yamuna Bridge or NDLS throat, brake hard!
            if (train.currentSegmentId === 'seg-ymb-tkj-up' || train.currentSegmentId === 'seg-tkj-ndls-up') {
              currentSpeed = Math.max(0, currentSpeed * 0.9 - 4);
            } else {
              currentSpeed = Math.min(130, currentSpeed * 1.04 + 2);
            }
          }

          // Smooth progress calculation (zero jumps, zero glitches)
          const progressDelta = (currentSpeed / 100) * 0.0035 * simSpeed;
          let nextProgress = train.segmentProgress + progressDelta;

          // Route advancement logic
          let nextSegmentId = train.currentSegmentId;
          if (nextProgress >= 1.0) {
            nextProgress = 0.0;

            if (train.currentSegmentId === 'seg-gzb-sbb-up') {
              nextSegmentId = train.assignedRouteId === 'rt-vb-anvt-divert' ? 'seg-sbb-anvt' :
                             train.assignedRouteId === 'rt-vb-siding-hold' ? 'seg-sbb-loop' : 'seg-sbb-ymb-up';
            } else if (train.currentSegmentId === 'seg-sbb-ymb-up') {
              nextSegmentId = 'seg-ymb-tkj-up';
            } else if (train.currentSegmentId === 'seg-sbb-loop') {
              nextSegmentId = 'seg-ymb-tkj-up';
            } else if (train.currentSegmentId === 'seg-sbb-anvt') {
              nextSegmentId = 'seg-anvt-tkj';
            } else if (train.currentSegmentId === 'seg-anvt-tkj') {
              nextSegmentId = 'seg-tkj-ndls-up';
            } else if (train.currentSegmentId === 'seg-ymb-tkj-up') {
              nextSegmentId = train.destinationStationId === 'st-nzm' ? 'seg-tkj-nzm' : 'seg-tkj-ndls-up';
            } else if (train.currentSegmentId === 'seg-tkj-ndls-up') {
              // Reached New Delhi Railway Station platform berth!
              nextSegmentId = 'seg-gzb-sbb-up';
              setPreventedBottlenecksCount((prev) => prev + 1);
            } else if (train.currentSegmentId === 'seg-tkj-nzm') {
              // Reached Hazrat Nizamuddin
              nextSegmentId = 'seg-nzm-goods';
            } else if (train.currentSegmentId === 'seg-nzm-goods') {
              nextSegmentId = 'seg-gzb-sbb-up';
            }
          }

          return {
            ...train,
            speedKmh: currentSpeed,
            segmentProgress: nextProgress,
            currentSegmentId: nextSegmentId
          };
        });
      });

      // Smoothly update track saturation
      setTrackSegments((prevSegments) => {
        return prevSegments.map((seg) => {
          let baseSat = seg.saturationPercent;
          if (dynamicPacingActive) {
            if (seg.id === 'seg-ymb-tkj-up') baseSat = Math.max(45, baseSat * 0.985);
            if (seg.id === 'seg-tkj-ndls-up') baseSat = Math.max(50, baseSat * 0.985);
          } else {
            if (seg.id === 'seg-ymb-tkj-up') baseSat = Math.min(98, baseSat * 1.015);
            if (seg.id === 'seg-tkj-ndls-up') baseSat = Math.min(99, baseSat * 1.015);
          }

          const level = baseSat >= 85 ? 'critical' : baseSat >= 65 ? 'heavy' : baseSat >= 40 ? 'moderate' : 'nominal';
          const signal = baseSat >= 90 ? 'red' : baseSat >= 75 ? 'double_yellow' : baseSat >= 50 ? 'yellow' : 'green';

          return {
            ...seg,
            saturationPercent: Math.round(baseSat),
            congestionLevel: level,
            signalAspect: signal
          };
        });
      });

    }, 120);

    return () => clearInterval(interval);
  }, [isSimulating, simSpeed, dynamicPacingActive]);

  const handleSelectTrain = (trainId: string) => {
    setSelectedTrainId(trainId);
    const train = trains.find((t) => t.id === trainId);
    if (train) {
      const activeOption = train.routeOptions.find((r) => r.id === train.assignedRouteId) || train.routeOptions[0];
      if (activeOption) {
        setHighlightedPathSegments(activeOption.pathSegmentIds);
      }
    }
  };

  const handleSelectSegment = (segmentId: string) => {
    setSelectedSegmentId(segmentId);
    const seg = trackSegments.find((s) => s.id === segmentId);
    if (seg) {
      setInspectingSegment(seg);
      setInspectingTrain(null);
    }
  };

  const handleApplyRoute = (trainId: string, routeId: string) => {
    setTrains((prev) =>
      prev.map((t) => {
        if (t.id === trainId) {
          const selectedOption = t.routeOptions.find((r) => r.id === routeId);
          return {
            ...t,
            assignedRouteId: routeId,
            targetPacingDelayMin: selectedOption ? selectedOption.deliberateDelayMin : t.targetPacingDelayMin,
            status: selectedOption?.strategy === 'siding_hold' ? 'holding_siding' : 
                    selectedOption?.strategy === 'relief_bypass' ? 'diverted' : 'pacing'
          };
        }
        return t;
      })
    );
    setPreventedBottlenecksCount((prev) => prev + 2);
  };

  const handleToggleIncident = (incidentId: string) => {
    setIncidents((prev) =>
      prev.map((i) => (i.id === incidentId ? { ...i, active: !i.active } : i))
    );
  };

  const handleApplyMassPacing = () => {
    setDynamicPacingActive(true);
    setTrains((prev) =>
      prev.map((t) => {
        const best = t.routeOptions.find((r) => r.recommended) || t.routeOptions[0];
        return {
          ...t,
          status: 'pacing',
          targetPacingDelayMin: best ? best.deliberateDelayMin : 14,
          speedKmh: t.targetPacingSpeedKmh
        };
      })
    );
    setPreventedBottlenecksCount((prev) => prev + 6);
  };

  const handleResetSimulation = () => {
    setTrains(INDIAN_TRAINS);
    setTrackSegments(INDIAN_TRACK_SEGMENTS);
    setIncidents(INDIAN_INCIDENTS);
    setDynamicPacingActive(true);
  };

  const activeIncidentsCount = incidents.filter((i) => i.active).length;

  return (
    <div className="min-h-screen bg-[#05080e] text-slate-100 flex flex-col font-sans">
      
      {/* 3-Zone Clean Top Navigation */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSimulating={isSimulating}
        setIsSimulating={setIsSimulating}
        simSpeed={simSpeed}
        setSimSpeed={setSimSpeed}
        dynamicPacingActive={dynamicPacingActive}
        setDynamicPacingActive={setDynamicPacingActive}
        preventedBottlenecksCount={preventedBottlenecksCount}
        activeIncidentsCount={activeIncidentsCount}
        onResetSimulation={handleResetSimulation}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 w-full max-w-[1560px] mx-auto px-4 lg:px-6 py-5 space-y-6">
        
        {/* TAB 1: Network Heatmap (NDLS & Ghaziabad Corridor) */}
        {activeTab === 'map' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Quick Context Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#080d1a] border border-slate-800 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                <span className="text-xs text-slate-300 font-medium">
                  {dynamicPacingActive 
                    ? 'Kavach Arrival Pacing ENGAGED: Inbound rakes cruise at 62 km/h to prevent stopping on Yamuna River Bridge.' 
                    : 'Kavach Arrival Pacing OFF: Warning, rakes will bunch up at Yamuna Bridge and block NDLS Platform entries.'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('optimizer')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow"
                >
                  Configure Arrival Delay Routes →
                </button>
              </div>
            </div>

            {/* Network Map Visualizer */}
            <NetworkMap
              stations={stations}
              trackSegments={trackSegments}
              trains={trains}
              incidents={incidents}
              selectedTrainId={selectedTrainId}
              onSelectTrain={(id) => {
                handleSelectTrain(id);
                const t = trains.find((train) => train.id === id);
                if (t) setInspectingTrain(t);
              }}
              selectedSegmentId={selectedSegmentId}
              onSelectSegment={handleSelectSegment}
              highlightedPathSegments={highlightedPathSegments}
              dynamicPacingActive={dynamicPacingActive}
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-800 bg-[#080d16] space-y-1">
                <div className="text-[11px] font-mono text-cyan-400 uppercase">NDLS Chokepoint Solution</div>
                <div className="text-sm font-bold text-white">Yamuna Bridge Halt Aversion</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Instead of rushing at 110 km/h and waiting dead on the river bridge for 30 min, arrival delay pacing glides trains into NDLS right as platforms clear.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-[#080d16] space-y-1">
                <div className="text-[11px] font-mono text-emerald-400 uppercase">Sahibabad Goods Loop</div>
                <div className="text-sm font-bold text-white">Dynamic Freight Siding Absorption</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Heavy BOXN freight rakes hold in Sahibabad Siding Loop 2 for 18 min buffer, freeing up the mainline for Vande Bharat and Swarna Shatabdi.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-[#080d16] space-y-1">
                <div className="text-[11px] font-mono text-purple-400 uppercase">Anand Vihar Relief Flyover</div>
                <div className="text-sm font-bold text-white">Circumferential Flyover Chord</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Diverts trains via Anand Vihar Terminal (+20m travel time), completely clearing the congested Yamuna River Bed interlocking.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Arrival Delay Optimizer */}
        {activeTab === 'optimizer' && (
          <div className="animate-fade-in">
            <ArrivalDelayOptimizer
              trains={trains}
              stations={stations}
              trackSegments={trackSegments}
              selectedTrainId={selectedTrainId}
              onSelectTrain={handleSelectTrain}
              onApplyRoute={handleApplyRoute}
              onHighlightRoute={setHighlightedPathSegments}
            />
          </div>
        )}

        {/* TAB 3: Live Traffic Routes */}
        {activeTab === 'routes' && (
          <div className="animate-fade-in">
            <LiveTrafficRoutes
              corridors={corridors}
              trackSegments={trackSegments}
              trains={trains}
              onHighlightRoute={(segIds) => {
                setHighlightedPathSegments(segIds);
                setActiveTab('map');
              }}
              onSelectTrain={handleSelectTrain}
              onSwitchToOptimizer={(trainId) => {
                handleSelectTrain(trainId);
                setActiveTab('optimizer');
              }}
            />
          </div>
        )}

        {/* TAB 4: Predictive Analytics */}
        {activeTab === 'analytics' && (
          <div className="animate-fade-in">
            <PredictiveAnalytics
              trains={trains}
              trackSegments={trackSegments}
              dynamicPacingActive={dynamicPacingActive}
              onTogglePacing={setDynamicPacingActive}
            />
          </div>
        )}

        {/* TAB 5: Incident Sandbox */}
        {activeTab === 'incidents' && (
          <div className="animate-fade-in">
            <IncidentSandbox
              incidents={incidents}
              onToggleIncident={handleToggleIncident}
              trains={trains}
              onApplyMassPacing={handleApplyMassPacing}
              onResetIncidents={handleResetSimulation}
              dynamicPacingActive={dynamicPacingActive}
              onTogglePacing={setDynamicPacingActive}
            />
          </div>
        )}

      </main>

      {/* Interactive Inspector Modal */}
      {(inspectingTrain || inspectingSegment) && (
        <InspectorModal
          train={inspectingTrain}
          segment={inspectingSegment}
          stations={stations}
          onClose={() => {
            setInspectingTrain(null);
            setInspectingSegment(null);
          }}
          onOpenOptimizer={(trainId) => {
            handleSelectTrain(trainId);
            setActiveTab('optimizer');
          }}
        />
      )}

      {/* Clean Footer */}
      <footer className="w-full border-t border-slate-900 bg-[#05080e] py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-[1560px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>RailPace · Indian Railways Northern Division (NDLS - GZB Interlocking)</span>
          <span>Mission Raftaar & Kavach Headway Pacing Compatible</span>
        </div>
      </footer>

    </div>
  );
}
