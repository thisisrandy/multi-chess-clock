import { Paper } from "@mui/material";

export default function ActiveGame() {
  return (
    <Paper
      elevation={5}
      style={{
        width: 300,
        height: 300,
        margin: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    ></Paper>
  );
}
