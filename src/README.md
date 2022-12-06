# Directory Structure Overview

The directory structure of the project is as follows:

- `gjs-declarations/` - Contains the TS declaration files for the GJS APIs, like Gtk, Gdk, Gio, etc.
- `gjs-elements/` - Contains the implementations of the Gtk.Widgets wrapper classes, called GjsElements (for example `BoxElement` or `ButtonElement`), that are used to provide a standardized API for the React Reconciler to use.
  - `utils/` - Contains various utilities and extenders used by the GjsElements.
  - `gjs-element.ts` - Contains the interface definition for the GjsElement class implementations.
  - `gjs-element-manager.ts` - Contains a static class for managing the GjsElement instances. Most notably it handles creating new instances of GjsElements from a provided type string and identifying the Elements "kind".
  - `element-extender.ts` - Contains the interface definition for the Element lifecycle hooks that are used by the Element extenders. (Extenders are similar in concept to mixins, they are supposed to provide some additional functionality to the GjsElement classes.)
- `reconciler/` - Contains the React Reconciler related code.
  - `gjs-renderer.ts` - Contains the implementation of the [React Reconciler](https://www.npmjs.com/package/react-reconciler) for Gtk.Widgets. (reconciler does not interact with the widgets directly, and instead uses the GjsElements to do so.)
  - `host-context.ts` - Contains a class implementation for objects that we use as a Reconciler's [HostContext](https://www.npmjs.com/package/react-reconciler#getroothostcontextrootcontainer).
  - `render.ts` - Contains the implementation of the `render` function that is used to render a React application.
  - `jsx-types.ts` - Contains the type definitions for the JSX Intrinsic elements that are provided by this renderer.
- `g-enums.ts` - This file re-exports many of the Gtk and Gdk enums that are used by the GjsElements.
- `intrinsic-components.ts` - Exports the JSX Component names for the GjsElements as const variables. These are intended to be used for building applications with Gtk and this renderer similar to how you would use the HTML elements in a web application.
- `index.ts` - The entry-point of this library.
