import { useState, useEffect } from "react";
import {
  Alert,
  Button,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { Player } from "../types";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import TimerIcon from "@mui/icons-material/Timer";
import UndoIcon from "@mui/icons-material/Undo";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";

interface Props {
  setGameActive: React.Dispatch<React.SetStateAction<boolean>>;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  playTimeLimit: number;
}

function formatTime(seconds: number): string {
  const hh = Math.floor(seconds / 3600);
  seconds %= 3600;
  const mm = Math.floor(seconds / 60);
  seconds %= 60;
  const ss = Math.floor(seconds);
  const res = `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  if (hh) return `${String(hh).padStart(2, "0")}:${res}`;
  else return res;
}

/**
 * Timer update interval in ms
 */
const intervalPeriod = 100;
const intervalPeriodSeconds = intervalPeriod / 1000;

export default function ActiveGame({
  setGameActive,
  players,
  setPlayers,
  playTimeLimit,
}: Props) {
  // note that we always want the page to load in a paused state, so we're not
  // saving this to localStorage
  const [timerPaused, setTimerPaused] = useState(true);
  const [stopDialogOpen, setStopDialogOpen] = useState(false);
  const [overageSnackOpen, setOverageSnackOpen] = useState(false);
  const [overageSnackMessage, setOverageSnackMessage] = useState("");

  const handlePunchTimer = () => {
    const newPlayers = [...players.slice(1), players[0]];
    newPlayers[0].timeLastTurn = 0;
    setPlayers(newPlayers);
  };
  const handleGoBackward = () => {
    setPlayers((players) => [
      players[players.length - 1],
      ...players.slice(0, players.length - 1),
    ]);
  };
  const handleReverseOrder = () => {
    setPlayers((players) => [players[0], ...players.slice(1).reverse()]);
  };
  const handlePause = () => setTimerPaused((paused) => !paused);
  const handleCloseStopDialog = () => setStopDialogOpen(false);
  const handleStop = () => setGameActive(false);
  const handleOverageSnackClose = () => setOverageSnackOpen(false);

  useEffect(() => {
    if (timerPaused) {
      return;
    }
    const timer = setInterval(
      () =>
        setPlayers((players) => {
          const timeLastTurn = players[0].timeLastTurn + intervalPeriodSeconds;
          const timePlayed = players[0].timePlayed + intervalPeriodSeconds;
          let isOverTime = players[0].isOverTime;
          if (timePlayed > playTimeLimit * 60 && !isOverTime) {
            setOverageSnackMessage(
              `${players[0].name} exceeded their allotted play time of ${playTimeLimit} minutes`
            );
            setOverageSnackOpen(true);
            isOverTime = true;
          }
          return [
            {
              ...players[0],
              timeLastTurn,
              timePlayed,
              isOverTime,
            },
            ...players.slice(1, players.length),
          ];
        }),
      intervalPeriod
    );
    return () => clearInterval(timer);
  }, [timerPaused, setPlayers, playTimeLimit]);

  return (
    <>
      {/* Main interface */}
      <Paper
        elevation={5}
        style={{
          width: 300,
          margin: "10px 0px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "5px 0px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Tooltip
            title={
              timerPaused
                ? "The timer is paused. Unpause it to continue play"
                : "Punch the clock to advance to the next player"
            }
            arrow
            disableInteractive
          >
            <span
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <IconButton
                onClick={handlePunchTimer}
                style={{ width: "60%", height: "60%" }}
                disabled={timerPaused}
              >
                <TimerIcon style={{ width: "100%", height: "100%" }} />
              </IconButton>
            </span>
          </Tooltip>
          <span
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <Tooltip title="Return to the previous player" disableInteractive>
              <IconButton onClick={handleGoBackward}>
                <UndoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reverse play order" disableInteractive>
              <IconButton onClick={handleReverseOrder}>
                <SettingsBackupRestoreIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={timerPaused ? "Restart the timer" : "Pause the timer"}
              disableInteractive
            >
              <IconButton onClick={handlePause}>
                {timerPaused ? <PlayCircleIcon /> : <PauseCircleIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="End the game" disableInteractive>
              <IconButton
                onClick={() => {
                  setTimerPaused(true);
                  setStopDialogOpen(true);
                }}
              >
                <StopCircleIcon />
              </IconButton>
            </Tooltip>
          </span>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {players.map((player, i) => (
            <Paper
              key={i}
              elevation={2}
              style={{
                width: "90%",
                margin: 5,
                marginTop: 0,
                padding: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  player.timePlayed > playTimeLimit * 60 ? "#a63030" : "",
              }}
            >
              <Typography variant="body1">{player.name}</Typography>
              <Typography variant="subtitle2">
                {`${formatTime(player.timeLastTurn)} turn / ${formatTime(
                  player.timePlayed
                )} game`}
              </Typography>
              {i === 0 && (
                <Typography variant="subtitle2">
                  {` (${formatTime(
                    players
                      .map((p) => p.timePlayed)
                      .reduce((acc, time) => acc + time, 0)
                  )} all players)`}
                </Typography>
              )}
            </Paper>
          ))}
        </div>
      </Paper>

      {/* Stop confirmation dialog */}
      <Dialog open={stopDialogOpen} onClose={handleCloseStopDialog}>
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            You chose to end the game. Are you sure?{" "}
            <em>This is not reversible.</em>
          </Typography>
        </DialogContent>
        <DialogActions
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          <Button
            variant="contained"
            onClick={handleStop}
            style={{ marginRight: 20 }}
          >
            End the game
          </Button>
          <Button variant="contained" onClick={handleCloseStopDialog}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Overage snackbar */}
      <Snackbar open={overageSnackOpen} onClose={handleOverageSnackClose}>
        <Alert
          onClose={handleOverageSnackClose}
          severity={"error"}
          style={{ width: "100%" }}
        >
          {overageSnackMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
