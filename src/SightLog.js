import EorzeaWeather from 'eorzea-weather';
import EorzeaTime from 'eorzea-time';
import { EIGHT_HOURS, ONE_HOUR, PHASES } from './Constants';
import { useState, useEffect } from 'react';
import SightLogView from './SightLogView';

const Times_Intersect = (Range1, Range2) => {
  if (Range1.StartTime > Range1.EndTime) {
    return Times_Intersect(Range2, {StartTime: Range1.StartTime, EndTime: 24}) || Times_Intersect(Range2, {StartTime: 0, EndTime: Range1.EndTime});
  }
  if (Range2.StartTime > Range2.EndTime) {
    return Times_Intersect(Range1, {StartTime: Range2.StartTime, EndTime: 24}) || Times_Intersect(Range1, {StartTime: 0, EndTime: Range2.EndTime});
  }
  return Range1.StartTime < Range2.EndTime && Range1.EndTime > Range2.StartTime;
};

const getTimeDisplay = time => {
  if (time === 0) return '12AM';
  if (time === 12) return '12PM';
  if (time > 11) return `${time % 12}PM`;
  return `${time}AM`; 
}

function SightLog({
  log,
  times,
  updateCollectionWindow
}) {
  const [windowStartDisplay, setWindowStartDisplay] = useState('');
  const [windowEndDisplay, setWindowEndDisplay] = useState('');
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if ((log.CollectableWindowStartTime != null && log.CollectableWindowEndTime != null && log.CollectableWindowEndTime > new Date()) || times.length === 0) return;
    if (log.LastUpdated < Date.now() + EIGHT_HOURS) return;
    const eWeather = new EorzeaWeather(log.ZoneId);
    const phases = PHASES.filter(phase => Times_Intersect(phase, log.Window));
    const goodWeatherTime = times.find(time => {
      if (new Date(time + EIGHT_HOURS) < new Date()) return false;
      const date = new Date(time);
      if (!phases.some(phase => phase.StartTime === new EorzeaTime(date).getHours())) return false;
      const actualWeather = eWeather.getWeather(date)
      return log.Weather.some(allowedWeather => allowedWeather === actualWeather);
    });
    if (goodWeatherTime != null) {
      const phase = phases.find(phase => phase.StartTime === new EorzeaTime(new Date(goodWeatherTime)).getHours());
      const effectiveWindowStartTime = Math.max(phase.EndTime < log.Window.StartTime ? phase.StartTime : log.Window.StartTime, phase.StartTime);
      const baseOffset = (effectiveWindowStartTime - phase.StartTime)
      const CollectableWindowStartTime = new Date(goodWeatherTime + (ONE_HOUR * baseOffset));
      const nextWindowIsAlsoGoodWeather = log.Weather.some(weather => weather === eWeather.getWeather(new Date(goodWeatherTime + EIGHT_HOURS)));
      let effectiveWindowEndTime = log.Window.EndTime > log.Window.StartTime ? log.Window.EndTime : log.Window.EndTime + 24
      if (effectiveWindowEndTime >= phase.EndTime && !nextWindowIsAlsoGoodWeather) {
        effectiveWindowEndTime = phase.EndTime;
      }
      const CollectableWindowEndTime = new Date(goodWeatherTime + ((baseOffset + effectiveWindowEndTime - effectiveWindowStartTime) * ONE_HOUR));
      updateCollectionWindow({Key: log.Key, CollectableWindowStartTime, CollectableWindowEndTime, LastUpdated: new Date()})
    } else {
      updateCollectionWindow({Key: log.Key, LastUpdated: new Date()});
    }
  }, [
    log.Key,
    log.Weather,
    log.Window,
    log.ZoneId,
    log.CollectableWindowStartTime,
    log.CollectableWindowEndTime,
    log.LastUpdated,
    times,
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
    />
  );
};

export default SightLog