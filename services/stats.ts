import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

export async function getSessionDataForPeriod(
  userId: string,
  period: 'week' | 'month' | 'year' | 'all'
) {
  const now = new Date();
  let startDate = new Date();

  switch (period) {
    case 'week':
      startDate.setDate(now.getDate() - 6);
      break;
    case 'month':
      startDate.setDate(now.getDate() - 29);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    case 'all':
      startDate = new Date(0); // all time
      break;
  }

  const sessionsRef = collection(db, 'sessions');
  const q = query(
    sessionsRef,
    where('userId', '==', userId),
    where('timestamp', '>=', Timestamp.fromDate(startDate))
  );

  const snapshot = await getDocs(q);
  const data: { timestamp: Date; duration: number }[] = [];
  snapshot.forEach((doc) => {
    const s = doc.data();
    data.push({
      timestamp: s.timestamp.toDate(),
      duration: s.duration || 0,
    });
  });

  return aggregateSessionsByPeriod(data, period);
}

function aggregateSessionsByPeriod(
  sessions: { timestamp: Date; duration: number }[],
  period: 'week' | 'month' | 'year' | 'all'
) {
  if (sessions.length === 0) {
    return { labels: [], datasets: [{ data: [] }] };
  }

  const map = new Map<string, number>();
  const now = new Date();

  // Convert minutes → hours for display
  const toHours = (min: number) => min / 60;

  if (period === 'week') {
    // Group by weekday (Mon–Sun)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (const s of sessions) {
      const day = days[s.timestamp.getDay()];
      map.set(day, (map.get(day) || 0) + toHours(s.duration));
    }
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = labels.map((l) => map.get(l) || 0);
    return { labels, datasets: [{ data }] };
  }

  if (period === 'month') {
    // Group by week number (last 4–5 weeks)
    const weekMap = new Map<string, number>();
    const getWeekKey = (date: Date) => {
      const diff = now.getTime() - date.getTime();
      const weeksAgo = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
      return weeksAgo; // 0 = this week, 1 = last week, etc.
    };

    for (const s of sessions) {
      const key = getWeekKey(s.timestamp);
      weekMap.set(key.toString(), (weekMap.get(key.toString()) || 0) + toHours(s.duration));
    }

    const sortedWeeks = Array.from(weekMap.entries())
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .slice(0, 5); // keep latest 5 weeks

    const labels = sortedWeeks
      .map(([w]) => (parseInt(w) === 0 ? 'This week' : `${parseInt(w)}w ago`))
      .reverse();
    const data = sortedWeeks.map(([, h]) => h).reverse();

    return { labels, datasets: [{ data }] };
  }

  if (period === 'year') {
    // Group by last 7 months
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const currentMonth = now.getMonth();
    const monthsToShow = [];

    for (let i = 6; i >= 0; i--) {
      let monthIndex = (currentMonth - i + 12) % 12;
      let yearOffset = currentMonth - i < 0 ? -1 : 0;
      monthsToShow.push({
        label: monthNames[monthIndex],
        key: `${now.getFullYear() + yearOffset}-${monthIndex}`,
      });
    }

    for (const s of sessions) {
      const key = `${s.timestamp.getFullYear()}-${s.timestamp.getMonth()}`;
      map.set(key, (map.get(key) || 0) + toHours(s.duration));
    }

    const labels = monthsToShow.map((m) => m.label);
    const data = monthsToShow.map((m) => map.get(m.key) || 0);

    return { labels, datasets: [{ data }] };
  }

  if (period === 'all') {
    // Group by year
    for (const s of sessions) {
      const year = s.timestamp.getFullYear().toString();
      map.set(year, (map.get(year) || 0) + toHours(s.duration));
    }
    const labels = Array.from(map.keys()).sort();
    const data = labels.map((y) => map.get(y) || 0);
    return { labels, datasets: [{ data }] };
  }

  return { labels: [], datasets: [{ data: [] }] };
}
