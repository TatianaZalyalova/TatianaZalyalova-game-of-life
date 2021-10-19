export interface IGameView {
  updateGameField(field: number[][]): void;
  updateGameState(state: {
    width?: number;
    height?: number;
    isRunning?: boolean;
  }): void;
  onCellClick(cb: (x: number, y: number) => void): any;
  onGameStateChange(cb: (newState: boolean) => void): any;
  onFieldSizeChange(cb: (width: number, height: number) => void): any;
}

export class GameView implements IGameView {
  el: HTMLElement;
  constructor(el: HTMLElement) {
    const gameField = document.createElement("div");
    gameField.classList.add("gameField");
    el.appendChild(gameField);

    const gameControls = document.createElement("div");
    gameControls.classList.add("gameControls");
    el.appendChild(gameControls);

    const buttonStopped: HTMLElement = document.createElement("button");
    buttonStopped.classList.add("run-button");
    buttonStopped.classList.add("run-button--stopped");
    buttonStopped.innerHTML = "Play";
    gameControls.appendChild(buttonStopped);

    const inputSizeWidth: HTMLElement = document.createElement("input");
    inputSizeWidth.classList.add("field-size");
    inputSizeWidth.classList.add("field-size--width");
    inputSizeWidth.setAttribute("type", "number");
    gameControls.appendChild(inputSizeWidth);

    const inputSizeHeight: HTMLElement = document.createElement("input");
    inputSizeHeight.classList.add("field-size");
    inputSizeHeight.classList.add("field-size--height");
    inputSizeHeight.setAttribute("type", "number");
    gameControls.appendChild(inputSizeHeight);

    const inputSpeed: HTMLInputElement = document.createElement("input");
    inputSpeed.classList.add("field-speed");
    inputSpeed.setAttribute("type", "range");
    inputSpeed.setAttribute("min", "1");
    inputSpeed.setAttribute("max", "5000");
    inputSpeed.setAttribute("step", "10");
    inputSpeed.value = "500";
    gameControls.appendChild(inputSpeed);

    this.el = el;
  }
  updateGameField(field: number[][]) {
    const gameFieldEl = this.el.querySelector(".gameField") as HTMLElement;
    gameFieldEl.innerHTML = `<table>
      <tbody>${field
        .map(
          (row, y) =>
            `<tr>${row
              .map(
                (cell, x) =>
                  `<td class="cell cell--${cell ? "alive" : "dead"}"></td>`
              )
              .join("")}
        </tr>`
        )
        .join("")}
      </tbody>
    </table>`;
  }

  updateGameState(state: {
    isRunning?: boolean;
    width?: number;
    height?: number;
  }) {
    const buttonRun = this.el.querySelector(".run-button") as HTMLButtonElement;
    const inputSizeHeight = this.el.querySelector(
      "input.field-size--height"
    ) as HTMLInputElement;
    const inputSizeWidth = this.el.querySelector(
      "input.field-size--width"
    ) as HTMLInputElement;
    if (state.isRunning) {
      buttonRun?.classList.remove("run-button--stopped");
      buttonRun?.classList.add("run-button--runned");
      buttonRun.innerHTML = "Stop";
    } else {
      buttonRun?.classList.remove("run-button--runned");
      buttonRun?.classList.add("run-button--stopped");
      buttonRun.innerHTML = "Play";
    }
    if (!(state.width === undefined || state.height === undefined)) {
      inputSizeWidth.value = state.width.toString();
      inputSizeHeight.value = state.height.toString();
    }
  }

  onCellClick(cb: (x: number, y: number) => void) {
    const gameFieldEl = this.el.querySelector(".gameField") as HTMLElement;
    function callCbWithArgs(el: any) {
      if (el.target.tagName === "TD") {
        const y: number = el.target.cellIndex;
        const x: number = el.target.closest("tr").rowIndex;
        cb(y, x);
      }
    }
    gameFieldEl.addEventListener("click", callCbWithArgs, true);
  }

  onGameStateChange(cb: (newState: boolean) => void) {
    const buttonRun = this.el.querySelector(".run-button") as HTMLButtonElement;
    function callCbStateChange(el: any) {
      const newState: boolean = buttonRun.classList.contains(
        "run-button--stopped"
      );
      cb(newState);
    }

    buttonRun.addEventListener("click", callCbStateChange, true);
  }

  onFieldSizeChange(cb: (width: number, height: number) => void) {
    const inputWidth = this.el.querySelector(
      ".field-size.field-size--width"
    ) as HTMLInputElement;
    const inputHeight = this.el.querySelector(
      ".field-size.field-size--height"
    ) as HTMLInputElement;
    const el: HTMLElement = this.el;
    function cbSizeChange() {
      const width: number = Number(inputWidth.value);
      const height: number = Number(inputHeight.value);
      if (width > 0 && height > 0) {
        cb(width, height);
      }
    }
    inputWidth.addEventListener("change", cbSizeChange, true);
    inputHeight.addEventListener("change", cbSizeChange, true);
  }
}
