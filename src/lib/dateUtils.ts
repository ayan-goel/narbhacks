import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

/**
 * Formats a timestamp to a readable date string
 */
export function formatDate(
  timestamp: number | string | Date,
  formatString: string = 'MMM dd, yyyy'
): string {
  try {
    let date: Date;
    
    if (typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else if (typeof timestamp === 'string') {
      date = parseISO(timestamp);
    } else {
      date = timestamp;
    }

    if (!isValid(date)) {
      return 'Invalid date';
    }

    return format(date, formatString);
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Formats a timestamp to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp: number | string | Date): string {
  try {
    let date: Date;
    
    if (typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else if (typeof timestamp === 'string') {
      date = parseISO(timestamp);
    } else {
      date = timestamp;
    }

    if (!isValid(date)) {
      return 'Invalid date';
    }

    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Extracts year from timestamp
 */
export function getYearFromTimestamp(timestamp: number | string | Date): number {
  try {
    let date: Date;
    
    if (typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else if (typeof timestamp === 'string') {
      date = parseISO(timestamp);
    } else {
      date = timestamp;
    }

    if (!isValid(date)) {
      return new Date().getFullYear();
    }

    return date.getFullYear();
  } catch (error) {
    return new Date().getFullYear();
  }
}

/**
 * Extracts month from timestamp (1-12)
 */
export function getMonthFromTimestamp(timestamp: number | string | Date): number {
  try {
    let date: Date;
    
    if (typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else if (typeof timestamp === 'string') {
      date = parseISO(timestamp);
    } else {
      date = timestamp;
    }

    if (!isValid(date)) {
      return new Date().getMonth() + 1;
    }

    return date.getMonth() + 1;
  } catch (error) {
    return new Date().getMonth() + 1;
  }
}

/**
 * Gets month name from month number (1-12)
 */
export function getMonthName(monthNumber: number, short: boolean = false): string {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const shortMonthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const index = monthNumber - 1;
  if (index < 0 || index >= 12) {
    return 'Invalid month';
  }

  return short ? shortMonthNames[index] : monthNames[index];
}

/**
 * Categorizes time of day based on hour
 */
export function getTimeOfDay(timestamp: number | string | Date): 'morning' | 'afternoon' | 'evening' | 'night' {
  try {
    let date: Date;
    
    if (typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else if (typeof timestamp === 'string') {
      date = parseISO(timestamp);
    } else {
      date = timestamp;
    }

    if (!isValid(date)) {
      return 'morning';
    }

    const hour = date.getHours();

    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  } catch (error) {
    return 'morning';
  }
}

/**
 * Gets day of week from timestamp
 */
export function getDayOfWeek(timestamp: number | string | Date): string {
  try {
    let date: Date;
    
    if (typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else if (typeof timestamp === 'string') {
      date = parseISO(timestamp);
    } else {
      date = timestamp;
    }

    if (!isValid(date)) {
      return 'Unknown';
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  } catch (error) {
    return 'Unknown';
  }
}

/**
 * Checks if a timestamp is within a specific year
 */
export function isInYear(timestamp: number | string | Date, year: number): boolean {
  try {
    const timestampYear = getYearFromTimestamp(timestamp);
    return timestampYear === year;
  } catch (error) {
    return false;
  }
}

/**
 * Checks if a timestamp is within a specific month and year
 */
export function isInMonth(timestamp: number | string | Date, year: number, month: number): boolean {
  try {
    const timestampYear = getYearFromTimestamp(timestamp);
    const timestampMonth = getMonthFromTimestamp(timestamp);
    return timestampYear === year && timestampMonth === month;
  } catch (error) {
    return false;
  }
}

/**
 * Gets the start and end of a year as timestamps
 */
export function getYearRange(year: number): { start: number; end: number } {
  const start = new Date(year, 0, 1).getTime();
  const end = new Date(year + 1, 0, 1).getTime() - 1;
  return { start, end };
}

/**
 * Gets the start and end of a month as timestamps
 */
export function getMonthRange(year: number, month: number): { start: number; end: number } {
  const start = new Date(year, month - 1, 1).getTime();
  const end = new Date(year, month, 1).getTime() - 1;
  return { start, end };
}

/**
 * Formats duration in milliseconds to human readable format
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''}`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''}`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''}`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  return `${seconds} second${seconds > 1 ? 's' : ''}`;
}

/**
 * Gets time zone offset string
 */
export function getTimezoneOffset(timestamp?: number | string | Date): string {
  try {
    const date = timestamp ? new Date(timestamp) : new Date();
    const offset = date.getTimezoneOffset();
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const sign = offset <= 0 ? '+' : '-';
    
    return `GMT${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } catch (error) {
    return 'GMT+00:00';
  }
}

/**
 * Checks if a date is today
 */
export function isToday(timestamp: number | string | Date): boolean {
  try {
    const date = new Date(timestamp);
    const today = new Date();
    
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  } catch (error) {
    return false;
  }
}

/**
 * Checks if a date is yesterday
 */
export function isYesterday(timestamp: number | string | Date): boolean {
  try {
    const date = new Date(timestamp);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return date.getDate() === yesterday.getDate() &&
           date.getMonth() === yesterday.getMonth() &&
           date.getFullYear() === yesterday.getFullYear();
  } catch (error) {
    return false;
  }
}

/**
 * Groups timestamps by time period
 */
export function groupByTimePeriod(
  timestamps: number[],
  period: 'hour' | 'day' | 'week' | 'month' | 'year'
): Record<string, number[]> {
  const groups: Record<string, number[]> = {};

  for (const timestamp of timestamps) {
    let key: string;
    const date = new Date(timestamp);

    switch (period) {
      case 'hour':
        key = format(date, 'yyyy-MM-dd HH');
        break;
      case 'day':
        key = format(date, 'yyyy-MM-dd');
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = format(weekStart, 'yyyy-MM-dd');
        break;
      case 'month':
        key = format(date, 'yyyy-MM');
        break;
      case 'year':
        key = format(date, 'yyyy');
        break;
      default:
        key = 'unknown';
    }

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(timestamp);
  }

  return groups;
}

/**
 * Calculates the most frequent time of day from timestamps
 */
export function getMostFrequentTimeOfDay(timestamps: number[]): {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  count: number;
  percentage: number;
} {
  const counts = {
    morning: 0,
    afternoon: 0,
    evening: 0,
    night: 0,
  };

  for (const timestamp of timestamps) {
    const timeOfDay = getTimeOfDay(timestamp);
    counts[timeOfDay]++;
  }

  const entries = Object.entries(counts) as Array<[keyof typeof counts, number]>;
  const [timeOfDay, count] = entries.reduce((max, current) => 
    current[1] > max[1] ? current : max
  );

  const percentage = timestamps.length > 0 ? (count / timestamps.length) * 100 : 0;

  return {
    timeOfDay,
    count,
    percentage: Math.round(percentage * 100) / 100,
  };
}