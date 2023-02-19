import { WEATHER_MAPPING, EMOTE_MAPPING } from "./Constants";
import { Alert, Avatar, Card, CardContent, CardHeader, Chip, Link, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

function SightLogView({
  Key,
  Name,
  ZoneName,
  Coordinates,
  Weather,
  Emote,
  Comment,
  URL,
  CollectableWindowStartTime,
  CollectableWindowEndTime,
  WindowStartDisplay,
  WindowEndDisplay,
  AlertMessage
}) {
  return (
    <Card>
      <CardHeader
        title={
          <Link href={URL} underline="hover">
            {Key}. {Name}
          </Link>
        }
        subheader={`${ZoneName} (${Coordinates.X}, ${Coordinates.Y})`}
      />
      <CardContent>
        <Grid container spacing={1}>
          {AlertMessage != null && (
            <Grid xs={12}>
              <Alert severity="error">{AlertMessage}</Alert>
            </Grid>
          )}
          <Grid xs={4}>
            <Chip
              avatar={<Avatar alt={Emote} src={`${process.env.PUBLIC_URL}/emotes/${EMOTE_MAPPING[Emote]}`} />}
              label={Emote}                       
            />
          </Grid>
          <Grid xs={4}>
            <Chip
              label={`${WindowStartDisplay} - ${WindowEndDisplay}`}
            />
          </Grid>
          <Grid xs={4} container>
            {Weather.map(condition => (
              <Grid xs={12} key={condition}>
                <Chip size="small"
                  avatar={<Avatar alt={condition} src={`${process.env.PUBLIC_URL}/weather/${WEATHER_MAPPING[condition]}`} />}
                  label={condition}
                />
              </Grid>
            ))}
          </Grid>
          {CollectableWindowStartTime == null || CollectableWindowEndTime == null ? (
          <Typography variant="h4">N/A</Typography> 
            ) : (
                <Grid xs={12}>
                  <Typography variant="h6">Available: {CollectableWindowStartTime.toLocaleTimeString()} - {CollectableWindowEndTime.toLocaleTimeString()}</Typography>
                </Grid>
            )}
            <Grid xs={12}>
              <Typography paragraph>{Comment}</Typography>
            </Grid>
        </Grid>

      </CardContent>
    </Card>
  );
};

export default SightLogView
