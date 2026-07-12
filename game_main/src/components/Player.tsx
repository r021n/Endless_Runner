import { useRef } from "react";
import type { Mesh } from "three";
import { useKeyboardControls } from "@react-three/drei";

function Player() {
  const playerRef = useRef<Mesh>(null);
  const [subscribeKeys, getKeys] = useKeyboardControls();

  subscribeKeys;
  getKeys;

  return (
    <mesh ref={playerRef} position={[0, 0.5, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

export default Player;
