import { useGameStore } from "../store/useGameStore";
import { useShallow } from "zustand/shallow";

function GameUI() {
  const { status, score, startGame, resetGame } = useGameStore(
    useShallow((state) => ({
      status: state.status,
      score: state.score,
      startGame: state.startGame,
      resetGame: state.resetGame,
    })),
  );

  const handleStart = () => {
    startGame();
  };

  const handleRestart = () => {
    resetGame();
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 10,
        pointerEvents: "none",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* START SCREEN */}
      {status === "START" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "white",
            pointerEvents: "auto",
          }}
        >
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
            ENDLESS RUNNER
          </h1>
          <p style={{ fontSize: "1.2rem", marginBottom: "2rem", opacity: 0.8 }}>
            Gunakan A/D atau ←/→ untuk bergerak
          </p>
          <button
            onClick={handleStart}
            style={{
              padding: "15px 40px",
              fontSize: "1rem",
              backgroundColor: "#ff4444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              pointerEvents: "auto",
            }}
          >
            MULAI
          </button>
        </div>
      )}

      {/* PLAYING Screen - Score HUD */}
      {status === "PLAYING" && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            color: "white",
            textAlign: "right",
          }}
        >
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            SCORE: {score}
          </div>
        </div>
      )}

      {/* GAMEOVER Screen */}
      {status === "GAMEOVER" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "white",
            pointerEvents: "auto",
          }}
        ></div>
      )}
    </div>
  );
}
