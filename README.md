# React GJS Renderer

A React renderer for the [Gnome JS](https://gjs.guide/about/). It provides components and methods allowing to use React to build native Gnome GTK applications.

## Components implemented so far:

- **Window** - build on top of Gtk.Window
- **Box** - build on top of Gtk.Box
- **Button** - build on top of Gtk.Button
- **LinkButton** - build on top of Gtk.LinkButton
- **Label** - build on top of Gtk.Label
- **TextEntry** - build on top of Gtk.Entry
- **TextArea** - build on top of Gtk.TextView
- **Switch** - build on top of Gtk.Switch

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
