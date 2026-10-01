import React, { useState, useRef } from 'react';
import { 
  Station, 
  TrackSegment, 
  Train, 
  CongestionIncident
} from '../types/railway';
import { getCoordinatesOnSegment } from '../data/railwayData';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Layers, 
  Info,
  Clock,
  Compass,
  TrainTrack,
  Shield,
  Activity
} from 'lucide-react';

interface NetworkMapProps {
  stations: Station[];
  trackSegments: TrackSegment[];
  trains: Train[];
  incidents: CongestionIncident[];
  selectedTrainId: string | null;
  onSelectTrain: (trainId: string) => void;
  selectedSegmentId: string | null;
  onSelectSegment: (segmentId: string) => void;
  highlightedPathSegments: string[];
  dynamicPacingActive: boolean;
}

export const NetworkMap: React.FC<NetworkMapProps> = ({
  stations,
  trackSegments,
  trains,
  incidents,
  selectedTrainId,
  onSelectTrain,
  selectedSegmentId,
  onSelectSegment,
  highlightedPathSegments,
  dynamicPacingActive
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Clean layer toggles
  const [heatmapMode, setHeatmapMode] = useState<'congestion' | 'speed' | 'signals'>('congestion');
  const [showPlatformBerths, setShowPlatformBerths] = useState<boolean>(true);
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(2.0, Math.max(0.75, prev + delta)));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getSegmentColor = (segment: TrackSegment) => {
    if (highlightedPathSegments.includes(segment.id)) {
      return '#00f0ff'; // Electric Cyan for active delay route
    }

    if (heatmapMode === 'speed') {
      if (segment.currentSpeedLimitKmh <= 45) return '#f43f5e';
      if (segment.currentSpeedLimitKmh <= 75) return '#f59e0b';
      return '#10b981';
    }

    if (heatmapMode === 'signals') {
      if (segment.signalAspect === 'red') return '#f43f5e';
      if (segment.signalAspect === 'double_yellow') return '#eab308';
      if (segment.signalAspect === 'yellow') return '#f59e0b';
      return '#10b981';
    }

    // Default: Congestion Saturation Heatmap
    if (segment.saturationPercent >= 85) return '#f43f5e'; // Critical choke
    if (segment.saturationPercent >= 65) return '#f59e0b'; // Heavy
    if (segment.saturationPercent >= 40) return '#10b981'; // Moderate
    return '#06b6d4'; // Nominal free flow
  };

  const selectedTrain = trains.find((t) => t.id === selectedTrainId);

  // Platforms layout at New Delhi Railway Station (16 distinct berths)
  const ndlsPlatforms = [
    { num: 'PF 1', occupied: true, train: 'VB-22436 (Pacing Entry)', type: 'VIP Express Bay' },
    { num: 'PF 2', occupied: true, train: 'SHT-12004 Swarna Shatabdi', type: 'Executive' },
    { num: 'PF 3', occupied: true, train: '12423 Dibrugarh Rajdhani', type: 'Superfast' },
    { num: 'PF 4', occupied: true, train: '12952 Mumbai Tejas Rajdhani', type: 'Superfast' },
    { num: 'PF 5', occupied: false, train: 'Vacant (Cleaning)', type: 'Through Bay' },
    { num: 'PF 6', occupied: true, train: '12012 Kalka Shatabdi', type: 'Intercity' },
    { num: 'PF 7', occupied: true, train: '12414 Jammu Pooja Express', type: 'Mail' },
    { num: 'PF 8', occupied: true, train: '12417 Prayagraj Express', type: 'Superfast' },
    { num: 'PF 9', occupied: false, train: 'Vacant (Scheduled 14:45)', type: 'Through Bay' },
    { num: 'PF 10', occupied: true, train: '14006 Lichchavi Express', type: 'Express' },
    { num: 'PF 11', occupied: true, train: 'EMU-64402 Ghaziabad Local', type: 'Suburban' },
    { num: 'PF 12', occupied: true, train: 'EMU-64410 Palwal Commuter', type: 'Suburban' },
    { num: 'PF 13', occupied: true, train: '12398 Mahabodhi Express', type: 'Superfast' },
    { num: 'PF 14', occupied: true, train: '12420 Gomti Express', type: 'Intercity' },
    { num: 'PF 15', occupied: true, train: '12560 Shiv Ganga Express', type: 'Superfast' },
    { num: 'PF 16', occupied: true, train: '12452 Shram Shakti Express', type: 'Ajmeri Gate Bay' }
  ];

  return (
    <div className="relative w-full h-full min-h-[620px] lg:min-h-[700px] bg-[#05080e] border border-slate-800 rounded-xl overflow-hidden flex flex-col select-none">
      
      {/* Top Map HUD Overlay */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left Status Indicator */}
        <div className="flex items-center gap-2.5 pointer-events-auto bg-[#0a0f1d]/90 border border-slate-800 backdrop-blur-md px-3.5 py-1.5 rounded-lg text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span className="text-white font-bold tracking-tight">NDLS – Ghaziabad Corridor</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-mono text-[11px]">
            Northern Railway · Delhi Division Interlocking
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-cyan-400 font-mono text-[11px] hidden sm:inline">
            Kavach Headway Pacing Active
          </span>
        </div>

        {/* Right Layer Mode Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-[#0a0f1d]/90 border border-slate-800 backdrop-blur-md p-1 rounded-lg">
          
          <button
            onClick={() => setHeatmapMode('congestion')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors flex items-center gap-1.5 ${
              heatmapMode === 'congestion'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Display Track Congestion Heatmap"
          >
            <Layers className="h-3 w-3" />
            <span>Congestion Heatmap</span>
          </button>

          <button
            onClick={() => setHeatmapMode('speed')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors flex items-center gap-1.5 ${
              heatmapMode === 'speed'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Display Paced Speed Limits"
          >
            <Activity className="h-3 w-3" />
            <span>Paced Speeds</span>
          </button>

          <button
            onClick={() => setHeatmapMode('signals')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors flex items-center gap-1.5 ${
              heatmapMode === 'signals'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Display Block Signal Aspects"
          >
            <Compass className="h-3 w-3" />
            <span>Signals</span>
          </button>

          <button
            onClick={() => setShowPlatformBerths(!showPlatformBerths)}
            className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
              showPlatformBerths ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle NDLS Platform Berths Details"
          >
            <span>NDLS PF 1-16</span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1"></div>

          <button
            onClick={() => handleZoom(0.15)}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleZoom(-0.15)}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleResetView}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Reset Pan & Zoom"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Centralized Traffic Control (CTC) Visualizer */}
      <div 
        ref={containerRef}
        className="w-full flex-1 cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          viewBox="0 0 1020 620"
          className="w-full h-full transition-transform duration-75"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '510px 310px'
          }}
        >
          <defs>
            {/* Dark Rail Interlocking Blueprint Grid */}
            <pattern id="ctc-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0e1726" strokeWidth="0.8" />
            </pattern>

            {/* Neon Glow Filters */}
            <filter id="neon-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="neon-rose" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="4.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* River Yamuna Water Texture Fill */}
            <pattern id="yamuna-water" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 0 10 Q 5 5 10 10 T 20 10" fill="none" stroke="#0b2238" strokeWidth="1.2" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect width="1020" height="620" fill="url(#ctc-grid)" />

          {/* Yamuna River Visual Zone (Between SBB and TKJ: x ~ 480 to 560) */}
          <g opacity="0.85">
            <rect x="490" y="50" width="60" height="520" rx="8" fill="#081423" />
            <rect x="490" y="50" width="60" height="520" fill="url(#yamuna-water)" />
            <text
              x="520"
              y="100"
              textAnchor="middle"
              fill="#1e40af"
              className="font-mono text-[10px] font-bold tracking-widest uppercase rotate-90"
            >
              YAMUNA RIVER BED
            </text>
            {/* Bridge Truss Bars */}
            <g stroke="#1e293b" strokeWidth="1.5">
              <line x1="490" y1="260" x2="550" y2="260" />
              <line x1="490" y1="300" x2="550" y2="300" />
              <line x1="490" y1="260" x2="550" y2="300" />
              <line x1="490" y1="300" x2="550" y2="260" />
            </g>
          </g>

          {/* Corridor Track Labels along the Top */}
          <g opacity="0.3" className="font-mono text-[9px] fill-slate-400">
            <text x="80" y="45">GHAZIABAD YARD (EAST GATEWAY)</text>
            <text x="400" y="45">ANAND VIHAR RELIEF FLYOVER</text>
            <text x="730" y="45">TILAK BRIDGE QUAD-THROAT</text>
            <text x="880" y="45">NEW DELHI TERMINAL CONCOURSE</text>
          </g>

          {/* 1. Track Underlay Sleeper Beds */}
          <g>
            {trackSegments.map((seg) => (
              <path
                key={`sleeper-${seg.id}`}
                d={seg.pathD}
                fill="none"
                stroke="#111c2e"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </g>

          {/* 2. Track Rails with Heatmap Glow (Zero Overlap, Clean Offset) */}
          <g>
            {trackSegments.map((seg) => {
              const strokeColor = getSegmentColor(seg);
              const isSelected = selectedSegmentId === seg.id;
              const isHighlighted = highlightedPathSegments.includes(seg.id);
              const isCritical = seg.saturationPercent >= 85;

              return (
                <g key={`track-${seg.id}`}>
                  {/* Outer Heatmap Aura */}
                  <path
                    d={seg.pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isHighlighted ? 9 : isCritical ? 7 : 4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={isHighlighted ? 0.9 : isCritical ? 0.75 : 0.4}
                    filter={isCritical ? 'url(#neon-rose)' : 'url(#neon-cyan)'}
                    className={isCritical ? 'glow-pulse' : ''}
                  />

                  {/* Core Sharp Vector Rail */}
                  <path
                    d={seg.pathD}
                    fill="none"
                    stroke={isHighlighted ? '#ffffff' : strokeColor}
                    strokeWidth={isHighlighted ? 3.5 : isSelected ? 3.5 : 2.4}
                    strokeDasharray={
                      isHighlighted ? '7 4' : 
                      seg.trackType === 'siding_loop' ? '5 3' : 
                      seg.isBypassRoute ? '8 3' : 'none'
                    }
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="cursor-pointer transition-all duration-150 hover:stroke-cyan-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSegment(seg.id);
                    }}
                    onMouseEnter={() => setHoveredEntity(`Section: ${seg.name} (${seg.code}) - ${seg.saturationPercent}% Saturation`)}
                    onMouseLeave={() => setHoveredEntity(null)}
                  />

                  {/* Track Block Tag (carefully positioned so it never overlaps stations) */}
                  <g transform={`translate(${
                    seg.id === 'seg-gzb-sbb-up' ? 180 :
                    seg.id === 'seg-sbb-ymb-up' ? 380 :
                    seg.id === 'seg-ymb-tkj-up' ? 620 :
                    seg.id === 'seg-tkj-ndls-up' ? 810 :
                    seg.id === 'seg-sbb-loop' ? 390 :
                    seg.id === 'seg-sbb-anvt' ? 350 :
                    seg.id === 'seg-anvt-tkj' ? 570 :
                    seg.id === 'seg-tkj-nzm' ? 660 : 180
                  }, ${
                    seg.id === 'seg-sbb-loop' ? 370 :
                    seg.id === 'seg-sbb-anvt' ? 145 :
                    seg.id === 'seg-anvt-tkj' ? 195 :
                    seg.id === 'seg-tkj-nzm' ? 440 :
                    seg.trackType === 'down_main' ? 355 : 265
                  })`}>
                    <rect
                      x="-22"
                      y="-7"
                      width="44"
                      height="14"
                      rx="3"
                      fill="#060b14"
                      stroke={strokeColor}
                      strokeWidth="0.8"
                      opacity="0.9"
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fill={strokeColor}
                      className="font-mono text-[8px] font-bold"
                    >
                      {seg.saturationPercent}% SAT
                    </text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* 3. Block Signal Aspects (Clean vertical posts, no collision) */}
          <g>
            {trackSegments.map((seg) => {
              // Placed at 50% along segment
              const coords = getCoordinatesOnSegment(seg, stations, 0.48);
              const aspectColor = 
                seg.signalAspect === 'green' ? '#10b981' :
                seg.signalAspect === 'yellow' ? '#f59e0b' :
                seg.signalAspect === 'double_yellow' ? '#eab308' : '#f43f5e';

              return (
                <g key={`sig-${seg.id}`} transform={`translate(${coords.x}, ${coords.y - 12})`}>
                  <circle cx="0" cy="0" r="3.2" fill={aspectColor} stroke="#05080e" strokeWidth="1" />
                  <line x1="0" y1="3.2" x2="0" y2="10" stroke="#475569" strokeWidth="1" />
                </g>
              );
            })}
          </g>

          {/* 4. Active Congestion Hazard Incidents */}
          <g>
            {incidents.filter((i) => i.active).map((inc) => {
              const seg = trackSegments.find((s) => s.id === inc.segmentId);
              if (!seg) return null;
              const coords = getCoordinatesOnSegment(seg, stations, 0.75);

              return (
                <g key={`inc-${inc.id}`} transform={`translate(${coords.x}, ${coords.y})`} className="cursor-pointer animate-bounce">
                  <circle cx="0" cy="0" r="10" fill="#f43f5e" opacity="0.3" className="animate-ping" />
                  <circle cx="0" cy="0" r="6" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
                  <text
                    x="10"
                    y="3"
                    fill="#fca5a5"
                    className="font-mono text-[8.5px] font-bold select-none drop-shadow"
                  >
                    ! {inc.title}
                  </text>
                </g>
              );
            })}
          </g>

          {/* 5. Stations Interlocking Markers (Positioned without label collision) */}
          <g>
            {stations.map((st) => {
              const isNDLS = st.id === 'st-ndls';
              const isOccupiedHeavy = st.platformsOccupied / st.platformsTotal >= 0.75;
              const labelAbove = st.y > 350;

              return (
                <g 
                  key={`st-${st.id}`} 
                  transform={`translate(${st.x}, ${st.y})`}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredEntity(`Station: ${st.name} (${st.code}) - ${st.platformsOccupied}/${st.platformsTotal} Platforms Busy`)}
                  onMouseLeave={() => setHoveredEntity(null)}
                >
                  {/* Terminal Saturation Halo */}
                  {isOccupiedHeavy && (
                    <circle
                      cx="0"
                      cy="0"
                      r={isNDLS ? 24 : 16}
                      fill="#f43f5e"
                      opacity="0.18"
                      className="animate-pulse"
                    />
                  )}

                  {/* Outer Node Ring */}
                  <circle
                    cx="0"
                    cy="0"
                    r={isNDLS ? 16 : 10}
                    fill="#0a101d"
                    stroke={isOccupiedHeavy ? '#f43f5e' : isNDLS ? '#00f0ff' : '#64748b'}
                    strokeWidth="2.5"
                  />

                  {/* Inner Core */}
                  <circle
                    cx="0"
                    cy="0"
                    r={isNDLS ? 7 : 4}
                    fill={isOccupiedHeavy ? '#f43f5e' : isNDLS ? '#00f0ff' : '#cbd5e1'}
                  />

                  {/* Station Code Box */}
                  <g transform={`translate(0, ${labelAbove ? 20 : -18})`}>
                    <rect
                      x="-24"
                      y="-8"
                      width="48"
                      height="16"
                      rx="3"
                      fill="#070c16"
                      stroke={isNDLS ? '#00f0ff' : '#334155'}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill="#e2e8f0"
                      className="font-mono text-[9px] font-bold tracking-wider"
                    >
                      {st.code}
                    </text>
                  </g>

                  {/* Station Name + Hindi Subtext */}
                  <g transform={`translate(0, ${labelAbove ? 36 : -30})`}>
                    <text
                      x="0"
                      y="0"
                      textAnchor="middle"
                      fill="#94a3b8"
                      className="text-[10px] font-semibold"
                    >
                      {st.name}
                    </text>
                    {st.hindiName && (
                      <text
                        x="0"
                        y="10"
                        textAnchor="middle"
                        fill="#64748b"
                        className="text-[8.5px]"
                      >
                        {st.hindiName}
                      </text>
                    )}
                  </g>

                  {/* Platform Occupancy Badge */}
                  <g transform={`translate(${isNDLS ? 18 : 12}, 0)`}>
                    <rect
                      x="0"
                      y="-7"
                      width="38"
                      height="14"
                      rx="3"
                      fill="#09101c"
                      stroke={isOccupiedHeavy ? '#f43f5e' : '#334155'}
                      strokeWidth="1"
                    />
                    <text
                      x="19"
                      y="3.5"
                      textAnchor="middle"
                      fill={isOccupiedHeavy ? '#fca5a5' : '#38bdf8'}
                      className="font-mono text-[8.5px] font-bold"
                    >
                      {st.platformsOccupied}/{st.platformsTotal} PF
                    </text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* 6. Active Moving Indian Trains with Zero Overlapping Labels */}
          <g>
            {trains.map((train) => {
              const seg = trackSegments.find((s) => s.id === train.currentSegmentId);
              if (!seg) return null;

              const { x, y, angleDeg } = getCoordinatesOnSegment(seg, stations, train.segmentProgress);
              const isSelected = selectedTrainId === train.id;

              // Color based on Indian train rake
              let rakeColor = '#00f0ff'; // Cyan default
              if (train.type === 'vande_bharat') rakeColor = '#00f0ff'; // Electric Vande Bharat Cyan/White
              if (train.type === 'rajdhani_express') rakeColor = '#ef4444'; // Red LHB Rajdhani
              if (train.type === 'shatabdi') rakeColor = '#3b82f6'; // Shatabdi Blue
              if (train.type === 'suburban_emu') rakeColor = '#10b981'; // Green EMU
              if (train.type === 'freight_boxn') rakeColor = '#f59e0b'; // Amber freight

              // Position label cleanly above or below depending on track type
              const isDownTrack = seg.trackType === 'down_main';
              const labelYOffset = isDownTrack ? 20 : -18;

              return (
                <g
                  key={`train-${train.id}`}
                  transform={`translate(${x}, ${y})`}
                  className="cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTrain(train.id);
                  }}
                  onMouseEnter={() => setHoveredEntity(`Train: ${train.callsign} (${train.name}) - ${Math.round(train.speedKmh)} km/h`)}
                  onMouseLeave={() => setHoveredEntity(null)}
                >
                  {/* Selection Pulsing Aura */}
                  {isSelected && (
                    <circle
                      cx="0"
                      cy="0"
                      r="20"
                      fill="none"
                      stroke="#00f0ff"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                      className="animate-spin origin-center"
                    />
                  )}

                  {/* Train Locomotive & Coaches body (oriented along track) */}
                  <g transform={`rotate(${angleDeg})`}>
                    {/* Shadow */}
                    <rect
                      x="-16"
                      y="-6"
                      width="32"
                      height="12"
                      rx="4"
                      fill="#03060c"
                      opacity="0.9"
                    />
                    {/* Train Locomotive Chassis */}
                    <rect
                      x="-15"
                      y="-5"
                      width="30"
                      height="10"
                      rx="3"
                      fill="#0b1322"
                      stroke={rakeColor}
                      strokeWidth={isSelected ? '2.2' : '1.5'}
                    />
                    {/* Headlight beam */}
                    <polygon
                      points="14,0 11,-3 11,3"
                      fill={rakeColor}
                    />
                    {/* Trailing Coach Link */}
                    <rect
                      x="-26"
                      y="-4"
                      width="9"
                      height="8"
                      rx="2"
                      fill="#070c16"
                      stroke={rakeColor}
                      strokeWidth="1"
                    />
                  </g>

                  {/* Clean Telemetry Tag (Collision-free offset) */}
                  <g transform={`translate(0, ${labelYOffset})`}>
                    <rect
                      x="-36"
                      y="-8"
                      width="72"
                      height="16"
                      rx="3"
                      fill="#070c16"
                      stroke={isSelected ? '#00f0ff' : '#1e293b'}
                      strokeWidth="1"
                      opacity="0.95"
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fill={isSelected ? '#38bdf8' : '#e2e8f0'}
                      className="font-mono text-[8.5px] font-bold"
                    >
                      {train.callsign} · {Math.round(train.speedKmh)}k
                    </text>
                  </g>

                  {/* Pacing buffer indicator */}
                  {train.targetPacingDelayMin > 0 && dynamicPacingActive && (
                    <g transform={`translate(0, ${isDownTrack ? 36 : -34})`}>
                      <rect
                        x="-26"
                        y="-6"
                        width="52"
                        height="12"
                        rx="3"
                        fill="#05281e"
                        stroke="#10b981"
                        strokeWidth="0.8"
                      />
                      <text
                        x="0"
                        y="3.5"
                        textAnchor="middle"
                        fill="#6ee7b7"
                        className="font-mono text-[7.5px] font-bold"
                      >
                        +{train.targetPacingDelayMin}m KAVACH
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* NDLS 16-Platform Yard Berth Matrix Drawer (Optional Overlay for extreme realism) */}
      {showPlatformBerths && (
        <div className="border-t border-slate-800 bg-[#070b14] px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrainTrack className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-bold text-white tracking-wide">
                New Delhi Railway Station (NDLS) · 16 Platform Berths Live Occupancy
              </span>
            </div>
            <span className="text-[11px] font-mono text-rose-400">
              14 / 16 Berths Occupied (87.5% Terminal Saturation)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {ndlsPlatforms.map((pf) => (
              <div
                key={pf.num}
                className={`p-2 rounded border text-left font-mono text-[10px] ${
                  pf.num === 'PF 1' ? 'border-cyan-400 bg-cyan-950/30' :
                  pf.occupied ? 'border-slate-800 bg-slate-900/60' : 'border-emerald-500/40 bg-emerald-950/20'
                }`}
              >
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-bold text-slate-200">{pf.num}</span>
                  <span className={`h-1.5 w-1.5 rounded-full ${pf.occupied ? 'bg-rose-500' : 'bg-emerald-400'}`}></span>
                </div>
                <div className="truncate text-slate-400 text-[9px]">{pf.type}</div>
                <div className={`truncate text-[9.5px] font-semibold ${
                  pf.num === 'PF 1' ? 'text-cyan-300' : pf.occupied ? 'text-slate-300' : 'text-emerald-400'
                }`}>
                  {pf.train}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Map Legend */}
      <div className="border-t border-slate-800 bg-[#060910] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Heatmap Legend */}
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-medium">Corridor Saturation:</span>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded-sm bg-cyan-400"></span>
            <span className="text-[11px] text-slate-300 font-mono">&lt;40% Nominal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded-sm bg-emerald-500"></span>
            <span className="text-[11px] text-slate-300 font-mono">40-65% Stable</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded-sm bg-amber-500"></span>
            <span className="text-[11px] text-slate-300 font-mono">65-85% Dense</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded-sm bg-rose-500 animate-pulse"></span>
            <span className="text-[11px] text-rose-300 font-mono font-semibold">&gt;85% Chokepoint (Yamuna Bridge)</span>
          </div>
        </div>

        {/* Selected Train / Hover status */}
        <div className="flex items-center gap-2 font-mono text-[11px]">
          {selectedTrain ? (
            <div className="flex items-center gap-2 text-cyan-300">
              <span className="text-slate-400">Active Train:</span>
              <span className="font-bold">{selectedTrain.callsign}</span>
              <span className="text-slate-400">({selectedTrain.name})</span>
              <span className="text-emerald-400">
                Pacing: +{selectedTrain.targetPacingDelayMin}m Buffer
              </span>
            </div>
          ) : hoveredEntity ? (
            <span className="text-slate-300">{hoveredEntity}</span>
          ) : (
            <span className="text-slate-500 flex items-center gap-1">
              <Info className="h-3 w-3" />
              Click any train or section to inspect Kavach arrival delay pacing
            </span>
          )}
        </div>

      </div>

    </div>
  );
};
