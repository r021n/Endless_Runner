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
      <Canvas shadows camera={{ position: [0, 4, 8], fov: 55 }}>
        <color attach="background" args={["#202025"]} />
        <fog attach="fog" args={["#202025", 20, 90]} />
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 12, 4]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={20}
          shadow-camera-bottom={-100}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
          shadow-bias={-0.0005}
        />
        <Player />
        <Track />
        <ObstacleManager />
      </Canvas>
      <GameUI />
    </KeyboardControls>
  );
}

export default App;
