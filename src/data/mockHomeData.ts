import type { ActivityRecommendation, ChildProfilePreview } from '../types/activity';

export const mockChildren: ChildProfilePreview[] = [
  { id: 'adam', name: 'Adam', interests: ['Aircraft', 'Space', 'Football'] },
  { id: 'sara', name: 'Sara', interests: ['Animals', 'Art', 'Nature'] },
];

export const mockRecommendations: Record<string, ActivityRecommendation[]> = {
  adam: [
    { id: 'airport-spotting', title: 'Make an aircraft spotting morning', description: 'Find an appropriate public viewing spot and turn plane-spotting into a shared little adventure.', category: 'OUTDOOR IDEA', emoji: '✈️', visual: 'sky', format: 'Outdoors', ageGuidance: 'Family activity', reason: 'Aircraft', matchScore: 96, sample: true },
    { id: 'paper-plane-lab', title: 'Build a paper-plane flight lab', description: 'Fold a few different designs, test how they fly, and see which one travels furthest.', category: 'MAKE & CREATE', emoji: '🛩️', visual: 'studio', format: 'At home', ageGuidance: 'Family activity', reason: 'Aircraft · Science', matchScore: 92, sample: true },
    { id: 'flight-map', title: 'Trace a journey across the map', description: 'Choose a place together and follow a flight route on a globe or map.', category: 'CURIOUS MINDS', emoji: '🌍', visual: 'cosmos', format: 'At home', ageGuidance: 'Family activity', reason: 'Aircraft · Geography', matchScore: 88, sample: true },
  ],
  sara: [
    { id: 'nature-sketchbook', title: 'Start a little nature sketchbook', description: 'Head outdoors, notice small details, and sketch a few things you discover together.', category: 'MAKE & CREATE', emoji: '🎨', visual: 'garden', format: 'Outdoors', ageGuidance: 'Family activity', reason: 'Art · Nature', matchScore: 95, sample: true },
    { id: 'animal-story', title: 'Make up an animal rescue story', description: 'Invent a kind character, draw a map, and decide how they help an animal friend.', category: 'IMAGINE & PLAY', emoji: '🐾', visual: 'studio', format: 'At home', ageGuidance: 'Family activity', reason: 'Animals · Art', matchScore: 91, sample: true },
    { id: 'bird-watch', title: 'Take a slow bird-watching walk', description: 'Pick a quiet route and see how many different birds you can spot along the way.', category: 'OUTDOOR IDEA', emoji: '🐦', visual: 'garden', format: 'Outdoors', ageGuidance: 'Family activity', reason: 'Animals · Nature', matchScore: 87, sample: true },
  ],
};

export const weekendIdeas: ActivityRecommendation[] = [
  { id: 'weekend-aviation', title: 'Explore aircraft together', description: 'Look for an official family visit or public viewing option in your area before you go.', category: 'FAMILY OUTING IDEA', emoji: '🛫', visual: 'sky', format: 'Check locally', ageGuidance: 'Family activity', reason: 'A shared adventure', matchScore: 94, sample: true },
  { id: 'weekend-build', title: 'Build a cardboard cockpit', description: 'Use a box, paper controls, and plenty of imagination to make a plane for a living-room adventure.', category: 'AT-HOME IDEA', emoji: '📦', visual: 'studio', format: 'At home', ageGuidance: 'Family activity', reason: 'Make something together', matchScore: 89, sample: true },
  { id: 'weekend-sky', title: 'Watch the sky change', description: 'Find a comfortable outdoor spot and spend a little time noticing clouds, birds, and aircraft.', category: 'OUTDOOR IDEA', emoji: '☁️', visual: 'cosmos', format: 'Outdoors', ageGuidance: 'Family activity', reason: 'A slower afternoon', matchScore: 85, sample: true },
];

export const newIdeas: ActivityRecommendation[] = [
  { id: 'new-flight-log', title: 'Keep a family flight log', description: 'Sketch aircraft you notice and make up names or stories for each design.', category: 'TRY SOMETHING NEW', emoji: '📓', visual: 'cosmos', format: 'At home', ageGuidance: 'Family activity', reason: 'A creative twist', matchScore: 90, sample: true },
  { id: 'new-glider', title: 'Make a gentle paper glider', description: 'Try a new fold, then adjust one small detail at a time and compare the flights.', category: 'TRY SOMETHING NEW', emoji: '🪽', visual: 'sky', format: 'At home', ageGuidance: 'Family activity', reason: 'Build and experiment', matchScore: 86, sample: true },
  { id: 'new-clouds', title: 'Invent stories in the clouds', description: 'Look up together and let each cloud shape become a character in a shared story.', category: 'TRY SOMETHING NEW', emoji: '🌤️', visual: 'garden', format: 'Outdoors', ageGuidance: 'Family activity', reason: 'Notice something new', matchScore: 82, sample: true },
];
