import { useRef } from "react";
import type { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../store/useGameStore";

interface ObstacleProps {
  id: number;
  position: [number, number, number];
}

function Obstacle({ id, position }: ObstacleProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    // gerakkan obstacle
    meshRef.current.position.z += useGameStore.getState().speed * delta;

    // cek status game
    const status = useGameStore.getState().status;
    if (status !== "PLAYING") return;

    // deteksi tabrakan
    const playerPos = useGameStore.getState().playerPosition;
    const distanceX = Math.abs(playerPos[0] - meshRef.current.position.x);
    const distanceZ = Math.abs(playerPos[2] - meshRef.current.position.z);

    if (distanceX < 0.8 && distanceZ < 0.8) {
      console.log("terdeteksi tabrakan");
      useGameStore.getState().endGame();
      return;
    }

    // garbage collector
    if (meshRef.current.position.z > 15) {
      useGameStore.getState().removeObstacle(id);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default Obstacle;
