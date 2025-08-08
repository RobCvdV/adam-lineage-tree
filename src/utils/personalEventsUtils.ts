import { PersonNodeData } from '../components/PersonNodeComponent';
import { characterEventsData } from '../domain/CharacterEventsData';

// Get personal events for a specific person
export function getPersonalEvents(person: PersonNodeData) {
  // Find events specific to this person by checking both personId and relatedPersonIds
  return characterEventsData.filter(event =>
    event.personId === person.id || event.relatedPersonIds?.includes(person.id)
  );
}
