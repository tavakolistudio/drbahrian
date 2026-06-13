import { formatInTimeZone, toZonedTime, fromZonedTime } from 'date-fns-tz'
import { format, addMinutes, startOfDay, endOfDay, isSameDay, parseISO } from 'date-fns'

export const DOCTOR_TIMEZONE = 'Asia/Tehran'

/** Convert a local date+time string (in a given tz) to UTC Date */
export function toUtc(localDateStr: string, timezone: string): Date {
  return fromZonedTime(new Date(localDateStr), timezone)
}

/** Format a UTC date as it appears in a specific timezone */
export function formatInTz(date: Date | string, timezone: string, fmt: string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return formatInTimeZone(d, timezone, fmt)
}

/** Iran time display — short: "۱۴:۳۰ | شنبه ۲۵ دی" */
export function formatIranTime(utcDate: Date): string {
  const iranDate = toZonedTime(utcDate, DOCTOR_TIMEZONE)
  const time = iranDate.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
  const weekday = iranDate.toLocaleDateString('fa-IR', { weekday: 'long' })
  const date = iranDate.toLocaleDateString('fa-IR', { day: 'numeric', month: 'long' })
  return `${time} | ${weekday} ${date}`
}

/** Client local time display */
export function formatClientTime(utcDate: Date, clientTimezone: string): string {
  const localDate = toZonedTime(utcDate, clientTimezone)
  const time = localDate.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
  const date = localDate.toLocaleDateString('fa-IR', { day: 'numeric', month: 'long', year: 'numeric' })
  return `${time} — ${date}`
}

/** Iran date string for grouping by day: "2024-01-15" (in Tehran tz) */
export function toIranDateKey(utcDate: Date): string {
  return formatInTimeZone(utcDate, DOCTOR_TIMEZONE, 'yyyy-MM-dd')
}

/** Get ISO date keys for a slot, in Iran timezone */
export function getSlotDateKey(utcDate: Date | string): string {
  const d = typeof utcDate === 'string' ? new Date(utcDate) : utcDate
  return toIranDateKey(d)
}

/** Format Iran weekday + date for display in Persian */
export function formatIranDate(utcDate: Date): string {
  const iranDate = toZonedTime(utcDate, DOCTOR_TIMEZONE)
  return iranDate.toLocaleDateString('fa-IR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Format just the time in Iran tz (HH:mm) */
export function formatIranTimeOnly(utcDate: Date): string {
  const iranDate = toZonedTime(utcDate, DOCTOR_TIMEZONE)
  return iranDate.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
}

/** Format just the time in client tz */
export function formatClientTimeOnly(utcDate: Date, clientTz: string): string {
  const localDate = toZonedTime(utcDate, clientTz)
  return localDate.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
}

/** Get the UTC start/end of an Iran calendar day (for DB queries) */
export function getIranDayUtcRange(iranDateStr: string): { start: Date; end: Date } {
  // Parse "2024-01-15" as a date in Tehran timezone
  const dateInTehran = fromZonedTime(new Date(`${iranDateStr}T00:00:00`), DOCTOR_TIMEZONE)
  const dayStart = fromZonedTime(new Date(`${iranDateStr}T00:00:00`), DOCTOR_TIMEZONE)
  const dayEnd = fromZonedTime(new Date(`${iranDateStr}T23:59:59`), DOCTOR_TIMEZONE)
  return { start: dayStart, end: dayEnd }
}

/** Compute expiry: now + N hours */
export function computeExpiry(hours: number): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000)
}

/** Check if a date is in the past */
export function isPast(date: Date): boolean {
  return date < new Date()
}

/** Generate time slots between startHour and endHour (Tehran time) for a given date */
export function generateSlots(
  iranDateStr: string,
  startHour: number,
  endHour: number,
  durationMin: number,
  breakMin: number
): Array<{ startUtc: Date; endUtc: Date }> {
  const slots: Array<{ startUtc: Date; endUtc: Date }> = []
  let currentMinutes = startHour * 60

  while (currentMinutes + durationMin <= endHour * 60) {
    const startStr = `${iranDateStr}T${String(Math.floor(currentMinutes / 60)).padStart(2, '0')}:${String(currentMinutes % 60).padStart(2, '0')}:00`
    const startUtc = fromZonedTime(new Date(startStr), DOCTOR_TIMEZONE)
    const endUtc = addMinutes(startUtc, durationMin)

    slots.push({ startUtc, endUtc })
    currentMinutes += durationMin + breakMin
  }

  return slots
}

/** Long format for confirmation messages */
export function formatLongIranDateTime(utcDate: Date): string {
  const iranDate = toZonedTime(utcDate, DOCTOR_TIMEZONE)
  return iranDate.toLocaleDateString('fa-IR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatLongClientDateTime(utcDate: Date, tz: string): string {
  const localDate = toZonedTime(utcDate, tz)
  return localDate.toLocaleDateString('fa-IR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
