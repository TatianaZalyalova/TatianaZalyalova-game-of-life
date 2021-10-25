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
    const buttonClean = document.querySelector(
      ".clean-button"
    ) as HTMLButtonElement;
    if (buttonClean) {
      buttonClean.addEventListener("click", function () {
        const allLiveCells = document.querySelectorAll(".cell.cell--alive");
        allLiveCells.forEach((item) => {
          item.classList.remove("cell--alive");
        });

        for (let i = 0; i < gameField.arrState.length; i++) {
          for (let j = 0; j < gameField.arrState[i].length; j++) {
            if (gameField.arrState[i][j] === 1) {
              gameField.arrState[i][j] = 0;
            }
          }
        }
      });
    }

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
      if (buttonClean) {
        buttonClean.disabled = true;
      }
    });

    function tick(): void {
      if (isGameRun) {
        const numberOfLivingCells: number | null =
          document.querySelectorAll(".cell.cell--alive").length;
        const stateCorrent = gameField.nextGeneration();
        if (numberOfLivingCells === 0 || stateCorrent === false) {
          isGameRun = false;
          gameView.updateGameState({
            isRunning: isGameRun,
          });
          if (gameField.arrStateBefore) {
            gameField.arrStateBefore.length = 0;
          }
          if (buttonClean) {
            buttonClean.disabled = false;
          }
        } else {
          gameView.updateGameField(gameField.getState());
          inputRange?.addEventListener("change", function () {
            clearInterval(interval);
            stepDurationMs = Number(inputRange.value);
            interval = setInterval(tick, stepDurationMs);
          });
        }
      }
    }
    let interval = setInterval(tick, stepDurationMs);
  }
}
