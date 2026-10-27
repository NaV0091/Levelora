/**
 * Date manipulation and streak calculation utilities
 */

/**
 * Returns local YYYY-MM-DD string
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Formats a date string for display (e.g. "Oct 25, 2026")
 */
export function formatDateDisplay(dateStr?: string): string {
  if (!dateStr) return 'No deadline';
  try {
    const d = parseLocalDate(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export interface DayInfo {
  dateStr: string;
  dayShort: string; // 'M', 'T', 'W', 'T', 'F', 'S', 'S'
  dayNumber: number; // 25
  isToday: boolean;
  isPast: boolean;
}

/**
 * Gets 7 days for the current week (Monday through Sunday)
 * Matching the M T W T F S S layout in the reference image
 */
export function getCurrentWeekDays(referenceDate: Date = new Date()): DayInfo[] {
  const current = new Date(referenceDate);
  const dayOfWeek = current.getDay(); // 0 is Sunday, 1 is Monday...
  
  // Convert so Monday is day 0, Sunday is day 6
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const monday = new Date(current);
  monday.setDate(current.getDate() + diffToMonday);
  
  const days: DayInfo[] = [];
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayStr = getLocalDateString(referenceDate);

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = getLocalDateString(d);
    
    days.push({
      dateStr,
      dayShort: dayLabels[i],
      dayNumber: d.getDate(),
      isToday: dateStr === todayStr,
      isPast: dateStr < todayStr
    });
  }

  return days;
}

/**
 * Returns past N days (inclusive of today)
 */
export function getPastNDays(n: number = 7, referenceDate: Date = new Date()): DayInfo[] {
  const days: DayInfo[] = [];
  const todayStr = getLocalDateString(referenceDate);
  const dayLabels = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(referenceDate);
    d.setDate(referenceDate.getDate() - i);
    const dateStr = getLocalDateString(d);
    
    days.push({
      dateStr,
      dayShort: dayLabels[d.getDay()],
      dayNumber: d.getDate(),
      isToday: dateStr === todayStr,
      isPast: dateStr < todayStr
    });
  }

  return days;
}

/**
 * Calculates current streak and longest streak from a set of active dates (YYYY-MM-DD)
 */
export function calculateStreaks(activeDates: string[] | Set<string>, referenceDateStr?: string): {
  currentStreak: number;
  longestStreak: number;
} {
  const datesSet = activeDates instanceof Set ? activeDates : new Set(activeDates);
  if (datesSet.size === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const todayStr = referenceDateStr || getLocalDateString();
  const today = parseLocalDate(todayStr);

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = new Date(today);

  // If today has completion, start counting back from today
  // If today does NOT have completion yet, check yesterday. If yesterday was completed, the streak is alive!
  if (!datesSet.has(todayStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const checkStr = getLocalDateString(checkDate);
    if (datesSet.has(checkStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate longest historical streak
  const sortedDates = Array.from(datesSet).sort();
  let longestStreak = 0;
  let running = 0;
  let previousDate: Date | null = null;

  for (const dateStr of sortedDates) {
    const d = parseLocalDate(dateStr);
    if (!previousDate) {
      running = 1;
    } else {
      const diffTime = d.getTime() - previousDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
      if (diffDays === 1) {
        running++;
      } else if (diffDays > 1) {
        running = 1;
      }
    }
    previousDate = d;
    if (running > longestStreak) {
      longestStreak = running;
    }
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  return {
    currentStreak,
    longestStreak
  };
}

/**
 * Checks whether a completed quest was completed on a previous day (before today).
 * Quests completed today remain visible for the rest of today, but auto-delete next day.
 */
export function isQuestCompletedOnPastDay(
  quest: { isCompleted: boolean; completedAt?: string },
  todayStr: string = getLocalDateString()
): boolean {
  if (!quest.isCompleted) return false;
  if (!quest.completedAt) return true; // Legacy completed quest without timestamp - treat as past
  try {
    const compDateStr = getLocalDateString(new Date(quest.completedAt));
    return compDateStr < todayStr;
  } catch {
    return true;
  }
}

/**
 * Prunes quests that were completed on previous days so they delete themselves the next day.
 */
export function prunePastCompletedQuests<T extends { isCompleted: boolean; completedAt?: string }>(
  quests: T[],
  todayStr: string = getLocalDateString()
): T[] {
  return quests.filter(q => !isQuestCompletedOnPastDay(q, todayStr));
}
