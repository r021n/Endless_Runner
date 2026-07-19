import { useRef } from "react";
import type { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../store/useGameStore";

function Track() {
  const trackRef = useRef<Mesh>(null);
  const scoreTimeRef = useRef(0);

  useFrame((_, delta) => {
    if (!trackRef.current) return;
    if (useGameStore.getState().status !== "PLAYING") return;
    trackRef.current.position.z += useGameStore.getState().speed * delta;
    scoreTimeRef.current += delta;
    if (scoreTimeRef.current >= 0.1) {
      scoreTimeRef.current = 0;
      useGameStore.setState((state) => ({ score: state.score + 1 }));
    }
    if (trackRef.current.position.z > 10) {
      trackRef.current.position.z -= 120;
    }
  });

  return (
    <mesh ref={trackRef} position={[0, -0.1, -50]} receiveShadow>
      <boxGeometry args={[6, 0.2, 120]} />
      <meshStandardMaterial color="#444444" roughness={0.9} />
    </mesh>
  );
}

export default Track;
