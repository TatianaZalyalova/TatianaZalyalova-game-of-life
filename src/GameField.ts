export interface IGameField {
  getState: () => number[][];
  toggleCellState: (x: number, y: number) => void;
  nextGeneration: () => void;
  setSize: (width: number, height: number) => void;
  arrState: number[][];
  arrStateBefore: string[];
}

export class GameField implements IGameField {
  width;
  height;
  arrState;

  constructor(width: number = 0, height: number = 1) {
    this.width = width;
    this.height = height;
    this.arrState = this.getState();
  }
  arrStateBefore = [""];

  nextGeneration() {
    this.getArrStateBefore(this.arrStateBefore);
    const nextGenerationArr = this.arrState.map((row, y) =>
      row.map((cell, x) => this.getNextCellState(x, y))
    );
    const nextGenerationArrStr: string = nextGenerationArr.join("");
    if (this.arrStateBefore.includes(nextGenerationArrStr)) {
      return false;
    } else {
      this.arrState = nextGenerationArr;
    }
  }

  getArrStateBefore(arrStateBefore: string[]): void {
    if (arrStateBefore.indexOf(this.getState().join("")) === -1) {
      arrStateBefore.push(this.getState().join(""));
    }
    if (arrStateBefore.length >= 3) {
      arrStateBefore.shift();
    }
  }

  getState(): number[][] {
    if (this.arrState) {
      return this.arrState;
    } else {
      const arr: number[][] = [];
      for (let i = 0; i < this.height; i++) {
        const arrItem: number[] = [];
        for (let j = 0; j < this.width; j++) {
          arrItem.push(0);
        }
        arr.push(arrItem);
      }
      return arr;
    }
  }

  toggleCellState(x: number, y: number) {
    this.arrState[y][x] = this.arrState[y][x] === 0 ? 1 : 0;
    return this.arrState;
  }

  isCellAlive(x: number, y: number) {
    if (
      y < 0 ||
      y >= this.arrState.length ||
      (x < 0 && x < this.arrState[y].length)
    ) {
      return false;
    }
    return Boolean(this.arrState[y][x]);
  }

  getNumberOfNeighbour(x: number, y: number) {
    let num = 0;
    for (let i = y - 1; i <= y + 1; i++) {
      for (let k = x - 1; k <= x + 1; k++) {
        if (i === y && k === x) {
          continue;
        }
        num += Number(this.isCellAlive(k, i));
      }
    }
    return num;
  }

  getNextCellState(x: number, y: number) {
    const liveCount = this.getNumberOfNeighbour(x, y);
    const isAlive = this.isCellAlive(x, y);
    if ((isAlive && (liveCount === 3 || liveCount === 2)) || liveCount === 3) {
      return 1;
    }
    return 0;
  }

  setSize(newWidth: number, newHeight: number) {
    for (let i = 0; i < this.arrState.length; i++) {
      for (let k = this.arrState[i].length; k < newWidth; k++) {
        this.arrState[i][k] = 0;
      }

      if (newWidth < this.arrState[i].length) {
        this.arrState[i].splice(newWidth, this.arrState[i].length - newWidth);
      }
    }

    if (newHeight < this.arrState.length) {
      this.arrState.splice(newHeight, this.arrState.length - newHeight);
    }

    for (let i = this.arrState.length; i < newHeight; i++) {
      const arr: number[] = [];
      for (let j = 0; j < newWidth; j++) {
        arr.push(0);
      }
      this.arrState.push(arr);
    }
  }
}
