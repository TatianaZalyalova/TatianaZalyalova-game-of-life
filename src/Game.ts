import { GameField, IGameField } from "./GameField";
import { GameView, IGameView } from "./GameView";

export class Game {
  constructor(
    gameField: IGameField | GameField,
    gameView: IGameView | GameView
  ) {
    const state = gameField.getState();
    const inputRange = document.querySelector(
      ".field-speed"
    ) as HTMLInputElement;
    let stepDurationMs!: number;
    if (inputRange) {
      stepDurationMs = Number(inputRange.value);
    }
    let isGameRun = false;

    gameView.updateGameField(state);
    gameView.updateGameState({
      height: state.length,
      isRunning: false,
      width: state[0].length,
    });
    gameView.onCellClick(function (y: number, x: number) {
      gameField.toggleCellState(y, x);
      gameView.updateGameField(gameField.getState());
    });
    gameView.onFieldSizeChange(function (width: number, height: number) {
      gameField.setSize(width, height);
      const newState = gameField.getState();
      gameView.updateGameField(newState);
      gameView.updateGameState({
        height: newState.length,
        width: newState[0].length,
      });
    });

    gameView.onGameStateChange(function (gameRunState: boolean) {
      gameView.updateGameState({
        isRunning: gameRunState,
      });
      isGameRun = gameRunState;
      if (gameRunState) {
        gameField.nextGeneration();
        gameView.updateGameField(gameField.getState());
      }
    });

    function tick(): void {
      if (isGameRun) {
        gameField.nextGeneration();
        gameView.updateGameField(gameField.getState());
        inputRange?.addEventListener("change", function () {
          clearInterval(interval);
          stepDurationMs = Number(inputRange.value);
          interval = setInterval(tick, stepDurationMs);
        });
        const numberOfLivingCells: number | null =
          document.querySelectorAll(".cell.cell--alive").length;
        if (numberOfLivingCells === 0) {
          isGameRun = false;
          gameView.updateGameState({
            isRunning: isGameRun,
          });
        }
      }
    }
    let interval = setInterval(tick, stepDurationMs);
  }
}
