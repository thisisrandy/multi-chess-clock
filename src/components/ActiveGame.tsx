import { useState } from "react";
import {
  Button,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { Player } from "../types";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import TimerIcon from "@mui/icons-material/Timer";
import UndoIcon from "@mui/icons-material/Undo";

interface Props {
  setGameActive: React.Dispatch<React.SetStateAction<boolean>>;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  playTimeLimit: number;
}

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

  const handlePunchTimer = () => {
    setPlayers((players) => [...players.slice(1, players.length), players[0]]);
  };
  const handleGoBackward = () => {
    setPlayers((players) => [
      players[players.length - 1],
      ...players.slice(0, players.length - 1),
    ]);
  };
  const handlePause = () => setTimerPaused((paused) => !paused);
  const handleCloseStopDialog = () => setStopDialogOpen(false);
  const handleStop = () => setGameActive(false);

  return (
    <>
      {/* Main interface */}
      <Paper
        elevation={5}
        style={{
          width: 300,
          margin: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
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
          <IconButton
            onClick={handlePunchTimer}
            style={{ width: "60%", height: "60%" }}
            disabled={timerPaused}
          >
            <TimerIcon style={{ width: "100%", height: "100%" }} />
          </IconButton>
          <span
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <IconButton onClick={handleGoBackward}>
              <UndoIcon />
            </IconButton>
            <IconButton onClick={handlePause}>
              <PauseCircleIcon />
            </IconButton>
            <IconButton onClick={() => setStopDialogOpen(true)}>
              <StopCircleIcon />
            </IconButton>
          </span>
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
            Stop the game
          </Button>
          <Button variant="contained" onClick={handleCloseStopDialog}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
