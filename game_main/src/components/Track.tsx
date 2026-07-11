import { useRef } from "react";
import type { Mesh } from "three";

function Track() {
  const trackRef = useRef<Mesh>(null);

  return (
    <mesh ref={trackRef} position={[0, -0.1, -50]}>
      <boxGeometry args={[6, 0.2, 150]} />
      <meshStandardMaterial color="#444444" roughness={0.9} />
    </mesh>
  );
}

export default Track;
