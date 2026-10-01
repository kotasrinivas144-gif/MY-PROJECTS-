export type CongestionStatus = 'nominal' | 'moderate' | 'heavy' | 'critical';
export type SignalAspect = 'green' | 'yellow' | 'double_yellow' | 'red';
export type TrainType = 'vande_bharat' | 'rajdhani_express' | 'shatabdi' | 'suburban_emu' | 'freight_boxn';
export type TrainStatus = 'on_schedule' | 'pacing' | 'diverted' | 'holding_siding' | 'delayed';

export interface Station {
  id: string;
  name: string;
  code: string;
  hindiName?: string;
  x: number;
  y: number;
  platformsTotal: number;
  platformsOccupied: number;
  activeQueueCount: number;
  connectedSegmentIds: string[];
  isMajorTerminal?: boolean;
}

export interface TrackSegment {
  id: string;
  name: string;
  code: string;
  fromStationId: string;
  toStationId: string;
  pathD: string; // SVG path
  trackType: 'up_main' | 'down_main' | 'goods_bypass' | 'siding_loop' | 'chord_line';
  distanceKm: number;
  maxSpeedKmh: number;
  currentSpeedLimitKmh: number;
  capacityTrains: number;
  activeTrainIds: string[];
  saturationPercent: number; // 0 to 100
  congestionLevel: CongestionStatus;
  signalAspect: SignalAspect;
  hasSidingLoop: boolean;
  sidingName?: string;
  isBypassRoute?: boolean;
  labelOffsetY?: number;
}

export interface PacingRouteOption {
  id: string;
  name: string;
  strategy: 'speed_pacing' | 'siding_hold' | 'relief_bypass' | 'standard_direct';
  title: string;
  summary: string;
  pathSegmentIds: string[];
  totalDistanceKm: number;
  standardDurationMin: number;
  pacedDurationMin: number;
  deliberateDelayMin: number;
  downstreamConflictAverted: boolean;
  energySavingsKWh: number;
  congestionReductionPercent: number;
  recommended: boolean;
  colorHex: string;
  advisoryNote: string;
}

export interface Train {
  id: string;
  trainNumber: string;
  callsign: string;
  name: string;
  type: TrainType;
  rakeType: string;
  originStationId: string;
  destinationStationId: string;
  currentSegmentId: string;
  segmentProgress: number; // 0.0 to 1.0
  speedKmh: number;
  targetPacingSpeedKmh: number;
  scheduledArrival: string;
  estimatedArrival: string;
  targetPacingDelayMin: number;
  currentDelayMin: number;
  status: TrainStatus;
  priority: number;
  tonnageOrPassengers: string;
  assignedRouteId: string;
  routeOptions: PacingRouteOption[];
  driverPacingAcknowledged: boolean;
  assignedPlatform?: string;
}

export interface CongestionIncident {
  id: string;
  title: string;
  segmentId: string;
  locationName: string;
  type: 'platform_congestion' | 'signal_failure' | 'track_maintenance' | 'junction_bottleneck';
  severity: 'minor' | 'major' | 'critical';
  addedDelayMin: number;
  active: boolean;
  description: string;
}

export interface RouteCorridor {
  id: string;
  name: string;
  code: string;
  color: string;
  description: string;
  trackSegmentIds: string[];
  lengthKm: number;
  currentAverageSpeed: number;
  densityScore: number;
  status: 'smooth' | 'pacing_active' | 'congested';
  keyBottleneckPoint: string;
  activeTrainsCount: number;
}
