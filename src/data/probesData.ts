import { StopId } from '../core/store';

export type ProbeArchetype = 'parker' | 'bepicolombo' | 'venera13' | 'iss' | 'jwst';

export interface ProbeSpec {
  id: ProbeArchetype;
  hostStop: StopId;
  name: string;
  agency: string;
  year: string;
  status: string;
  orbitRadiusFactor: number;
  orbitSpeed: number;
  orbitInclination: number;
  initialPhase: number;
  summary: string;
}

export const PROBES_DATA: ProbeSpec[] = [
  {
    id: 'parker',
    hostStop: 'sun',
    name: 'PARKER SOLAR PROBE',
    agency: 'NASA / JHUAPL',
    year: '2018',
    status: 'ACTIVE PERIHELION SKIMMER',
    orbitRadiusFactor: 1.72,
    orbitSpeed: 0.22,
    orbitInclination: 0.14,
    initialPhase: 0.35,
    summary: '11.4 cm carbon-composite shield surviving 1,377 °C inside the solar corona at 192 km/s.',
  },
  {
    id: 'bepicolombo',
    hostStop: 'mercury',
    name: 'BEPICOLOMBO',
    agency: 'ESA / JAXA',
    year: '2018',
    status: 'DUAL-ORBITER STACK',
    orbitRadiusFactor: 1.95,
    orbitSpeed: 0.32,
    orbitInclination: 0.38,
    initialPhase: 0.85,
    summary: 'Stacked MPO + Mio magnetospheric orbiters mapping Mercury’s offset magnetic dynamo.',
  },
  {
    id: 'venera13',
    hostStop: 'venus',
    name: 'VENERA 13',
    agency: 'IKI / SOVIET SPACE PROGRAM',
    year: '1981',
    status: 'HERITAGE DESCENT CAPSULE',
    orbitRadiusFactor: 1.75,
    orbitSpeed: -0.24,
    orbitInclination: -0.22,
    initialPhase: 0.55,
    summary: 'Titanium pressure hull that endured 89 atm and 457 °C for 127 minutes on Venus’s plains.',
  },
  {
    id: 'iss',
    hostStop: 'earth',
    name: 'INTL. SPACE STATION (ISS)',
    agency: 'NASA · ROSCOSMOS · ESA · JAXA · CSA',
    year: '1998',
    status: 'CREWED LEO OUTPOST (408 KM)',
    orbitRadiusFactor: 1.42,
    orbitSpeed: 0.38,
    orbitInclination: 0.48,
    initialPhase: 0.9,
    summary: '109-meter orbital laboratory completing 15.5 revolutions per day at 7.66 km/s.',
  },
  {
    id: 'jwst',
    hostStop: 'earth',
    name: 'JAMES WEBB SPACE TELESCOPE',
    agency: 'NASA · ESA · CSA',
    year: '2021',
    status: 'INFRARED OBSERVATORY',
    orbitRadiusFactor: 2.25,
    orbitSpeed: 0.14,
    orbitInclination: -0.26,
    initialPhase: 2.15,
    summary: '6.5 m gold-coated beryllium segmented mirror shielded at 50 K by a 5-layer Kapton sunshield.',
  },
];
