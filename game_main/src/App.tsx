import { Canvas } from "@react-three/fiber";
import Player from "./components/Player";
import Track from "./components/Track";

function App() {
  return (
    <Canvas camera={{ position: [0, 4, 8], fov: 55 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 12, 4]} intensity={1.2} />
      <Player />
      <Track />
    </Canvas>
  );
}

export default App;
