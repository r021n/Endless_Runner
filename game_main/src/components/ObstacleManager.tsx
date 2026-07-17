import { useEffect, useRef } from "react";
import { useGameStore } from "../store/useGameStore";
import { useShallow } from "zustand/shallow";
import Obstacle from "./Obstacle";

function ObstacleManager() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { status, obstacles } = useGameStore(
    useShallow((state) => ({
      status: state.status,
      obstacles: state.obstacles,
    })),
  );

  useEffect(() => {
    if (status !== "PLAYING") {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      const lanes = [-2, 0, 2];
      const randomLane = lanes[Math.floor(Math.random() * lanes.length)];

      useGameStore.getState().addObstacle({
        id: Math.random(),
        position: [randomLane, 0.5, -80],
      });
    }, 1500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status]);

  return (
    <>
      {obstacles.map((obs) => (
        <Obstacle key={obs.id} id={obs.id} position={obs.position} />
      ))}
    </>
  );
}

export default ObstacleManager;
