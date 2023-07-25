export class GridMatrix {
  private matrix: Array<Array<boolean>> = [];
  private lastUsedCoordinates = { x: -1, y: -1 };
  private currentRow = 0;
  private newRowTemplate: Array<boolean>;

  constructor(private width: number) {
    this.newRowTemplate = new Array(this.width).fill(false);
    this.addNextRow();
  }

  private addNextRow() {
    this.matrix.push(this.newRowTemplate.slice());
  }

  /**
   * Finds the first N cells within the row that are not taken, and
   * returns the index of the first of those cells, if theres is no N
   * free cells in the row, returns null.
   */
  private getFirstNFreeCellsInRow(
    y: number,
    n: number,
    onlyAfterIndex = -1,
  ) {
    const row = this.matrix[y];
    let result = [];

    for (let i = onlyAfterIndex + 1; i < this.width; i++) {
      if (!row[i]) {
        result.push(i);
      } else {
        result = [];
      }

      if (result.length === n) return result[0];
    }

    return null;
  }

  private markCellsAsUsed(
    x: number,
    y: number,
    colSpan: number,
    rowSpan: number,
  ) {
    for (let i = 0; i < rowSpan; i++) {
      const nextRowIndex = y + i;

      if (this.matrix[nextRowIndex] == undefined) {
        this.addNextRow();
      }

      for (let j = 0; j < colSpan; j++) {
        const nextColIndex = x + j;
        const row = this.matrix[nextRowIndex];

        if (row[nextColIndex]) {
          throw new Error("Cell already used.");
        }

        row[nextColIndex] = true;
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

    const currentRowX = this.getFirstNFreeCellsInRow(
      this.currentRow,
      colSpan,
      this.lastUsedCoordinates.x,
    );

    if (currentRowX != null) {
      return { x: currentRowX, y: this.currentRow };
    }

    let nextRowIndex = this.currentRow + 1;

    while (true) {
      if (nextRowIndex > this.matrix.length - 1) {
        this.addNextRow();
      }
      const x = this.getFirstNFreeCellsInRow(nextRowIndex, colSpan);
      if (x !== null) {
        this.currentRow = nextRowIndex;
        return { x, y: nextRowIndex };
      }

      nextRowIndex++;
    }
  }

  nextElement(colSpan: number, rowSpan: number) {
    const { x, y } = this.findNextAvailableCellForElement(colSpan);
    this.markCellsAsUsed(x, y, colSpan, rowSpan);
    return { x, y };
  }
}
