import { useState } from "react";
import {
  CssBaseline,
  IconButton,
  Paper,
  ThemeProvider,
  Tooltip,
  unstable_createMuiStrictModeTheme,
} from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { GitHub } from "@mui/icons-material";
import { useStateWithLocalStorage } from "../hooks/useStateWithLocalStorage";
import NoSleep from "nosleep.js";

/* enable NoSleep per https://github.com/richtr/NoSleep.js#usage */
const noSleep = new NoSleep();
document.addEventListener(
  "click",
  function enableNoSleep() {
    document.removeEventListener("click", enableNoSleep, false);
    noSleep.enable();
  },
  false
);

interface Player {
  /**
   * The player's name
   */
  name: string;
  /**
   * The player's place in the play order. 0-indexed
   */
  order: number;
  /**
   * The cumulative time that it has been this player's turn this game
   */
  timePlayed: number;
}

function App() {
  const [gameActive, setGameActive] = useStateWithLocalStorage(
    "gameActive",
    false
  );
  const [players, setPlayers] = useStateWithLocalStorage<Player[]>(
    "players",
    []
  );
  const [playTimeLimit, setPlayTimeLimit] = useStateWithLocalStorage(
    "playTimeLimit",
    30
  );
  // note that we always want the page to load in a paused state, so we're not
  // saving this to localStorage
  const [timePaused, setTimerPaused] = useState(true);

  const theme = unstable_createMuiStrictModeTheme({
    palette: { mode: "dark", primary: blueGrey },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        id="app"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={5}
          // TODO: make this responsive
          style={{ width: 500, height: 500, margin: 20 }}
        ></Paper>
        <Tooltip
          title="See the code on github.com"
          placement="top"
          arrow
          disableInteractive
        >
          <IconButton
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/thisisrandy/multi-chess-clock"
          >
            <GitHub />
          </IconButton>
        </Tooltip>
      </div>
    </ThemeProvider>
  );
}

export default App;
