import { Station, TrackSegment, Train, CongestionIncident, RouteCorridor } from '../types/railway';

export const INDIAN_STATIONS: Station[] = [
  {
    id: 'st-gzb',
    name: 'Ghaziabad Junction',
    code: 'GZB',
    hindiName: 'गाजियाबाद जंक्शन',
    x: 90,
    y: 310,
    platformsTotal: 6,
    platformsOccupied: 3,
    activeQueueCount: 1,
    connectedSegmentIds: ['seg-gzb-sbb-up', 'seg-gzb-sbb-dn'],
    isMajorTerminal: false
  },
  {
    id: 'st-sbb',
    name: 'Sahibabad Interlocking Hub',
    code: 'SBB',
    hindiName: 'साहिबाबाद',
    x: 270,
    y: 310,
    platformsTotal: 5,
    platformsOccupied: 2,
    activeQueueCount: 1,
    connectedSegmentIds: ['seg-gzb-sbb-up', 'seg-sbb-ymb-up', 'seg-sbb-loop', 'seg-sbb-anvt'],
    isMajorTerminal: false
  },
  {
    id: 'st-anvt',
    name: 'Anand Vihar Terminal',
    code: 'ANVT',
    hindiName: 'आनंद विहार टर्मिनल',
    x: 440,
    y: 160,
    platformsTotal: 7,
    platformsOccupied: 3,
    activeQueueCount: 0,
    connectedSegmentIds: ['seg-sbb-anvt', 'seg-anvt-tkj'],
    isMajorTerminal: true
  },
  {
    id: 'st-ymb',
    name: 'Yamuna River Bridge Chokepoint',
    code: 'YMB',
    hindiName: 'यमुना ब्रिज आउटर',
    x: 520,
    y: 310,
    platformsTotal: 2,
    platformsOccupied: 2,
    activeQueueCount: 3,
    connectedSegmentIds: ['seg-sbb-ymb-up', 'seg-ymb-tkj-up', 'seg-sbb-loop'],
    isMajorTerminal: false
  },
  {
    id: 'st-tkj',
    name: 'Tilak Bridge Quad-Track Throat',
    code: 'TKJ',
    hindiName: 'तिलक ब्रिज',
    x: 710,
    y: 310,
    platformsTotal: 4,
    platformsOccupied: 3,
    activeQueueCount: 2,
    connectedSegmentIds: ['seg-ymb-tkj-up', 'seg-tkj-ndls-up', 'seg-anvt-tkj', 'seg-tkj-nzm'],
    isMajorTerminal: false
  },
  {
    id: 'st-nzm',
    name: 'Hazrat Nizamuddin Terminal',
    code: 'NZM',
    hindiName: 'हजरत निजामुद्दीन',
    x: 570,
    y: 490,
    platformsTotal: 8,
    platformsOccupied: 4,
    activeQueueCount: 1,
    connectedSegmentIds: ['seg-tkj-nzm', 'seg-nzm-goods'],
    isMajorTerminal: true
  },
  {
    id: 'st-ndls',
    name: 'New Delhi Railway Station (NDLS)',
    code: 'NDLS',
    hindiName: 'नई दिल्ली रेलवे स्टेशन',
    x: 910,
    y: 310,
    platformsTotal: 16,
    platformsOccupied: 14,
    activeQueueCount: 5,
    connectedSegmentIds: ['seg-tkj-ndls-up', 'seg-dbsi-ndls'],
    isMajorTerminal: true
  },
  {
    id: 'st-dbsi',
    name: 'Dayabasti Goods Marshalling Yard',
    code: 'DBSI',
    hindiName: 'दयाबस्ती यार्ड',
    x: 760,
    y: 160,
    platformsTotal: 4,
    platformsOccupied: 1,
    activeQueueCount: 0,
    connectedSegmentIds: ['seg-anvt-tkj', 'seg-dbsi-ndls'],
    isMajorTerminal: false
  }
];

export const INDIAN_TRACK_SEGMENTS: TrackSegment[] = [
  {
    id: 'seg-gzb-sbb-up',
    name: 'GZB – SBB Up Express Line',
    code: 'LINE-1A',
    fromStationId: 'st-gzb',
    toStationId: 'st-sbb',
    pathD: 'M 90 280 L 270 280',
    trackType: 'up_main',
    distanceKm: 7.2,
    maxSpeedKmh: 130,
    currentSpeedLimitKmh: 110,
    capacityTrains: 3,
    activeTrainIds: ['tr-22436'],
    saturationPercent: 45,
    congestionLevel: 'nominal',
    signalAspect: 'green',
    hasSidingLoop: false,
    labelOffsetY: -12
  },
  {
    id: 'seg-gzb-sbb-dn',
    name: 'GZB – SBB Down Main Line',
    code: 'LINE-1B',
    fromStationId: 'st-sbb',
    toStationId: 'st-gzb',
    pathD: 'M 270 340 L 90 340',
    trackType: 'down_main',
    distanceKm: 7.2,
    maxSpeedKmh: 130,
    currentSpeedLimitKmh: 120,
    capacityTrains: 3,
    activeTrainIds: [],
    saturationPercent: 30,
    congestionLevel: 'nominal',
    signalAspect: 'green',
    hasSidingLoop: false,
    labelOffsetY: 16
  },
  {
    id: 'seg-sbb-ymb-up',
    name: 'Sahibabad – Yamuna Bridge Section',
    code: 'LINE-2A',
    fromStationId: 'st-sbb',
    toStationId: 'st-ymb',
    pathD: 'M 270 280 L 520 280',
    trackType: 'up_main',
    distanceKm: 8.4,
    maxSpeedKmh: 110,
    currentSpeedLimitKmh: 65,
    capacityTrains: 3,
    activeTrainIds: ['tr-12431'],
    saturationPercent: 78,
    congestionLevel: 'heavy',
    signalAspect: 'yellow',
    hasSidingLoop: false,
    labelOffsetY: -12
  },
  {
    id: 'seg-sbb-loop',
    name: 'Sahibabad Dynamic Goods Siding Loop',
    code: 'SBB-SIDING',
    fromStationId: 'st-sbb',
    toStationId: 'st-ymb',
    pathD: 'M 270 280 C 330 380, 460 380, 520 280',
    trackType: 'siding_loop',
    distanceKm: 11.2,
    maxSpeedKmh: 75,
    currentSpeedLimitKmh: 50,
    capacityTrains: 2,
    activeTrainIds: ['tr-boxn-99'],
    saturationPercent: 35,
    congestionLevel: 'nominal',
    signalAspect: 'green',
    hasSidingLoop: true,
    sidingName: 'Sahibabad Loop Siding 2',
    labelOffsetY: 20
  },
  {
    id: 'seg-ymb-tkj-up',
    name: 'Yamuna Bridge – Tilak Bridge Chokepoint',
    code: 'YMB-TKJ',
    fromStationId: 'st-ymb',
    toStationId: 'st-tkj',
    pathD: 'M 520 280 L 710 280',
    trackType: 'up_main',
    distanceKm: 6.8,
    maxSpeedKmh: 80,
    currentSpeedLimitKmh: 45,
    capacityTrains: 3,
    activeTrainIds: ['tr-emu-644'],
    saturationPercent: 92,
    congestionLevel: 'critical',
    signalAspect: 'double_yellow',
    hasSidingLoop: false,
    labelOffsetY: -12
  },
  {
    id: 'seg-tkj-ndls-up',
    name: 'Tilak Bridge – NDLS Inbound Throat (PF 1-16 Entry)',
    code: 'TKJ-NDLS',
    fromStationId: 'st-tkj',
    toStationId: 'st-ndls',
    pathD: 'M 710 280 L 910 280',
    trackType: 'up_main',
    distanceKm: 4.1,
    maxSpeedKmh: 60,
    currentSpeedLimitKmh: 30,
    capacityTrains: 4,
    activeTrainIds: ['tr-12004'],
    saturationPercent: 96,
    congestionLevel: 'critical',
    signalAspect: 'red',
    hasSidingLoop: false,
    labelOffsetY: -12
  },
  {
    id: 'seg-sbb-anvt',
    name: 'Sahibabad – Anand Vihar Relief Chord',
    code: 'CHORD-ANVT',
    fromStationId: 'st-sbb',
    toStationId: 'st-anvt',
    pathD: 'M 270 280 C 310 190, 370 160, 440 160',
    trackType: 'chord_line',
    distanceKm: 6.5,
    maxSpeedKmh: 100,
    currentSpeedLimitKmh: 90,
    capacityTrains: 2,
    activeTrainIds: ['tr-garib-25'],
    saturationPercent: 28,
    congestionLevel: 'nominal',
    signalAspect: 'green',
    hasSidingLoop: false,
    isBypassRoute: true,
    labelOffsetY: -10
  },
  {
    id: 'seg-anvt-tkj',
    name: 'Anand Vihar – Tilak Bridge Bypass Flyover',
    code: 'ANVT-TKJ',
    fromStationId: 'st-anvt',
    toStationId: 'st-tkj',
    pathD: 'M 440 160 C 540 160, 640 210, 710 280',
    trackType: 'chord_line',
    distanceKm: 9.3,
    maxSpeedKmh: 100,
    currentSpeedLimitKmh: 85,
    capacityTrains: 3,
    activeTrainIds: [],
    saturationPercent: 25,
    congestionLevel: 'nominal',
    signalAspect: 'green',
    hasSidingLoop: false,
    isBypassRoute: true,
    labelOffsetY: -10
  },
  {
    id: 'seg-tkj-nzm',
    name: 'Tilak Bridge – Hazrat Nizamuddin South Link',
    code: 'TKJ-NZM',
    fromStationId: 'st-tkj',
    toStationId: 'st-nzm',
    pathD: 'M 710 340 C 670 410, 630 460, 570 490',
    trackType: 'up_main',
    distanceKm: 5.8,
    maxSpeedKmh: 90,
    currentSpeedLimitKmh: 75,
    capacityTrains: 2,
    activeTrainIds: ['tr-gatimaan-12'],
    saturationPercent: 38,
    congestionLevel: 'nominal',
    signalAspect: 'green',
    hasSidingLoop: false,
    labelOffsetY: 12
  },
  {
    id: 'seg-nzm-goods',
    name: 'Nizamuddin South Freight Departure',
    code: 'NZM-GOODS',
    fromStationId: 'st-nzm',
    toStationId: 'st-sbb',
    pathD: 'M 570 490 C 430 500, 310 420, 270 340',
    trackType: 'goods_bypass',
    distanceKm: 14.5,
    maxSpeedKmh: 80,
    currentSpeedLimitKmh: 65,
    capacityTrains: 3,
    activeTrainIds: [],
    saturationPercent: 32,
    congestionLevel: 'nominal',
    signalAspect: 'green',
    hasSidingLoop: true,
    sidingName: 'Tughlakabad Link Siding',
    labelOffsetY: 14
  },
  {
    id: 'seg-dbsi-ndls',
    name: 'Dayabasti Yard – NDLS North Throat',
    code: 'DBSI-NDLS',
    fromStationId: 'st-dbsi',
    toStationId: 'st-ndls',
    pathD: 'M 760 160 C 830 180, 880 230, 910 280',
    trackType: 'goods_bypass',
    distanceKm: 7.0,
    maxSpeedKmh: 70,
    currentSpeedLimitKmh: 50,
    capacityTrains: 2,
    activeTrainIds: [],
    saturationPercent: 20,
    congestionLevel: 'nominal',
    signalAspect: 'green',
    hasSidingLoop: false,
    labelOffsetY: -10
  }
];

export const INDIAN_TRAINS: Train[] = [
  {
    id: 'tr-22436',
    trainNumber: '22436',
    callsign: 'VB-22436',
    name: 'Vande Bharat Express (Varanasi - NDLS)',
    type: 'vande_bharat',
    rakeType: '16-Coach Trainset (Kavach Automated)',
    originStationId: 'st-gzb',
    destinationStationId: 'st-ndls',
    assignedPlatform: 'Platform 1 (VIP Bay)',
    currentSegmentId: 'seg-gzb-sbb-up',
    segmentProgress: 0.65,
    speedKmh: 110,
    targetPacingSpeedKmh: 62,
    scheduledArrival: '14:05',
    estimatedArrival: '14:21',
    targetPacingDelayMin: 16,
    currentDelayMin: 0,
    status: 'pacing',
    priority: 1,
    tonnageOrPassengers: '1,128 Passengers',
    assignedRouteId: 'rt-vb-pacing',
    driverPacingAcknowledged: true,
    routeOptions: [
      {
        id: 'rt-vb-pacing',
        name: 'Kavach Dynamic Speed Pacing (GZB – NDLS Direct)',
        strategy: 'speed_pacing',
        title: 'Throttled Glide via Tilak Bridge Corridor',
        summary: 'Reduce cruising speed from 110 km/h to 62 km/h across Yamuna Bridge. Deliberately delays arrival by +16 mins so NDLS Platform 1 vacates right as train approaches.',
        pathSegmentIds: ['seg-gzb-sbb-up', 'seg-sbb-ymb-up', 'seg-ymb-tkj-up', 'seg-tkj-ndls-up'],
        totalDistanceKm: 26.5,
        standardDurationMin: 22,
        pacedDurationMin: 38,
        deliberateDelayMin: 16,
        downstreamConflictAverted: true,
        energySavingsKWh: 1680,
        congestionReductionPercent: 44,
        recommended: true,
        colorHex: '#00f0ff',
        advisoryNote: 'Prevents hard emergency braking at Yamuna Bridge Outer Red Signal. Smooth green wave entry into NDLS PF 1.'
      },
      {
        id: 'rt-vb-siding-hold',
        name: 'Sahibabad Siding Loop 2 Staging',
        strategy: 'siding_hold',
        title: 'Buffer Insertion at SBB Goods Siding',
        summary: 'Enter Sahibabad loop siding for 12 mins to let local EMU clear the Tilak Bridge single-line curve.',
        pathSegmentIds: ['seg-gzb-sbb-up', 'seg-sbb-loop', 'seg-ymb-tkj-up', 'seg-tkj-ndls-up'],
        totalDistanceKm: 29.3,
        standardDurationMin: 26,
        pacedDurationMin: 42,
        deliberateDelayMin: 16,
        downstreamConflictAverted: true,
        energySavingsKWh: 950,
        congestionReductionPercent: 32,
        recommended: false,
        colorHex: '#10b981',
        advisoryNote: 'Safe alternative: Frees main line for Kanpur Shatabdi trailing behind.'
      },
      {
        id: 'rt-vb-anvt-divert',
        name: 'Anand Vihar Bypass Flyover Relief',
        strategy: 'relief_bypass',
        title: 'Circumferential Flyover via ANVT',
        summary: 'Divert onto Anand Vihar bypass chord, skipping Yamuna Bridge outer chokepoint completely. Adds +20 min delay.',
        pathSegmentIds: ['seg-gzb-sbb-up', 'seg-sbb-anvt', 'seg-anvt-tkj', 'seg-tkj-ndls-up'],
        totalDistanceKm: 34.1,
        standardDurationMin: 28,
        pacedDurationMin: 48,
        deliberateDelayMin: 20,
        downstreamConflictAverted: true,
        energySavingsKWh: 420,
        congestionReductionPercent: 65,
        recommended: false,
        colorHex: '#a855f7',
        advisoryNote: 'Bypasses the entire congested Yamuna river bed interlocking. Highly recommended during peak evening hours.'
      },
      {
        id: 'rt-vb-rush-halt',
        name: 'Unpaced Full Throttle (High Hazard)',
        strategy: 'standard_direct',
        title: 'Race at Maximum 130 km/h',
        summary: 'Full speed into Delhi. Train reaches Yamuna Bridge outer in 9 mins and is forced into a dead stop at Red Signal for 28 mins.',
        pathSegmentIds: ['seg-gzb-sbb-up', 'seg-sbb-ymb-up', 'seg-ymb-tkj-up', 'seg-tkj-ndls-up'],
        totalDistanceKm: 26.5,
        standardDurationMin: 22,
        pacedDurationMin: 22,
        deliberateDelayMin: 0,
        downstreamConflictAverted: false,
        energySavingsKWh: 0,
        congestionReductionPercent: 0,
        recommended: false,
        colorHex: '#f43f5e',
        advisoryNote: 'CRITICAL DEADLOCK: Stops train on river bridge track, trapping 3 suburban EMUs and burning 2.8 MWh auxiliary power.'
      }
    ]
  },
  {
    id: 'tr-12431',
    trainNumber: '12431',
    callsign: 'RAJ-12431',
    name: 'Trivandrum Rajdhani Express',
    type: 'rajdhani_express',
    rakeType: '22-Coach LHB Rake (WAP-7 Twin)',
    originStationId: 'st-sbb',
    destinationStationId: 'st-nzm',
    assignedPlatform: 'Platform 3 (Hazrat Nizamuddin)',
    currentSegmentId: 'seg-sbb-ymb-up',
    segmentProgress: 0.40,
    speedKmh: 68,
    targetPacingSpeedKmh: 55,
    scheduledArrival: '14:20',
    estimatedArrival: '14:31',
    targetPacingDelayMin: 11,
    currentDelayMin: 2,
    status: 'pacing',
    priority: 1,
    tonnageOrPassengers: '1,280 AC Passengers',
    assignedRouteId: 'rt-raj-pacing',
    driverPacingAcknowledged: true,
    routeOptions: []
  },
  {
    id: 'tr-12004',
    trainNumber: '12004',
    callsign: 'SHT-12004',
    name: 'Lucknow Swarna Shatabdi',
    type: 'shatabdi',
    rakeType: '18-Coach LHB Executive',
    originStationId: 'st-tkj',
    destinationStationId: 'st-ndls',
    assignedPlatform: 'Platform 2 (NDLS Concourse)',
    currentSegmentId: 'seg-tkj-ndls-up',
    segmentProgress: 0.70,
    speedKmh: 35,
    targetPacingSpeedKmh: 32,
    scheduledArrival: '13:58',
    estimatedArrival: '14:04',
    targetPacingDelayMin: 6,
    currentDelayMin: 4,
    status: 'pacing',
    priority: 2,
    tonnageOrPassengers: '960 Passengers',
    assignedRouteId: 'rt-sht-pacing',
    driverPacingAcknowledged: true,
    routeOptions: []
  },
  {
    id: 'tr-emu-644',
    trainNumber: '64402',
    callsign: 'EMU-64402',
    name: 'Ghaziabad – Delhi Main EMU Local',
    type: 'suburban_emu',
    rakeType: '12-Car Medha AC EMU',
    originStationId: 'st-ymb',
    destinationStationId: 'st-ndls',
    assignedPlatform: 'Platform 11 (Suburban Island)',
    currentSegmentId: 'seg-ymb-tkj-up',
    segmentProgress: 0.35,
    speedKmh: 42,
    targetPacingSpeedKmh: 38,
    scheduledArrival: '14:15',
    estimatedArrival: '14:24',
    targetPacingDelayMin: 9,
    currentDelayMin: 3,
    status: 'pacing',
    priority: 3,
    tonnageOrPassengers: '2,400 Commuters',
    assignedRouteId: 'rt-emu-pacing',
    driverPacingAcknowledged: true,
    routeOptions: []
  },
  {
    id: 'tr-boxn-99',
    trainNumber: 'BOXN-99',
    callsign: 'FRT-BOXN-99',
    name: 'Tughlakabad Container Freight Rake',
    type: 'freight_boxn',
    rakeType: '58 WAG-9 Freight Wagons',
    originStationId: 'st-sbb',
    destinationStationId: 'st-nzm',
    assignedPlatform: 'Goods Loop Yard',
    currentSegmentId: 'seg-sbb-loop',
    segmentProgress: 0.50,
    speedKmh: 30,
    targetPacingSpeedKmh: 25,
    scheduledArrival: '15:10',
    estimatedArrival: '15:28',
    targetPacingDelayMin: 18,
    currentDelayMin: 0,
    status: 'holding_siding',
    priority: 4,
    tonnageOrPassengers: '4,650 Metric Tons',
    assignedRouteId: 'rt-boxn-siding',
    driverPacingAcknowledged: true,
    routeOptions: []
  },
  {
    id: 'tr-gatimaan-12',
    trainNumber: '12050',
    callsign: 'GTM-12050',
    name: 'Gatimaan Express (Agra - NZM)',
    type: 'rajdhani_express',
    rakeType: '12-Coach High-Speed LHB',
    originStationId: 'st-tkj',
    destinationStationId: 'st-nzm',
    assignedPlatform: 'Platform 1 (NZM South)',
    currentSegmentId: 'seg-tkj-nzm',
    segmentProgress: 0.55,
    speedKmh: 85,
    targetPacingSpeedKmh: 80,
    scheduledArrival: '14:10',
    estimatedArrival: '14:12',
    targetPacingDelayMin: 2,
    currentDelayMin: 0,
    status: 'on_schedule',
    priority: 1,
    tonnageOrPassengers: '710 Passengers',
    assignedRouteId: 'rt-gtm-direct',
    driverPacingAcknowledged: true,
    routeOptions: []
  },
  {
    id: 'tr-garib-25',
    trainNumber: '12206',
    callsign: 'GR-12206',
    name: 'Dehradun Garib Rath Express',
    type: 'shatabdi',
    rakeType: '16-Coach AC 3-Tier',
    originStationId: 'st-sbb',
    destinationStationId: 'st-anvt',
    assignedPlatform: 'Platform 4 (Anand Vihar)',
    currentSegmentId: 'seg-sbb-anvt',
    segmentProgress: 0.52,
    speedKmh: 82,
    targetPacingSpeedKmh: 80,
    scheduledArrival: '14:00',
    estimatedArrival: '14:02',
    targetPacingDelayMin: 2,
    currentDelayMin: 0,
    status: 'on_schedule',
    priority: 2,
    tonnageOrPassengers: '1,150 Passengers',
    assignedRouteId: 'rt-gr-direct',
    driverPacingAcknowledged: true,
    routeOptions: []
  }
];

export const INDIAN_CORRIDORS: RouteCorridor[] = [
  {
    id: 'corr-delhi-main-trunk',
    name: 'Ghaziabad – NDLS Main Quad-Track Corridor',
    code: 'GZB-NDLS-01',
    color: '#00f0ff',
    description: 'Busiest railway section in Northern India. Feeds Eastern/Northern trains into New Delhi Railway Station platforms 1-16.',
    trackSegmentIds: ['seg-gzb-sbb-up', 'seg-sbb-ymb-up', 'seg-ymb-tkj-up', 'seg-tkj-ndls-up'],
    lengthKm: 26.5,
    currentAverageSpeed: 62,
    densityScore: 92,
    status: 'pacing_active',
    keyBottleneckPoint: 'Yamuna River Bridge Outer Cabin (94% Saturation)',
    activeTrainsCount: 4
  },
  {
    id: 'corr-anvt-bypass',
    name: 'Sahibabad – Anand Vihar Relief Chord',
    code: 'ANVT-RELIEF-02',
    color: '#a855f7',
    description: 'High-speed elevated flyover chord diverting trans-Yamuna traffic into Anand Vihar Terminal, relieving NDLS throat.',
    trackSegmentIds: ['seg-sbb-anvt', 'seg-anvt-tkj'],
    lengthKm: 15.8,
    currentAverageSpeed: 88,
    densityScore: 28,
    status: 'smooth',
    keyBottleneckPoint: 'Nominal Flow (Clear Section)',
    activeTrainsCount: 1
  },
  {
    id: 'corr-sbb-goods-loop',
    name: 'Sahibabad Dynamic Goods Siding Loop',
    code: 'SBB-LOOP-03',
    color: '#10b981',
    description: 'Dedicated dynamic holding loop for heavy freight rakes and parcel expresses to absorb delays and let Vande Bharat pass.',
    trackSegmentIds: ['seg-sbb-loop'],
    lengthKm: 11.2,
    currentAverageSpeed: 38,
    densityScore: 35,
    status: 'smooth',
    keyBottleneckPoint: 'Siding Entry Turnout Point 42B',
    activeTrainsCount: 1
  },
  {
    id: 'corr-nzm-south-radial',
    name: 'Tilak Bridge – Hazrat Nizamuddin South Radial',
    code: 'TKJ-NZM-04',
    color: '#f59e0b',
    description: 'Connects central Delhi throat to Hazrat Nizamuddin terminal for Central and Western bound superfast expresses.',
    trackSegmentIds: ['seg-tkj-nzm', 'seg-nzm-goods'],
    lengthKm: 20.3,
    currentAverageSpeed: 74,
    densityScore: 42,
    status: 'smooth',
    keyBottleneckPoint: 'Nizamuddin Cabin C Throat',
    activeTrainsCount: 1
  }
];

export const INDIAN_INCIDENTS: CongestionIncident[] = [
  {
    id: 'inc-ndls-pf1',
    title: 'NDLS Platform 1 Rake Shunting Conflict',
    segmentId: 'seg-tkj-ndls-up',
    locationName: 'New Delhi Railway Station (Platform 1)',
    type: 'platform_congestion',
    severity: 'major',
    addedDelayMin: 16,
    active: true,
    description: 'Inbound Vande Bharat 22436 assigned to PF 1. However, earlier Kalka Shatabdi rake is delayed departing by 14 minutes due to VIP protocol boarding. Dynamic speed pacing prevents Vande Bharat from stopping dead on Yamuna Bridge.'
  },
  {
    id: 'inc-ymb-choke',
    title: 'Yamuna River Bridge Point Sensor Recalibration',
    segmentId: 'seg-ymb-tkj-up',
    locationName: 'Yamuna Outer Cabin Switch 18A',
    type: 'junction_bottleneck',
    severity: 'minor',
    addedDelayMin: 8,
    active: true,
    description: 'Speed restriction of 45 km/h enforced on bridge track. Dynamic arrival pacing synchronizes following rakes to prevent signal clustering.'
  },
  {
    id: 'inc-sbb-loop-clear',
    title: 'Sahibabad Marshalling Yard Block',
    segmentId: 'seg-sbb-loop',
    locationName: 'Sahibabad Freight Siding 2',
    type: 'track_maintenance',
    severity: 'minor',
    addedDelayMin: 5,
    active: false,
    description: 'Overhead 25kV traction wire inspection window on freight line 4; traffic routed via Up Main.'
  }
];

/**
 * Calculates coordinates along track segments with zero overlap and high visual clarity
 */
export function getCoordinatesOnSegment(
  segment: TrackSegment,
  stations: Station[],
  progress: number
): { x: number; y: number; angleDeg: number } {
  const p = Math.max(0, Math.min(1, progress));

  // 1. Straight lines (Up Main Line at y=280)
  if (segment.id === 'seg-gzb-sbb-up') {
    return { x: 90 + (270 - 90) * p, y: 280, angleDeg: 0 };
  }
  if (segment.id === 'seg-gzb-sbb-dn') {
    return { x: 270 - (270 - 90) * p, y: 340, angleDeg: 180 };
  }
  if (segment.id === 'seg-sbb-ymb-up') {
    return { x: 270 + (520 - 270) * p, y: 280, angleDeg: 0 };
  }
  if (segment.id === 'seg-ymb-tkj-up') {
    return { x: 520 + (710 - 520) * p, y: 280, angleDeg: 0 };
  }
  if (segment.id === 'seg-tkj-ndls-up') {
    return { x: 710 + (910 - 710) * p, y: 280, angleDeg: 0 };
  }

  // 2. Sahibabad Loop Siding (curved below: M 270 280 C 330 380, 460 380, 520 280)
  if (segment.id === 'seg-sbb-loop') {
    const p0 = { x: 270, y: 280 };
    const p1 = { x: 330, y: 380 };
    const p2 = { x: 460, y: 380 };
    const p3 = { x: 520, y: 280 };
    const t = p;
    const x = Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x;
    const y = Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y;
    const dx = 3 * Math.pow(1 - t, 2) * (p1.x - p0.x) + 6 * (1 - t) * t * (p2.x - p1.x) + 3 * Math.pow(t, 2) * (p3.x - p2.x);
    const dy = 3 * Math.pow(1 - t, 2) * (p1.y - p0.y) + 6 * (1 - t) * t * (p2.y - p1.y) + 3 * Math.pow(t, 2) * (p3.y - p2.y);
    return { x, y, angleDeg: (Math.atan2(dy, dx) * 180) / Math.PI };
  }

  // 3. Anand Vihar Chord (curved above: M 270 280 C 310 190, 370 160, 440 160)
  if (segment.id === 'seg-sbb-anvt') {
    const p0 = { x: 270, y: 280 };
    const p1 = { x: 310, y: 190 };
    const p2 = { x: 370, y: 160 };
    const p3 = { x: 440, y: 160 };
    const t = p;
    const x = Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x;
    const y = Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y;
    const dx = 3 * Math.pow(1 - t, 2) * (p1.x - p0.x) + 6 * (1 - t) * t * (p2.x - p1.x) + 3 * Math.pow(t, 2) * (p3.x - p2.x);
    const dy = 3 * Math.pow(1 - t, 2) * (p1.y - p0.y) + 6 * (1 - t) * t * (p2.y - p1.y) + 3 * Math.pow(t, 2) * (p3.y - p2.y);
    return { x, y, angleDeg: (Math.atan2(dy, dx) * 180) / Math.PI };
  }

  // 4. Anand Vihar to Tilak Bridge (M 440 160 C 540 160, 640 210, 710 280)
  if (segment.id === 'seg-anvt-tkj') {
    const p0 = { x: 440, y: 160 };
    const p1 = { x: 540, y: 160 };
    const p2 = { x: 640, y: 210 };
    const p3 = { x: 710, y: 280 };
    const t = p;
    const x = Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x;
    const y = Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y;
    const dx = 3 * Math.pow(1 - t, 2) * (p1.x - p0.x) + 6 * (1 - t) * t * (p2.x - p1.x) + 3 * Math.pow(t, 2) * (p3.x - p2.x);
    const dy = 3 * Math.pow(1 - t, 2) * (p1.y - p0.y) + 6 * (1 - t) * t * (p2.y - p1.y) + 3 * Math.pow(t, 2) * (p3.y - p2.y);
    return { x, y, angleDeg: (Math.atan2(dy, dx) * 180) / Math.PI };
  }

  // 5. Tilak Bridge to Nizamuddin (M 710 340 C 670 410, 630 460, 570 490)
  if (segment.id === 'seg-tkj-nzm') {
    const p0 = { x: 710, y: 340 };
    const p1 = { x: 670, y: 410 };
    const p2 = { x: 630, y: 460 };
    const p3 = { x: 570, y: 490 };
    const t = p;
    const x = Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x;
    const y = Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y;
    const dx = 3 * Math.pow(1 - t, 2) * (p1.x - p0.x) + 6 * (1 - t) * t * (p2.x - p1.x) + 3 * Math.pow(t, 2) * (p3.x - p2.x);
    const dy = 3 * Math.pow(1 - t, 2) * (p1.y - p0.y) + 6 * (1 - t) * t * (p2.y - p1.y) + 3 * Math.pow(t, 2) * (p3.y - p2.y);
    return { x, y, angleDeg: (Math.atan2(dy, dx) * 180) / Math.PI };
  }

  // Fallback linear
  const fromSt = stations.find((s) => s.id === segment.fromStationId);
  const toSt = stations.find((s) => s.id === segment.toStationId);
  if (!fromSt || !toSt) return { x: 500, y: 300, angleDeg: 0 };
  const x = fromSt.x + (toSt.x - fromSt.x) * p;
  const y = fromSt.y + (toSt.y - fromSt.y) * p;
  const angleDeg = (Math.atan2(toSt.y - fromSt.y, toSt.x - fromSt.x) * 180) / Math.PI;
  return { x, y, angleDeg };
}
