import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(utc);
dayjs.extend(isBetween);

export function toEorzeanDate(date: Date) {
  return dayjs((24 * date.getTime() * 60) / 70).utcOffset(0);
}

export function toEarthDate(date: Date) {
  return dayjs((date.getTime() * 70) / (24 * 60));
}

export function toEarthTime(millisecond: number) {
  return (millisecond * 70) / (24 * 60);
}

export function formatTime(time: Date, format: string = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(time).format(format);
}

export type PointStatus = 'Exposing' | 'Done' | 'Cooming';

export function calculateLimitedGatherPointTime(now: Date, start_time: number, duration: number) {
  const eorzeaTime = toEorzeanDate(now);
  let status: PointStatus = 'Exposing';

  let eorzeaStartTime = eorzeaTime.hour(start_time).minute(0).second(0).millisecond(0);
  let eorzeaEndTime = eorzeaStartTime.add(duration, 'minute');

  // 不在出现时间内，冷却中
  if (!eorzeaTime.isBetween(eorzeaStartTime, eorzeaEndTime)) {
    status = 'Done';
  }

  // 已经过了出现时间段，时间+1天
  if (eorzeaTime.isAfter(eorzeaEndTime)) {
    eorzeaStartTime = eorzeaStartTime.add(1, 'day');
    eorzeaEndTime = eorzeaStartTime.add(duration, 'minute');
  }

  const earthStartTime = toEarthDate(eorzeaStartTime.toDate());
  const earthEndTime = toEarthDate(eorzeaEndTime.toDate());
  let progress: number;
  let diffTime: number;
  if (status === 'Exposing') {
    diffTime = earthEndTime.diff(now, 'millisecond');
    progress = (diffTime * 100) / toEarthTime(duration * 60 * 1000);
  } else {
    diffTime = earthStartTime.diff(now, 'millisecond');
    if (diffTime < 30 * 1000) {
      status = 'Cooming';
    }
    progress = 100 - (diffTime * 100) / toEarthTime(24 * 3600 * 1000 - duration * 60 * 1000);
  }
  const leftTime = dayjs(diffTime).utcOffset(0);

  return {
    eorzeaStartTime: eorzeaStartTime.format('HH:mm'),
    eorzeaEndTime: eorzeaEndTime.format('HH:mm'),
    earthStartTime: earthStartTime.format('HH:mm'),
    earthEndTime: earthEndTime.format('HH:mm'),
    leftTime: leftTime.format('HH:mm:ss'),
    status,
    progress: Number(progress.toFixed(2))
  };
}
