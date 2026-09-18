import { Task, UserProfile, ScheduleBlock, RiskLevel, Subtask, RoutineActivity, OneTimeEvent } from '../types';

export function formatTimeHM(minuteOfDay: number): string {
  const norm = ((minuteOfDay % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function formatDateIndonesian(dateObj: Date): string {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  const dayName = days[dateObj.getDay()];
  const dayNum = dateObj.getDate();
  const monthName = months[dateObj.getMonth()];
  return `${dayName}, ${dayNum} ${monthName}`;
}

export function getISODateOnly(dateObj: Date): string {
  const y = dateObj.getFullYear();
  const m = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const d = dateObj.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export interface ScheduledTimelineResult {
  blocksForDate: ScheduleBlock[];
  allScheduledTasks: Task[];
  totalActiveTasks: number;
  criticalTasksCount: number;
}

export interface UserScheduleConstraints {
  sleepStart?: string;
  sleepEnd?: string;
  schoolStart?: string;
  schoolEnd?: string;
  activeSchoolDays?: number[];
}

export interface TimeInterval {
  startMs: number;
  endMs: number;
  source: 'sleep' | 'school' | 'routine' | 'event' | 'existing_task';
}

/**
 * Aggregates ALL busy time intervals for a user on a given target date:
 * - Sleep schedule (morning and night)
 * - School hours (if active school day)
 * - Custom routines (Ibadah, Les, Ekskul, etc.)
 * - One-time dadakan events
 * - Existing scheduled subtasks in calendar
 */
export function buildUnifiedBusyIntervals(
  targetDate: Date,
  existingSubtasks: Subtask[] = [],
  routines: RoutineActivity[] = [],
  constraints?: UserScheduleConstraints,
  oneTimeEvents: OneTimeEvent[] = []
): TimeInterval[] {
  const intervals: TimeInterval[] = [];
  const dateStr = getISODateOnly(targetDate);
  const dayOfWeek = targetDate.getDay();

  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  const day = targetDate.getDate();
  const startOfDayMs = new Date(year, month, day, 0, 0, 0, 0).getTime();

  // A. Jam Tidur & Jam Sekolah (Hard Constraints)
  const sleepStartMins = parseTimeToMinutes(constraints?.sleepStart || '22:00');
  const sleepEndMins = parseTimeToMinutes(constraints?.sleepEnd || '05:30');
  const schoolStartMins = parseTimeToMinutes(constraints?.schoolStart || '07:00');
  const schoolEndMins = parseTimeToMinutes(constraints?.schoolEnd || '15:00');

  // Morning sleep (00:00 to sleepEndMins)
  if (sleepEndMins > 0) {
    intervals.push({
      startMs: startOfDayMs,
      endMs: startOfDayMs + sleepEndMins * 60 * 1000,
      source: 'sleep',
    });
  }

  // Night sleep (sleepStartMins to 24:00)
  if (sleepStartMins < 1440) {
    intervals.push({
      startMs: startOfDayMs + sleepStartMins * 60 * 1000,
      endMs: startOfDayMs + 24 * 60 * 60 * 1000,
      source: 'sleep',
    });
  }

  // School Hours (if active school day)
  const activeSchoolDays = constraints?.activeSchoolDays ?? [1, 2, 3, 4, 5];
  if (activeSchoolDays.includes(dayOfWeek) && schoolEndMins > schoolStartMins) {
    intervals.push({
      startMs: startOfDayMs + schoolStartMins * 60 * 1000,
      endMs: startOfDayMs + schoolEndMins * 60 * 1000,
      source: 'school',
    });
  }

  // B. Custom Routines (Ibadah, Les, Ekskul)
  if (routines && routines.length > 0) {
    routines.forEach((routine) => {
      const days = routine.days ?? [0, 1, 2, 3, 4, 5, 6];
      if (days.includes(dayOfWeek)) {
        const startMins = parseTimeToMinutes(routine.start_time);
        const endMins = parseTimeToMinutes(routine.end_time);
        if (endMins > startMins) {
          intervals.push({
            startMs: startOfDayMs + startMins * 60 * 1000,
            endMs: startOfDayMs + endMins * 60 * 1000,
            source: 'routine',
          });
        }
      }
    });
  }

  // C. One-Time Events (Jadwal Dadakan)
  if (oneTimeEvents && oneTimeEvents.length > 0) {
    oneTimeEvents.forEach((ev) => {
      if (ev.date === dateStr) {
        const startMins = parseTimeToMinutes(ev.start_time);
        const endMins = parseTimeToMinutes(ev.end_time);
        if (endMins > startMins) {
          intervals.push({
            startMs: startOfDayMs + startMins * 60 * 1000,
            endMs: startOfDayMs + endMins * 60 * 1000,
            source: 'event',
          });
        }
      }
    });
  }

  // D. Subtasks Already in Calendar for targetDate
  if (existingSubtasks && existingSubtasks.length > 0) {
    existingSubtasks.forEach((st) => {
      const allocDate = st.allocation_date || st.scheduled_date;
      if (allocDate === dateStr && st.scheduled_start && st.scheduled_end) {
        const startMins = parseTimeToMinutes(st.scheduled_start);
        const endMins = parseTimeToMinutes(st.scheduled_end);
        if (endMins > startMins) {
          intervals.push({
            startMs: startOfDayMs + startMins * 60 * 1000,
            endMs: startOfDayMs + endMins * 60 * 1000,
            source: 'existing_task',
          });
        }
      }
    });
  }

  // Sort intervals chronologically
  return intervals.sort((a, b) => a.startMs - b.startMs);
}

export function calculateSchedule(
  tasks: Task[],
  userProfile: UserProfile,
  targetDateInput: string | Date
): ScheduledTimelineResult {
  const targetDateStr = targetDateInput instanceof Date ? getISODateOnly(targetDateInput) : (targetDateInput || getISODateOnly(new Date()));
  const personalFactor = userProfile.personal_factor || 1.0;
  const targetDate = new Date(targetDateStr + 'T00:00:00');

  // Clone tasks and assign personalized durations
  const clonedTasks: Task[] = tasks.map((t) => ({
    ...t,
    subtasks: t.subtasks.map((st) => ({
      ...st,
      personalized_minutes: Math.round((st.estimated_minutes || 30) * personalFactor),
    })),
  }));

  // Sort tasks by urgency (deadline)
  clonedTasks.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  // Define hard constraints busy blocks for targetDate:
  const busyBlocks: ScheduleBlock[] = [];

  const sleepStartMin = parseTimeToMinutes(userProfile.sleep_schedule?.sleep_start || '22:00');
  const sleepEndMin = parseTimeToMinutes(userProfile.sleep_schedule?.sleep_end || '05:30');

  // Morning sleep (00:00 to sleepEndMin)
  if (sleepEndMin > 0) {
    busyBlocks.push({
      id: `sleep_morning_${targetDateStr}`,
      taskId: 'routine_sleep_morning',
      taskName: 'Jam Tidur (Hard Constraint)',
      subtaskId: 'sub_sleep_morning',
      subtaskName: 'Waktu Istirahat Tubuh & Otak',
      subject: 'Rutinitas',
      date: targetDateStr,
      startMinute: 0,
      endMinute: sleepEndMin,
      startTimeFormatted: '00:00',
      endTimeFormatted: formatTimeHM(sleepEndMin),
      durationMinutes: sleepEndMin,
      isCompleted: true,
      type: 'SLEEP',
    });
  }

  // Night sleep (sleepStartMin to 1440)
  if (sleepStartMin < 1440) {
    busyBlocks.push({
      id: `sleep_night_${targetDateStr}`,
      taskId: 'routine_sleep_night',
      taskName: 'Jam Tidur (Hard Constraint)',
      subtaskId: 'sub_sleep_night',
      subtaskName: 'Waktu Istirahat Malam',
      subject: 'Rutinitas',
      date: targetDateStr,
      startMinute: sleepStartMin,
      endMinute: 1440,
      startTimeFormatted: formatTimeHM(sleepStartMin),
      endTimeFormatted: '24:00',
      durationMinutes: 1440 - sleepStartMin,
      isCompleted: false,
      type: 'SLEEP',
    });
  }

  // School Hours (check active_days, default [1,2,3,4,5])
  const dayOfWeek = targetDate.getDay();
  const activeSchoolDays = userProfile.school_schedule?.active_days ?? [1, 2, 3, 4, 5];
  if (activeSchoolDays.includes(dayOfWeek)) {
    const schoolStartMin = parseTimeToMinutes(userProfile.school_schedule?.school_start || '07:00');
    const schoolEndMin = parseTimeToMinutes(userProfile.school_schedule?.school_end || '15:00');
    if (schoolEndMin > schoolStartMin) {
      busyBlocks.push({
        id: `school_${targetDateStr}`,
        taskId: 'routine_school',
        taskName: `Kegiatan Sekolah (${userProfile.school_name || 'SMA'})`,
        subtaskId: 'sub_school',
        subtaskName: 'Pembelajaran Kelas & KBM',
        subject: 'Sekolah',
        date: targetDateStr,
        startMinute: schoolStartMin,
        endMinute: schoolEndMin,
        startTimeFormatted: formatTimeHM(schoolStartMin),
        endTimeFormatted: formatTimeHM(schoolEndMin),
        durationMinutes: schoolEndMin - schoolStartMin,
        isCompleted: false,
        type: 'SCHOOL',
      });
    }
  }

  // Routine Activities (check routine.days)
  if (userProfile.routine_activities) {
    userProfile.routine_activities.forEach((act, idx) => {
      const days = act.days ?? [1, 2, 3, 4, 5, 6, 0];
      if (days.includes(dayOfWeek)) {
        const start = parseTimeToMinutes(act.start_time);
        const end = parseTimeToMinutes(act.end_time);
        if (end > start) {
          busyBlocks.push({
            id: `routine_${act.id}_${targetDateStr}_${idx}`,
            taskId: act.id,
            taskName: act.name,
            subtaskId: `sub_${act.id}`,
            subtaskName: 'Jadwal Tetap / Ekskul',
            subject: 'Ekskul & Les',
            date: targetDateStr,
            startMinute: start,
            endMinute: end,
            startTimeFormatted: formatTimeHM(start),
            endTimeFormatted: formatTimeHM(end),
            durationMinutes: end - start,
            isCompleted: false,
            type: 'ROUTINE',
          });
        }
      }
    });
  }

  // One-Time Jadwal Dadakan events (match targetDateStr)
  if (userProfile.one_time_events) {
    userProfile.one_time_events.forEach((ev, idx) => {
      if (ev.date === targetDateStr) {
        const start = parseTimeToMinutes(ev.start_time);
        const end = parseTimeToMinutes(ev.end_time);
        if (end > start) {
          busyBlocks.push({
            id: `event_${ev.id}_${targetDateStr}_${idx}`,
            taskId: ev.id,
            taskName: ev.name,
            subtaskId: `sub_event_${ev.id}`,
            subtaskName: 'Jadwal Dadakan (One-Time)',
            subject: 'Agenda Khusus',
            date: targetDateStr,
            startMinute: start,
            endMinute: end,
            startTimeFormatted: formatTimeHM(start),
            endTimeFormatted: formatTimeHM(end),
            durationMinutes: end - start,
            isCompleted: false,
            type: 'EVENT',
          });
        }
      }
    });
  }

  // Task Blocks on targetDateStr
  const taskBlocks: ScheduleBlock[] = [];
  clonedTasks.forEach((task) => {
    task.subtasks.forEach((sub) => {
      const allocDate = sub.allocation_date || sub.scheduled_date;
      if (allocDate === targetDateStr) {
        const startStr = sub.scheduled_start || '16:00';
        const endStr = sub.scheduled_end || '17:00';
        const startMin = parseTimeToMinutes(startStr);
        const endMin = parseTimeToMinutes(endStr);
        const duration = endMin > startMin ? endMin - startMin : (sub.personalized_minutes || 30);

        taskBlocks.push({
          id: `taskblock_${task.id}_${sub.id}`,
          taskId: task.id,
          taskName: task.task_name,
          subtaskId: sub.id,
          subtaskName: sub.name,
          subject: task.subject,
          date: targetDateStr,
          startMinute: startMin,
          endMinute: endMin,
          startTimeFormatted: startStr,
          endTimeFormatted: endStr,
          durationMinutes: duration,
          isCompleted: sub.is_completed,
          type: 'TASK',
          riskStatus: task.risk_status,
        });
      }
    });
  });

  // Combine busy blocks and task blocks for the targetDate
  const allBlocksForDate = [...busyBlocks, ...taskBlocks];

  // OVERLAP DETECTION & VISUAL OFFSET:
  for (let i = 0; i < allBlocksForDate.length; i++) {
    for (let j = i + 1; j < allBlocksForDate.length; j++) {
      const a = allBlocksForDate[i];
      const b = allBlocksForDate[j];

      // Check if time ranges intersect
      if (Math.max(a.startMinute, b.startMinute) < Math.min(a.endMinute, b.endMinute)) {
        if (a.durationMinutes <= b.durationMinutes) {
          a.isOffset = true;
          a.offsetDirection = 'right';
        } else {
          b.isOffset = true;
          b.offsetDirection = 'right';
        }
      }
    }
  }

  // Calculate dynamic risk status for tasks based on deadline buffer
  let criticalCount = 0;
  const nowTime = Date.now();

  for (const task of clonedTasks) {
    const deadlineTime = new Date(task.deadline).getTime();
    const hoursToDeadline = (deadlineTime - nowTime) / (1000 * 60 * 60);

    const pendingMinutes = task.subtasks
      .filter((s) => !s.is_completed)
      .reduce((sum, s) => sum + (s.personalized_minutes || s.estimated_minutes || 30), 0);

    const pendingHours = pendingMinutes / 60;

    if (task.status === 'COMPLETED') {
      task.risk_status = 'SAFE';
    } else if (hoursToDeadline <= 0) {
      task.risk_status = 'IMPOSSIBLE';
      criticalCount++;
    } else if (pendingHours > hoursToDeadline) {
      task.risk_status = 'IMPOSSIBLE';
      criticalCount++;
    } else if (hoursToDeadline < 24 || pendingHours / hoursToDeadline > 0.6) {
      task.risk_status = 'CRITICAL';
      criticalCount++;
    } else if (hoursToDeadline < 48 || pendingHours / hoursToDeadline > 0.35) {
      task.risk_status = 'AT_RISK';
    } else {
      task.risk_status = 'SAFE';
    }
  }

  return {
    blocksForDate: allBlocksForDate,
    allScheduledTasks: clonedTasks,
    totalActiveTasks: clonedTasks.filter((t) => t.status !== 'COMPLETED').length,
    criticalTasksCount: criticalCount,
  };
}

export interface ContinuousSlot {
  startDate: Date;
  endDate: Date;
  startTimeStr: string;
  endTimeStr: string;
}

export function findNextContinuousSlot(
  fromPointer: Date,
  durationMinutes: number = 30,
  constraints?: UserScheduleConstraints,
  existingSubtasks: Subtask[] = [],
  routines: RoutineActivity[] = [],
  oneTimeEvents: OneTimeEvent[] = []
): ContinuousSlot {
  const minThresholdMs = Date.now() + 15 * 60 * 1000;
  let candidateStart = new Date(Math.max(fromPointer.getTime(), minThresholdMs));

  // Round up minutes to clean 15-minute intervals
  const m = candidateStart.getMinutes();
  const rm = Math.ceil(m / 15) * 15;
  candidateStart.setMinutes(rm, 0, 0);

  for (let loop = 0; loop < 500; loop++) {
    // Ensure minThresholdMs
    if (candidateStart.getTime() < minThresholdMs) {
      candidateStart = new Date(minThresholdMs);
      const minM = candidateStart.getMinutes();
      const minRm = Math.ceil(minM / 15) * 15;
      candidateStart.setMinutes(minRm, 0, 0);
      continue;
    }

    const candidateStartMs = candidateStart.getTime();
    const candidateEndMs = candidateStartMs + durationMinutes * 60 * 1000;

    const targetDate = new Date(candidateStartMs);
    const busyIntervals = buildUnifiedBusyIntervals(
      targetDate,
      existingSubtasks,
      routines,
      constraints,
      oneTimeEvents
    );

    let overlappingInterval: TimeInterval | undefined = undefined;

    for (const interval of busyIntervals) {
      if (Math.max(candidateStartMs, interval.startMs) < Math.min(candidateEndMs, interval.endMs)) {
        overlappingInterval = interval;
        break;
      }
    }

    if (overlappingInterval) {
      // Overlap detected! Jump candidateStart past the overlapping busy interval
      candidateStart = new Date(overlappingInterval.endMs);
      const remM = candidateStart.getMinutes();
      const roundedM = Math.ceil(remM / 15) * 15;
      candidateStart.setMinutes(roundedM, 0, 0);
      continue;
    }

    // Found valid collision-free slot!
    break;
  }

  const startDate = new Date(candidateStart);
  const endDate = new Date(candidateStart.getTime() + durationMinutes * 60 * 1000);

  const startMins = startDate.getHours() * 60 + startDate.getMinutes();
  const endMins = endDate.getHours() * 60 + endDate.getMinutes();

  return {
    startDate,
    endDate,
    startTimeStr: formatTimeHM(startMins),
    endTimeStr: formatTimeHM(endMins),
  };
}

export function buildSequentialSchedule(
  rawSubtasks: Partial<Subtask>[],
  taskDeadline?: string,
  constraints?: UserScheduleConstraints,
  existingSubtasks: Subtask[] = [],
  routines: RoutineActivity[] = [],
  oneTimeEvents: OneTimeEvent[] = []
): Subtask[] {
  const result: Subtask[] = [];
  let currentPointer = new Date(Date.now() + 15 * 60 * 1000);

  const runningSubtasks = [...existingSubtasks];

  for (let i = 0; i < rawSubtasks.length; i++) {
    const raw = rawSubtasks[i];
    const durationMins = raw.personalized_minutes || raw.estimated_minutes || 30;

    const slot = findNextContinuousSlot(
      currentPointer,
      durationMins,
      constraints,
      runningSubtasks,
      routines,
      oneTimeEvents
    );

    const allocDate = getISODateOnly(slot.startDate);

    const scheduled: Subtask = {
      id: raw.id || `subtask-${Date.now()}-${i}`,
      name: raw.name || (raw as any).title || `Subtugas ${i + 1}`,
      description: raw.description || '',
      estimated_minutes: raw.estimated_minutes || 30,
      personalized_minutes: raw.personalized_minutes,
      dependencies: raw.dependencies || [],
      completion_criteria: raw.completion_criteria || '',
      is_completed: !!raw.is_completed,
      allocation_date: allocDate,
      scheduled_date: allocDate,
      scheduled_start: slot.startTimeStr,
      scheduled_end: slot.endTimeStr,
    };

    result.push(scheduled);
    runningSubtasks.push(scheduled);

    // Pointer dipaksa bergeser ke waktu selesai subtugas ini (+ 15m buffer antar-subtugas)
    currentPointer = new Date(slot.endDate.getTime() + 15 * 60 * 1000);
  }

  return result;
}

export function sanitizeSubtaskAllocation(
  subtasks: Subtask[],
  taskDeadline?: string,
  constraints?: UserScheduleConstraints,
  existingSubtasks: Subtask[] = [],
  routines: RoutineActivity[] = [],
  oneTimeEvents: OneTimeEvent[] = []
): Subtask[] {
  if (!subtasks || subtasks.length === 0) return [];
  return buildSequentialSchedule(
    subtasks,
    taskDeadline,
    constraints,
    existingSubtasks,
    routines,
    oneTimeEvents
  );
}

/**
 * Sanitizes all tasks across the user's schedule sequentially to eliminate any global collisions
 */
export function sanitizeAllTasksSchedule(
  tasks: Task[],
  userProfile: UserProfile
): Task[] {
  if (!tasks || tasks.length === 0) return [];

  const constraints: UserScheduleConstraints = {
    sleepStart: userProfile.sleep_schedule?.sleep_start,
    sleepEnd: userProfile.sleep_schedule?.sleep_end,
    schoolStart: userProfile.school_schedule?.school_start,
    schoolEnd: userProfile.school_schedule?.school_end,
    activeSchoolDays: userProfile.school_schedule?.active_days ?? [1, 2, 3, 4, 5],
  };

  const routines = userProfile.routine_activities || [];
  const oneTimeEvents = userProfile.one_time_events || [];

  // Sort tasks by created_at or deadline
  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(a.created_at || a.deadline).getTime() - new Date(b.created_at || b.deadline).getTime()
  );

  const accumulatedSubtasks: Subtask[] = [];
  const updatedTasks: Task[] = [];

  for (const task of sortedTasks) {
    const newlyScheduledSubtasks = buildSequentialSchedule(
      task.subtasks || [],
      task.deadline,
      constraints,
      accumulatedSubtasks,
      routines,
      oneTimeEvents
    );

    const updatedTask: Task = {
      ...task,
      subtasks: newlyScheduledSubtasks,
    };

    updatedTasks.push(updatedTask);
    accumulatedSubtasks.push(...newlyScheduledSubtasks);
  }

  // Preserve original task order
  const taskMap = new Map(updatedTasks.map((t) => [t.id, t]));
  return tasks.map((t) => taskMap.get(t.id) || t);
}



