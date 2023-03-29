import { describe, expect, it, match } from "@reactgjs/gest";
import { diffProps } from "../../../src/gjs-elements/utils/diff-props";

export default describe("diffProps", () => {
  describe("should correctly compare primitive props", () => {
    it("positive scenarios", () => {
      expect(diffProps({ foo: "bar" }, { foo: "bar" }, true)).toMatch([]);
      expect(diffProps({ foo: 1 }, { foo: 1 }, true)).toMatch([]);
      expect(diffProps({ foo: true }, { foo: true }, true)).toMatch([]);
      expect(diffProps({ foo: null }, { foo: null }, true)).toMatch([]);
    });

    it("negative scenarios", () => {
      expect(diffProps({ foo: "bar" }, { foo: "baz" }, true)).toMatch([
        ["foo", "baz"],
      ]);
      expect(diffProps({ foo: 1 }, { foo: 2 }, true)).toMatch([["foo", 2]]);
      expect(diffProps({ foo: true }, { foo: false }, true)).toMatch([
        ["foo", false],
      ]);
      expect(diffProps({ foo: null }, { foo: undefined }, true)).toMatch([
        ["foo", undefined],
      ]);
    });

    it("mix of changed and unchanged props", () => {
      expect(
        diffProps(
          {
            foo: "abc",
            bar: 123,
            baz: true,
            qux: null,
          },
          {
            foo: "def",
            bar: 123,
            baz: false,
            qux: null,
          },
          true
        )
      ).toMatch([
        ["foo", "def"],
        ["baz", false],
      ]);
    });
  });

  describe("should correctly compare objects", () => {
    it("compare dict by reference", () => {
      const sameObj = { foo: "bar" };

      expect(diffProps({ foo: sameObj }, { foo: sameObj }, true)).toMatch([]);
      expect(
        diffProps({ foo: sameObj }, { foo: { foo: "bar" } }, true)
      ).toMatch([["foo", { foo: "bar" }]]);
    });

    it("compare array by reference", () => {
      const sameArr = [1, 2, 3];

      expect(diffProps({ foo: sameArr }, { foo: sameArr }, true)).toMatch([]);
      expect(diffProps({ foo: sameArr }, { foo: [1, 2, 3] }, true)).toMatch([
        ["foo", [1, 2, 3]],
      ]);
    });
  });

  describe("should correctly compare special cases", () => {
    describe("margin", () => {
      // margin can be a number or an array of numbers

      it("positive scenarios", () => {
        expect(diffProps({ margin: 1 }, { margin: 1 }, true)).toMatch([]);
        expect(diffProps({ margin: [1, 2] }, { margin: [1, 2] }, true)).toMatch(
          []
        );
      });

      it("negative scenarios", () => {
        expect(diffProps({ margin: 1 }, { margin: 2 }, true)).toMatch([
          ["margin", 2],
        ]);
        expect(diffProps({ margin: [1, 2] }, { margin: [1, 3] }, true)).toMatch(
          [["margin", [1, 3]]]
        );
        expect(diffProps({ margin: [1] }, { margin: [1, 3] }, true)).toMatch([
          ["margin", [1, 3]],
        ]);
        expect(diffProps({ margin: [1, 2] }, { margin: [1] }, true)).toMatch([
          ["margin", [1]],
        ]);
        expect(diffProps({ margin: [] }, { margin: [1, 3] }, true)).toMatch([
          ["margin", [1, 3]],
        ]);
        expect(diffProps({ margin: [1, 2] }, { margin: [] }, true)).toMatch([
          ["margin", []],
        ]);
        expect(diffProps({ margin: [1, 2] }, { margin: 0 }, true)).toMatch([
          ["margin", 0],
        ]);
        expect(diffProps({ margin: 1 }, { margin: [1, 2] }, true)).toMatch([
          ["margin", [1, 2]],
        ]);
        expect(diffProps({ margin: [] }, { margin: undefined }, true)).toMatch([
          ["margin", undefined],
        ]);
        expect(diffProps({ margin: 0 }, { margin: undefined }, true)).toMatch([
          ["margin", undefined],
        ]);
        expect(diffProps({ margin: undefined }, { margin: [] }, true)).toMatch([
          ["margin", []],
        ]);
        expect(diffProps({}, { margin: [] }, true)).toMatch([["margin", []]]);
        expect(diffProps({ margin: [1, 2] }, {}, true)).toMatch([
          ["margin", match.type("symbol")],
        ]);
      });
    });

    describe("className", () => {
      // class name can be either a string or an array of strings

      it("positive scenarios", () => {
        expect(
          diffProps({ className: "foo" }, { className: "foo" }, true)
        ).toMatch([]);
        expect(
          diffProps(
            { className: ["foo", "bar"] },
            { className: ["foo", "bar"] },
            true
          )
        ).toMatch([]);
      });

      it("negative scenarios", () => {
        expect(
          diffProps({ className: "foo" }, { className: "bar" }, true)
        ).toMatch([["className", "bar"]]);
        expect(
          diffProps(
            { className: ["foo", "bar"] },
            { className: ["foo", "baz"] },
            true
          )
        ).toMatch([["className", ["foo", "baz"]]]);
        expect(
          diffProps({ className: ["foo", "bar"] }, { className: ["foo"] }, true)
        ).toMatch([["className", ["foo"]]]);
        expect(
          diffProps({ className: ["foo"] }, { className: [] }, true)
        ).toMatch([["className", []]]);
        expect(
          diffProps({ className: [] }, { className: ["foo"] }, true)
        ).toMatch([["className", ["foo"]]]);
        expect(
          diffProps({ className: [] }, { className: undefined }, true)
        ).toMatch([["className", undefined]]);
        expect(diffProps({}, { className: ["foo"] }, true)).toMatch([
          ["className", ["foo"]],
        ]);
        expect(diffProps({ className: ["foo"] }, {}, true)).toMatch([
          ["className", match.type("symbol")],
        ]);
      });
    });

    describe("style", () => {
      // style is always a dictionary of key-value pairs,
      // where each value is a primitive, with the exception of
      // selector keys which start with a colon

      it("positive scenarios", () => {
        expect(
          diffProps(
            { style: { color: "red", ":hover": { color: "green" } } },
            { style: { color: "red", ":hover": { color: "green" } } },
            true
          )
        ).toMatch([]);
        expect(
          diffProps(
            { style: { fontSize: 18, ":hover": { borderSize: 1 } } },
            { style: { fontSize: 18, ":hover": { borderSize: 1 } } },
            true
          )
        ).toMatch([]);
      });

      it("negative scenarios", () => {
        expect(
          diffProps(
            { style: { color: "red", ":hover": { color: "green" } } },
            { style: { color: "red", ":hover": { color: "blue" } } },
            true
          )
        ).toMatch([["style", { color: "red", ":hover": { color: "blue" } }]]);
        expect(
          diffProps(
            { style: { color: "red", ":hover": { color: "green" } } },
            { style: { color: "blue", ":hover": { color: "green" } } },
            true
          )
        ).toMatch([["style", { color: "blue", ":hover": { color: "green" } }]]);
        expect(
          diffProps(
            { style: { fontSize: 18, ":hover": { borderSize: 1 } } },
            { style: { fontSize: 18, ":hover": { borderSize: 2 } } },
            true
          )
        ).toMatch([["style", { fontSize: 18, ":hover": { borderSize: 2 } }]]);
      });
    });
  });

  it("should always omit children", () => {
    expect(diffProps({}, { children: "bar" }, true)).toMatch([]);
    expect(diffProps({ children: "foo" }, {}, false)).toMatch([]);
  });
});
