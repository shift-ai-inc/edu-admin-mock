import { Assessment, AssessmentVersion, QuestionVersion, Question, QuestionDifficulty } from '@/types/assessment';
import { mockAssessments } from './mockAssessments';

// --- Mock Questions ---
const mockQuestionsDb: Record<string, Question> = {
  'q-react-1': { 
    id: 'q-react-1', 
    text: 'Reactの主要な特徴は何ですか？（複数選択可）', 
    type: 'multiple-choice', 
    options: ['仮想DOM', '双方向データバインディング', 'コンポーネントベース', 'サーバーサイドレンダリング'], 
    correctAnswer: ['仮想DOM', 'コンポーネントベース'],
    points: 10,
    category: 'React基礎',
    difficulty: 'easy',
  },
  'q-react-2': { 
    id: 'q-react-2', 
    text: 'useStateフックの目的を簡潔に説明してください。', 
    type: 'free-text',
    points: 15,
    category: 'React Hooks',
    difficulty: 'medium',
  },
  'q-react-3': { 
    id: 'q-react-3', 
    text: 'useEffectフックの第二引数に空の配列を渡すと、副作用関数はいつ実行されますか？', 
    type: 'single-choice', 
    options: ['毎レンダリング実行', '初回レンダリング時のみ実行', '依存関係変更時のみ実行'], 
    correctAnswer: '初回レンダリング時のみ実行',
    points: 10,
    category: 'React Hooks',
    difficulty: 'easy',
  },
  'q-js-algo-1': { 
    id: 'q-js-algo-1', 
    text: '与えられた数値配列を逆順にするJavaScriptの関数を記述してください。', 
    type: 'code',
    points: 20,
    category: 'JavaScriptアルゴリズム',
    difficulty: 'medium',
  },
  'q-js-algo-2': { 
    id: 'q-js-algo-2', 
    text: 'フィボナッチ数列のn番目の値を返す再帰関数を記述してください。', 
    type: 'code',
    points: 25,
    category: 'JavaScriptアルゴリズム',
    difficulty: 'hard',
  },
};

// --- Mock Question Versions ---
const mockQuestionVersionsDb: Record<string, QuestionVersion[]> = {
  'q-react-1': [
    { id: 'qv-react-1-v1', questionId: 'q-react-1', versionNumber: 1, questionData: mockQuestionsDb['q-react-1'], createdAt: new Date('2023-01-10T10:00:00Z'), createdBy: 'admin1', status: 'published', changeLog: '初期バージョン作成' },
    { 
      id: 'qv-react-1-v2', 
      questionId: 'q-react-1', 
      versionNumber: 2, 
      questionData: { ...mockQuestionsDb['q-react-1'], text: 'Reactの主要な特徴を2つ選択してください。', options: ['仮想DOM', '双方向データバインディング', 'コンポーネントベースアーキテクチャ', 'サーバーサイドレンダリング'], points: 12 }, 
      createdAt: new Date('2023-01-12T11:00:00Z'), 
      createdBy: 'admin2', 
      status: 'published', 
      changeLog: '設問文修正、選択肢「コンポーネントベース」を「コンポーネントベースアーキテクチャ」に修正、配点を12に変更' 
    },
  ],
  'q-react-2': [
    { id: 'qv-react-2-v1', questionId: 'q-react-2', versionNumber: 1, questionData: mockQuestionsDb['q-react-2'], createdAt: new Date('2023-01-10T10:05:00Z'), createdBy: 'admin1', status: 'published', changeLog: '初期バージョン作成' },
  ],
  'q-react-3': [
    { id: 'qv-react-3-v1', questionId: 'q-react-3', versionNumber: 1, questionData: mockQuestionsDb['q-react-3'], createdAt: new Date('2023-01-10T10:10:00Z'), createdBy: 'admin1', status: 'published', changeLog: '初期バージョン作成' },
  ],
  'q-js-algo-1': [
    { id: 'qv-js-algo-1-v1', questionId: 'q-js-algo-1', versionNumber: 1, questionData: mockQuestionsDb['q-js-algo-1'], createdAt: new Date('2023-02-05T14:00:00Z'), createdBy: 'admin3', status: 'published', changeLog: '初期バージョン作成' },
  ],
  'q-js-algo-2': [
    { id: 'qv-js-algo-2-v1', questionId: 'q-js-algo-2', versionNumber: 1, questionData: mockQuestionsDb['q-js-algo-2'], createdAt: new Date('2023-02-05T14:05:00Z'), createdBy: 'admin3', status: 'published', changeLog: '初期バージョン作成' },
  ],
};


// --- Mock Assessment Versions ---
export const mockAssessmentVersions: Record<string, AssessmentVersion[]> = {
  'asm-001': [ // React基礎理解度テスト
    {
      id: 'asmv-001-v1',
      assessmentId: 'asm-001',
      versionNumber: 1,
      description: '初期リリースバージョン。基本的なReactの概念をカバー。',
      questions: [mockQuestionVersionsDb['q-react-1'][0], mockQuestionVersionsDb['q-react-2'][0]],
      questionCount: 2,
      createdAt: new Date('2023-01-15T09:00:00Z'),
      createdBy: 'admin1',
      status: 'archived',
      publishedAt: new Date('2023-01-15T09:00:00Z'),
    },
    {
      id: 'asmv-001-v2',
      assessmentId: 'asm-001',
      versionNumber: 2,
      description: '質問内容を更新し、useEffectに関する質問を追加。',
      questions: [mockQuestionVersionsDb['q-react-1'][1], mockQuestionVersionsDb['q-react-2'][0], mockQuestionVersionsDb['q-react-3'][0]],
      questionCount: 3,
      createdAt: new Date('2023-01-20T14:30:00Z'),
      createdBy: 'admin2',
      status: 'published',
      publishedAt: new Date('2023-01-20T15:00:00Z'),
    },
  ],
  'asm-002': [ // JavaScriptアルゴリズムチャレンジ
    {
      id: 'asmv-002-v1',
      assessmentId: 'asm-002',
      versionNumber: 1,
      description: 'アルゴリズム問題の初期セット。',
      questions: [mockQuestionVersionsDb['q-js-algo-1'][0], mockQuestionVersionsDb['q-js-algo-2'][0]],
      questionCount: 2,
      createdAt: new Date('2023-02-10T11:00:00Z'),
      createdBy: 'admin3',
      status: 'published',
      publishedAt: new Date('2023-02-10T11:00:00Z'),
    },
  ],
  'asm-003': [ // 空のバージョンのアセスメント（テスト用）
    {
      id: 'asmv-003-v1',
      assessmentId: 'asm-003',
      versionNumber: 1,
      description: '設問がまだないバージョン。',
      questions: [],
      questionCount: 0,
      createdAt: new Date('2023-03-01T10:00:00Z'),
      createdBy: 'admin4',
      status: 'draft',
    }
  ]
};

// Function to get full assessment details including versions
export const getAssessmentWithVersions = (assessmentId: string): (Assessment & { versions: AssessmentVersion[] }) | undefined => {
  const baseAssessment = mockAssessments.find(asm => asm.id === assessmentId);
  if (!baseAssessment) return undefined;

  return {
    ...baseAssessment,
    versions: mockAssessmentVersions[assessmentId] ? [...mockAssessmentVersions[assessmentId]].sort((a, b) => b.versionNumber - a.versionNumber) : [],
  };
};

// Function to get a specific assessment version with its full question version details
export const getAssessmentVersionDetails = (assessmentId: string, versionId: string): AssessmentVersion | undefined => {
  const versions = mockAssessmentVersions[assessmentId];
  if (!versions) return undefined;
  const version = versions.find(v => v.id === versionId);
  return version;
};

// Function to get a specific question version by its ID
export const getQuestionVersionById = (questionVersionId: string): QuestionVersion | undefined => {
  for (const questionId in mockQuestionVersionsDb) {
    const versions = mockQuestionVersionsDb[questionId];
    const foundVersion = versions.find(qv => qv.id === questionVersionId);
    if (foundVersion) {
      return { ...foundVersion }; // Return a copy
    }
  }
  return undefined;
};

// Function to add a new assessment version
export const addMockAssessmentVersion = (assessmentId: string, description: string): AssessmentVersion | null => {
  if (!mockAssessmentVersions[assessmentId]) {
    mockAssessmentVersions[assessmentId] = [];
  }

  const existingVersions = mockAssessmentVersions[assessmentId];
  const latestVersionNumber = existingVersions.length > 0 
    ? Math.max(...existingVersions.map(v => v.versionNumber)) 
    : 0;
  const newVersionNumber = latestVersionNumber + 1;

  const newVersion: AssessmentVersion = {
    id: `asmv-${assessmentId}-v${newVersionNumber}-${Date.now()}`, // Unique ID
    assessmentId: assessmentId,
    versionNumber: newVersionNumber,
    description: description,
    questions: [], // New versions start with no questions
    questionCount: 0,
    createdAt: new Date(),
    createdBy: 'current-user-mock', // Mock user, replace with actual user if available
    status: 'draft',
  };

  mockAssessmentVersions[assessmentId].push(newVersion);
  
  const assessmentIndex = mockAssessments.findIndex(a => a.id === assessmentId);
  if (assessmentIndex !== -1) {
    mockAssessments[assessmentIndex].updatedAt = new Date();
  }
  
  return { ...newVersion }; // Return a copy
};

// Function to update a specific question version
export const updateMockQuestionVersion = (
  questionVersionId: string,
  newData: {
    questionData: {
      text: string;
      category: string;
      points: number;
      difficulty: QuestionDifficulty;
    };
    changeLog: string;
  }
): QuestionVersion | null => {
  for (const qId in mockQuestionVersionsDb) {
    const versions = mockQuestionVersionsDb[qId];
    const versionIndex = versions.findIndex(qv => qv.id === questionVersionId);
    if (versionIndex !== -1) {
      const originalVersion = versions[versionIndex];
      
      const updatedQuestionData = {
        ...originalVersion.questionData,
        text: newData.questionData.text,
        category: newData.questionData.category,
        points: newData.questionData.points,
        difficulty: newData.questionData.difficulty,
      };
      
      const updatedVersion: QuestionVersion = {
        ...originalVersion,
        questionData: updatedQuestionData,
        changeLog: newData.changeLog,
        // Consider adding/updating an `updatedAt` field on QuestionVersion if needed
        // For now, `createdAt` remains the creation time of this version,
        // and `changeLog` tracks modifications to this specific version.
      };
      
      versions[versionIndex] = updatedVersion;

      // Also update any AssessmentVersion that includes this QuestionVersion
      Object.values(mockAssessmentVersions).forEach(assessmentVersionList => {
        assessmentVersionList.forEach(av => {
          const qvIndex = av.questions.findIndex(q => q.id === questionVersionId);
          if (qvIndex !== -1) {
            av.questions[qvIndex] = { ...updatedVersion }; // Update with a copy
          }
        });
      });
      
      return { ...updatedVersion }; // Return a copy
    }
  }
  console.error(`QuestionVersion with id ${questionVersionId} not found for update.`);
  return null;
};
