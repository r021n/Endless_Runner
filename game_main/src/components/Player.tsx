import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useEffect } from "react";
import type { Mesh } from "three";
import { useKeyboardControls } from "@react-three/drei";

function Player() {
  const playerRef = useRef<Mesh>(null);
  const targetRef = useRef(0);
  const [subscribeKeys, getKeys] = useKeyboardControls();

  useEffect(() => {
    const unsubscribe = subscribeKeys(
      (state) => state,
      (pressed) => {
        if (pressed.left) {
          targetRef.current = Math.max(targetRef.current - 2, -2);
        }
        if (pressed.right) {
          targetRef.current = Math.min(targetRef.current + 2, 2);
        }
      },
    );
    return () => unsubscribe();
  }, [subscribeKeys]);

  useFrame((_, delta) => {
    if (!playerRef.current) return;
    playerRef.current.position.x = THREE.MathUtils.lerp(
      playerRef.current.position.x,
      targetRef.current,
      delta * 10,
    );
  });

  return (
    <mesh ref={playerRef} position={[0, 0.5, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

export default Player;
