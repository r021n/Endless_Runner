import { create } from "zustand";

interface GameState {
  status: "START" | "PLAYING" | "GAMEOVER";
  score: number;
  speed: number;
  obstacles: { id: number; position: [number, number, number] }[];
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  addObstacle: (obs: {
    id: number;
    position: [number, number, number];
  }) => void;
  removeObstacle: (id: number) => void;
}

export const useGameStore = create<GameState>()((set) => ({
  status: "START",
  score: 0,
  speed: 15,
  obstacles: [],
  startGame: () =>
    set({
      status: "PLAYING",
      score: 0,
      obstacles: [],
    }),
  endGame: () => set({ status: "GAMEOVER" }),
  resetGame: () => set({ status: "START" }),
  addObstacle: (obs) =>
    set((state) => ({ obstacles: [...state.obstacles, obs] })),
  removeObstacle: (id) =>
    set((state) => ({
      obstacles: state.obstacles.filter((obs) => obs.id !== id),
    })),
}));
