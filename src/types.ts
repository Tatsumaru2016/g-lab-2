export type ChamberCode = 'L-01' | 'L-02' | 'L-03' | 'L-04' | 'L-05' | 'L-06' | 'L-07' | 'L-08' | 'L-09';

export interface Chamber {
  id: number;
  code: ChamberCode;
  name: string;
  headline: string;
  subheadline: string;
}

export const CHAMBERS: Chamber[] = [
  {
    id: 1,
    code: 'L-01',
    name: 'Entry',
    headline: 'G.Lab',
    subheadline: 'Where Ideas Become Reality',
  },
  {
    id: 2,
    code: 'L-02',
    name: 'Thinking',
    headline: 'Cognitive Foundry',
    subheadline: 'Visualizing thoughts flowing into real-time digital blueprints',
  },
  {
    id: 3,
    code: 'L-03',
    name: 'Ecosystem',
    headline: 'Neural Network',
    subheadline: 'Navigating the interconnected constellation of modern tools',
  },
  {
    id: 4,
    code: 'L-04',
    name: 'G.Game',
    headline: 'Worlds Worth Exploring',
    subheadline: 'Procedural playgrounds, design sandboxes, and game systems',
  },
  {
    id: 5,
    code: 'L-05',
    name: 'G.Trans',
    headline: 'Beyond Language',
    subheadline: 'An AI-powered multi-directional communication engine',
  },
  {
    id: 6,
    code: 'L-06',
    name: 'The Engine',
    headline: 'Ideation Mechanics',
    subheadline: 'A fully visual conceptual lifecycle from seed to product deployment',
  },
  {
    id: 7,
    code: 'L-07',
    name: 'Showcase',
    headline: 'Active Artifacts',
    subheadline: 'A gallery of premium tools physically assembled from negative space',
  },
  {
    id: 8,
    code: 'L-08',
    name: 'Future',
    headline: 'The Next Experiment',
    subheadline: 'Sailing along a synthetic horizon made of ideas and raw technology',
  },
  {
    id: 9,
    code: 'L-09',
    name: 'Contact',
    headline: 'Infinite Core',
    subheadline: 'Initiate telemetry, sign up for transmissions, or collapse space-time',
  },
];
