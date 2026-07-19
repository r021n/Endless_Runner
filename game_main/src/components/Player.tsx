import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import type { Mesh } from "three";
import { useKeyboardControls } from "@react-three/drei";
import { useGameStore } from "../store/useGameStore";

function Player() {
  const playerRef = useRef<Mesh>(null);
  const targetRef = useRef(0);
  const [subscribeKeys] = useKeyboardControls();

  useEffect(() => {
    const unsubscribe = useGameStore.subscribe((state, prevState) => {
      if (state.status === "PLAYING" && prevState.status !== "PLAYING") {
        targetRef.current = 0;
        if (playerRef.current) {
          playerRef.current.position.set(0, 0.5, 0);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeKeys(
      (state) => state,
      (pressed) => {
        if (useGameStore.getState().status !== "PLAYING") return;
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
    if (useGameStore.getState().status !== "PLAYING") return;
    playerRef.current.position.x = THREE.MathUtils.lerp(
      playerRef.current.position.x,
      targetRef.current,
      delta * 10,
    );
    useGameStore
      .getState()
      .setPlayerPosition([
        playerRef.current.position.x,
        playerRef.current.position.y,
        playerRef.current.position.z,
      ]);
  });

  return (
    <mesh ref={playerRef} position={[0, 0.5, 0]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

export default Player;
