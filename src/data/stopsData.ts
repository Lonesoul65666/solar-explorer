import { StopId, QuoteCardInfo } from '../core/store';

export interface StopCatalogEntry {
  id: StopId;
  code: string;
  name: string;
  classification: string;
  semiMajorAu: number;
  radiusKm: number;
  gravityMs2: number;
  escapeKms: number;
  meanTempK: number;
  axialTiltDeg: number;
  rotationPeriodHours: number;
  explorerSummary: string;
  hazardRadiusFactor?: number;
  arrivalDistanceRadii: number;
  quote: QuoteCardInfo;
}

export const STOPS_ORDER: StopId[] = ['sun', 'mercury', 'venus', 'earth', 'moon'];

export const STOPS_DATA: Record<StopId, StopCatalogEntry> = {
  sun: {
    id: 'sun',
    code: 'STOP 01 // SOL',
    name: 'THE SUN',
    classification: 'G2V Main-Sequence Star',
    semiMajorAu: 0.0,
    radiusKm: 696_340,
    gravityMs2: 274.0,
    escapeKms: 617.7,
    meanTempK: 5778,
    axialTiltDeg: 7.25,
    rotationPeriodHours: 609.12,
    explorerSummary: '99.86% of the Solar System’s mass—fusing 600 million tons of hydrogen per second.',
    hazardRadiusFactor: 2.35,
    arrivalDistanceRadii: 2.55,
    quote: {
      stopName: 'STOP 01 · THE SUN',
      text: 'The nitrogen in our DNA, the calcium in our teeth, the iron in our blood, the carbon in our apple pies were made in the interiors of collapsing stars. We are made of starstuff.',
      author: 'CARL SAGAN',
      source: 'Cosmos (1980)',
    },
  },
  mercury: {
    id: 'mercury',
    code: 'STOP 02 // MER',
    name: 'MERCURY',
    classification: 'Silicate-Iron Terrestrial Planet',
    semiMajorAu: 0.3871,
    radiusKm: 2439.7,
    gravityMs2: 3.7,
    escapeKms: 4.25,
    meanTempK: 440,
    axialTiltDeg: 0.03,
    rotationPeriodHours: 1407.6,
    explorerSummary: 'Airless iron-cored world locked in a 3:2 spin-orbit resonance with 600 K day-night swings.',
    arrivalDistanceRadii: 3.1,
    quote: {
      stopName: 'STOP 02 · MERCURY',
      text: 'The universe is under no obligation to make sense to you.',
      author: 'NEIL DEGRASSE TYSON',
      source: 'Astrophysics for People in a Hurry (2017)',
    },
  },
  venus: {
    id: 'venus',
    code: 'STOP 03 // VEN',
    name: 'VENUS',
    classification: 'Super-Greenhouse Terrestrial Planet',
    semiMajorAu: 0.7233,
    radiusKm: 6051.8,
    gravityMs2: 8.87,
    escapeKms: 10.36,
    meanTempK: 737,
    axialTiltDeg: 177.36,
    rotationPeriodHours: -5832.5,
    explorerSummary: 'Crushing 92-bar CO₂ atmosphere and sulfuric acid cloud decks spinning retrograde.',
    hazardRadiusFactor: 1.32,
    arrivalDistanceRadii: 2.65,
    quote: {
      stopName: 'STOP 03 · VENUS',
      text: 'Science is not only compatible with spirituality; it is a profound source of spirituality.',
      author: 'CARL SAGAN',
      source: 'The Demon-Haunted World (1995)',
    },
  },
  earth: {
    id: 'earth',
    code: 'STOP 04 // TER',
    name: 'EARTH',
    classification: 'Oceanic Biosphere Terrestrial Planet',
    semiMajorAu: 1.0,
    radiusKm: 6371.0,
    gravityMs2: 9.807,
    escapeKms: 11.186,
    meanTempK: 288,
    axialTiltDeg: 23.44,
    rotationPeriodHours: 23.934,
    explorerSummary: 'Liquid-water ocean world shielded by a dipolar magnetosphere and nitrogen-oxygen sky.',
    arrivalDistanceRadii: 2.55,
    quote: {
      stopName: 'STOP 04 · EARTH',
      text: "Look again at that dot. That's here. That's home. That's us.",
      author: 'CARL SAGAN',
      source: 'Pale Blue Dot (1994)',
    },
  },
  moon: {
    id: 'moon',
    code: 'STOP 04B // LUN',
    name: 'THE MOON',
    classification: 'Tidally Locked Natural Satellite',
    semiMajorAu: 1.0026,
    radiusKm: 1737.4,
    gravityMs2: 1.62,
    escapeKms: 2.38,
    meanTempK: 250,
    axialTiltDeg: 6.68,
    rotationPeriodHours: 655.7,
    explorerSummary: 'Ancient anorthositic highlands and basaltic maria stabilizing Earth’s axial obliquity.',
    arrivalDistanceRadii: 3.3,
    quote: {
      stopName: 'STOP 04B · LUNA',
      text: 'We are part of this universe; we are in this universe, but perhaps more important than both of those facts, is that the universe is in us.',
      author: 'NEIL DEGRASSE TYSON',
      source: 'Time (2007)',
    },
  },
};
