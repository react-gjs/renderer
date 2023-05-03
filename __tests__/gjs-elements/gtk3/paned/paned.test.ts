import { describe, expect, it, match } from "@reactgjs/gest";
import Gtk from "gi://Gtk?version=3.0";
import { GjsElement } from "../../../../src/gjs-elements/gjs-element";
import { PanedElement } from "../../../../src/gjs-elements/gtk3/paned/paned";

Gtk.init(null);

class PanedWidgetMock {
  current1: any = null;
  current2: any = null;

  add1(w: any) {
    this.current1 ??= w;
  }

  add2(w: any) {
    this.current2 ??= w;
  }

  show_all() {}

  remove(w: any) {
    if (this.current1 === w) {
      this.current1 = null;
    } else if (this.current2 === w) {
      this.current2 = null;
    }
  }
}

class WidgetMock {
  mock = true;

  notifyWillAppendTo() {
    return true;
  }

  getWidget() {
    return this;
  }
}

export default describe("PanedElement", () => {
  it("should properly append children as the first and second panes", () => {
    const panedWidgetMock = new PanedWidgetMock();

    const paned = new PanedElement([]);
    paned["widget"] = panedWidgetMock;

    const child1 = new WidgetMock() as any as GjsElement;
    const child2 = new WidgetMock() as any as GjsElement;

    paned.appendChild(child1);
    paned.appendChild(child2);

    expect(panedWidgetMock.current1).toEqual(child1);
    expect(panedWidgetMock.current2).toEqual(child2);
    expect(paned["children"]).toMatch([
      match.equal(child1),
      match.equal(child2),
    ]);
  });

  it("should throw an error if more than two children are appended", () => {
    const panedWidgetMock = new PanedWidgetMock();

    const paned = new PanedElement([]);
    paned["widget"] = panedWidgetMock;

    const child1 = new WidgetMock() as any as GjsElement;
    const child2 = new WidgetMock() as any as GjsElement;
    const child3 = new WidgetMock() as any as GjsElement;

    paned.appendChild(child1);
    paned.appendChild(child2);

    expect(() => paned.appendChild(child3)).toThrow();
  });

  it("should move the second child to the first pane when the first child is removed", () => {
    const panedWidgetMock = new PanedWidgetMock();

    const paned = new PanedElement([]);
    paned["widget"] = panedWidgetMock;

    const child1 = new WidgetMock() as any as GjsElement;
    const child2 = new WidgetMock() as any as GjsElement;

    paned.appendChild(child1);
    paned.appendChild(child2);

    paned.notifyWillUnmount(child1);

    expect(panedWidgetMock.current1).toEqual(child2);
    expect(panedWidgetMock.current2).toEqual(null);
    expect(paned["children"]).toMatch([match.equal(child2), null]);
  });

  it("should swap the first and second children when the second child is inserted before the first", () => {
    const panedWidgetMock = new PanedWidgetMock();

    const paned = new PanedElement([]);
    paned["widget"] = panedWidgetMock;

    const child1 = new WidgetMock() as any as GjsElement;
    const child2 = new WidgetMock() as any as GjsElement;

    paned.appendChild(child1);
    paned.appendChild(child2);

    paned.insertBefore(child2, child1);

    expect(panedWidgetMock.current1).toEqual(child2);
    expect(panedWidgetMock.current2).toEqual(child1);
    expect(paned["children"]).toMatch([
      match.equal(child2),
      match.equal(child1),
    ]);
  });

  it("when only first child is present, it should be moved to the second position on insertBefore", () => {
    const panedWidgetMock = new PanedWidgetMock();

    const paned = new PanedElement([]);
    paned["widget"] = panedWidgetMock;

    const child1 = new WidgetMock() as any as GjsElement;
    const child2 = new WidgetMock() as any as GjsElement;

    paned.appendChild(child1);

    paned.insertBefore(child2, child1);

    expect(panedWidgetMock.current1).toEqual(child2);
    expect(panedWidgetMock.current2).toEqual(child1);
    expect(paned["children"]).toMatch([
      match.equal(child2),
      match.equal(child1),
    ]);
  });
});
