# React GJS Renderer

A React renderer for the [Gnome JS](https://gjs.guide/about/). It provides components and methods allowing to use React to build native Gnome GTK applications.

_This is still a work in progress, bugs and missing features are expected._

## Components implemented so far:

- **Box** - build on top of Gtk.Box
- **Button** - build on top of Gtk.Button
- **CheckButton** - build on top of Gtk.CheckButton
- **FlowBox** - build on top of Gtk.FlowBox
- **Grid** - build on top of Gtk.Grid
- **Image** - build on top of Gtk.Image
- **Label** - build on top of Gtk.Label
- **LinkButton** - build on top of Gtk.LinkButton
- **NumberInput** - build on top of Gtk.SpinButton
- **Popover** - build on top of Gtk.Popover
- **Pressable** - build on top of Gtk.EventBox
- **RadioButton** - build on top of Gtk.RadioButton
- **Revealer** - build on top of Gtk.Revealer
- **ScrollBox** - build on top of Gtk.ScrolledWindow
- **Selector** - build on top of Gtk.ComboBox
- **Separator** - build on top of Gtk.Separator
- **Stack** - build on top of Gtk.Stack, usable only via `useStack` or `createStack` functions
- **Switch** - build on top of Gtk.Switch
- **TextArea** - build on top of Gtk.TextView
- **TextEntry** - build on top of Gtk.Entry
- **Window** - build on top of Gtk.Window
- **Markup** - a special component for Gtk.Label allowing to use Pango markup
  - **Big** - A markup component for the Pango `<big>` tag
  - **Bold** - A markup component for the Pango `<b>` tag
  - **Italic** - A markup component for the Pango `<i>` tag
  - **Monospace** - A markup component for the Pango `<tt>` tag
  - **Small** - A markup component for the Pango `<small>` tag
  - **Span** - A markup component for the Pango `<span>` tag
  - **Strike** - A markup component for the Pango `<s>` tag
  - **Sub** - A markup component for the Pango `<sub>` tag
  - **Sup** - A markup component for the Pango `<sup>` tag
  - **Underline** - A markup component for the Pango `<u>` tag

## Usage

Since GJS environment doesn't support importing packages from node_modules, applications using this renderer need to bundle it into a single `.js` file. This usually is done using a tool like [webpack](https://webpack.js.org/), [esbuild](https://esbuild.github.io/), or [rollup](https://rollupjs.org/guide/en/).

To use this render simply import the `render` method and call it with the root component as the argument:

```tsx
import { render, exit, Window, Box, Label } from "react-gjs-renderer";

const App = () => (
  <Window onDestroy={exit}>
    <Box>
      <Label>Hello World!</Label>
    </Box>
  </Window>
);

render(<App />);
```

## Help needed

This renderer is still in early development and there are many components that need to be implemented. If you want to help, please
check [this discussion](https://github.com/ncpa0cpl/react-gjs-renderer/discussions/1).
