import {
  Survey,
  SurveyVersion,
  Question,
  QuestionVersion,
  QuestionType,
  QuestionDifficulty,
  // SkillLevel, <-- Remove this line
} from "@/types/survey";
import { mockSurveys, updateMockSurvey } from "./mockSurveys"; // Ensure this path is correct

interface MockSurveyDetailsData {
  [surveyId: string]: {
    base: Survey;
    versions: SurveyVersion[];
  };
}

// Initialize with some question data for surveys
const generateMockSurveyQuestions = (
  count: number,
  surveyId: string,
  versionNumber: number
): QuestionVersion[] => {
  const questions: QuestionVersion[] = [];
  for (let i = 1; i <= count; i++) {
    const questionId = `sq-${surveyId}-v${versionNumber}-q${i}`;
    questions.push({
      id: `sqv-${surveyId}-v${versionNumber}-q${i}`,
      questionId: questionId,
      versionNumber: 1, // Initial version of the question itself
      questionData: {
        id: questionId,
        text: `サーベイ設問 ${i} (ID: ${questionId}) - このサーベイバージョン ${versionNumber} のためのサンプル設問です。詳細な内容はここに記述されます。`,
        type: (
          ["multiple-choice", "single-choice", "free-text"] as QuestionType[]
        )[i % 3],
        options:
          i % 3 !== 2
            ? [`選択肢A`, `選択肢B`, `選択肢C`, `選択肢D`]
            : undefined,
        correctAnswer: i % 3 !== 2 ? `選択肢A` : undefined, // Surveys might not have "correct" answers
        points: i % 3 !== 2 ? 10 : 0, // Points might not apply
        category: `サーベイカテゴリ ${String.fromCharCode(65 + (i % 3))}`,
        difficulty: (["easy", "medium", "hard"] as QuestionDifficulty[])[i % 3],
      },
      createdAt: new Date(`2024-01-${10 + i}T10:00:00Z`),
      createdBy: "system",
      status: "published",
      changeLog: "初版",
    });
  }
  return questions;
};

const mockSurveyDetailsData: MockSurveyDetailsData = mockSurveys.reduce(
  (acc, survey) => {
    const versions: SurveyVersion[] = [
      {
        id: `${survey.id}-v2`,
        surveyId: survey.id,
        versionNumber: 2,
        description:
          "最新版サーベイ。いくつかの設問を更新し、表現を改善しました。",
        questions: generateMockSurveyQuestions(
          survey.questionsCount,
          survey.id,
          2
        ),
        questionCount: survey.questionsCount,
        createdAt: new Date(
          survey.updatedAt.getTime() - 2 * 24 * 60 * 60 * 1000
        ), // 2 days before survey update
        createdBy: "admin-user-02",
        status: "published",
        publishedAt: new Date(
          survey.updatedAt.getTime() - 1 * 24 * 60 * 60 * 1000
        ), // 1 day before survey update
      },
      {
        id: `${survey.id}-v1`,
        surveyId: survey.id,
        versionNumber: 1,
        description: "サーベイ初版。基本的な設問セットを含みます。",
        questions: generateMockSurveyQuestions(
          survey.questionsCount - (survey.questionsCount > 2 ? 2 : 0),
          survey.id,
          1
        ), // Fewer questions for v1
        questionCount:
          survey.questionsCount - (survey.questionsCount > 2 ? 2 : 0),
        createdAt: new Date(
          survey.createdAt.getTime() - 5 * 24 * 60 * 60 * 1000
        ), // 5 days before survey creation
        createdBy: "admin-user-01",
        status: "archived",
        publishedAt: new Date(
          survey.createdAt.getTime() - 4 * 24 * 60 * 60 * 1000
        ),
      },
    ];
    acc[survey.id] = {
      base: survey,
      versions: versions.sort((a, b) => b.versionNumber - a.versionNumber),
    };
    return acc;
  },
  {} as MockSurveyDetailsData
);

export const getSurveyWithVersions = (
  surveyId: string
): (Survey & { versions: SurveyVersion[] }) | null => {
  const detail = mockSurveyDetailsData[surveyId];
  if (!detail) return null;
  // Ensure base survey info is up-to-date from mockSurveys
  const currentBaseSurvey = mockSurveys.find((s) => s.id === surveyId);
  if (!currentBaseSurvey) return null;

  return {
    ...currentBaseSurvey,
    versions: detail.versions
      .map((v) => ({
        ...v,
        // ensure questionCount is accurate if questions array is the source of truth
        questionCount: v.questions.length,
      }))
      .sort((a, b) => b.versionNumber - a.versionNumber),
  };
};

export const getSurveyVersionDetails = (
  surveyId: string,
  versionId: string
): SurveyVersion | null => {
  const detail = mockSurveyDetailsData[surveyId];
  if (!detail) return null;
  const version = detail.versions.find((v) => v.id === versionId);
  return version || null;
};

export const addMockSurveyVersion = (
  surveyId: string,
  description: string
): SurveyVersion | null => {
  const surveyDetail = mockSurveyDetailsData[surveyId];
  if (!surveyDetail) return null;

  const latestVersion = surveyDetail.versions.sort(
    (a, b) => b.versionNumber - a.versionNumber
  )[0];
  const newVersionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1;

  const newVersion: SurveyVersion = {
    id: `${surveyId}-v${newVersionNumber}`,
    surveyId: surveyId,
    versionNumber: newVersionNumber,
    description: description || `サーベイバージョン ${newVersionNumber} の説明`,
    questions: latestVersion
      ? JSON.parse(JSON.stringify(latestVersion.questions))
      : [], // Deep copy questions from latest version or start fresh
    questionCount: latestVersion ? latestVersion.questions.length : 0,
    createdAt: new Date(),
    createdBy: "current-user", // Placeholder
    status: "draft",
  };

  surveyDetail.versions.push(newVersion);
  surveyDetail.versions.sort((a, b) => b.versionNumber - a.versionNumber);

  // Update the main survey's updatedAt timestamp
  updateMockSurvey(surveyId, {
    updatedAt: new Date(),
    targetSkillLevel: surveyDetail.base.targetSkillLevel,
  });

  return newVersion;
};

export const getQuestionVersionDetails = (
  questionVersionId: string
): QuestionVersion | null => {
  for (const surveyId in mockSurveyDetailsData) {
    const surveyDetail = mockSurveyDetailsData[surveyId];
    for (const surveyVersion of surveyDetail.versions) {
      const foundQuestion = surveyVersion.questions.find(
        (q) => q.id === questionVersionId
      );
      if (foundQuestion) {
        return foundQuestion;
      }
    }
  }
  return null;
};

export const updateMockQuestionVersionContent = (
  questionVersionId: string,
  newText: string,
  newOptions?: string[],
  newCorrectAnswer?: string | string[]
): QuestionVersion | null => {
  for (const surveyId in mockSurveyDetailsData) {
    const surveyDetail = mockSurveyDetailsData[surveyId];
    for (const surveyVersion of surveyDetail.versions) {
      const questionIndex = surveyVersion.questions.findIndex(
        (q) => q.id === questionVersionId
      );
      if (questionIndex !== -1) {
        const originalQuestionVersion = surveyVersion.questions[questionIndex];
        const updatedQuestionData: Question = {
          ...originalQuestionVersion.questionData,
          text: newText,
          options:
            newOptions !== undefined
              ? newOptions
              : originalQuestionVersion.questionData.options,
          correctAnswer:
            newCorrectAnswer !== undefined
              ? newCorrectAnswer
              : originalQuestionVersion.questionData.correctAnswer,
        };

        const updatedQuestionVersion: QuestionVersion = {
          ...originalQuestionVersion,
          questionData: updatedQuestionData,
          // Potentially update version number of the question itself if significant change
          // For now, just updating content within the same QuestionVersion
        };
        surveyVersion.questions[questionIndex] = updatedQuestionVersion;

        // Update the parent survey's updatedAt timestamp
        updateMockSurvey(surveyId, {
          updatedAt: new Date(),
          targetSkillLevel: surveyDetail.base.targetSkillLevel,
        });
        return updatedQuestionVersion;
      }
    }
  }
  return null;
};

// Example usage:
// updateMockSurveyStatus('survey-1', 'archived');
// updateMockSurvey('survey-1', { title: 'New Survey Title', targetSkillLevel: ['junior'] }); // Provide targetSkillLevel
// addQuestionToSurvey('survey-1', newQuestion);
// updateQuestionInSurvey('survey-1', 'q1', { text: 'Updated Question Text' });
// removeQuestionFromSurvey('survey-1', 'q1');

// Simulating an update to a survey
const surveyIdToUpdate = mockSurveys[0].id;
updateMockSurvey(surveyIdToUpdate, {
  updatedAt: new Date(),
  targetSkillLevel: mockSurveys[0].targetSkillLevel,
});

// Simulating an update to another survey
if (mockSurveys.length > 1) {
  const anotherSurveyId = mockSurveys[1].id;
  updateMockSurvey(anotherSurveyId, {
    updatedAt: new Date(),
    targetSkillLevel: mockSurveys[1].targetSkillLevel,
  });
}
