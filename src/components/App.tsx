import { useState } from "react";
import {
  CssBaseline,
  IconButton,
  ThemeProvider,
  Tooltip,
  unstable_createMuiStrictModeTheme,
} from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { GitHub } from "@mui/icons-material";
import { useStateWithLocalStorage } from "../hooks/useStateWithLocalStorage";
import NoSleep from "nosleep.js";
import NewGame from "./NewGame";
import ActiveGame from "./ActiveGame";
import { Player } from "../types/index";

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
  const [timerPaused, setTimerPaused] = useState(true);

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
        {(gameActive && <ActiveGame />) || (
          <NewGame
            {...{
              players,
              setPlayers,
              playTimeLimit,
              setPlayTimeLimit,
              setGameActive,
            }}
          />
        )}
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
