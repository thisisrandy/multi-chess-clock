import { useEffect, useState } from "react";
import { Player } from "../types/index";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

interface Props {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  playTimeLimit: number;
  setPlayTimeLimit: React.Dispatch<React.SetStateAction<number>>;
  setGameActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NewGame({
  players,
  setPlayers,
  playTimeLimit,
  setPlayTimeLimit,
  setGameActive,
}: Props) {
  const [newGameDialogOpen, setNewGameDialogOpen] = useState(false);
  const [addPlayerDialogOpen, setAddPlayerDialogOpen] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [playTimeIsValid, setPlayTimeIsValid] = useState(true);

  const handleNewGameDialogClose = () => setNewGameDialogOpen(false);
  const handleAddPlayerDialogClose = () => {
    setAddPlayerDialogOpen(false);
    setNewPlayerName("");
  };
  const handleStartNewGame = () => {
    setPlayers((players) =>
      players.map((p) => ({ name: p.name, timePlayed: 0 }))
    );
    setGameActive(true);
    handleNewGameDialogClose();
  };
  const addPlayer = () => {
    setPlayers((players) => [
      ...players,
      { name: newPlayerName, timePlayed: 0 },
    ]);
    handleAddPlayerDialogClose();
  };
  const removePlayer = (index: number) =>
    setPlayers((players) => [
      ...players.slice(0, index),
      ...players.slice(index + 1, players.length),
    ]);

  useEffect(
    () =>
      setPlayTimeIsValid(Number.isInteger(playTimeLimit) && playTimeLimit > 0),
    [playTimeLimit]
  );

  return (
    <>
      {/* Base interface */}
      <Tooltip title="Start a new game" arrow disableInteractive>
        <IconButton
          onClick={() => setNewGameDialogOpen(true)}
          style={{ width: "90%", height: "90%" }}
        >
          <AddCircleIcon style={{ width: "100%", height: "100%" }} />
        </IconButton>
      </Tooltip>

      {/* New game dialog */}
      <Dialog
        open={newGameDialogOpen}
        onClose={handleNewGameDialogClose}
        style={{ zIndex: 1 }}
      >
        <DialogTitle>New Game</DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
              justifyContent: "center",
              paddingBottom: 10,
              width: 275,
            }}
          >
            <Typography variant="body1">Players</Typography>
            {players.map((player, i) => (
              <span
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <DragHandleIcon />
                <Typography>{player.name}</Typography>
                <IconButton onClick={() => removePlayer(i)}>
                  <RemoveCircleIcon />
                </IconButton>
              </span>
            ))}
            <span style={{ display: "flex", justifyContent: "center" }}>
              <IconButton onClick={() => setAddPlayerDialogOpen(true)}>
                <AddCircleIcon />
              </IconButton>
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
              justifyContent: "center",
            }}
          >
            <TextField
              label={"Play time per player"}
              value={playTimeLimit}
              onChange={(e) => {
                setPlayTimeLimit(Number(e.target.value));
              }}
              /* FIXME: when this displays, it causes the dialog to expand */
              helperText={
                playTimeIsValid
                  ? null
                  : "Must be an integral value greater than zero"
              }
            />
          </div>
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
            onClick={handleStartNewGame}
            style={{ marginRight: 20 }}
            disabled={!playTimeIsValid}
          >
            Start Playing
          </Button>
          <Button variant="contained" onClick={handleNewGameDialogClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add player dialog. TODO: Replace with in-line player name editing */}
      <Dialog
        open={addPlayerDialogOpen}
        onClose={handleAddPlayerDialogClose}
        style={{ zIndex: 2 }}
      >
        <DialogTitle>Add Player</DialogTitle>
        <DialogContent
          style={{ display: "flex", justifyContent: "center", paddingTop: 5 }}
        >
          <TextField
            label="New player name"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            autoFocus={true}
          />
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
            onClick={addPlayer}
            style={{ marginRight: 20 }}
            disabled={newPlayerName === ""}
          >
            Add Player
          </Button>
          <Button variant="contained" onClick={handleAddPlayerDialogClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
