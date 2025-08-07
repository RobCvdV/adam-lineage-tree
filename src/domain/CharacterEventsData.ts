import CharacterEventsJson from '../data-source/eventsOfCharacters.json';

export type CharacterEventData = typeof CharacterEventsJson[0];
export const characterEventsData = CharacterEventsJson;
