import './App.css';
import { useState, useEffect, useMemo } from 'react';
import {DATA, ONE_HOUR, EIGHT_HOURS, ONE_DAY, DAYS_TO_CHECK} from './Constants';
import range from 'lodash/range'
import SightLog from './SightLog';
import { Container } from '@mui/system';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Unstable_Grid2';


function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [times, setTimes] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [logs, setLogs] = useState(DATA);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  useEffect(() => {
    const msec = new Date().getTime();
    const bell = (msec / ONE_HOUR) % 24;
    const startMsec = msec - Math.round(ONE_HOUR * bell);
    setTimes(range(
      startMsec,
      startMsec + ONE_DAY * DAYS_TO_CHECK,
      EIGHT_HOURS,
    ));
  }, [
    lastRefresh
  ]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main">
        <Grid container spacing={2}>
          <Grid xs={12}>
            <img className="headerImage" src={`${process.env.PUBLIC_URL}/greetings-from-eorzea.png`} alt="Greetings from Eorzea header" />
          </Grid>
          {logs.map((log) => (
          <Grid xs={4} key={log.Key}>
            <SightLog
              log={log}
              times={times}
              onRefresh={() => setLastRefresh(new Date())}
            />
          </Grid>
        ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
