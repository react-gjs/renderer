import { GridMatrix } from "../src/gjs-elements/grid/helpers/grid-matrix";

const child = (colsSpan: number, rowSpan: number) => ({
  colsSpan,
  rowSpan,
});

describe("GridMatrix", () => {
  describe("should correctly calculate position of each element", () => {
    it("scenario 1", () => {
      const matrix = new GridMatrix(3);

      const children: Array<{ colsSpan: number; rowSpan: number }> = [
        child(1, 1),
        child(1, 1),
        child(1, 1),
        child(1, 1),
        child(1, 1),
        child(1, 1),
        child(1, 1),
      ];

      expect(
        matrix.nextElement(children[0].colsSpan, children[0].rowSpan)
      ).toEqual({ x: 0, y: 0 });
      expect(
        matrix.nextElement(children[1].colsSpan, children[1].rowSpan)
      ).toEqual({ x: 1, y: 0 });
      expect(
        matrix.nextElement(children[2].colsSpan, children[2].rowSpan)
      ).toEqual({ x: 2, y: 0 });
      expect(
        matrix.nextElement(children[3].colsSpan, children[3].rowSpan)
      ).toEqual({ x: 0, y: 1 });
      expect(
        matrix.nextElement(children[4].colsSpan, children[4].rowSpan)
      ).toEqual({ x: 1, y: 1 });
      expect(
        matrix.nextElement(children[5].colsSpan, children[5].rowSpan)
      ).toEqual({ x: 2, y: 1 });
      expect(
        matrix.nextElement(children[6].colsSpan, children[6].rowSpan)
      ).toEqual({ x: 0, y: 2 });
    });

    it("scenario 2", () => {
      const matrix = new GridMatrix(3);

      /**
       * @example
       *   > 0 1 2
       *   0 A|B|B
       *   1 C|D|-
       *   2 E|E|F
       *   3 G|-|-
       */
      const children: Array<{ colsSpan: number; rowSpan: number }> = [
        child(1, 1), // A
        child(2, 1), // B
        child(1, 1), // C
        child(1, 1), // D
        child(2, 1), // E
        child(1, 1), // F
        child(1, 1), // G
      ];

      // A
      expect(
        matrix.nextElement(children[0].colsSpan, children[0].rowSpan)
      ).toEqual({ x: 0, y: 0 });
      // B
      expect(
        matrix.nextElement(children[1].colsSpan, children[1].rowSpan)
      ).toEqual({ x: 1, y: 0 });
      // C
      expect(
        matrix.nextElement(children[2].colsSpan, children[2].rowSpan)
      ).toEqual({ x: 0, y: 1 });
      // D
      expect(
        matrix.nextElement(children[3].colsSpan, children[3].rowSpan)
      ).toEqual({ x: 1, y: 1 });
      // E
      expect(
        matrix.nextElement(children[4].colsSpan, children[4].rowSpan)
      ).toEqual({ x: 0, y: 2 });
      // F
      expect(
        matrix.nextElement(children[5].colsSpan, children[5].rowSpan)
      ).toEqual({ x: 2, y: 2 });
      // G
      expect(
        matrix.nextElement(children[6].colsSpan, children[6].rowSpan)
      ).toEqual({ x: 0, y: 3 });
    });

    it("scenario 3", () => {
      const matrix = new GridMatrix(3);

      /**
       * @example
       *   > 0 1 2
       *   0 A|A|B
       *   1 A|A|C
       *   2 D|E|E
       *   3 F|E|E
       *   4 F|-|-
       */
      const children: Array<{ colsSpan: number; rowSpan: number }> = [
        child(2, 2), // A
        child(1, 1), // B
        child(1, 1), // C
        child(1, 1), // D
        child(2, 2), // E
        child(1, 2), // F
      ];

      // A
      expect(
        matrix.nextElement(children[0].colsSpan, children[0].rowSpan)
      ).toEqual({ x: 0, y: 0 });
      // B
      expect(
        matrix.nextElement(children[1].colsSpan, children[1].rowSpan)
      ).toEqual({ x: 2, y: 0 });
      // C
      expect(
        matrix.nextElement(children[2].colsSpan, children[2].rowSpan)
      ).toEqual({ x: 2, y: 1 });
      // D
      expect(
        matrix.nextElement(children[3].colsSpan, children[3].rowSpan)
      ).toEqual({ x: 0, y: 2 });
      // E
      expect(
        matrix.nextElement(children[4].colsSpan, children[4].rowSpan)
      ).toEqual({ x: 1, y: 2 });
      // F
      expect(
        matrix.nextElement(children[5].colsSpan, children[5].rowSpan)
      ).toEqual({ x: 0, y: 3 });
    });

    it("scenario 4", () => {
      const matrix = new GridMatrix(5);

      /**
       * @example
       *   > 0 1 2 3 4
       *   0 A|A|B|C|C
       *   1 D|E|B|F|F
       *   2 D|G|B|F|F
       *   3 -|G|H|H|-
       */
      const children: Array<{ colsSpan: number; rowSpan: number }> = [
        child(2, 1), // A
        child(1, 3), // B
        child(2, 1), // C
        child(1, 2), // D
        child(1, 1), // E
        child(2, 2), // F
        child(1, 2), // G
        child(2, 1), // H
      ];

      // A
      expect(
        matrix.nextElement(children[0].colsSpan, children[0].rowSpan)
      ).toEqual({ x: 0, y: 0 });
      // B
      expect(
        matrix.nextElement(children[1].colsSpan, children[1].rowSpan)
      ).toEqual({ x: 2, y: 0 });
      // C
      expect(
        matrix.nextElement(children[2].colsSpan, children[2].rowSpan)
      ).toEqual({ x: 3, y: 0 });
      // D
      expect(
        matrix.nextElement(children[3].colsSpan, children[3].rowSpan)
      ).toEqual({ x: 0, y: 1 });
      // E
      expect(
        matrix.nextElement(children[4].colsSpan, children[4].rowSpan)
      ).toEqual({ x: 1, y: 1 });
      // F
      expect(
        matrix.nextElement(children[5].colsSpan, children[5].rowSpan)
      ).toEqual({ x: 3, y: 1 });
      // G
      expect(
        matrix.nextElement(children[6].colsSpan, children[6].rowSpan)
      ).toEqual({ x: 1, y: 2 });
      // H
      expect(
        matrix.nextElement(children[7].colsSpan, children[7].rowSpan)
      ).toEqual({ x: 2, y: 3 });
    });

    it("scenario 5", () => {
      const matrix = new GridMatrix(5);

      /**
       * @example
       *   > 0 1 2 3 4
       *   0 A|A|B|-|-
       *   1 -|-|B|-|-
       *   2 -|-|B|-|-
       *   3 C|C|C|D|-
       */
      const children: Array<{ colsSpan: number; rowSpan: number }> = [
        child(2, 1), // A
        child(1, 3), // B
        child(3, 1), // C
        child(1, 1), // D
      ];

      // A
      expect(
        matrix.nextElement(children[0].colsSpan, children[0].rowSpan)
      ).toEqual({ x: 0, y: 0 });
      // B
      expect(
        matrix.nextElement(children[1].colsSpan, children[1].rowSpan)
      ).toEqual({ x: 2, y: 0 });
      // C
      expect(
        matrix.nextElement(children[2].colsSpan, children[2].rowSpan)
      ).toEqual({ x: 0, y: 3 });
      // D
      expect(
        matrix.nextElement(children[3].colsSpan, children[3].rowSpan)
      ).toEqual({ x: 3, y: 3 });
    });
  });
});
