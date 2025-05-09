// This file's content (mockSurveyDetailsMap and getMockSurveyDetail)
// has been moved to src/types/survey.ts as per user request.

// You can leave this file empty or remove it if it's no longer needed.
// For now, to avoid potential issues if other parts of the system still expect this file to export something,
// we can export an empty map.
export const mockSurveyDetailsMap: Map<string, any> = new Map();

export const getMockSurveyDetail = (id: string): any | undefined => {
  return undefined; // Or return mockSurveyDetailsMap.get(id) if you keep the empty map
};
