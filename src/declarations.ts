import type GLib from "gi://GLib";
import "./gjs-declarations/index";
import type { ApplicationContext } from "./gjs-elements/gtk3/application/context";
export default {};

declare global {
  type Pkg = {
    /**
     * Initialize directories and global variables. Must be called
     * before any of other API in Package is used. `params` must be an
     * object with at least the following keys:
     *
     * - Name: the package name ($(PACKAGE_NAME) in autotools, eg.
     *   org.foo.Bar)
     * - Version: the package version
     * - Prefix: the installation prefix
     *
     * Init() will take care to check if the program is running from
     * the source directory or not, by looking for a 'src' directory.
     *
     * At the end, the global variable 'pkg' will contain the Package
     * module (imports.package).
     */
    init(
      options: Pick<Pkg, "name" | "version" | "prefix"> &
        Partial<Pick<Pkg, "libdir">>
    ): void;
    /**
     * This is a convenience function if your package has a single
     * entry point. You must define a main(ARGV) function inside a
     * main.js module in moduledir.
     */
    start(
      options: Pick<Pkg, "name" | "version" | "prefix"> &
        Partial<Pick<Pkg, "libdir">>
    ): void;
    /**
     * - This is the function to use if you want to have multiple entry
     *   points in one package. You must define a main(ARGV) function
     *   inside the passed in module, and then the launcher would be:
     *
     * @example
     *   imports.package.init(...);
     *   imports.package.run(imports.entrypoint);
     */
    run(module: { main(argv: string[]): void }): number | undefined;
    /**
     * Mark a dependency on a specific version of one or more external
     * GI typelibs. `libs` must be an object whose keys are a typelib
     * name, and values are the respective version. The empty string
     * indicates any version.
     *
     * @param libs The external dependencies to import as a dictionary
     *   of name:version pairs.
     */
    require(libs: Record<string, string>): void;
    /**
     * As checkSymbol(), but exit with an error if the dependency
     * cannot be satisfied.
     *
     * @param lib An external dependency to import
     * @param ver Version of the dependency
     * @param symbol Symbol to check for
     */
    requireSymbol(lib: string, ver: string, symbol?: string): void;
    /**
     * Check whether an external GI typelib can be imported and
     * provides @symbol.
     *
     * Symbols may refer to
     *
     * - Global functions ('main_quit')
     * - Classes ('Window')
     * - Class / instance methods ('IconTheme.get_default' /
     *   'IconTheme.has_icon')
     * - GObject properties ('Window.default_height')
     *
     * @param lib An external dependency to import
     * @param ver Version of the dependency
     * @param symbol Symbol to check for
     * @returns True if `lib` can be imported and provides `symbol`,
     *   false otherwise
     */
    checkSymbol(lib: string, ver: string, symbol?: string): void;
    initFormat(): void;
    initGettext(): void;
    initSubmodule(moduleName: string): void;

    /** The base name of the entry point (eg. org.foo.Bar.App) */
    name: string;
    /** The package version */
    version: string;
    /** The installation prefix */
    prefix: string;
    /**
     * The final libdir when installed; usually, these would be
     * `${prefix}/lib` (or '/lib64')
     */
    libdir?: string;
    /**
     * The final datadir when installed; usually, these would be
     * '${prefix}//share'
     */
    datadir?: string;
    /**
     * The directory to look for private data files, such as images,
     * stylesheets and UI definitions; this will be datadir + name
     * when installed and './data' when running from the source tree
     */
    pkgdatadir: string;
    /**
     * The directory to look for private typelibs and C libraries;
     * this will be libdir + name when installed and './lib' when
     * running from the source tree
     */
    pkglibdir: string;
    /**
     * The directory to look for JS modules; this will be pkglibdir
     * when installed and './src' when running from the source tree
     */
    moduledir: string;
    /**
     * The directory containing gettext translation files; this will
     * be datadir + '/locale' when installed and './po' in the source
     * tree
     */
    localedir: string;
  };

  type MainLoop = {
    quit(name: string): void;
    run(name: string): void;
    idle_source(handler: () => any, priority: number): GLib.Source;
    idle_add(handler: () => any, priority: number): number;
    timeout_source(
      timeout: number,
      handler: () => any,
      priority: number
    ): GLib.Source;
    timeout_seconds_source(
      timeout: number,
      handler: () => any,
      priority: number
    ): GLib.Source;
    timeout_add(
      timeout: number,
      handler: () => any,
      priority: number
    ): GLib.Source;
    timeout_add_seconds(
      timeout: number,
      handler: () => any,
      priority: number
    ): GLib.Source;
    source_remove(id: number): boolean;
  };

  const imports: {
    mainloop: MainLoop;
    package: Pkg;
  };

  const pkg: Pkg;

  /**
   * Globally accessible equivalent of the `quit()` method that's
   * available through `useApp` hook.
   *
   * If possible, please use the `useApp` hook instead.
   */
  const quitMainApplication: undefined | ApplicationContext["quit"];
}
