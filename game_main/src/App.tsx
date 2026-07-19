import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import Player from "./components/Player";
import Track from "./components/Track";
import ObstacleManager from "./components/ObstacleManager";
import GameUI from "./components/GameUI";

function App() {
  return (
    <KeyboardControls
      map={[
        { name: "left", keys: ["ArrowLeft", "KeyA"] },
        { name: "right", keys: ["ArrowRight", "KeyD"] },
      ]}
    >
      <Canvas camera={{ position: [0, 4, 8], fov: 55 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 12, 4]} intensity={1.2} />
        <Player />
        <Track />
        <ObstacleManager />
      </Canvas>
      <GameUI />
    </KeyboardControls>
  );
}

export default App;
