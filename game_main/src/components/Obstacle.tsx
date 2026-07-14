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
    meshRef.current.position.z += useGameStore.getState().speed * delta;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default Obstacle;
