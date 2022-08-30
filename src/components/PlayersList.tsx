import { useMemo } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
  DropResult,
} from "react-beautiful-dnd";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { IconButton, ListItem, Typography } from "@mui/material";
import { Player } from "../types";

interface Props {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
}

export default function PlayersList({ players, setPlayers }: Props) {
  const playersList = useMemo(() => {
    const onDragEnd: OnDragEndResponder = ({
      destination,
      source,
    }: DropResult) => {
      if (!destination || destination.index === source.index) return;
      const res = Array.from(players);
      const [removed] = res.splice(source.index, 1);
      res.splice(destination.index, 0, removed);
      setPlayers(res);
    };

    const removePlayer = (index: number) =>
      setPlayers((players) => [
        ...players.slice(0, index),
        ...players.slice(index + 1, players.length),
      ]);

    return (
      // IMPORTANT: Strict mode breaks react-beautiful-dnd. Make sure to turn
      // it off for testing. Also, react-beautiful-dnd complains "Droppable:
      // unsupported nested scroll container detected" when this is used inside
      // a dialog or the like. However, it seems to work just fine
      <DragDropContext {...{ onDragEnd }}>
        <Droppable droppableId="players-list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {players.map((player, i) => (
                <Draggable
                  key={player.name}
                  draggableId={player.name}
                  index={i}
                >
                  {(provided, snapshot) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 0 0 8px",
                        borderRadius: 3,
                        backgroundColor: snapshot.isDragging ? "#696969" : "",
                        // FIXME: this doens't seem to be working...
                        transition: "background-color 0.5s ease",
                        ...provided.draggableProps.style,
                      }}
                    >
                      <DragHandleIcon />
                      <Typography>{player.name}</Typography>
                      <IconButton onClick={() => removePlayer(i)}>
                        <RemoveCircleIcon />
                      </IconButton>
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }, [players, setPlayers]);

  return playersList;
}
