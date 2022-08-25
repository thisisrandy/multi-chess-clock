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

function App() {
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
