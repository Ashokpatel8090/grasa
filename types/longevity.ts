// src/types/longevity.ts

export type Screen = 'intro' | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'q8' | 'calc';

export type QuestionOption = {
  index: number;
  icon: string;
  label: string;
  sub_label: string | null;
  score: number;
};

export type QuestionField = {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  min?: number;
  max?: number;
  required: boolean;
  options?: { value: string; label: string }[];
};

export type Question = {
  id: string;
  order: number;
  category: string;
  type: 'input' | 'single_select' | 'multi_select';
  text: string;
  sub_text: string | null;
  fields?: QuestionField[];
  options?: QuestionOption[];
};

export type QuizMeta = {
  title: string;
  description: string;
  total_questions: number;
  estimated_duration_minutes: number;
  target_population: string;
};

export type ApiFlag = {
  id: string;
  icon: string;
  title: string;
  severity: string;
  tag: string;
  desc?: string;
};

export type ApiResultData = {
  calendar_age: number;
  biological_age: number;
  longevity_score: number;
  bio_delta: number;
  result_band: string;
  result_message: string;
  flags: ApiFlag[];
};

// We added 'payload' here so the result page can submit the WhatsApp number later
export type StoredResult = {
  result: ApiResultData;
  isUnlocked: boolean;
  age: number | null;
  scores: Record<string, number>;
  payload: any; 
  timestamp: number;
};