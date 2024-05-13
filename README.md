# React GJS Renderer

A React renderer for the [Gnome JS](https://gjs.guide/about/). It provides components and methods allowing to use React to build native Gnome GTK applications.

_This is still a work in progress, bugs and missing features are expected._

## Elements of Gtk3

(All components have full TypeScript type definitions for each supported prop)

List of all GTK3 Widgets provided as JSX Components by this renderer:

- **ActionBar**
- **Box**
- **Button**
- **ButtonBox**
- **CheckButton**
- **ColorButton**
- **EventBox** (Pressable)
- **Expander**
- **FlowBox**
- **Frame**
- **Grid**
- **HeaderBar**
- **Icon**
- **Image**
- **Label**
- **LevelBar**
- **LinkButton**
- **MenuBar**
- **ModelButton**
- **NumberInput**
- **Paned**
- **Popover**
- **PopoverMenu**
- **ProgressBar**
- **RadioButton**
- **Revealer**
- **ScrollBox**
- **SearchBar**
- **SearchEntry** (SearchInput)
- **Selector**
- **Separator**
- **SizeGroupBox**
- **Slider**
- **Spinner**
- **Stack**
- **Switch**
- **TextArea**
- **TextEntry**
- **TextView**
- **VolumeButton**
- **Window**
- **Toolbar**
  - **ToolbarButton**
  - **ToolbarItem**
  - **ToolbarRadioButton**
  - **ToolbarSeparator**
  - **ToolbarToggleButton**
- **Markup**
  - **Big**
  - **Bold**
  - **Italic**
  - **Monospace**
  - **Small**
  - **Span**
  - **Strike**
  - **Sub**
  - **Sup**
  - **Underline**

## Usage

Since GJS environment doesn't support importing packages from node_modules, applications using this renderer need to either define each import as a relative path to the correct file (e.x. `import * as renderer from "../node_modules/react-gjs-renderer/dist/index.js"`) or bundle it into a single `.js` file. This usually is done using a tool like [webpack](https://webpack.js.org/), [esbuild](https://esbuild.github.io/), or [rollup](https://rollupjs.org/guide/en/).

Example esbuild setup:

```sh
esbuild ./App.tsx --bundle '--external:gi://*' --external:system  --format=esm --outfile=./out.js
```

```tsx
// App.tsx
import Gtk from "gi://Gtk?version=3.0";
import * as React from "react";
import { Box, Label, Renderer, Window } from "react-gjs-renderer";

Gtk.init(null);

const App = () => {
  return (
    <Window
      quitOnClose
      minWidth={200}
      minHeight={200}
    >
      <Box>
        <Label>Hello World</Label>
      </Box>
    </Window>
  );
};

const renderer = new Renderer({
  appId: "com.example.app",
});

renderer.start(<App />);
```

## Help needed

This renderer is still in early development and there are many components that need to be implemented. If you want to help, please
check [this discussion](https://github.com/ncpa0cpl/react-gjs-renderer/discussions/1).
