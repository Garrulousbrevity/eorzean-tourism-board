import React from 'react';
import EorzeaWeather from 'eorzea-weather';
import EorzeaTime from 'eorzea-time';
import { EIGHT_HOURS, ONE_HOUR, PHASES } from './Constants';
import { useState, useEffect } from 'react';
import SightLogView from './SightLogView';
import useDeepCompareEffect from 'use-deep-compare-effect';

const timesIntersect = (Range1, Range2) => {
  if (Range1.StartTime > Range1.EndTime) {
    return (
      timesIntersect(Range2, { StartTime: Range1.StartTime, EndTime: 24 }) ||
      timesIntersect(Range2, { StartTime: 0, EndTime: Range1.EndTime })
    );
  }
  if (Range2.StartTime > Range2.EndTime) {
    return (
      timesIntersect(Range1, { StartTime: Range2.StartTime, EndTime: 24 }) ||
      timesIntersect(Range1, { StartTime: 0, EndTime: Range2.EndTime })
    );
  }
  return Range1.StartTime < Range2.EndTime && Range1.EndTime > Range2.StartTime;
};

const getStartOfDay = (date) => {
  const msec = date.getTime();
  const bell = (msec / ONE_HOUR) % 24;
  return msec - Math.round(ONE_HOUR * bell);
};

const getTimeDisplay = (time) => {
  if (time === 0) return '12AM';
  if (time === 12) return '12PM';
  if (time > 11) return `${time % 12}PM`;
  return `${time}AM`;
};

const getWindow = ({ log, currentTime }) => {
  const eWeather = new EorzeaWeather(log.ZoneId);
  const phases = PHASES.filter((phase) => timesIntersect(phase, log.Window));
  let goodWeatherFound = false;
  let startOfWeatherWindow = 0;
  while (!goodWeatherFound) {
    if (startOfWeatherWindow === 0) {
      startOfWeatherWindow = getStartOfDay(new Date(currentTime));
    } else {
      startOfWeatherWindow += EIGHT_HOURS;
    }
    const startOfWeatherWindowDate = new Date(startOfWeatherWindow);
    const phase = phases.find(
      (phase) =>
        phase.StartTime === new EorzeaTime(startOfWeatherWindowDate).getHours()
    );
    if (phase == null) continue;
    if (
      !log.Weather.some(
        (allowedWeather) =>
          allowedWeather === eWeather.getWeather(startOfWeatherWindowDate)
      )
    )
      continue;
    const effectiveWindowStartTime = Math.max(
      phase.EndTime < log.Window.StartTime // This is checking for whether the log crosses midnight into the next day
        ? phase.StartTime
        : log.Window.StartTime,
      phase.StartTime
    );
    const baseOffset = effectiveWindowStartTime - phase.StartTime;
    const CollectableWindowStartTime = new Date(
      startOfWeatherWindow + ONE_HOUR * baseOffset
    );
    const nextWindowStart = (startOfWeatherWindow += EIGHT_HOURS);
    const nextWindowIsAlsoGoodWeather = log.Weather.some(
      (weather) => weather === eWeather.getWeather(new Date(nextWindowStart))
    );
    let effectiveWindowEndTime =
      log.Window.EndTime > log.Window.StartTime
        ? log.Window.EndTime
        : log.Window.EndTime + 24;
    if (
      effectiveWindowEndTime >= phase.EndTime + 1 &&
      !nextWindowIsAlsoGoodWeather
    ) {
      effectiveWindowEndTime = phase.EndTime + 1;
    }
    const CollectableWindowEndTime = new Date(
      CollectableWindowStartTime.getTime() +
        (effectiveWindowEndTime - effectiveWindowStartTime) * ONE_HOUR
    );
    if (new Date(currentTime) > CollectableWindowEndTime) continue;
    return {
      Key: log.Key,
      CollectableWindowStartTime,
      CollectableWindowEndTime,
    };
  }
};

function SightLog({
  log,
  updateCollectionWindow,
  onChangeMarkAsFound,
  currentTime,
}) {
  const [windowStartDisplay, setWindowStartDisplay] = useState('');
  const [windowEndDisplay, setWindowEndDisplay] = useState('');
  const [alert, setAlert] = useState(null);

  useDeepCompareEffect(() => {
    if (
      currentTime != null ||
      log.CollectableWindowStartTime != null ||
      log.CollectableWindowEndTime != null ||
      currentTime > log.CollectableWindowEndTime
    )
      updateCollectionWindow(getWindow({ log, currentTime }));
  }, [log, updateCollectionWindow, currentTime]);

  useEffect(() => {
    setWindowStartDisplay(getTimeDisplay(log.Window.StartTime));
    setWindowEndDisplay(getTimeDisplay(log.Window.EndTime));
  }, [log.Window.StartTime, log.Window.EndTime]);

  useEffect(() => {
    setAlert(
      log.CollectableWindowStartTime != null &&
        log.CollectableWindowEndTime != null &&
        log.CollectableWindowStartTime >= log.CollectableWindowEndTime
        ? 'This is an impossible time range'
        : null
    );
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
}

export default SightLog;
