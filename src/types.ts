export type RiskLevel = 'SAFE' | 'AT_RISK' | 'CRITICAL' | 'IMPOSSIBLE';

export interface Subtask {
  id: string;
  name: string;
  description: string;
  estimated_minutes: number;
  personalized_minutes?: number;
  dependencies: string[];
  completion_criteria: string;
  is_completed: boolean;
  actual_minutes_logged?: number;
  scheduled_date?: string; // YYYY-MM-DD
  scheduled_start?: string; // HH:mm
  scheduled_end?: string; // HH:mm
  allocation_date?: string; // YYYY-MM-DD
}

export interface Task {
  id: string;
  userId: string;
  task_name: string;
  subject: string;
  deadline: string; // ISO string or YYYY-MM-DDTHH:mm
  description: string;
  reference?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  risk_status: RiskLevel;
  tools_and_materials: string[];
  requirements: string[];
  subtasks: Subtask[];
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  max_session_min: number;
  break_min: number;
}

export interface SleepSchedule {
  sleep_start: string; // "22:00"
  sleep_end: string; // "05:30"
}

export interface SchoolSchedule {
  school_start: string; // "07:00"
  school_end: string; // "15:00"
  active_days?: number[]; // 0-6 (default [1,2,3,4,5])
}

export interface RoutineActivity {
  id: string;
  name: string;
  start_time: string; // "16:00"
  end_time: string; // "17:30"
  days: number[]; // 0-6 (Sunday to Saturday)
  constraint_type?: 'HARD' | 'FLEXIBLE';
}

export interface OneTimeEvent {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  start_time: string; // "18:30"
  end_time: string; // "20:00"
  constraint_type: 'HARD' | 'FLEXIBLE';
}

export interface UserProfile {
  id: string; // uid
  name: string;
  email: string;
  school_name: string;
  sleep_schedule: SleepSchedule;
  school_schedule: SchoolSchedule;
  routine_activities: RoutineActivity[];
  one_time_events: OneTimeEvent[];
  preferences: UserPreferences;
  personal_factor: number; // e.g. 1.0, 1.25
  total_ai_estimated_minutes: number;
  total_actual_minutes: number;
}

export interface ScheduleBlock {
  id: string;
  taskId: string;
  taskName: string;
  subtaskId: string;
  subtaskName: string;
  subject: string;
  date: string; // YYYY-MM-DD
  startMinute: number; // 0 - 1439
  endMinute: number; // 0 - 1439
  startTimeFormatted: string; // HH:mm
  endTimeFormatted: string; // HH:mm
  durationMinutes: number;
  isCompleted: boolean;
  type: 'TASK' | 'SCHOOL' | 'SLEEP' | 'ROUTINE' | 'EVENT';
  isOffset?: boolean;
  offsetDirection?: 'left' | 'right';
  riskStatus?: RiskLevel;
}

export interface DecompositionResult {
  task_summary: string;
  requirements: string[];
  subtasks: {
    id: string;
    name: string;
    description: string;
    estimated_minutes: number;
    dependencies: string[];
    completion_criteria: string;
    scheduled_date?: string; // YYYY-MM-DD
    scheduled_start?: string; // HH:mm
    scheduled_end?: string; // HH:mm
  }[];
  tools_and_materials: string[];
}

export interface FilterState {
  subject: string; // 'ALL' or specific subject
  risk: string; // 'ALL' or RiskLevel
  search: string;
}

