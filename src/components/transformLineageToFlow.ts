// Helper to transform lineage data into nodes/edges
import { LineageData } from "../domain/LineageData";
import { Edge } from "@xyflow/react";
import { PersonNode, PersonNodeData } from "./PersonNodeComponent";
import { NODE_SIZES } from "../constants/nodeSizes";

interface PositionedPerson {
  person: LineageData;
  x: number;
  y: number;
  processed: boolean;
}

export function transformLineageToFlow(data: LineageData[], isMobile: boolean = false): {
  nodes: PersonNode[];
  edges: Edge[]
} {
  const nodes: PersonNode[] = [];
  const edges: Edge[] = [];

  // Create lookup maps
  const peopleMap = new Map<string, LineageData>();
  data.forEach(person => {
    peopleMap.set(person.id, person);
  });

  // Get layout constants based on device type
  const sizes = isMobile ? NODE_SIZES.mobile : NODE_SIZES.desktop;
  const NODE_WIDTH = sizes.width;
  const NODE_HEIGHT = sizes.height;
  const HORIZONTAL_SPACING = sizes.spacing.horizontal; // Use full spacing, don't subtract width
  const VERTICAL_SPACING = sizes.spacing.vertical;
  const PARTNER_SPACING = 20; // Increased spacing for partners
  const MIN_NODE_MARGIN = 20; // Minimum margin between any two nodes

  // Track positioned people and occupied positions with actual coordinates
  const positionedPeople = new Map<string, PositionedPerson>();
  const occupiedRectangles: Array<{ x: number, y: number, width: number, height: number }> = [];

  // Helper function to check if position overlaps with existing nodes
  function isPositionAvailable(x: number, y: number, width: number = NODE_WIDTH, height: number = NODE_HEIGHT): boolean {
    const newRect = {
      x: x - MIN_NODE_MARGIN,
      y: y - MIN_NODE_MARGIN,
      width: width + (MIN_NODE_MARGIN * 2),
      height: height + (MIN_NODE_MARGIN * 2)
    };

    return !occupiedRectangles.some(existingRect => {
      return !(newRect.x >= existingRect.x + existingRect.width ||
        newRect.x + newRect.width <= existingRect.x ||
        newRect.y >= existingRect.y + existingRect.height ||
        newRect.y + newRect.height <= existingRect.y);
    });
  }

  // Helper function to mark position as occupied
  function occupyPosition(x: number, y: number, width: number = NODE_WIDTH, height: number = NODE_HEIGHT): void {
    occupiedRectangles.push({
      x: x - MIN_NODE_MARGIN,
      y: y - MIN_NODE_MARGIN,
      width: width + (MIN_NODE_MARGIN * 2),
      height: height + (MIN_NODE_MARGIN * 2)
    });
  }

  // Helper function to find next available position moving right
  function findNextAvailablePosition(startX: number, y: number, width: number = NODE_WIDTH): {
    x: number;
    y: number
  } {
    let x = startX;
    const maxAttempts = 50; // Prevent infinite loops
    let attempts = 0;

    while (!isPositionAvailable(x, y, width) && attempts < maxAttempts) {
      x += HORIZONTAL_SPACING;
      attempts++;
    }

    // If we can't find a position horizontally, try moving down
    if (attempts >= maxAttempts) {
      return findNextAvailablePosition(0, y + VERTICAL_SPACING, width);
    }

    return {x, y};
  }

  // Helper function to get chronological Y position based on birth year
  function getChronologicalY(person: LineageData): number {
    if (person.birthYear !== null && person.birthYear !== undefined) {
      // Scale AM years to pixels (start from year 0 = y 0)
      return person.birthYear * 0.5; // Adjust scale factor as needed
    }

    // If no birth year, try to estimate based on parents
    if (person.parents.length > 0) {
      const parent = peopleMap.get(person.parents[0]);
      if (parent && parent.birthYear !== null && parent.birthYear !== undefined) {
        return parent.birthYear * 0.5 + VERTICAL_SPACING; // Place below parent
      }
    }

    // Default fallback
    return 1000;
  }

  // Helper function to position a family unit (person + partners)
  function positionFamilyUnit(personId: string, baseX: number, baseY: number): {
    width: number;
    positions: Array<{ id: string; x: number; y: number }>
  } {
    const person = peopleMap.get(personId);
    if (!person || positionedPeople.has(personId)) {
      return {width: 0, positions: []};
    }

    const positions: Array<{ id: string; x: number; y: number }> = [];

    // Get all partners
    const partners = person.partners.map(partnerId => peopleMap.get(partnerId)).filter(Boolean) as LineageData[];

    // Calculate total width needed for the family unit
    const totalPeople = 1 + partners.length;
    const familyWidth = (totalPeople * NODE_WIDTH) + ((totalPeople - 1) * PARTNER_SPACING);

    // Find available position for the family unit
    const availablePos = findNextAvailablePosition(baseX, baseY);
    let currentX = availablePos.x;

    // Position the main person
    positions.push({id: personId, x: currentX, y: availablePos.y});
    occupyPosition(currentX, availablePos.y);
    currentX += NODE_WIDTH + PARTNER_SPACING;

    // Position partners next to the main person
    partners.forEach(partner => {
      if (!positionedPeople.has(partner.id)) {
        positions.push({id: partner.id, x: currentX, y: availablePos.y});
        occupyPosition(currentX, availablePos.y);
        currentX += NODE_WIDTH + PARTNER_SPACING;
      }
    });

    return {width: familyWidth, positions};
  }

  // Helper function to position children below their parents
  function positionChildren(parentIds: string[], parentY: number): void {
    // Get all children from all parents in this family unit
    const allChildren = new Set<string>();
    parentIds.forEach(parentId => {
      const parent = peopleMap.get(parentId);
      if (parent) {
        parent.children.forEach(childId => allChildren.add(childId));
      }
    });

    if (allChildren.size === 0) return;

    // Sort children by birth year for chronological order
    const childrenArray = Array.from(allChildren)
      .map(childId => peopleMap.get(childId))
      .filter(Boolean) as LineageData[];

    childrenArray.sort((a, b) => {
      const aYear = a.birthYear ?? 9999;
      const bYear = b.birthYear ?? 9999;
      return aYear - bYear;
    });

    // Position children below parents
    const childrenY = parentY + NODE_HEIGHT + VERTICAL_SPACING;
    let currentX = 0;

    childrenArray.forEach(child => {
      if (!positionedPeople.has(child.id)) {
        // Use chronological Y position, but ensure it's below parents
        const chronologicalY = Math.max(getChronologicalY(child), childrenY);

        // Position this child and their family unit
        const familyUnit = positionFamilyUnit(child.id, currentX, chronologicalY);

        // Update positions for all people in this family unit
        familyUnit.positions.forEach(pos => {
          positionedPeople.set(pos.id, {
            person: peopleMap.get(pos.id)!,
            x: pos.x,
            y: pos.y,
            processed: false
          });
        });

        // Move to next position for siblings
        currentX = Math.max(currentX, familyUnit.positions[familyUnit.positions.length - 1].x + NODE_WIDTH + HORIZONTAL_SPACING);

        // Recursively position their children
        positionChildren(familyUnit.positions.map(p => p.id), chronologicalY);
      }
    });
  }

  // Start with root people (those with no parents)
  const rootPeople = data.filter(person => person.parents.length === 0);

  // Sort root people by birth year
  rootPeople.sort((a, b) => {
    const aYear = a.birthYear ?? 0;
    const bYear = b.birthYear ?? 0;
    return aYear - bYear;
  });

  // Position root people and their descendants
  let rootX = 0;
  rootPeople.forEach(rootPerson => {
    if (!positionedPeople.has(rootPerson.id)) {
      const rootY = getChronologicalY(rootPerson);

      // Position this root person and their family unit
      const familyUnit = positionFamilyUnit(rootPerson.id, rootX, rootY);

      // Update positions
      familyUnit.positions.forEach(pos => {
        positionedPeople.set(pos.id, {
          person: peopleMap.get(pos.id)!,
          x: pos.x,
          y: pos.y,
          processed: false
        });
      });

      // Position their children
      positionChildren(familyUnit.positions.map(p => p.id), rootY);

      // Move to next position for next root family
      rootX = Math.max(rootX, familyUnit.positions[familyUnit.positions.length - 1].x + NODE_WIDTH + HORIZONTAL_SPACING * 2);
    }
  });

  // Handle any remaining unpositioned people
  data.forEach(person => {
    if (!positionedPeople.has(person.id)) {
      const y = getChronologicalY(person);
      const availablePos = findNextAvailablePosition(rootX, y);

      positionedPeople.set(person.id, {
        person,
        x: availablePos.x,
        y: availablePos.y,
        processed: false
      });

      occupyPosition(availablePos.x, availablePos.y);
      rootX += NODE_WIDTH + HORIZONTAL_SPACING;
    }
  });

  // Create nodes from positioned people
  positionedPeople.forEach((positionedPerson) => {
    const person = positionedPerson.person;

    // Find parent data (first parent for backward compatibility)
    const parentData = person.parents.length > 0 ? peopleMap.get(person.parents[0]) : null;

    const personNodeData: PersonNodeData = {
      ...person,
      parent: parentData,
      selected: false,
      highlighted: false,
      generation: 0
    };

    const node: PersonNode = {
      id: person.id,
      type: 'personNode',
      position: {x: positionedPerson.x, y: positionedPerson.y},
      data: personNodeData,
      width: NODE_WIDTH,
      height: NODE_HEIGHT
    };

    nodes.push(node);
  });

  // Create edges between parents and children
  data.forEach(person => {
    person.children.forEach(childId => {
      const childExists = peopleMap.has(childId);
      if (childExists) {
        const edge: Edge = {
          id: `${person.id}-${childId}`,
          source: person.id,
          target: childId,
          style: {stroke: '#565267', strokeWidth: 2}
        };
        edges.push(edge);
      }
    });
  });

  return {nodes, edges};
}
