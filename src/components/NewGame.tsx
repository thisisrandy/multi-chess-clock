import { useEffect, useState } from "react";
import { Player } from "../types/index";
import AddCircleIcon from "@mui/icons-material/AddCircle";
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
  Paper,
} from "@mui/material";
import PlayersList from "./PlayersList";

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
  const [newPlayerNameIsValid, setNewPlayerNameIsValid] = useState(false);
  const [newPlayerNameIsUnique, setNewPlayerNameIsUnique] = useState(false);
  const [playTimeIsValid, setPlayTimeIsValid] = useState(true);

  const handleNewGameDialogClose = () => setNewGameDialogOpen(false);
  const handleAddPlayerDialogClose = () => {
    setAddPlayerDialogOpen(false);
    setNewPlayerName("");
  };
  const handleStartNewGame = () => {
    setPlayers((players) =>
      players.map((p) => ({
        ...p,
        timeLastTurn: 0,
        timePlayed: 0,
        isOverTime: false,
      }))
    );
    setGameActive(true);
    handleNewGameDialogClose();
  };
  const addPlayer = () => {
    setPlayers((players) => [
      ...players,
      {
        name: newPlayerName,
        timeLastTurn: 0,
        timePlayed: 0,
        isOverTime: false,
      },
    ]);
    handleAddPlayerDialogClose();
  };

  useEffect(
    () =>
      setPlayTimeIsValid(Number.isInteger(playTimeLimit) && playTimeLimit > 0),
    [playTimeLimit]
  );
  useEffect(
    () =>
      setNewPlayerNameIsUnique(
        players
          .map((p) => p.name !== newPlayerName)
          .reduce((acc, eq) => acc && eq, true)
      ),
    [newPlayerName, players]
  );
  useEffect(
    () =>
      setNewPlayerNameIsValid(
        newPlayerName.length > 0 && newPlayerNameIsUnique
      ),
    [newPlayerName, newPlayerNameIsUnique]
  );

  return (
    <>
      {/* Base interface */}
      <Paper
        elevation={5}
        style={{
          width: 300,
          height: 300,
          margin: "10px 0px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Tooltip title="Start a new game" arrow disableInteractive>
          <IconButton
            onClick={() => setNewGameDialogOpen(true)}
            style={{ width: "90%", height: "90%" }}
          >
            <AddCircleIcon style={{ width: "100%", height: "100%" }} />
          </IconButton>
        </Tooltip>
      </Paper>

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
            <PlayersList {...{ players, setPlayers }} />
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
              label={"Play time per player (minutes)"}
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
            disabled={!playTimeIsValid || players.length === 0}
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
            autoFocus
            onKeyPress={(e) => {
              if (e.key === "Enter" && newPlayerNameIsValid) {
                addPlayer();
              }
            }}
            error={!newPlayerNameIsUnique}
            helperText={!newPlayerNameIsUnique ? "Name already in use" : ""}
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
            disabled={!newPlayerNameIsValid}
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
