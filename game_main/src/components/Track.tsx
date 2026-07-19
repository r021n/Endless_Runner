import { useRef } from "react";
import type { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../store/useGameStore";

const TRACK_LENGTH = 120;

function Track() {
  const trackRef1 = useRef<Mesh>(null);
  const trackRef2 = useRef<Mesh>(null);
  const scoreTimeRef = useRef(0);

  useFrame((_, delta) => {
    if (!trackRef1.current || !trackRef2.current) return;
    if (useGameStore.getState().status !== "PLAYING") return;

    const speed = useGameStore.getState().speed;

    trackRef1.current.position.z += speed * delta;
    trackRef2.current.position.z += speed * delta;

    if (trackRef1.current.position.z > 65) {
      trackRef1.current.position.z =
        trackRef2.current.position.z - TRACK_LENGTH;
    }

    if (trackRef2.current.position.z > 65) {
      trackRef2.current.position.z =
        trackRef1.current.position.z - TRACK_LENGTH;
    }

    scoreTimeRef.current += delta;
    if (scoreTimeRef.current >= 0.1) {
      scoreTimeRef.current = 0;
      useGameStore.setState((state) => ({ score: state.score + 1 }));
    }
  });

  return (
    <>
      <mesh ref={trackRef1} position={[0, -0.1, -50]} receiveShadow>
        <boxGeometry args={[6, 0.2, TRACK_LENGTH]} />
        <meshStandardMaterial color="#444444" roughness={0.9} />
      </mesh>
      <mesh ref={trackRef2} position={[0, -0.1, -170]} receiveShadow>
        <boxGeometry args={[6, 0.2, TRACK_LENGTH]} />
        <meshStandardMaterial color="#444444" roughness={0.9} />
      </mesh>
    </>
  );
}

export default Track;
