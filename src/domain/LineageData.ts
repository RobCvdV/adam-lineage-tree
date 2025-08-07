import AdamLineage from '../data-source/lineage.json';

export const  lineageData = AdamLineage;

// make a type for lineage data that is a subset of the AdamLineage type
export type LineageData = {
  name: string;
  birthYear?: number | null;
  ageAtDeath?: number | null;
  partner?: string | null;
  children?: LineageData[];
  [key: string]: any; // allow additional properties
};
  

