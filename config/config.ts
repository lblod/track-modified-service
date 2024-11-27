import { Changeset } from '../types';

export const interestingTypes = [
  'http://www.w3.org/2004/02/skos/core#Concept',
];

export const filterModifiedSubjects = '';

export async function filterDeltas(changeSets: Changeset[]) {
  // by default, let's not be total asses and if someone would like to set their own modified, let them
  const modifiedPred = 'http://purl.org/dc/terms/modified';
  const subjectsWithModified = new Set();

  const trackModifiedSubjects = (quad) => {
    if (quad.predicate.value === modifiedPred) {
      subjectsWithModified.add(quad.subject.value);
    }
  };
  changeSets.map((changeSet) => {
    changeSet.inserts.forEach(trackModifiedSubjects);
    changeSet.deletes.forEach(trackModifiedSubjects);
  });

  const isGoodQuad = (quad) => !subjectsWithModified.has(quad.subject.value);
  return changeSets.map((changeSet) => {
    return {
      inserts: changeSet.inserts.filter(isGoodQuad),
      deletes: changeSet.deletes.filter(isGoodQuad),
    };
  });
}
