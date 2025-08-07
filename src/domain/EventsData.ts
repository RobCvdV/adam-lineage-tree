export interface Event {
  eventName: string;
  dateAM: number;
  dateBCEstimate: number;
  keyFigures: string[];
  scriptureReference: string;
  description: string;
}

export type EventsData = Event[];
