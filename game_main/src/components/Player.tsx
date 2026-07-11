import { useRef } from "react";
import type { Mesh } from "three";

function Player() {
  const playerRef = useRef<Mesh>(null);

  return (
    <mesh ref={playerRef} position={[0, 0.5, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

export default Player;
