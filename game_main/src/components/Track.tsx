import { useRef } from "react";
import type { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../store/useGameStore";

function Track() {
  const trackRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!trackRef.current) return;
    if (useGameStore.getState().status !== "PLAYING") return;
    trackRef.current.position.z += useGameStore.getState().speed * delta;
    if (trackRef.current.position.z > 10) {
      trackRef.current.position.z -= 150;
    }
  });

  return (
    <mesh ref={trackRef} position={[0, -0.1, -50]}>
      <boxGeometry args={[6, 0.2, 150]} />
      <meshStandardMaterial color="#444444" roughness={0.9} />
    </mesh>
  );
}

export default Track;
