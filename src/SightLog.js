import EorzeaWeather from 'eorzea-weather';
import EorzeaTime from 'eorzea-time';
import { EIGHT_HOURS, ONE_HOUR, PHASES } from './Constants';
import { useState, useEffect } from 'react';
import SightLogView from './SightLogView';

const timesIntersect = (Range1, Range2) => {
  if (Range1.StartTime > Range1.EndTime) {
    return timesIntersect(Range2, {StartTime: Range1.StartTime, EndTime: 24}) || timesIntersect(Range2, {StartTime: 0, EndTime: Range1.EndTime});
  }
  if (Range2.StartTime > Range2.EndTime) {
    return timesIntersect(Range1, {StartTime: Range2.StartTime, EndTime: 24}) || timesIntersect(Range1, {StartTime: 0, EndTime: Range2.EndTime});
  }
  return Range1.StartTime < Range2.EndTime && Range1.EndTime > Range2.StartTime;
};

const getStartOfDay = () => {
  const msec = new Date().getTime();
  const bell = (msec / ONE_HOUR) % 24;
  return msec - Math.round(ONE_HOUR * bell);
};

const getTimeDisplay = time => {
  if (time === 0) return '12AM';
  if (time === 12) return '12PM';
  if (time > 11) return `${time % 12}PM`;
  return `${time}AM`; 
}

function SightLog({
  log,
  updateCollectionWindow,
  onChangeMarkAsFound
}) {
  const [windowStartDisplay, setWindowStartDisplay] = useState('');
  const [windowEndDisplay, setWindowEndDisplay] = useState('');
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (log.LastUpdated < Date.now() + EIGHT_HOURS) return;
    const eWeather = new EorzeaWeather(log.ZoneId);
    const phases = PHASES.filter(phase => timesIntersect(phase, log.Window));
    let goodWeatherFound = false;
    let startOfWeatherWindow = 0;
    while (!goodWeatherFound) {
      if (startOfWeatherWindow === 0) {
        startOfWeatherWindow = getStartOfDay();
      } else {
        startOfWeatherWindow += EIGHT_HOURS
      }
      const startOfWeatherWindowDate = new Date(startOfWeatherWindow);
      const phase = phases.find(phase => phase.StartTime === new EorzeaTime(startOfWeatherWindowDate).getHours());
      if (phase == null) continue;
      if (!log.Weather.some(allowedWeather => allowedWeather === eWeather.getWeather(startOfWeatherWindowDate))) continue;
      const effectiveWindowStartTime = Math.max(phase.EndTime < log.Window.StartTime ? phase.StartTime : log.Window.StartTime, phase.StartTime);
      const baseOffset = (effectiveWindowStartTime - phase.StartTime)
      const CollectableWindowStartTime = new Date(startOfWeatherWindow + (ONE_HOUR * baseOffset));
      const nextWindowStart = startOfWeatherWindow += EIGHT_HOURS;
      const nextWindowIsAlsoGoodWeather = log.Weather.some(weather => weather === eWeather.getWeather(new Date(nextWindowStart)));
      let effectiveWindowEndTime = log.Window.EndTime > log.Window.StartTime ? log.Window.EndTime : log.Window.EndTime + 24
      if (effectiveWindowEndTime >= phase.EndTime && !nextWindowIsAlsoGoodWeather) {
        effectiveWindowEndTime = phase.EndTime;
      }
      const CollectableWindowEndTime = new Date(startOfWeatherWindow + ((baseOffset + effectiveWindowEndTime - effectiveWindowStartTime) * ONE_HOUR));
      if (Date.now() > CollectableWindowEndTime) continue;
      updateCollectionWindow({Key: log.Key, CollectableWindowStartTime, CollectableWindowEndTime})
      goodWeatherFound = true;
    }
  }, [
    log.Key,
    log.Weather,
    log.Window,
    log.ZoneId,
    log.CollectableWindowStartTime,
    log.CollectableWindowEndTime,
    log.LastUpdated,
    updateCollectionWindow
  ]);

  useEffect(() => {
    setWindowStartDisplay(getTimeDisplay(log.Window.StartTime));
    setWindowEndDisplay(getTimeDisplay(log.Window.EndTime));
  }, [log.Window.StartTime, log.Window.EndTime]);

  useEffect(() => {
    setAlert(log.CollectableWindowStartTime != null && log.CollectableWindowEndTime != null && log.CollectableWindowStartTime >= log.CollectableWindowEndTime ? "This is an impossible time range" : null);
  }, [log.CollectableWindowStartTime, log.CollectableWindowEndTime]);

  return (
    <SightLogView 
      {...log}
      WindowStartDisplay={windowStartDisplay}
      WindowEndDisplay={windowEndDisplay}
      AlertMessage={alert}
      onChangeMarkAsFound={onChangeMarkAsFound}
    />
  );
};

export default SightLog