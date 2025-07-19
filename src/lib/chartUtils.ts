import { format, parseISO, startOfMonth, eachMonthOfInterval } from 'date-fns';

export interface ChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

export interface MonthlyData {
  month: string;
  conversations: number;
  messages: number;
  year: number;
  monthNumber: number;
}

export interface HourlyData {
  hour: number;
  count: number;
  label: string;
}

/**
 * Generates a color palette for charts
 */
export function generateChartColors(count: number): string[] {
  const baseColors = [
    '#10A37F', // ChatGPT Green
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
    '#6366F1', // Indigo
  ];

  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }

  // Generate additional colors by varying the base colors
  const colors = [...baseColors];
  for (let i = baseColors.length; i < count; i++) {
    const baseIndex = i % baseColors.length;
    const base = baseColors[baseIndex];
    // Create variations by adjusting opacity or lightness
    const variation = `${base}${Math.floor(80 + (i * 20) % 60).toString(16)}`;
    colors.push(variation);
  }

  return colors;
}

/**
 * Formats data for line charts (usage over time)
 */
export function formatTimeSeriesData(
  conversations: Array<{ createTime: number; messageCount: number }>,
  granularity: 'day' | 'week' | 'month' = 'month'
): TimeSeriesData[] {
  const grouped = new Map<string, { conversations: number; messages: number }>();

  for (const conv of conversations) {
    const date = new Date(conv.createTime);
    let key: string;

    switch (granularity) {
      case 'day':
        key = format(date, 'yyyy-MM-dd');
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = format(weekStart, 'yyyy-MM-dd');
        break;
      case 'month':
      default:
        key = format(date, 'yyyy-MM');
        break;
    }

    const existing = grouped.get(key) || { conversations: 0, messages: 0 };
    existing.conversations += 1;
    existing.messages += conv.messageCount;
    grouped.set(key, existing);
  }

  return Array.from(grouped.entries())
    .map(([date, data]) => ({
      date,
      value: data.conversations,
      label: `${data.conversations} conversations, ${data.messages} messages`,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Formats monthly usage data for bar charts
 */
export function formatMonthlyData(
  conversations: Array<{ createTime: number; messageCount: number; year: number; month: number }>
): MonthlyData[] {
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const grouped = new Map<string, { conversations: number; messages: number; year: number; month: number }>();

  for (const conv of conversations) {
    const key = `${conv.year}-${conv.month.toString().padStart(2, '0')}`;
    const existing = grouped.get(key) || { conversations: 0, messages: 0, year: conv.year, month: conv.month };
    existing.conversations += 1;
    existing.messages += conv.messageCount;
    grouped.set(key, existing);
  }

  return Array.from(grouped.entries())
    .map(([key, data]) => ({
      month: monthNames[data.month - 1],
      conversations: data.conversations,
      messages: data.messages,
      year: data.year,
      monthNumber: data.month,
    }))
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.monthNumber - b.monthNumber;
    });
}

/**
 * Formats hourly activity data
 */
export function formatHourlyData(
  messages: Array<{ createTime: number }>
): HourlyData[] {
  const hourCounts = new Array(24).fill(0);

  for (const message of messages) {
    const hour = new Date(message.createTime).getHours();
    hourCounts[hour]++;
  }

  return hourCounts.map((count, hour) => ({
    hour,
    count,
    label: `${hour}:00`,
  }));
}

/**
 * Formats topic distribution for pie charts
 */
export function formatTopicData(
  topTopics: string[],
  limit: number = 10
): ChartDataPoint[] {
  const topicCounts = new Map<string, number>();
  
  for (const topic of topTopics) {
    topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
  }

  const sorted = Array.from(topicCounts.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit);

  const colors = generateChartColors(sorted.length);

  return sorted.map(([topic, count], index) => ({
    x: topic,
    y: count,
    label: `${topic} (${count})`,
    color: colors[index],
  }));
}

/**
 * Formats sentiment distribution for pie charts
 */
export function formatSentimentData(sentimentBreakdown: {
  positive: number;
  negative: number;
  neutral: number;
}): ChartDataPoint[] {
  const data = [
    { sentiment: 'Positive', count: sentimentBreakdown.positive, color: '#10B981' },
    { sentiment: 'Neutral', count: sentimentBreakdown.neutral, color: '#6B7280' },
    { sentiment: 'Negative', count: sentimentBreakdown.negative, color: '#EF4444' },
  ];

  return data
    .filter(item => item.count > 0)
    .map(item => ({
      x: item.sentiment,
      y: item.count,
      label: `${item.sentiment}: ${item.count}`,
      color: item.color,
    }));
}

/**
 * Formats conversation length distribution
 */
export function formatConversationLengthData(
  conversations: Array<{ messageCount: number }>
): ChartDataPoint[] {
  const buckets = [
    { label: '1-5 messages', min: 1, max: 5 },
    { label: '6-10 messages', min: 6, max: 10 },
    { label: '11-20 messages', min: 11, max: 20 },
    { label: '21-50 messages', min: 21, max: 50 },
    { label: '50+ messages', min: 51, max: Infinity },
  ];

  const counts = buckets.map(bucket => ({
    ...bucket,
    count: conversations.filter(conv => 
      conv.messageCount >= bucket.min && conv.messageCount <= bucket.max
    ).length,
  }));

  const colors = generateChartColors(buckets.length);

  return counts.map((bucket, index) => ({
    x: bucket.label,
    y: bucket.count,
    label: `${bucket.label}: ${bucket.count} conversations`,
    color: colors[index],
  }));
}

/**
 * Creates heatmap data for activity patterns
 */
export function formatHeatmapData(
  messages: Array<{ createTime: number }>
): Array<{ day: number; hour: number; value: number }> {
  const heatmapData: Array<{ day: number; hour: number; value: number }> = [];
  
  // Initialize grid (7 days x 24 hours)
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      heatmapData.push({ day, hour, value: 0 });
    }
  }

  // Count messages by day of week and hour
  for (const message of messages) {
    const date = new Date(message.createTime);
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hour = date.getHours();
    
    const cell = heatmapData.find(item => item.day === day && item.hour === hour);
    if (cell) {
      cell.value += 1;
    }
  }

  return heatmapData;
}

/**
 * Calculates moving averages for trend lines
 */
export function calculateMovingAverage(
  data: TimeSeriesData[],
  windowSize: number = 7
): TimeSeriesData[] {
  if (data.length < windowSize) return data;

  const result: TimeSeriesData[] = [];
  
  for (let i = windowSize - 1; i < data.length; i++) {
    const window = data.slice(i - windowSize + 1, i + 1);
    const average = window.reduce((sum, item) => sum + item.value, 0) / windowSize;
    
    result.push({
      date: data[i].date,
      value: Math.round(average * 100) / 100, // Round to 2 decimal places
      label: `${windowSize}-day average: ${average.toFixed(1)}`,
    });
  }

  return result;
}

/**
 * Exports chart data as CSV
 */
export function exportChartDataAsCSV(
  data: ChartDataPoint[] | TimeSeriesData[],
  filename: string = 'chart-data.csv'
): void {
  let csvContent = '';
  
  if (data.length === 0) return;

  // Determine data type and create appropriate headers
  const firstItem = data[0];
  if ('date' in firstItem) {
    // Time series data
    csvContent = 'Date,Value,Label\n';
    (data as TimeSeriesData[]).forEach(item => {
      csvContent += `${item.date},${item.value},"${item.label || ''}"\n`;
    });
  } else {
    // Chart data points
    csvContent = 'X,Y,Label,Color\n';
    (data as ChartDataPoint[]).forEach(item => {
      csvContent += `${item.x},${item.y},"${item.label || ''}","${item.color || ''}"\n`;
    });
  }

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Formats numbers for display in charts
 */
export function formatNumberForDisplay(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
}

/**
 * Generates responsive chart dimensions
 */
export function getResponsiveChartDimensions(containerWidth: number): {
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
} {
  const aspectRatio = 16 / 9;
  const maxWidth = Math.min(containerWidth * 0.9, 800);
  const height = Math.min(maxWidth / aspectRatio, 400);

  return {
    width: maxWidth,
    height,
    margin: {
      top: 20,
      right: 30,
      bottom: 50,
      left: 60,
    },
  };
}