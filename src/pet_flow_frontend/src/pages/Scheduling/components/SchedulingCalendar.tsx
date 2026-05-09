import type { SchedulingResolvedItem } from '../types';
import styles from './SchedulingCalendar.module.css';

interface SchedulingCalendarProps {
  weekDates: Date[];
  items: SchedulingResolvedItem[];
}

const weekDayNames = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const CALENDAR_START_HOUR = 9;
const CALENDAR_END_HOUR = 18;
const CALENDAR_TOTAL_HOURS = CALENDAR_END_HOUR - CALENDAR_START_HOUR;
const SLOT_GAP_PERCENT = 0.8;
const hourMarks = Array.from(
  { length: CALENDAR_END_HOUR - CALENDAR_START_HOUR },
  (_, index) => CALENDAR_START_HOUR + index,
);

function getStartOfDay(dateTime: string): number {
  const date = new Date(dateTime);
  return date.getHours() + date.getMinutes() / 60;
}

function getEndOfDay(dateTime: string): number {
  return getStartOfDay(dateTime) + 1;
}

function getCardStyle(dateTime: string): React.CSSProperties {
  const startHour = getStartOfDay(dateTime);
  const endHour = getEndOfDay(dateTime);

  const startPercent = ((startHour - CALENDAR_START_HOUR) / CALENDAR_TOTAL_HOURS) * 100;
  const durationPercent = ((endHour - startHour) / CALENDAR_TOTAL_HOURS) * 100;
  const top = startPercent + SLOT_GAP_PERCENT / 2;
  const height = durationPercent - SLOT_GAP_PERCENT;

  return {
    top: `${Math.min(Math.max(top, 0), 100)}%`,
    height: `${Math.max(height, 6.2)}%`,
  };
}

function isInCalendarRange(dateTime: string): boolean {
  const hour = getStartOfDay(dateTime);
  return hour >= CALENDAR_START_HOUR && hour < CALENDAR_END_HOUR;
}

function isSameDay(first: Date, second: Date): boolean {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function formatHourFromDate(date: Date): string {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function formatHourRange(dateTime: string): string {
  const start = new Date(dateTime);
  const end = new Date(start);
  end.setHours(end.getHours() + 1);

  return `${formatHourFromDate(start)} - ${formatHourFromDate(end)}`;
}

export default function SchedulingCalendar({ weekDates, items }: SchedulingCalendarProps) {
  const groupedByDay = weekDates.map((date) =>
    items.filter((item) => isSameDay(new Date(item.dateTime), date)),
  );

  return (
    <section className={styles.container}>
      <div className={styles.calendar}>
        <div className={styles.hoursColumn}>
          <div className={styles.hoursHeader} />
          <div className={styles.hoursBody}>
            {hourMarks.map((hour, index) => (
              <span
                key={hour}
                className={styles.hourLabel}
                style={{ top: `${(index / CALENDAR_TOTAL_HOURS) * 100}%` }}
              >
                {hour}:00
              </span>
            ))}
          </div>
        </div>

        {weekDates.map((dayDate, index) => (
          <div key={dayDate.toISOString()} className={styles.dayColumn}>
            <header className={styles.dayHeader}>{weekDayNames[index]}</header>

            <div className={styles.dayBody}>
              {groupedByDay[index].filter((item) => isInCalendarRange(item.dateTime)).map((item) => (
                <article
                  key={item.id}
                  className={styles.eventCard}
                  style={getCardStyle(item.dateTime)}
                >
                  <div className={styles.eventTopRow}>
                    <span className={styles.eventHour}>{formatHourRange(item.dateTime)}</span>
                    <span
                      className={`${styles.eventEmployeeSide} ${
                        item.employeeName === '-' ? styles.eventEmployeeSideEmpty : ''
                      }`}
                      title={item.employeeName === '-' ? 'Sem funcionário' : item.employeeName}
                    >
                      {item.employeeName === '-' ? 'Sem funcionário' : item.employeeName}
                    </span>
                  </div>
                  <strong className={styles.eventTitle}>
                    {item.serviceName}: {item.petName}
                  </strong>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
