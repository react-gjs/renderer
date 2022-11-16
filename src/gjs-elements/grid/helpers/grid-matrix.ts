export class GridMatrix {
  private matrix: Array<Array<boolean>> = [];
  private lastUsedCoordinates = { x: -1, y: -1 };
  private currentRow = 0;

  constructor(private width: number) {
    this.addNextRow();
  }

  private addNextRow() {
    this.matrix.push(new Array(this.width).fill(false));
  }

  private getRowAvailableSpace(y: number) {
    let result = 0;

    for (let i = this.width - 1; i >= 0; i--) {
      if (!this.matrix[y][i]) {
        result++;
      } else {
        break;
      }
    }

    return result;
  }

  private getLastFreeCellInRow(y: number) {
    if (this.matrix[y][this.width - 1]) {
      throw new Error("No free cells in row.");
    }

    for (let i = this.width - 1; i >= 0; i--) {
      if (this.matrix[y][i]) {
        return i + 1;
      }
    }

    return 0;
  }

  private markCellsAsUsed(
    x: number,
    y: number,
    colSpan: number,
    rowSpan: number
  ) {
    for (let i = 0; i < rowSpan; i++) {
      const nextRowIndex = y + i;

      if (this.matrix[nextRowIndex] == undefined) {
        this.addNextRow();
      }

      for (let j = 0; j < colSpan; j++) {
        const nextColIndex = x + j;

        if (this.matrix[nextRowIndex][nextColIndex]) {
          throw new Error("Cell already used.");
        }

        this.matrix[nextRowIndex][nextColIndex] = true;
      }
    }

    this.lastUsedCoordinates = { x, y };
  }

  private findNextAvailableCellForElement(colSpan: number) {
    const lastCords = { ...this.lastUsedCoordinates };

    if (colSpan > this.width) {
      throw new Error("Column span is bigger than grid width.");
    }

    if (lastCords.x == -1 && lastCords.y == -1) {
      return { x: 0, y: 0 };
    }

    let nextRow = this.currentRow;

    while (true) {
      const lastRowAvailableSpace = this.getRowAvailableSpace(nextRow);

      if (colSpan > lastRowAvailableSpace) {
        if (this.matrix.length == this.currentRow) {
          this.addNextRow();
          this.currentRow++;
          return { x: 0, y: this.currentRow };
        }
        nextRow++;
      } else {
        const targetX = this.getLastFreeCellInRow(nextRow);
        return { x: targetX, y: nextRow };
      }
    }
  }

  nextElement(colSpan: number, rowSpan: number) {
    const { x, y } = this.findNextAvailableCellForElement(colSpan);
    this.markCellsAsUsed(x, y, colSpan, rowSpan);
    return { x, y };
  }
}
