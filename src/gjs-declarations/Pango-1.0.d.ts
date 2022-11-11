/**
 * Generated with https://github.com/Gr3q/GIR2TS - If possible do
 * not modify.
 */
declare namespace Pango {
  /**
   * This construct is only for enabling class multi-inheritance,
   * use {@link Context} instead.
   */
  interface IContext {
    /**
     * Forces a change in the context, which will cause any
     * `PangoLayout` using this context to re-layout.
     *
     * This function is only useful when implementing a new
     * backend for Pango, something applications won't do.
     * Backends should call this function if they have attached
     * extra data to the context and such data is changed.
     */
    changed(): void;
    /**
     * Retrieves the base direction for the context.
     *
     * See [method#Pango.Context.set_base_dir].
     *
     * @returns The base direction for the context.
     */
    get_base_dir(): Direction;
    /**
     * Retrieves the base gravity for the context.
     *
     * See [method#Pango.Context.set_base_gravity].
     *
     * @returns The base gravity for the context.
     */
    get_base_gravity(): Gravity;
    /**
     * Retrieve the default font description for the context.
     *
     * @returns A pointer to the context's default font
     *   description. This value must not be modified or freed.
     */
    get_font_description(): FontDescription;
    /**
     * Gets the `PangoFontMap` used to look up fonts for this
     * context.
     *
     * @returns The font map for the `PangoContext`. This value
     *   is owned by Pango and should not be unreferenced.
     */
    get_font_map(): FontMap;
    /**
     * Retrieves the gravity for the context.
     *
     * This is similar to
     * [method#Pango.Context.get_base_gravity], except for when
     * the base gravity is %PANGO_GRAVITY_AUTO for which
     * [func#Pango.Gravity.get_for_matrix] is used to return the
     * gravity from the current context matrix.
     *
     * @returns The resolved gravity for the context.
     */
    get_gravity(): Gravity;
    /**
     * Retrieves the gravity hint for the context.
     *
     * See [method#Pango.Context.set_gravity_hint] for details.
     *
     * @returns The gravity hint for the context.
     */
    get_gravity_hint(): GravityHint;
    /**
     * Retrieves the global language tag for the context.
     *
     * @returns The global language tag.
     */
    get_language(): Language;
    /**
     * Gets the transformation matrix that will be applied when
     * rendering with this context.
     *
     * See [method#Pango.Context.set_matrix].
     *
     * @returns The matrix, or %NULL if no matrix has been set
     *   (which is the same as the identity matrix). The returned
     *   matrix is owned by Pango and must not be modified or
     *   freed.
     */
    get_matrix(): Matrix | null;
    /**
     * Get overall metric information for a particular font
     * description.
     *
     * Since the metrics may be substantially different for
     * different scripts, a language tag can be provided to
     * indicate that the metrics should be retrieved that
     * correspond to the script(s) used by that language.
     *
     * The `PangoFontDescription` is interpreted in the same way
     * as by [func#itemize], and the family name may be a comma
     * separated list of names. If characters from multiple of
     * these families would be used to render the string, then
     * the returned fonts would be a composite of the metrics for
     * the fonts loaded for the individual families.
     *
     * @param desc A `PangoFontDescription` structure. %NULL
     *   means that the font description from the context will be
     *   used.
     * @param language Language tag used to determine which
     *   script to get the metrics for. %NULL means that the
     *   language tag from the context will be used. If no
     *   language tag is set on the context, metrics for the
     *   default language (as determined by
     *   [func#Pango.Language.get_default] will be returned.
     * @returns A `PangoFontMetrics` object. The caller must call
     *   [method#Pango.FontMetrics.unref] when finished using the
     *   object.
     */
    get_metrics(
      desc: FontDescription | null,
      language: Language | null
    ): FontMetrics;
    /**
     * Returns whether font rendering with this context should
     * round glyph positions and widths.
     *
     * @returns
     */
    get_round_glyph_positions(): boolean;
    /**
     * Returns the current serial number of #context.
     *
     * The serial number is initialized to an small number larger
     * than zero when a new context is created and is increased
     * whenever the context is changed using any of the setter
     * functions, or the `PangoFontMap` it uses to find fonts has
     * changed. The serial may wrap, but will never have the
     * value 0. Since it can wrap, never compare it with "less
     * than", always use "not equals".
     *
     * This can be used to automatically detect changes to a
     * `PangoContext`, and is only useful when implementing
     * objects that need update when their `PangoContext`
     * changes, like `PangoLayout`.
     *
     * @returns The current serial number of #context.
     */
    get_serial(): number;
    /**
     * List all families for a context.
     *
     * @returns Location to store a pointer to an array of
     *   `PangoFontFamily`. This array should be freed with
     *   {@link G.free}.
     *
     *   Location to store the number of elements in #descs
     */
    list_families(): [FontFamily[], number];
    /**
     * Loads the font in one of the fontmaps in the context that
     * is the closest match for #desc.
     *
     * @param desc A `PangoFontDescription` describing the font
     *   to load
     * @returns The newly allocated `PangoFont` that was loaded,
     *   or %NULL if no font matched.
     */
    load_font(desc: FontDescription): Font | null;
    /**
     * Load a set of fonts in the context that can be used to
     * render a font matching #desc.
     *
     * @param desc A `PangoFontDescription` describing the fonts
     *   to load
     * @param language A `PangoLanguage` the fonts will be used
     *   for
     * @returns The newly allocated `PangoFontset` loaded, or
     *   %NULL if no font matched.
     */
    load_fontset(desc: FontDescription, language: Language): Fontset | null;
    /**
     * Sets the base direction for the context.
     *
     * The base direction is used in applying the Unicode
     * bidirectional algorithm; if the #direction is
     * %PANGO_DIRECTION_LTR or %PANGO_DIRECTION_RTL, then the
     * value will be used as the paragraph direction in the
     * Unicode bidirectional algorithm. A value of
     * %PANGO_DIRECTION_WEAK_LTR or %PANGO_DIRECTION_WEAK_RTL is
     * used only for paragraphs that do not contain any strong
     * characters themselves.
     *
     * @param direction The new base direction
     */
    set_base_dir(direction: Direction): void;
    /**
     * Sets the base gravity for the context.
     *
     * The base gravity is used in laying vertical text out.
     *
     * @param gravity The new base gravity
     */
    set_base_gravity(gravity: Gravity): void;
    /**
     * Set the default font description for the context
     *
     * @param desc The new pango font description
     */
    set_font_description(desc: FontDescription): void;
    /**
     * Sets the font map to be searched when fonts are looked-up
     * in this context.
     *
     * This is only for internal use by Pango backends, a
     * `PangoContext` obtained via one of the recommended methods
     * should already have a suitable font map.
     *
     * @param font_map The `PangoFontMap` to set.
     */
    set_font_map(font_map: FontMap): void;
    /**
     * Sets the gravity hint for the context.
     *
     * The gravity hint is used in laying vertical text out, and
     * is only relevant if gravity of the context as returned by
     * [method#Pango.Context.get_gravity] is set to
     * %PANGO_GRAVITY_EAST or %PANGO_GRAVITY_WEST.
     *
     * @param hint The new gravity hint
     */
    set_gravity_hint(hint: GravityHint): void;
    /**
     * Sets the global language tag for the context.
     *
     * The default language for the locale of the running process
     * can be found using [func#Pango.Language.get_default].
     *
     * @param language The new language tag.
     */
    set_language(language: Language): void;
    /**
     * Sets the transformation matrix that will be applied when
     * rendering with this context.
     *
     * Note that reported metrics are in the user space
     * coordinates before the application of the matrix, not
     * device-space coordinates after the application of the
     * matrix. So, they don't scale with the matrix, though they
     * may change slightly for different matrices, depending on
     * how the text is fit to the pixel grid.
     *
     * @param matrix A `PangoMatrix`, or %NULL to unset any
     *   existing matrix. (No matrix set is the same as setting
     *   the identity matrix.)
     */
    set_matrix(matrix: Matrix | null): void;
    /**
     * Sets whether font rendering with this context should round
     * glyph positions and widths to integral positions, in
     * device units.
     *
     * This is useful when the renderer can't handle subpixel
     * positioning of glyphs.
     *
     * The default value is to round glyph positions, to remain
     * compatible with previous Pango behavior.
     *
     * @param round_positions Whether to round glyph positions
     */
    set_round_glyph_positions(round_positions: boolean): void;
  }

  type ContextInitOptionsMixin = GObject.ObjectInitOptions;
  export interface ContextInitOptions extends ContextInitOptionsMixin {}

  /**
   * This construct is only for enabling class multi-inheritance,
   * use {@link Context} instead.
   */
  type ContextMixin = IContext & GObject.Object;

  /**
   * A `PangoContext` stores global information used to control
   * the itemization process.
   *
   * The information stored by `PangoContext` includes the
   * fontmap used to look up fonts, and default values such as
   * the default language, default gravity, or default font.
   *
   * To obtain a `PangoContext`, use
   * [method#Pango.FontMap.create_context].
   */
  interface Context extends ContextMixin {}

  class Context {
    public constructor(options?: Partial<ContextInitOptions>);
    /**
     * Creates a new `PangoContext` initialized to default
     * values.
     *
     * This function is not particularly useful as it should
     * always be followed by a
     * [method#Pango.Context.set_font_map] call, and the function
     * [method#Pango.FontMap.create_context] does these two steps
     * together and hence users are recommended to use that.
     *
     * If you are using Pango as part of a higher-level system,
     * that system may have it's own way of create a
     * `PangoContext`. For instance, the GTK toolkit has, among
     * others, {@link `gtk.widget_get_pango_context}`. Use those
     * instead.
     *
     * @returns The newly allocated `PangoContext`, which should
     *   be freed with {@link GObject.unref}.
     */
    public static new(): Context;
  }

  /**
   * This construct is only for enabling class multi-inheritance,
   * use {@link Coverage} instead.
   */
  interface ICoverage {
    /**
     * Copy an existing `PangoCoverage`.
     *
     * @returns The newly allocated `PangoCoverage`, with a
     *   reference count of one, which should be freed with
     *   [method#Pango.Coverage.unref].
     */
    copy(): Coverage;
    /**
     * Determine whether a particular index is covered by
     * #coverage.
     *
     * @param index_ The index to check
     * @returns The coverage level of #coverage for character
     *   #index_.
     */
    get(index_: number): CoverageLevel;
    /**
     * @deprecated This function does nothing
     *
     *   Set the coverage for each index in #coverage to be the max
     *   (better) value of the current coverage for the index and
     *   the coverage for the corresponding index in #other.
     * @param other Another `PangoCoverage`
     */
    max(other: Coverage): void;
    /**
     * Increase the reference count on the `PangoCoverage` by
     * one.
     *
     * @returns #coverage
     */
    ref(): Coverage;
    /**
     * Modify a particular index within #coverage
     *
     * @param index_ The index to modify
     * @param level The new level for #index_
     */
    set(index_: number, level: CoverageLevel): void;
    /**
     * @deprecated This returns %NULL
     *
     *   Convert a `PangoCoverage` structure into a flat binary
     *   format.
     * @returns Location to store result (must be freed with
     *   {@link G.free})
     *
     *   Location to store size of result
     */
    to_bytes(): [number[], number];
    /**
     * Decrease the reference count on the `PangoCoverage` by
     * one.
     *
     * If the result is zero, free the coverage and all
     * associated memory.
     */
    unref(): void;
  }

  type CoverageInitOptionsMixin = GObject.ObjectInitOptions;
  export interface CoverageInitOptions extends CoverageInitOptionsMixin {}

  /**
   * This construct is only for enabling class multi-inheritance,
   * use {@link Coverage} instead.
   */
  type CoverageMixin = ICoverage & GObject.Object;

  /**
   * A `PangoCoverage` structure is a map from Unicode characters
   * to [enum#Pango.CoverageLevel] values.
   *
   * It is often necessary in Pango to determine if a particular
   * font can represent a particular character, and also how well
   * it can represent that character. The `PangoCoverage` is a
   * data structure that is used to represent that information.
   * It is an opaque structure with no public fields.
   */
  interface Coverage extends CoverageMixin {}

  class Coverage {
    public constructor(options?: Partial<CoverageInitOptions>);
    /**
     * Create a new `PangoCoverage`
     *
     * @returns The newly allocated `PangoCoverage`, initialized
     *   to %PANGO_COVERAGE_NONE with a reference count of one,
     *   which should be freed with
     *   [method#Pango.Coverage.unref].
     */
    public static new(): Coverage;
    /**
     * @deprecated This returns %NULL
     *
     *   Convert data generated from {@link Pango.Coverage.to_bytes}
     *   back to a `PangoCoverage`.
     * @param bytes Binary data representing a `PangoCoverage`
     * @param n_bytes The size of #bytes in bytes
     * @returns A newly allocated `PangoCoverage`
     */
    public static from_bytes(bytes: number[], n_bytes: number): Coverage | null;
  }

  /**
   * This construct is only for enabling class multi-inheritance,
   * use {@link Font} instead.
   */
  interface IFont {
    /**
     * Returns a description of the font, with font size set in
     * points.
     *
     * Use [method#Pango.Font.describe_with_absolute_size] if you
     * want the font size in device units.
     *
     * @returns A newly-allocated `PangoFontDescription` object.
     */
    describe(): FontDescription;
    /**
     * Returns a description of the font, with absolute font size
     * set in device units.
     *
     * Use [method#Pango.Font.describe] if you want the font size
     * in points.
     *
     * @returns A newly-allocated `PangoFontDescription` object.
     */
    describe_with_absolute_size(): FontDescription;
    /**
     * Computes the coverage map for a given font and language
     * tag.
     *
     * @param language The language tag
     * @returns A newly-allocated `PangoCoverage` object.
     */
    get_coverage(language: Language): Coverage;
    /**
     * Gets the `PangoFontFace` to which #font belongs.
     *
     * @returns The `PangoFontFace`
     */
    get_face(): FontFace;
    /**
     * Obtain the OpenType features that are provided by the
     * font.
     *
     * These are passed to the rendering system, together with
     * features that have been explicitly set via attributes.
     *
     * Note that this does not include OpenType features which
     * the rendering system enables by default.
     *
     * @returns Array to features in
     *
     *   The length of #features
     */
    get_features(): [HarfBuzz.feature_t[], number];
    /**
     * Gets the font map for which the font was created.
     *
     * Note that the font maintains a _weak_ reference to the
     * font map, so if all references to font map are dropped,
     * the font map will be finalized even if there are fonts
     * created with the font map that are still alive. In that
     * case this function will return %NULL.
     *
     * It is the responsibility of the user to ensure that the
     * font map is kept alive. In most uses this is not an issue
     * as a `PangoContext` holds a reference to the font map.
     *
     * @returns The `PangoFontMap` for the font
     */
    get_font_map(): FontMap | null;
    /**
     * Gets the logical and ink extents of a glyph within a font.
     *
     * The coordinate system for each rectangle has its origin at
     * the base line and horizontal origin of the character with
     * increasing coordinates extending to the right and down.
     * The macros {@link PANGO.ASCENT}, PANGO_DESCENT(),
     * PANGO_LBEARING(), and PANGO_RBEARING() can be used to
     * convert from the extents rectangle to more traditional
     * font metrics. The units of the rectangles are in
     * 1/PANGO_SCALE of a device unit.
     *
     * If #font is %NULL, this function gracefully sets some sane
     * values in the output variables and returns.
     *
     * @param glyph The glyph index
     * @returns Rectangle used to store the extents of the glyph
     *   as drawn
     *
     *   Rectangle used to store the logical extents of the glyph
     */
    get_glyph_extents(
      glyph: Glyph
    ): [ink_rect: Rectangle | null, logical_rect: Rectangle | null];
    /**
     * Get a `hb_font_t` object backing this font.
     *
     * Note that the objects returned by this function are cached
     * and immutable. If you need to make changes to the
     * `hb_font_t`, use {@link Hb.font_create_sub_font}.
     *
     * @returns The `hb_font_t` object backing the font
     */
    get_hb_font(): HarfBuzz.font_t | null;
    /**
     * Gets overall metric information for a font.
     *
     * Since the metrics may be substantially different for
     * different scripts, a language tag can be provided to
     * indicate that the metrics should be retrieved that
     * correspond to the script(s) used by that language.
     *
     * If #font is %NULL, this function gracefully sets some sane
     * values in the output variables and returns.
     *
     * @param language Language tag used to determine which
     *   script to get the metrics for, or %NULL to indicate to
     *   get the metrics for the entire font.
     * @returns A `PangoFontMetrics` object. The caller must call
     *   [method#Pango.FontMetrics.unref] when finished using the
     *   object.
     */
    get_metrics(language: Language | null): FontMetrics;
    /**
     * Returns whether the font provides a glyph for this
     * character.
     *
     * Returns %TRUE if #font can render #wc
     *
     * @param wc A Unicode character
     * @returns
     */
    has_char(wc: string): boolean;
  }

  type FontInitOptionsMixin = GObject.ObjectInitOptions;
  export interface FontInitOptions extends FontInitOptionsMixin {}

  /**
   * This construct is only for enabling class multi-inheritance,
   * use {@link Font} instead.
   */
  type FontMixin = IFont & GObject.Object;

  /**
   * A `PangoFont` is used to represent a font in a
   * rendering-system-independent manner.
   */
  interface Font extends FontMixin {}

  class Font {
    public constructor(options?: Partial<FontInitOptions>);
    /**
     * Frees an array of font descriptions.
     *
     * @param descs A pointer to an array of
     *   `PangoFontDescription`, may be %NULL
     * @param n_descs Number of font descriptions in #descs
     */
    public static descriptions_free(
      descs: FontDescription[] | null,
      n_descs: number
    ): void;
  }

  /**
   * This construct is only for enabling class multi-inheritance,
   * use {@link FontFace} instead.
   */
  interface IFontFace {
    /**
     * Returns the family, style, variant, weight and stretch of
     * a `PangoFontFace`. The size field of the resulting font
     * description will be unset.
     *
     * @returns A newly-created `PangoFontDescription` structure
     *   holding the description of the face. Use
     *   [method#Pango.FontDescription.free] to free the result.
     */
    describe(): FontDescription;
    /**
     * Gets a name representing the style of this face among the
     * different faces in the `PangoFontFamily` for the face. The
     * name is suitable for displaying to users.
     *
     * @returns The face name for the face. This string is owned
     *   by the face object and must not be modified or freed.
     */
    get_face_name(): string;
    /**
     * Gets the `PangoFontFamily` that #face belongs to.
     *
     * @returns The `PangoFontFamily`
     */
    get_family(): FontFamily;
    /**
     * Returns whether a `PangoFontFace` is synthesized by the
     * underlying font rendering engine from another face,
     * perhaps by shearing, emboldening, or lightening it.
     *
     * @returns Whether #face is synthesized.
     */
    is_synthesized(): boolean;
    /**
     * List the available sizes for a font.
     *
     * This is only applicable to bitmap fonts. For scalable
     * fonts, stores %NULL at the location pointed to by #sizes
     * and 0 at the location pointed to by #n_sizes. The sizes
     * returned are in Pango units and are sorted in ascending
     * order.
     *
     * @returns Location to store a pointer to an array of int.
     *   This array should be freed with {@link G.free}.
     *
     *   Location to store the number of elements in #sizes
     */
    list_sizes(): [number[] | null, number];
  }

  type FontFaceInitOptionsMixin = GObject.ObjectInitOptions;
  export interface FontFaceInitOptions extends FontFaceInitOptionsMixin {}

  /**
   * This construct is only for enabling class multi-inheritance,
   * use {@link FontFace} instead.
   */
  type FontFaceMixin = IFontFace & GObject.Object;

  /**
   * A `PangoFontFace` is used to represent a group of fonts with
   * the same family, slant, weight, and width, but varying
   * sizes.
   */
  interface FontFace extends FontFaceMixin {}

  class FontFace {
    public constructor(options?: Partial<FontFaceInitOptions>);
  }

  /**
   * This construct is only for enabling class multi-inheritance,
   * use {@link FontFamily} instead.
   */
  interface IFontFamily {
    /**
     * Gets the `PangoFontFace` of #family with the given name.
     *
     * @param name The name of a face. If the name is %NULL, the
     *   family's default face (fontconfig calls it "Regular")
     *   will be returned.
     * @returns The `PangoFontFace`, or %NULL if no face with the
     *   given name exists.
     */
    get_face(name: string | null): FontFace | null;
    /**
     * Gets the name of the family.
     *
     * The name is unique among all fonts for the font backend
     * and can be used in a `PangoFontDescription` to specify
     * that a face from this family is desired.
     *
     * @returns The name of the family. This string is owned by
     *   the family object and must not be modified or freed.
     */
    get_name(): string;
    /**
     * A monospace font is a font designed for text display where
     * the the characters form a regular grid.
     *
     * For Western languages this would mean that the advance
     * width of all characters are the same, but this
     * categorization also includes Asian fonts which include
     * double-width characters: characters that occupy two grid
     * cells. {@link G.unichar_iswide} returns a result that
     * indicates whether a character is typically double-width in
     * a monospace font.
     *
     * The best way to find out the grid-cell size is to call
     * [method#Pango.FontMetrics.get_approximate_digit_width],
     * since the results of
     * [method#Pango.FontMetrics.get_approximate_char_width] may
     * be affected by double-width characters.
     *
     * @returns %TRUE if the family is monospace.
     */
    is_monospace(): boolean;
    /**
     * A variable font is a font which has axes that can be
     * modified to produce different faces.
     *
     * @returns %TRUE if the family is variable
     */
    is_variable(): boolean;
    /**
     * Lists the different font faces that make up #family.
     *
     * The faces in a family share a common design, but differ in
     * slant, weight, width and other aspects.
     *
     * @returns Location to store an array of pointers to
     *   `PangoFontFace` objects, or %NULL. This array should be
     *   freed with {@link G.free} when it is no longer needed.
     *
     *   Location to store number of elements in #faces.
     */
    list_faces(): [FontFace[] | null, number];
  }

  type FontFamilyInitOptionsMixin = GObject.ObjectInitOptions;
  export interface FontFamilyInitOptions extends FontFamilyInitOptionsMixin {}

  /**
   * This construct is only for enabling class multi-inheritance,
   * use {@link FontFamily} instead.
   */
  type FontFamilyMixin = IFontFamily & GObject.Object;

  /**
   * A `PangoFontFamily` is used to represent a family of related
   * font faces.
   *
   * The font faces in a family share a common design, but differ
   * in slant, weight, width or other aspects.
   */
  interface FontFamily extends FontFamilyMixin {}

  class FontFamily {
    public constructor(options?: Partial<FontFamilyInitOptions>);
  }

  /**
   * This construct is only for enabling class multi-inheritance,
   * use {@link FontMap} instead.
   */
  interface IFontMap {
    /**
     * Forces a change in the context, which will cause any
     * `PangoContext` using this fontmap to change.
     *
     * This function is only useful when implementing a new
     * backend for Pango, something applications won't do.
     * Backends should call this function if they have attached
     * extra data to the context and such data is changed.
     */
    changed(): void;
    /**
     * Creates a `PangoContext` connected to #fontmap.
     *
     * This is equivalent to [ctor#Pango.Context.new] followed by
     * [method#Pango.Context.set_font_map].
     *
     * If you are using Pango as part of a higher-level system,
     * that system may have it's own way of create a
     * `PangoContext`. For instance, the GTK toolkit has, among
     * others, {@link NsGtk.Widget.get_pango_context}. Use those
     * instead.
     *
     * @returns The newly allocated `PangoContext`, which should
     *   be freed with {@link GObject.unref}.
     */
    create_context(): Context;
    /**
     * Gets a font family by name.
     *
     * @param name A family name
     * @returns The `PangoFontFamily`
     */
    get_family(name: string): FontFamily;
    /**
     * Returns the current serial number of #fontmap.
     *
     * The serial number is initialized to an small number larger
     * than zero when a new fontmap is created and is increased
     * whenever the fontmap is changed. It may wrap, but will
     * never have the value 0. Since it can wrap, never compare
     * it with "less than", always use "not equals".
     *
     * The fontmap can only be changed using backend-specific
     * API, like changing fontmap resolution.
     *
     * This can be used to automatically detect changes to a
     * `PangoFontMap`, like in `PangoContext`.
     *
     * @returns The current serial number of #fontmap.
     */
    get_serial(): number;
    /**
     * List all families for a fontmap.
     *
     * @returns Location to store a pointer to an array of
     *   `PangoFontFamily` *. This array should be freed with
     *   {@link G.free}.
     *
     *   Location to store the number of elements in #families
     */
    list_families(): [FontFamily[], number];
    /**
     * Load the font in the fontmap that is the closest match for
     * #desc.
     *
     * @param context The `PangoContext` the font will be used
     *   with
     * @param desc A `PangoFontDescription` describing the font
     *   to load
     * @returns The newly allocated `PangoFont` loaded, or %NULL
     *   if no font matched.
     */
    load_font(context: Context, desc: FontDescription): Font | null;
    /**
     * Load a set of fonts in the fontmap that can be used to
     * render a font matching #desc.
     *
     * @param context The `PangoContext` the font will be used
     *   with
     * @param desc A `PangoFontDescription` describing the font
     *   to load
     * @param language A `PangoLanguage` the fonts will be used
     *   for
     * @returns The newly allocated `PangoFontset` loaded, or
     *   %NULL if no font matched.
     */
    load_fontset(
      context: Context,
      desc: FontDescription,
      language: Language
    ): Fontset | null;
  }

  type FontMapInitOptionsMixin = GObject.ObjectInitOptions;
  export interface FontMapInitOptions extends FontMapInitOptionsMixin {}

  /**
   * This construct is only for enabling class multi-inheritance,
   * use {@link FontMap} instead.
   */
  type FontMapMixin = IFontMap & GObject.Object;

  /**
   * A `PangoFontMap` represents the set of fonts available for a
   * particular rendering system.
   *
   * This is a virtual object with implementations being specific
   * to particular rendering systems.
   */
  interface FontMap extends FontMapMixin {}

  class FontMap {
    public constructor(options?: Partial<FontMapInitOptions>);
  }

  /**
   * This construct is only for enabling class multi-inheritance,
   * use {@link Fontset} instead.
   */
  interface IFontset {
    /**
     * Iterates through all the fonts in a fontset, calling #func
     * for each one.
     *
     * If #func returns %TRUE, that stops the iteration.
     *
     * @param func Callback function
     * @param data Data to pass to the callback function
     */
    foreach(func: FontsetForeachFunc, data: any | null): void;
    /**
     * Returns the font in the fontset that contains the best
     * glyph for a Unicode character.
     *
     * @param wc A Unicode character
     * @returns A `PangoFont`
     */
    get_font(wc: number): Font;
    /**
     * Get overall metric information for the fonts in the
     * fontset.
     *
     * @returns A `PangoFontMetrics` object
     */
    get_metrics(): FontMetrics;
  }

  type FontsetInitOptionsMixin = GObject.ObjectInitOptions;
  export interface FontsetInitOptions extends FontsetInitOptionsMixin {}

  /**
   * This construct is only for enabling class multi-inheritance,
   * use {@link Fontset} instead.
   */
  type FontsetMixin = IFontset & GObject.Object;

  /**
   * A `PangoFontset` represents a set of `PangoFont` to use when
   * rendering text.
   *
   * A `PAngoFontset` is the result of resolving a
   * `PangoFontDescription` against a particular `PangoContext`.
   * It has operations for finding the component font for a
   * particular Unicode character, and for finding a composite
   * set of metrics for the entire fontset.
   */
  interface Fontset extends FontsetMixin {}

  class Fontset {
    public constructor(options?: Partial<FontsetInitOptions>);
  }

  /**
   * This construct is only for enabling class multi-inheritance,
   * use {@link FontsetSimple} instead.
   */
  interface IFontsetSimple {
    /**
     * Adds a font to the fontset.
     *
     * @param font A `PangoFont`.
     */
    append(font: Font): void;
    /**
     * Returns the number of fonts in the fontset.
     *
     * @returns The size of #fontset
     */
    size(): number;
  }

  type FontsetSimpleInitOptionsMixin = FontsetInitOptions;
  export interface FontsetSimpleInitOptions
    extends FontsetSimpleInitOptionsMixin {}

  /**
   * This construct is only for enabling class multi-inheritance,
   * use {@link FontsetSimple} instead.
   */
  type FontsetSimpleMixin = IFontsetSimple & Fontset;

  /**
   * `PangoFontsetSimple` is a implementation of the abstract
   * `PangoFontset` base class as an array of fonts.
   *
   * When creating a `PangoFontsetSimple`, you have to provide
   * the array of fonts that make up the fontset.
   */
  interface FontsetSimple extends FontsetSimpleMixin {}

  class FontsetSimple {
    public constructor(options?: Partial<FontsetSimpleInitOptions>);
    /**
     * Creates a new `PangoFontsetSimple` for the given language.
     *
     * @param language A `PangoLanguage` tag
     * @returns The newly allocated `PangoFontsetSimple`
     */
    public static new(language: Language): FontsetSimple;
  }

  /**
   * This construct is only for enabling class multi-inheritance,
   * use {@link Layout} instead.
   */
  interface ILayout {
    /**
     * Forces recomputation of any state in the `PangoLayout`
     * that might depend on the layout's context.
     *
     * This function should be called if you make changes to the
     * context subsequent to creating the layout.
     */
    context_changed(): void;
    /**
     * Creates a deep copy-by-value of the layout.
     *
     * The attribute list, tab array, and text from the original
     * layout are all copied by value.
     *
     * @returns The newly allocated `PangoLayout`
     */
    copy(): Layout;
    /**
     * Gets the alignment for the layout: how partial lines are
     * positioned within the horizontal space available.
     *
     * @returns The alignment
     */
    get_alignment(): Alignment;
    /**
     * Gets the attribute list for the layout, if any.
     *
     * @returns A `PangoAttrList`
     */
    get_attributes(): AttrList | null;
    /**
     * Gets whether to calculate the base direction for the
     * layout according to its contents.
     *
     * See [method#Pango.Layout.set_auto_dir].
     *
     * @returns %TRUE if the bidirectional base direction is
     *   computed from the layout's contents, %FALSE otherwise
     */
    get_auto_dir(): boolean;
    /**
     * Gets the Y position of baseline of the first line in
     * #layout.
     *
     * @returns Baseline of first line, from top of #layout
     */
    get_baseline(): number;
    /**
     * Returns the number of Unicode characters in the the text
     * of #layout.
     *
     * @returns The number of Unicode characters in the text of
     *   #layout
     */
    get_character_count(): number;
    /**
     * Retrieves the `PangoContext` used for this layout.
     *
     * @returns The `PangoContext` for the layout
     */
    get_context(): Context;
    /**
     * Given an index within a layout, determines the positions
     * that of the strong and weak cursors if the insertion point
     * is at that index.
     *
     * The position of each cursor is stored as a zero-width
     * rectangle. The strong cursor location is the location
     * where characters of the directionality equal to the base
     * direction of the layout are inserted. The weak cursor
     * location is the location where characters of the
     * directionality opposite to the base direction of the
     * layout are inserted.
     *
     * @param index_ The byte index of the cursor
     * @returns Location to store the strong cursor position
     *
     *   Location to store the weak cursor position
     */
    get_cursor_pos(
      index_: number
    ): [strong_pos: Rectangle | null, weak_pos: Rectangle | null];
    /**
     * Gets the text direction at the given character position in
     * #layout.
     *
     * @param index The byte index of the char
     * @returns The text direction at #index
     */
    get_direction(index: number): Direction;
    /**
     * Gets the type of ellipsization being performed for
     * #layout.
     *
     * See [method#Pango.Layout.set_ellipsize].
     *
     * Use [method#Pango.Layout.is_ellipsized] to query whether
     * any paragraphs were actually ellipsized.
     *
     * @returns The current ellipsization mode for #layout
     */
    get_ellipsize(): EllipsizeMode;
    /**
     * Computes the logical and ink extents of #layout.
     *
     * Logical extents are usually what you want for positioning
     * things. Note that both extents may have non-zero x and y.
     * You may want to use those to offset where you render the
     * layout. Not doing that is a very typical bug that shows up
     * as right-to-left layouts not being correctly positioned in
     * a layout with a set width.
     *
     * The extents are given in layout coordinates and in Pango
     * units; layout coordinates begin at the top left corner of
     * the layout.
     *
     * @returns Rectangle used to store the extents of the layout
     *   as drawn
     *
     *   Rectangle used to store the logical extents of the layout
     */
    get_extents(): [ink_rect: Rectangle | null, logical_rect: Rectangle | null];
    /**
     * Gets the font description for the layout, if any.
     *
     * @returns A pointer to the layout's font description, or
     *   %NULL if the font description from the layout's context
     *   is inherited.
     */
    get_font_description(): FontDescription | null;
    /**
     * Gets the height of layout used for ellipsization.
     *
     * See [method#Pango.Layout.set_height] for details.
     *
     * @returns The height, in Pango units if positive, or number
     *   of lines if negative.
     */
    get_height(): number;
    /**
     * Gets the paragraph indent width in Pango units.
     *
     * A negative value indicates a hanging indentation.
     *
     * @returns The indent in Pango units
     */
    get_indent(): number;
    /**
     * Returns an iterator to iterate over the visual extents of
     * the layout.
     *
     * @returns The new `PangoLayoutIter`
     */
    get_iter(): LayoutIter;
    /**
     * Gets whether each complete line should be stretched to
     * fill the entire width of the layout.
     *
     * @returns The justify value
     */
    get_justify(): boolean;
    /**
     * Retrieves a particular line from a `PangoLayout`.
     *
     * Use the faster [method#Pango.Layout.get_line_readonly] if
     * you do not plan to modify the contents of the line
     * (glyphs, glyph widths, etc.).
     *
     * @param line The index of a line, which must be between 0
     *   and `pango_layout_get_line_count(layout) - 1`,
     *   inclusive.
     * @returns The requested `PangoLayoutLine`, or %NULL if the
     *   index is out of range. This layout line can be ref'ed
     *   and retained, but will become invalid if changes are
     *   made to the `PangoLayout`.
     */
    get_line(line: number): LayoutLine | null;
    /**
     * Retrieves the count of lines for the #layout.
     *
     * @returns The line count
     */
    get_line_count(): number;
    /**
     * Retrieves a particular line from a `PangoLayout`.
     *
     * This is a faster alternative to
     * [method#Pango.Layout.get_line], but the user is not
     * expected to modify the contents of the line (glyphs, glyph
     * widths, etc.).
     *
     * @param line The index of a line, which must be between 0
     *   and `pango_layout_get_line_count(layout) - 1`,
     *   inclusive.
     * @returns The requested `PangoLayoutLine`, or %NULL if the
     *   index is out of range. This layout line can be ref'ed
     *   and retained, but will become invalid if changes are
     *   made to the `PangoLayout`. No changes should be made to
     *   the line.
     */
    get_line_readonly(line: number): LayoutLine | null;
    /**
     * Gets the line spacing factor of #layout.
     *
     * See [method#Pango.Layout.set_line_spacing].
     *
     * @returns
     */
    get_line_spacing(): number;
    /**
     * Returns the lines of the #layout as a list.
     *
     * Use the faster [method#Pango.Layout.get_lines_readonly] if
     * you do not plan to modify the contents of the lines
     * (glyphs, glyph widths, etc.).
     *
     * @returns A `GSList` containing the lines in the layout.
     *   This points to internal data of the `PangoLayout` and
     *   must be used with care. It will become invalid on any
     *   change to the layout's text or properties.
     */
    get_lines(): GLib.SList;
    /**
     * Returns the lines of the #layout as a list.
     *
     * This is a faster alternative to
     * [method#Pango.Layout.get_lines], but the user is not
     * expected to modify the contents of the lines (glyphs,
     * glyph widths, etc.).
     *
     * @returns A `GSList` containing the lines in the layout.
     *   This points to internal data of the `PangoLayout` and
     *   must be used with care. It will become invalid on any
     *   change to the layout's text or properties. No changes
     *   should be made to the lines.
     */
    get_lines_readonly(): GLib.SList;
    /**
     * Retrieves an array of logical attributes for each
     * character in the #layout.
     *
     * @returns Location to store a pointer to an array of
     *   logical attributes. This value must be freed with
     *   {@link G.free}.
     *
     *   Location to store the number of the attributes in the
     *   array. (The stored value will be one more than the total
     *   number of characters in the layout, since there need to
     *   be attributes corresponding to both the position before
     *   the first character and the position after the last
     *   character.)
     */
    get_log_attrs(): [LogAttr[], number];
    /**
     * Retrieves an array of logical attributes for each
     * character in the #layout.
     *
     * This is a faster alternative to
     * [method#Pango.Layout.get_log_attrs]. The returned array is
     * part of #layout and must not be modified. Modifying the
     * layout will invalidate the returned array.
     *
     * The number of attributes returned in #n_attrs will be one
     * more than the total number of characters in the layout,
     * since there need to be attributes corresponding to both
     * the position before the first character and the position
     * after the last character.
     *
     * @returns An array of logical attributes
     *
     *   Location to store the number of the attributes in the
     *   array
     */
    get_log_attrs_readonly(): [LogAttr[], number];
    /**
     * Computes the logical and ink extents of #layout in device
     * units.
     *
     * This function just calls [method#Pango.Layout.get_extents]
     * followed by two [func#extents_to_pixels] calls, rounding
     * #ink_rect and #logical_rect such that the rounded
     * rectangles fully contain the unrounded one (that is,
     * passes them as first argument to
     * [func#Pango.extents_to_pixels]).
     *
     * @returns Rectangle used to store the extents of the layout
     *   as drawn
     *
     *   Rectangle used to store the logical extents of the layout
     */
    get_pixel_extents(): [
      ink_rect: Rectangle | null,
      logical_rect: Rectangle | null
    ];
    /**
     * Determines the logical width and height of a `PangoLayout`
     * in device units.
     *
     * [method#Pango.Layout.get_size] returns the width and
     * height scaled by %PANGO_SCALE. This is simply a
     * convenience function around
     * [method#Pango.Layout.get_pixel_extents].
     *
     * @returns Location to store the logical width
     *
     *   Location to store the logical height
     */
    get_pixel_size(): [width: number | null, height: number | null];
    /**
     * Returns the current serial number of #layout.
     *
     * The serial number is initialized to an small number larger
     * than zero when a new layout is created and is increased
     * whenever the layout is changed using any of the setter
     * functions, or the `PangoContext` it uses has changed. The
     * serial may wrap, but will never have the value 0. Since it
     * can wrap, never compare it with "less than", always use
     * "not equals".
     *
     * This can be used to automatically detect changes to a
     * `PangoLayout`, and is useful for example to decide whether
     * a layout needs redrawing. To force the serial to be
     * increased, use [method#Pango.Layout.context_changed].
     *
     * @returns The current serial number of #layout.
     */
    get_serial(): number;
    /**
     * Obtains whether #layout is in single paragraph mode.
     *
     * See [method#Pango.Layout.set_single_paragraph_mode].
     *
     * @returns %TRUE if the layout does not break paragraphs at
     *   paragraph separator characters, %FALSE otherwise
     */
    get_single_paragraph_mode(): boolean;
    /**
     * Determines the logical width and height of a `PangoLayout`
     * in Pango units.
     *
     * This is simply a convenience function around
     * [method#Pango.Layout.get_extents].
     *
     * @returns Location to store the logical width
     *
     *   Location to store the logical height
     */
    get_size(): [width: number | null, height: number | null];
    /**
     * Gets the amount of spacing between the lines of the
     * layout.
     *
     * @returns The spacing in Pango units
     */
    get_spacing(): number;
    /**
     * Gets the current `PangoTabArray` used by this layout.
     *
     * If no `PangoTabArray` has been set, then the default tabs
     * are in use and %NULL is returned. Default tabs are every 8
     * spaces.
     *
     * The return value should be freed with
     * [method#Pango.TabArray.free].
     *
     * @returns A copy of the tabs for this layout
     */
    get_tabs(): TabArray | null;
    /**
     * Gets the text in the layout.
     *
     * The returned text should not be freed or modified.
     *
     * @returns The text in the #layout
     */
    get_text(): string;
    /**
     * Counts the number of unknown glyphs in #layout.
     *
     * This function can be used to determine if there are any
     * fonts available to render all characters in a certain
     * string, or when used in combination with
     * %PANGO_ATTR_FALLBACK, to check if a certain font supports
     * all the characters in the string.
     *
     * @returns The number of unknown glyphs in #layout
     */
    get_unknown_glyphs_count(): number;
    /**
     * Gets the width to which the lines of the `PangoLayout`
     * should wrap.
     *
     * @returns The width in Pango units, or -1 if no width set.
     */
    get_width(): number;
    /**
     * Gets the wrap mode for the layout.
     *
     * Use [method#Pango.Layout.is_wrapped] to query whether any
     * paragraphs were actually wrapped.
     *
     * @returns Active wrap mode.
     */
    get_wrap(): WrapMode;
    /**
     * Converts from byte #index_ within the #layout to line and
     * X position.
     *
     * The X position is measured from the left edge of the line.
     *
     * @param index_ The byte index of a grapheme within the
     *   layout
     * @param trailing An integer indicating the edge of the
     *   grapheme to retrieve the position of. If > 0, the
     *   trailing edge of the grapheme, if 0, the leading of the
     *   grapheme
     * @returns Location to store resulting line index. (which
     *   will between 0 and pango_layout_get_line_count(layout) -
     *   1)
     *
     *   Location to store resulting position within line
     *   (%PANGO_SCALE units per device unit)
     */
    index_to_line_x(
      index_: number,
      trailing: boolean
    ): [line: number | null, x_pos: number | null];
    /**
     * Converts from an index within a `PangoLayout` to the
     * onscreen position corresponding to the grapheme at that
     * index.
     *
     * The return value is represented as rectangle. Note that
     * `pos->x` is always the leading edge of the grapheme and
     * `pos->x + pos->width` the trailing edge of the grapheme.
     * If the directionality of the grapheme is right-to-left,
     * then `pos->width` will be negative.
     *
     * @param index_ Byte index within #layout
     * @returns Rectangle in which to store the position of the
     *   grapheme
     */
    index_to_pos(index_: number): Rectangle;
    /**
     * Queries whether the layout had to ellipsize any
     * paragraphs.
     *
     * This returns %TRUE if the ellipsization mode for #layout
     * is not %PANGO_ELLIPSIZE_NONE, a positive width is set on
     * #layout, and there are paragraphs exceeding that width
     * that have to be ellipsized.
     *
     * @returns %TRUE if any paragraphs had to be ellipsized,
     *   %FALSE otherwise
     */
    is_ellipsized(): boolean;
    /**
     * Queries whether the layout had to wrap any paragraphs.
     *
     * This returns %TRUE if a positive width is set on #layout,
     * ellipsization mode of #layout is set to
     * %PANGO_ELLIPSIZE_NONE, and there are paragraphs exceeding
     * the layout width that have to be wrapped.
     *
     * @returns %TRUE if any paragraphs had to be wrapped, %FALSE
     *   otherwise
     */
    is_wrapped(): boolean;
    /**
     * Computes a new cursor position from an old position and a
     * count of positions to move visually.
     *
     * If #direction is positive, then the new strong cursor
     * position will be one position to the right of the old
     * cursor position. If #direction is negative, then the new
     * strong cursor position will be one position to the left of
     * the old cursor position.
     *
     * In the presence of bidirectional text, the correspondence
     * between logical and visual order will depend on the
     * direction of the current run, and there may be jumps when
     * the cursor is moved off of the end of a run.
     *
     * Motion here is in cursor positions, not in characters, so
     * a single call to
     * [method#Pango.Layout.move_cursor_visually] may move the
     * cursor over multiple characters when multiple characters
     * combine to form a single grapheme.
     *
     * @param strong Whether the moving cursor is the strong
     *   cursor or the weak cursor. The strong cursor is the
     *   cursor corresponding to text insertion in the base
     *   direction for the layout.
     * @param old_index The byte index of the grapheme for the
     *   old index
     * @param old_trailing If 0, the cursor was at the leading
     *   edge of the grapheme indicated by #old_index, if > 0,
     *   the cursor was at the trailing edge.
     * @param direction Direction to move cursor. A negative
     *   value indicates motion to the left
     * @returns Location to store the new cursor byte index. A
     *   value of -1 indicates that the cursor has been moved off
     *   the beginning of the layout. A value of %G_MAXINT
     *   indicates that the cursor has been moved off the end of
     *   the layout.
     *
     *   Number of characters to move forward from the location
     *   returned for #new_index to get the position where the
     *   cursor should be displayed. This allows distinguishing
     *   the position at the beginning of one line from the
     *   position at the end of the preceding line. #new_index is
     *   always on the line where the cursor should be
     *   displayed.
     */
    move_cursor_visually(
      strong: boolean,
      old_index: number,
      old_trailing: number,
      direction: number
    ): [new_index: number, new_trailing: number];
    /**
     * Sets the alignment for the layout: how partial lines are
     * positioned within the horizontal space available.
     *
     * The default alignment is %PANGO_ALIGN_LEFT.
     *
     * @param alignment The alignment
     */
    set_alignment(alignment: Alignment): void;
    /**
     * Sets the text attributes for a layout object.
     *
     * References #attrs, so the caller can unref its reference.
     *
     * @param attrs A `PangoAttrList`
     */
    set_attributes(attrs: AttrList | null): void;
    /**
     * Sets whether to calculate the base direction for the
     * layout according to its contents.
     *
     * When this flag is on (the default), then paragraphs in
     * #layout that begin with strong right-to-left characters
     * (Arabic and Hebrew principally), will have right-to-left
     * layout, paragraphs with letters from other scripts will
     * have left-to-right layout. Paragraphs with only neutral
     * characters get their direction from the surrounding
     * paragraphs.
     *
     * When %FALSE, the choice between left-to-right and
     * right-to-left layout is done according to the base
     * direction of the layout's `PangoContext`. (See
     * [method#Pango.Context.set_base_dir]).
     *
     * When the auto-computed direction of a paragraph differs
     * from the base direction of the context, the interpretation
     * of %PANGO_ALIGN_LEFT and %PANGO_ALIGN_RIGHT are swapped.
     *
     * @param auto_dir If %TRUE, compute the bidirectional base
     *   direction from the layout's contents
     */
    set_auto_dir(auto_dir: boolean): void;
    /**
     * Sets the type of ellipsization being performed for
     * #layout.
     *
     * Depending on the ellipsization mode #ellipsize text is
     * removed from the start, middle, or end of text so they fit
     * within the width and height of layout set with
     * [method#Pango.Layout.set_width] and
     * [method#Pango.Layout.set_height].
     *
     * If the layout contains characters such as newlines that
     * force it to be layed out in multiple paragraphs, then
     * whether each paragraph is ellipsized separately or the
     * entire layout is ellipsized as a whole depends on the set
     * height of the layout.
     *
     * The default value is %PANGO_ELLIPSIZE_NONE.
     *
     * See [method#Pango.Layout.set_height] for details.
     *
     * @param ellipsize The new ellipsization mode for #layout
     */
    set_ellipsize(ellipsize: EllipsizeMode): void;
    /**
     * Sets the default font description for the layout.
     *
     * If no font description is set on the layout, the font
     * description from the layout's context is used.
     *
     * @param desc The new `PangoFontDescription` to unset the
     *   current font description
     */
    set_font_description(desc: FontDescription | null): void;
    /**
     * Sets the height to which the `PangoLayout` should be
     * ellipsized at.
     *
     * There are two different behaviors, based on whether
     * #height is positive or negative.
     *
     * If #height is positive, it will be the maximum height of
     * the layout. Only lines would be shown that would fit, and
     * if there is any text omitted, an ellipsis added. At least
     * one line is included in each paragraph regardless of how
     * small the height value is. A value of zero will render
     * exactly one line for the entire layout.
     *
     * If #height is negative, it will be the (negative of)
     * maximum number of lines per paragraph. That is, the total
     * number of lines shown may well be more than this value if
     * the layout contains multiple paragraphs of text. The
     * default value of -1 means that the first line of each
     * paragraph is ellipsized. This behavior may be changed in
     * the future to act per layout instead of per paragraph.
     * File a bug against pango at
     * [https://gitlab.gnome.org/gnome/pango](https://gitlab.gnome.org/gnome/pango)
     * if your code relies on this behavior.
     *
     * Height setting only has effect if a positive width is set
     * on #layout and ellipsization mode of #layout is not
     * %PANGO_ELLIPSIZE_NONE. The behavior is undefined if a
     * height other than -1 is set and ellipsization mode is set
     * to %PANGO_ELLIPSIZE_NONE, and may change in the future.
     *
     * @param height The desired height of the layout in Pango
     *   units if positive, or desired number of lines if
     *   negative.
     */
    set_height(height: number): void;
    /**
     * Sets the width in Pango units to indent each paragraph.
     *
     * A negative value of #indent will produce a hanging
     * indentation. That is, the first line will have the full
     * width, and subsequent lines will be indented by the
     * absolute value of #indent.
     *
     * The indent setting is ignored if layout alignment is set
     * to %PANGO_ALIGN_CENTER.
     *
     * The default value is 0.
     *
     * @param indent The amount by which to indent
     */
    set_indent(indent: number): void;
    /**
     * Sets whether each complete line should be stretched to
     * fill the entire width of the layout.
     *
     * Stretching is typically done by adding whitespace, but for
     * some scripts (such as Arabic), the justification may be
     * done in more complex ways, like extending the characters.
     *
     * Note that this setting is not implemented and so is
     * ignored in Pango older than 1.18.
     *
     * The default value is %FALSE.
     *
     * @param justify Whether the lines in the layout should be
     *   justified
     */
    set_justify(justify: boolean): void;
    /**
     * Sets a factor for line spacing.
     *
     * Typical values are: 0, 1, 1.5, 2. The default values is 0.
     *
     * If #factor is non-zero, lines are placed so that
     *
     *     baseline2 = baseline1 + factor * height2;
     *
     * Where height2 is the line height of the second line (as
     * determined by the font(s)). In this case, the spacing set
     * with [method#Pango.Layout.set_spacing] is ignored.
     *
     * If #factor is zero (the default), spacing is applied as
     * before.
     *
     * @param factor The new line spacing factor
     */
    set_line_spacing(factor: number): void;
    /**
     * Sets the layout text and attribute list from marked-up
     * text.
     *
     * See [Pango Markup](pango_markup.html)).
     *
     * Replaces the current text and attribute list.
     *
     * This is the same as
     * [method#Pango.Layout.set_markup_with_accel], but the
     * markup text isn't scanned for accelerators.
     *
     * @param markup Marked-up text
     * @param length Length of marked-up text in bytes, or -1 if
     *   #markup is `NUL`-terminated
     */
    set_markup(markup: string, length: number): void;
    /**
     * Sets the layout text and attribute list from marked-up
     * text.
     *
     * See [Pango Markup](pango_markup.html)).
     *
     * Replaces the current text and attribute list.
     *
     * If #accel_marker is nonzero, the given character will mark
     * the character following it as an accelerator. For example,
     * #accel_marker might be an ampersand or underscore. All
     * characters marked as an accelerator will receive a
     * %PANGO_UNDERLINE_LOW attribute, and the first character so
     * marked will be returned in #accel_char. Two #accel_marker
     * characters following each other produce a single literal
     * #accel_marker character.
     *
     * @param markup Marked-up text (see [Pango
     *   Markup](pango_markup.html))
     * @param length Length of marked-up text in bytes, or -1 if
     *   #markup is `NUL`-terminated
     * @param accel_marker Marker for accelerators in the text
     * @returns Return location for first located accelerator
     */
    set_markup_with_accel(
      markup: string,
      length: number,
      accel_marker: string
    ): string | null;
    /**
     * Sets the single paragraph mode of #layout.
     *
     * If #setting is %TRUE, do not treat newlines and similar
     * characters as paragraph separators; instead, keep all text
     * in a single paragraph, and display a glyph for paragraph
     * separator characters. Used when you want to allow editing
     * of newlines on a single text line.
     *
     * The default value is %FALSE.
     *
     * @param setting New setting
     */
    set_single_paragraph_mode(setting: boolean): void;
    /**
     * Sets the amount of spacing in Pango units between the
     * lines of the layout.
     *
     * When placing lines with spacing, Pango arranges things so
     * that
     *
     *     line2.top = line1.bottom + spacing;
     *
     * The default value is 0.
     *
     * Note: Since 1.44, Pango is using the line height (as
     * determined by the font) for placing lines when the line
     * height factor is set to a non-zero value with
     * [method#Pango.Layout.set_line_spacing]. In that case, the
     * #spacing set with this function is ignored.
     *
     * @param spacing The amount of spacing
     */
    set_spacing(spacing: number): void;
    /**
     * Sets the tabs to use for #layout, overriding the default
     * tabs.
     *
     * By default, tabs are every 8 spaces. If #tabs is %NULL,
     * the default tabs are reinstated. #tabs is copied into the
     * layout; you must free your copy of #tabs yourself.
     *
     * @param tabs A `PangoTabArray`
     */
    set_tabs(tabs: TabArray | null): void;
    /**
     * Sets the text of the layout.
     *
     * This function validates #text and renders invalid UTF-8
     * with a placeholder glyph.
     *
     * Note that if you have used
     * [method#Pango.Layout.set_markup] or
     * [method#Pango.Layout.set_markup_with_accel] on #layout
     * before, you may want to call
     * [method#Pango.Layout.set_attributes] to clear the
     * attributes set on the layout from the markup as this
     * function does not clear attributes.
     *
     * @param text The text
     * @param length Maximum length of #text, in bytes. -1
     *   indicates that the string is nul-terminated and the
     *   length should be calculated. The text will also be
     *   truncated on encountering a nul-termination even when
     *   #length is positive.
     */
    set_text(text: string, length: number): void;
    /**
     * Sets the width to which the lines of the `PangoLayout`
     * should wrap or ellipsized.
     *
     * The default value is -1: no width set.
     *
     * @param width The desired width in Pango units, or -1 to
     *   indicate that no wrapping or ellipsization should be
     *   performed.
     */
    set_width(width: number): void;
    /**
     * Sets the wrap mode.
     *
     * The wrap mode only has effect if a width is set on the
     * layout with [method#Pango.Layout.set_width]. To turn off
     * wrapping, set the width to -1.
     *
     * The default value is %PANGO_WRAP_WORD.
     *
     * @param wrap The wrap mode
     */
    set_wrap(wrap: WrapMode): void;
    /**
     * Converts from X and Y position within a layout to the byte
     * index to the character at that logical position.
     *
     * If the Y position is not inside the layout, the closest
     * position is chosen (the position will be clamped inside
     * the layout). If the X position is not within the layout,
     * then the start or the end of the line is chosen as
     * described for [method#Pango.LayoutLine.x_to_index]. If
     * either the X or Y positions were not inside the layout,
     * then the function returns %FALSE; on an exact hit, it
     * returns %TRUE.
     *
     * @param x The X offset (in Pango units) from the left edge
     *   of the layout
     * @param y The Y offset (in Pango units) from the top edge
     *   of the layout
     * @returns %TRUE if the coordinates were inside text, %FALSE
     *   otherwise
     *
     *   Location to store calculated byte index
     *
     *   Location to store a integer indicating where in the
     *   grapheme the user clicked. It will either be zero, or
     *   the number of characters in the grapheme. 0 represents
     *   the leading edge of the grapheme.
     */
    xy_to_index(x: number, y: number): [boolean, number, number];
  }

  type LayoutInitOptionsMixin = GObject.ObjectInitOptions;
  export interface LayoutInitOptions extends LayoutInitOptionsMixin {}

  /**
   * This construct is only for enabling class multi-inheritance,
   * use {@link Layout} instead.
   */
  type LayoutMixin = ILayout & GObject.Object;

  /**
   * A `PangoLayout` structure represents an entire paragraph of
   * text.
   *
   * While complete access to the layout capabilities of Pango is
   * provided using the detailed interfaces for itemization and
   * shaping, using that functionality directly involves writing
   * a fairly large amount of code. `PangoLayout` provides a
   * high-level driver for formatting entire paragraphs of text
   * at once. This includes paragraph-level functionality such as
   * line breaking, justification, alignment and ellipsization.
   *
   * A `PangoLayout` is initialized with a `PangoContext`, UTF-8
   * string and set of attributes for that string. Once that is
   * done, the set of formatted lines can be extracted from the
   * object, the layout can be rendered, and conversion between
   * logical character positions within the layout's text, and
   * the physical position of the resulting glyphs can be made.
   *
   * There are a number of parameters to adjust the formatting of
   * a `PangoLayout`. The following image shows adjustable
   * parameters (on the left) and font metrics (on the right):
   *
   * [Pango Layout Parameters](layout.png)
   *
   * It is possible, as well, to ignore the 2-D setup, and simply
   * treat the results of a `PangoLayout` as a list of lines.
   */
  interface Layout extends LayoutMixin {}

  class Layout {
    public constructor(options?: Partial<LayoutInitOptions>);
    /**
     * Create a new `PangoLayout` object with attributes
     * initialized to default values for a particular
     * `PangoContext`.
     *
     * @param context A `PangoContext`
     * @returns The newly allocated `PangoLayout`
     */
    public static new(context: Context): Layout;
  }

  /**
   * This construct is only for enabling class multi-inheritance,
   * use {@link Renderer} instead.
   */
  interface IRenderer {
    /**
     * The current transformation matrix for the Renderer; may be
     * %NULL, which should be treated the same as the identity
     * matrix.
     */
    readonly matrix: Matrix;
    /**
     * Does initial setup before rendering operations on
     * #renderer.
     *
     * [method#Pango.Renderer.deactivate] should be called when
     * done drawing. Calls such as
     * [method#Pango.Renderer.draw_layout] automatically activate
     * the layout before drawing on it.
     *
     * Calls to [method#Pango.Renderer.activate] and
     * [method#Pango.Renderer.deactivate] can be nested and the
     * renderer will only be initialized and deinitialized once.
     */
    activate(): void;
    /**
     * Cleans up after rendering operations on #renderer.
     *
     * See docs for [method#Pango.Renderer.activate].
     */
    deactivate(): void;
    /**
     * Draw a squiggly line that approximately covers the given
     * rectangle in the style of an underline used to indicate a
     * spelling error.
     *
     * The width of the underline is rounded to an integer number
     * of up/down segments and the resulting rectangle is
     * centered in the original rectangle.
     *
     * This should be called while #renderer is already active.
     * Use [method#Pango.Renderer.activate] to activate a
     * renderer.
     *
     * @param x X coordinate of underline, in Pango units in user
     *   coordinate system
     * @param y Y coordinate of underline, in Pango units in user
     *   coordinate system
     * @param width Width of underline, in Pango units in user
     *   coordinate system
     * @param height Height of underline, in Pango units in user
     *   coordinate system
     */
    draw_error_underline(
      x: number,
      y: number,
      width: number,
      height: number
    ): void;
    /**
     * Draws a single glyph with coordinates in device space.
     *
     * @param font A `PangoFont`
     * @param glyph The glyph index of a single glyph
     * @param x X coordinate of left edge of baseline of glyph
     * @param y Y coordinate of left edge of baseline of glyph
     */
    draw_glyph(font: Font, glyph: Glyph, x: number, y: number): void;
    /**
     * Draws the glyphs in #glyph_item with the specified
     * `PangoRenderer`, embedding the text associated with the
     * glyphs in the output if the output format supports it.
     *
     * This is useful for rendering text in PDF.
     *
     * Note that this method does not handle attributes in
     * #glyph_item. If you want colors, shapes and lines handled
     * automatically according to those attributes, you need to
     * use {@link Pango.Renderer.draw_layout_line} or
     * pango_renderer_draw_layout().
     *
     * Note that #text is the start of the text for layout, which
     * is then indexed by `glyph_item->item->offset`.
     *
     * If #text is %NULL, this simply calls
     * [method#Pango.Renderer.draw_glyphs].
     *
     * The default implementation of this method simply falls
     * back to [method#Pango.Renderer.draw_glyphs].
     *
     * @param text The UTF-8 text that #glyph_item refers to
     * @param glyph_item A `PangoGlyphItem`
     * @param x X position of left edge of baseline, in user
     *   space coordinates in Pango units
     * @param y Y position of left edge of baseline, in user
     *   space coordinates in Pango units
     */
    draw_glyph_item(
      text: string | null,
      glyph_item: GlyphItem,
      x: number,
      y: number
    ): void;
    /**
     * Draws the glyphs in #glyphs with the specified
     * `PangoRenderer`.
     *
     * @param font A `PangoFont`
     * @param glyphs A `PangoGlyphString`
     * @param x X position of left edge of baseline, in user
     *   space coordinates in Pango units.
     * @param y Y position of left edge of baseline, in user
     *   space coordinates in Pango units.
     */
    draw_glyphs(font: Font, glyphs: GlyphString, x: number, y: number): void;
    /**
     * Draws #layout with the specified `PangoRenderer`.
     *
     * This is equivalent to drawing the lines of the layout, at
     * their respective positions relative to #x, #y.
     *
     * @param layout A `PangoLayout`
     * @param x X position of left edge of baseline, in user
     *   space coordinates in Pango units.
     * @param y Y position of left edge of baseline, in user
     *   space coordinates in Pango units.
     */
    draw_layout(layout: Layout, x: number, y: number): void;
    /**
     * Draws #line with the specified `PangoRenderer`.
     *
     * This draws the glyph items that make up the line, as well
     * as shapes, backgrounds and lines that are specified by the
     * attributes of those items.
     *
     * @param line A `PangoLayoutLine`
     * @param x X position of left edge of baseline, in user
     *   space coordinates in Pango units.
     * @param y Y position of left edge of baseline, in user
     *   space coordinates in Pango units.
     */
    draw_layout_line(line: LayoutLine, x: number, y: number): void;
    /**
     * Draws an axis-aligned rectangle in user space coordinates
     * with the specified `PangoRenderer`.
     *
     * This should be called while #renderer is already active.
     * Use [method#Pango.Renderer.activate] to activate a
     * renderer.
     *
     * @param part Type of object this rectangle is part of
     * @param x X position at which to draw rectangle, in user
     *   space coordinates in Pango units
     * @param y Y position at which to draw rectangle, in user
     *   space coordinates in Pango units
     * @param width Width of rectangle in Pango units
     * @param height Height of rectangle in Pango units
     */
    draw_rectangle(
      part: RenderPart,
      x: number,
      y: number,
      width: number,
      height: number
    ): void;
    /**
     * Draws a trapezoid with the parallel sides aligned with the
     * X axis using the given `PangoRenderer`; coordinates are in
     * device space.
     *
     * @param part Type of object this trapezoid is part of
     * @param y1_ Y coordinate of top of trapezoid
     * @param x11 X coordinate of left end of top of trapezoid
     * @param x21 X coordinate of right end of top of trapezoid
     * @param y2 Y coordinate of bottom of trapezoid
     * @param x12 X coordinate of left end of bottom of trapezoid
     * @param x22 X coordinate of right end of bottom of
     *   trapezoid
     */
    draw_trapezoid(
      part: RenderPart,
      y1_: number,
      x11: number,
      x21: number,
      y2: number,
      x12: number,
      x22: number
    ): void;
    /**
     * Gets the current alpha for the specified part.
     *
     * @param part The part to get the alpha for
     * @returns The alpha for the specified part, or 0 if it
     *   hasn't been set and should be inherited from the
     *   environment.
     */
    get_alpha(part: RenderPart): number;
    /**
     * Gets the current rendering color for the specified part.
     *
     * @param part The part to get the color for
     * @returns The color for the specified part, or %NULL if it
     *   hasn't been set and should be inherited from the
     *   environment.
     */
    get_color(part: RenderPart): Color | null;
    /**
     * Gets the layout currently being rendered using #renderer.
     *
     * Calling this function only makes sense from inside a
     * subclass's methods, like in its draw_shape vfunc, for
     * example.
     *
     * The returned layout should not be modified while still
     * being rendered.
     *
     * @returns The layout, or %NULL if no layout is being
     *   rendered using #renderer at this time.
     */
    get_layout(): Layout | null;
    /**
     * Gets the layout line currently being rendered using
     * #renderer.
     *
     * Calling this function only makes sense from inside a
     * subclass's methods, like in its draw_shape vfunc, for
     * example.
     *
     * The returned layout line should not be modified while
     * still being rendered.
     *
     * @returns The layout line, or %NULL if no layout line is
     *   being rendered using #renderer at this time.
     */
    get_layout_line(): LayoutLine | null;
    /**
     * Gets the transformation matrix that will be applied when
     * rendering.
     *
     * See [method#Pango.Renderer.set_matrix].
     *
     * @returns The matrix, or %NULL if no matrix has been set
     *   (which is the same as the identity matrix). The returned
     *   matrix is owned by Pango and must not be modified or
     *   freed.
     */
    get_matrix(): Matrix | null;
    /**
     * Informs Pango that the way that the rendering is done for
     * #part has changed.
     *
     * This should be called if the rendering changes in a way
     * that would prevent multiple pieces being joined together
     * into one drawing call. For instance, if a subclass of
     * `PangoRenderer` was to add a stipple option for drawing
     * underlines, it needs to call
     *
     *     pango_renderer_part_changed(
     *       render,
     *       PANGO_RENDER_PART_UNDERLINE
     *     );
     *
     * When the stipple changes or underlines with different
     * stipples might be joined together. Pango automatically
     * calls this for changes to colors. (See
     * [method#Pango.Renderer.set_color])
     *
     * @param part The part for which rendering has changed.
     */
    part_changed(part: RenderPart): void;
    /**
     * Sets the alpha for part of the rendering.
     *
     * Note that the alpha may only be used if a color is
     * specified for #part as well.
     *
     * @param part The part to set the alpha for
     * @param alpha An alpha value between 1 and 65536, or 0 to
     *   unset the alpha
     */
    set_alpha(part: RenderPart, alpha: number): void;
    /**
     * Sets the color for part of the rendering.
     *
     * Also see [method#Pango.Renderer.set_alpha].
     *
     * @param part The part to change the color of
     * @param color The new color or %NULL to unset the current
     *   color
     */
    set_color(part: RenderPart, color: Color | null): void;
    /**
     * Sets the transformation matrix that will be applied when
     * rendering.
     *
     * @param matrix A `PangoMatrix`, or %NULL to unset any
     *   existing matrix (No matrix set is the same as setting
     *   the identity matrix.)
     */
    set_matrix(matrix: Matrix | null): void;
    connect(
      signal: "notify::matrix",
      callback: (owner: this, ...args: any) => void
    ): number;
  }

  type RendererInitOptionsMixin = GObject.ObjectInitOptions;
  export interface RendererInitOptions extends RendererInitOptionsMixin {}

  /**
   * This construct is only for enabling class multi-inheritance,
   * use {@link Renderer} instead.
   */
  type RendererMixin = IRenderer & GObject.Object;

  /**
   * `PangoRenderer` is a base class for objects that can render
   * text provided as `PangoGlyphString` or `PangoLayout`.
   *
   * By subclassing `PangoRenderer` and overriding operations
   * such as #draw_glyphs and #draw_rectangle, renderers for
   * particular font backends and destinations can be created.
   */
  interface Renderer extends RendererMixin {}

  class Renderer {
    public constructor(options?: Partial<RendererInitOptions>);
  }

  export interface AnalysisInitOptions {}
  /**
   * The `PangoAnalysis` structure stores information about the
   * properties of a segment of text.
   */
  interface Analysis {}
  class Analysis {
    public constructor(options?: Partial<AnalysisInitOptions>);
    /** Unused */
    public shape_engine: any;
    /** Unused */
    public lang_engine: any;
    /** The font for this segment. */
    public font: Font;
    /** The bidirectional level for this segment. */
    public level: number;
    /** The glyph orientation for this segment (A `PangoGravity`). */
    public gravity: number;
    /** Boolean flags for this segment (Since: 1.16). */
    public flags: number;
    /**
     * The detected script for this segment (A `PangoScript`)
     * (Since: 1.18).
     */
    public script: number;
    /** The detected language for this segment. */
    public language: Language;
    /** Extra attributes for this segment. */
    public extra_attrs: GLib.SList;
  }

  export interface AttrClassInitOptions {}
  /**
   * The `PangoAttrClass` structure stores the type and
   * operations for a particular type of attribute.
   *
   * The functions in this structure should not be called
   * directly. Instead, one should use the wrapper functions
   * provided for `PangoAttribute`.
   */
  interface AttrClass {}
  class AttrClass {
    public constructor(options?: Partial<AttrClassInitOptions>);
    /** The type ID for this attribute */
    public type: AttrType;
    public copy: { (attr: Attribute): Attribute };
    public destroy: { (attr: Attribute): void };
    public equal: { (attr1: Attribute, attr2: Attribute): boolean };
  }

  export interface AttrColorInitOptions {}
  /**
   * The `PangoAttrColor` structure is used to represent
   * attributes that are colors.
   */
  interface AttrColor {}
  class AttrColor {
    public constructor(options?: Partial<AttrColorInitOptions>);
    /** The common portion of the attribute */
    public attr: Attribute;
    /** The `PangoColor` which is the value of the attribute */
    public color: Color;
  }

  export interface AttrFloatInitOptions {}
  /**
   * The `PangoAttrFloat` structure is used to represent
   * attributes with a float or double value.
   */
  interface AttrFloat {}
  class AttrFloat {
    public constructor(options?: Partial<AttrFloatInitOptions>);
    /** The common portion of the attribute */
    public attr: Attribute;
    /** The value of the attribute */
    public value: number;
  }

  export interface AttrFontDescInitOptions {}
  /**
   * The `PangoAttrFontDesc` structure is used to store an
   * attribute that sets all aspects of the font description at
   * once.
   */
  interface AttrFontDesc {}
  class AttrFontDesc {
    public constructor(options?: Partial<AttrFontDescInitOptions>);
    /** The common portion of the attribute */
    public attr: Attribute;
    /** The font description which is the value of this attribute */
    public desc: FontDescription;
  }

  export interface AttrFontFeaturesInitOptions {}
  /**
   * The `PangoAttrFontFeatures` structure is used to represent
   * OpenType font features as an attribute.
   */
  interface AttrFontFeatures {}
  class AttrFontFeatures {
    public constructor(options?: Partial<AttrFontFeaturesInitOptions>);
    /** The common portion of the attribute */
    public attr: Attribute;
    /** The featues, as a string in CSS syntax */
    public features: string;
  }

  export interface AttrIntInitOptions {}
  /**
   * The `PangoAttrInt` structure is used to represent attributes
   * with an integer or enumeration value.
   */
  interface AttrInt {}
  class AttrInt {
    public constructor(options?: Partial<AttrIntInitOptions>);
    /** The common portion of the attribute */
    public attr: Attribute;
    /** The value of the attribute */
    public value: number;
  }

  export interface AttrIteratorInitOptions {}
  /**
   * A `PangoAttrIterator` is used to iterate through a
   * `PangoAttrList`.
   *
   * A new iterator is created with
   * [method#Pango.AttrList.get_iterator]. Once the iterator is
   * created, it can be advanced through the style changes in the
   * text using [method#Pango.AttrIterator.next]. At each style
   * change, the range of the current style segment and the
   * attributes currently in effect can be queried.
   */
  interface AttrIterator {}
  class AttrIterator {
    public constructor(options?: Partial<AttrIteratorInitOptions>);
    /**
     * Copy a `PangoAttrIterator`.
     *
     * @returns The newly allocated `PangoAttrIterator`, which
     *   should be freed with
     *   [method#Pango.AttrIterator.destroy]
     */
    public copy(): AttrIterator;
    /**
     * Destroy a `PangoAttrIterator` and free all associated
     * memory.
     */
    public destroy(): void;
    /**
     * Find the current attribute of a particular type at the
     * iterator location.
     *
     * When multiple attributes of the same type overlap, the
     * attribute whose range starts closest to the current
     * location is used.
     *
     * @param type The type of attribute to find
     * @returns The current attribute of the given type, or %NULL
     *   if no attribute of that type applies to the current
     *   location.
     */
    public get(type: AttrType): Attribute | null;
    /**
     * Gets a list of all attributes at the current position of
     * the iterator.
     *
     * @returns A list of all attributes for the current range.
     *   To free this value, call
     *   [method#Pango.Attribute.destroy] on each value and
     *   {@link G.slist_free} on the list.
     */
    public get_attrs(): GLib.SList;
    /**
     * Get the font and other attributes at the current iterator
     * position.
     *
     * @param desc A `PangoFontDescription` to fill in with the
     *   current values. The family name in this structure will
     *   be set using
     *   [method#Pango.FontDescription.set_family_static] using
     *   values from an attribute in the `PangoAttrList`
     *   associated with the iterator, so if you plan to keep it
     *   around, you must call:
     *   `pango_font_description_set_family (desc,
     *   pango_font_description_get_family (desc))`.
     * @returns Location to store language tag for item, or %NULL
     *   if none is found.
     *
     *   Location in which to store a list of non-font attributes
     *   at the the current position; only the highest priority
     *   value of each attribute will be added to this list. In
     *   order to free this value, you must call
     *   [method#Pango.Attribute.destroy] on each member.
     */
    public get_font(
      desc: FontDescription
    ): [language: Language | null, extra_attrs: GLib.SList | null];
    /**
     * Advance the iterator until the next change of style.
     *
     * @returns %FALSE if the iterator is at the end of the list,
     *   otherwise %TRUE
     */
    public next(): boolean;
    /**
     * Get the range of the current segment.
     *
     * Note that the stored return values are signed, not
     * unsigned like the values in `PangoAttribute`. To deal with
     * this API oversight, stored return values that wouldn't fit
     * into a signed integer are clamped to %G_MAXINT.
     *
     * @returns Location to store the start of the range
     *
     *   Location to store the end of the range
     */
    public range(): [start: number, end: number];
  }

  export interface AttrLanguageInitOptions {}
  /**
   * The `PangoAttrLanguage` structure is used to represent
   * attributes that are languages.
   */
  interface AttrLanguage {}
  class AttrLanguage {
    public constructor(options?: Partial<AttrLanguageInitOptions>);
    /** The common portion of the attribute */
    public attr: Attribute;
    /** The `PangoLanguage` which is the value of the attribute */
    public value: Language;
  }

  export interface AttrListInitOptions {}
  /**
   * A `PangoAttrList` represents a list of attributes that apply
   * to a section of text.
   *
   * The attributes in a `PangoAttrList` are, in general, allowed
   * to overlap in an arbitrary fashion. However, if the
   * attributes are manipulated only through
   * [method#Pango.AttrList.change], the overlap between
   * properties will meet stricter criteria.
   *
   * Since the `PangoAttrList` structure is stored as a linear
   * list, it is not suitable for storing attributes for large
   * amounts of text. In general, you should not use a single
   * `PangoAttrList` for more than one paragraph of text.
   */
  interface AttrList {}
  class AttrList {
    public constructor(options?: Partial<AttrListInitOptions>);
    /**
     * Create a new empty attribute list with a reference count
     * of one.
     *
     * @returns The newly allocated `PangoAttrList`, which should
     *   be freed with [method#Pango.AttrList.unref]
     */
    public static new(): AttrList;
    /**
     * Insert the given attribute into the `PangoAttrList`.
     *
     * It will replace any attributes of the same type on that
     * segment and be merged with any adjoining attributes that
     * are identical.
     *
     * This function is slower than
     * [method#Pango.AttrList.insert] for creating an attribute
     * list in order (potentially much slower for large lists).
     * However, [method#Pango.AttrList.insert] is not suitable
     * for continually changing a set of attributes since it
     * never removes or combines existing attributes.
     *
     * @param attr The attribute to insert
     */
    public change(attr: Attribute): void;
    /**
     * Copy #list and return an identical new list.
     *
     * @returns The newly allocated `PangoAttrList`, with a
     *   reference count of one, which should be freed with
     *   [method#Pango.AttrList.unref]. Returns %NULL if #list
     *   was %NULL.
     */
    public copy(): AttrList | null;
    /**
     * Checks whether #list and #other_list contain the same
     * attributes and whether those attributes apply to the same
     * ranges.
     *
     * Beware that this will return wrong values if any list
     * contains duplicates.
     *
     * @param other_list The other `PangoAttrList`
     * @returns %TRUE if the lists are equal, %FALSE if they
     *   aren't
     */
    public equal(other_list: AttrList): boolean;
    /**
     * Given a `PangoAttrList` and callback function, removes any
     * elements of #list for which #func returns %TRUE and
     * inserts them into a new list.
     *
     * @param func Callback function; returns %TRUE if an
     *   attribute should be filtered out
     * @param data Data to be passed to #func
     * @returns The new `PangoAttrList` or %NULL if no attributes
     *   of the given types were found
     */
    public filter(func: AttrFilterFunc, data: any | null): AttrList | null;
    /**
     * Gets a list of all attributes in #list.
     *
     * @returns A list of all attributes in #list. To free this
     *   value, call [method#Pango.Attribute.destroy] on each
     *   value and {@link G.slist_free} on the list.
     */
    public get_attributes(): GLib.SList;
    /**
     * Create a iterator initialized to the beginning of the
     * list.
     *
     * #list must not be modified until this iterator is freed.
     *
     * @returns The newly allocated `PangoAttrIterator`, which
     *   should be freed with
     *   [method#Pango.AttrIterator.destroy]
     */
    public get_iterator(): AttrIterator;
    /**
     * Insert the given attribute into the `PangoAttrList`.
     *
     * It will be inserted after all other attributes with a
     * matching #start_index.
     *
     * @param attr The attribute to insert
     */
    public insert(attr: Attribute): void;
    /**
     * Insert the given attribute into the `PangoAttrList`.
     *
     * It will be inserted before all other attributes with a
     * matching #start_index.
     *
     * @param attr The attribute to insert
     */
    public insert_before(attr: Attribute): void;
    /**
     * Increase the reference count of the given attribute list
     * by one.
     *
     * @returns The attribute list passed in
     */
    public ref(): AttrList;
    /**
     * This function opens up a hole in #list, fills it in with
     * attributes from the left, and then merges #other on top of
     * the hole.
     *
     * This operation is equivalent to stretching every attribute
     * that applies at position #pos in #list by an amount #len,
     * and then calling [method#Pango.AttrList.change] with a
     * copy of each attribute in #other in sequence (offset in
     * position by #pos).
     *
     * This operation proves useful for, for instance, inserting
     * a pre-edit string in the middle of an edit buffer.
     *
     * @param other Another `PangoAttrList`
     * @param pos The position in #list at which to insert #other
     * @param len The length of the spliced segment. (Note that
     *   this must be specified since the attributes in #other
     *   may only be present at some subsection of this range)
     */
    public splice(other: AttrList, pos: number, len: number): void;
    /**
     * Decrease the reference count of the given attribute list
     * by one.
     *
     * If the result is zero, free the attribute list and the
     * attributes it contains.
     */
    public unref(): void;
    /**
     * Update indices of attributes in #list for a change in the
     * text they refer to.
     *
     * The change that this function applies is removing #remove
     * bytes at position #pos and inserting #add bytes instead.
     *
     * Attributes that fall entirely in the (#pos, #pos +
     * #remove) range are removed.
     *
     * Attributes that start or end inside the (#pos, #pos +
     * #remove) range are shortened to reflect the removal.
     *
     * Attributes start and end positions are updated if they are
     * behind #pos + #remove.
     *
     * @param pos The position of the change
     * @param remove The number of removed bytes
     * @param add The number of added bytes
     */
    public update(pos: number, remove: number, add: number): void;
  }

  export interface AttrShapeInitOptions {}
  /**
   * The `PangoAttrShape` structure is used to represent
   * attributes which impose shape restrictions.
   */
  interface AttrShape {}
  class AttrShape {
    public constructor(options?: Partial<AttrShapeInitOptions>);
    /** The common portion of the attribute */
    public attr: Attribute;
    /** The ink rectangle to restrict to */
    public ink_rect: Rectangle;
    /** The logical rectangle to restrict to */
    public logical_rect: Rectangle;
    /** User data set (see [func#Pango.AttrShape.new_with_data]) */
    public data: any;
    /** Copy function for the user data */
    public copy_func: AttrDataCopyFunc;
    /** Destroy function for the user data */
    public destroy_func: GLib.DestroyNotify;
  }

  export interface AttrSizeInitOptions {}
  /**
   * The `PangoAttrSize` structure is used to represent
   * attributes which set font size.
   */
  interface AttrSize {}
  class AttrSize {
    public constructor(options?: Partial<AttrSizeInitOptions>);
    /** The common portion of the attribute */
    public attr: Attribute;
    /**
     * Size of font, in units of 1/%PANGO_SCALE of a point (for
     * %PANGO_ATTR_SIZE) or of a device unit (for
     * %PANGO_ATTR_ABSOLUTE_SIZE)
     */
    public size: number;
    /**
     * Whether the font size is in device units or points. This
     * field is only present for compatibility with Pango-1.8.0
     * (%PANGO_ATTR_ABSOLUTE_SIZE was added in 1.8.1); and always
     * will be %FALSE for %PANGO_ATTR_SIZE and %TRUE for
     * %PANGO_ATTR_ABSOLUTE_SIZE.
     */
    public absolute: number;
  }

  export interface AttrStringInitOptions {}
  /**
   * The `PangoAttrString` structure is used to represent
   * attributes with a string value.
   */
  interface AttrString {}
  class AttrString {
    public constructor(options?: Partial<AttrStringInitOptions>);
    /** The common portion of the attribute */
    public attr: Attribute;
    /** The string which is the value of the attribute */
    public value: string;
  }

  export interface AttributeInitOptions {}
  /**
   * The `PangoAttribute` structure represents the common
   * portions of all attributes.
   *
   * Particular types of attributes include this structure as
   * their initial portion. The common portion of the attribute
   * holds the range to which the value in the type-specific part
   * of the attribute applies and should be initialized using
   * [method#Pango.Attribute.init]. By default, an attribute will
   * have an all-inclusive range of [0,%G_MAXUINT].
   */
  interface Attribute {}
  class Attribute {
    public constructor(options?: Partial<AttributeInitOptions>);
    /**
     * The class structure holding information about the type of
     * the attribute
     */
    public klass: AttrClass;
    /** The start index of the range (in bytes). */
    public start_index: number;
    /**
     * End index of the range (in bytes). The character at this
     * index is not included in the range.
     */
    public end_index: number;
    /**
     * Make a copy of an attribute.
     *
     * @returns The newly allocated `PangoAttribute`, which
     *   should be freed with [method#Pango.Attribute.destroy].
     */
    public copy(): Attribute;
    /** Destroy a `PangoAttribute` and free all associated memory. */
    public destroy(): void;
    /**
     * Compare two attributes for equality.
     *
     * This compares only the actual value of the two attributes
     * and not the ranges that the attributes apply to.
     *
     * @param attr2 Another `PangoAttribute`
     * @returns %TRUE if the two attributes have the same value
     */
    public equal(attr2: Attribute): boolean;
    /**
     * Initializes #attr's klass to #klass, it's start_index to
     * %PANGO_ATTR_INDEX_FROM_TEXT_BEGINNING and end_index to
     * %PANGO_ATTR_INDEX_TO_TEXT_END such that the attribute
     * applies to the entire text by default.
     *
     * @param klass A `PangoAttrClass`
     */
    public init(klass: AttrClass): void;
  }

  export interface ColorInitOptions {}
  /**
   * The `PangoColor` structure is used to represent a color in
   * an uncalibrated RGB color-space.
   */
  interface Color {}
  class Color {
    public constructor(options?: Partial<ColorInitOptions>);
    /** Value of red component */
    public red: number;
    /** Value of green component */
    public green: number;
    /** Value of blue component */
    public blue: number;
    /**
     * Creates a copy of #src.
     *
     * The copy should be freed with [method#Pango.Color.free].
     * Primarily used by language bindings, not that useful
     * otherwise (since colors can just be copied by assignment
     * in C).
     *
     * @returns The newly allocated `PangoColor`, which should be
     *   freed with [method#Pango.Color.free]
     */
    public copy(): Color | null;
    /** Frees a color allocated by [method#Pango.Color.copy]. */
    public free(): void;
    /**
     * Fill in the fields of a color from a string specification.
     *
     * The string can either one of a large set of standard
     * names. (Taken from the CSS Color
     * [specification](https://www.w3.org/TR/css-color-4/#named-colors),
     * or it can be a value in the form `#rgb`, `#rrggbb`,
     * `#rrrgggbbb` or `#rrrrggggbbbb`, where `r`, `g` and `b`
     * are hex digits of the red, green, and blue components of
     * the color, respectively. (White in the four forms is
     * `#fff`, `#ffffff`, `#fffffffff` and `#ffffffffffff`.)
     *
     * @param spec A string specifying the new color
     * @returns %TRUE if parsing of the specifier succeeded,
     *   otherwise %FALSE
     */
    public parse(spec: string): boolean;
    /**
     * Fill in the fields of a color from a string specification.
     *
     * The string can either one of a large set of standard
     * names. (Taken from the CSS Color
     * [specification](https://www.w3.org/TR/css-color-4/#named-colors),
     * or it can be a hexadecimal value in the form `#rgb`,
     * `#rrggbb`, `#rrrgggbbb` or `#rrrrggggbbbb` where `r`, `g`
     * and `b` are hex digits of the red, green, and blue
     * components of the color, respectively. (White in the four
     * forms is `#fff`, `#ffffff`, `#fffffffff` and
     * `#ffffffffffff`.)
     *
     * Additionally, parse strings of the form `#rgba`,
     * `#rrggbbaa`, `#rrrrggggbbbbaaaa`, if #alpha is not %NULL,
     * and set #alpha to the value specified by the hex digits
     * for `a`. If no alpha component is found in #spec, #alpha
     * is set to 0xffff (for a solid color).
     *
     * @param spec A string specifying the new color
     * @returns %TRUE if parsing of the specifier succeeded,
     *   otherwise %FALSE
     *
     *   Return location for alpha
     */
    public parse_with_alpha(spec: string): [boolean, number | null];
    /**
     * Returns a textual specification of #color.
     *
     * The string is in the hexadecimal form `#rrrrggggbbbb`,
     * where `r`, `g` and `b` are hex digits representing the
     * red, green, and blue components respectively.
     *
     * @returns A newly-allocated text string that must be freed
     *   with {@link G.free}.
     */
    public to_string(): string;
  }

  export interface FontDescriptionInitOptions {}
  /**
   * A `PangoFontDescription` describes a font in an
   * implementation-independent manner.
   *
   * `PangoFontDescription` structures are used both to list what
   * fonts are available on the system and also for specifying
   * the characteristics of a font to load.
   */
  interface FontDescription {}
  class FontDescription {
    public constructor(options?: Partial<FontDescriptionInitOptions>);
    /**
     * Creates a new font description structure with all fields
     * unset.
     *
     * @returns The newly allocated `PangoFontDescription`, which
     *   should be freed using
     *   [method#Pango.FontDescription.free].
     */
    public static new(): FontDescription;
    /**
     * Determines if the style attributes of #new_match are a
     * closer match for #desc than those of #old_match are, or if
     * #old_match is %NULL, determines if #new_match is a match
     * at all.
     *
     * Approximate matching is done for weight and style; other
     * style attributes must match exactly. Style attributes are
     * all attributes other than family and size-related
     * attributes. Approximate matching for style considers
     * %PANGO_STYLE_OBLIQUE and %PANGO_STYLE_ITALIC as matches,
     * but not as good a match as when the styles are equal.
     *
     * Note that #old_match must match #desc.
     *
     * @param old_match A `PangoFontDescription`, or %NULL
     * @param new_match A `PangoFontDescription`
     * @returns %TRUE if #new_match is a better match
     */
    public better_match(
      old_match: FontDescription | null,
      new_match: FontDescription
    ): boolean;
    /**
     * Make a copy of a `PangoFontDescription`.
     *
     * @returns The newly allocated `PangoFontDescription`, which
     *   should be freed with
     *   [method#Pango.FontDescription.free], or %NULL if #desc
     *   was %NULL.
     */
    public copy(): FontDescription | null;
    /**
     * Make a copy of a `PangoFontDescription`, but don't
     * duplicate allocated fields.
     *
     * This is like [method#Pango.FontDescription.copy], but only
     * a shallow copy is made of the family name and other
     * allocated fields. The result can only be used until #desc
     * is modified or freed. This is meant to be used when the
     * copy is only needed temporarily.
     *
     * @returns The newly allocated `PangoFontDescription`, which
     *   should be freed with
     *   [method#Pango.FontDescription.free], or %NULL if #desc
     *   was %NULL.
     */
    public copy_static(): FontDescription | null;
    /**
     * Compares two font descriptions for equality.
     *
     * Two font descriptions are considered equal if the fonts
     * they describe are provably identical. This means that
     * their masks do not have to match, as long as other fields
     * are all the same. (Two font descriptions may result in
     * identical fonts being loaded, but still compare %FALSE.)
     *
     * @param desc2 Another `PangoFontDescription`
     * @returns %TRUE if the two font descriptions are identical,
     *   %FALSE otherwise.
     */
    public equal(desc2: FontDescription): boolean;
    /** Frees a font description. */
    public free(): void;
    /**
     * Gets the family name field of a font description.
     *
     * See [method#Pango.FontDescription.set_family].
     *
     * @returns The family name field for the font description,
     *   or %NULL if not previously set. This has the same
     *   life-time as the font description itself and should not
     *   be freed.
     */
    public get_family(): string | null;
    /**
     * Gets the gravity field of a font description.
     *
     * See [method#Pango.FontDescription.set_gravity].
     *
     * @returns The gravity field for the font description. Use
     *   [method#Pango.FontDescription.get_set_fields] to find
     *   out if the field was explicitly set or not.
     */
    public get_gravity(): Gravity;
    /**
     * Determines which fields in a font description have been
     * set.
     *
     * @returns A bitmask with bits set corresponding to the
     *   fields in #desc that have been set.
     */
    public get_set_fields(): FontMask;
    /**
     * Gets the size field of a font description.
     *
     * See [method#Pango.FontDescription.set_size].
     *
     * @returns The size field for the font description in points
     *   or device units. You must call
     *   [method#Pango.FontDescription.get_size_is_absolute] to
     *   find out which is the case. Returns 0 if the size field
     *   has not previously been set or it has been set to 0
     *   explicitly. Use
     *   [method#Pango.FontDescription.get_set_fields] to find
     *   out if the field was explicitly set or not.
     */
    public get_size(): number;
    /**
     * Determines whether the size of the font is in points (not
     * absolute) or device units (absolute).
     *
     * See [method#Pango.FontDescription.set_size] and
     * [method#Pango.FontDescription.set_absolute_size].
     *
     * @returns Whether the size for the font description is in
     *   points or device units. Use
     *   [method#Pango.FontDescription.get_set_fields] to find
     *   out if the size field of the font description was
     *   explicitly set or not.
     */
    public get_size_is_absolute(): boolean;
    /**
     * Gets the stretch field of a font description.
     *
     * See [method#Pango.FontDescription.set_stretch].
     *
     * @returns The stretch field for the font description. Use
     *   [method#Pango.FontDescription.get_set_fields] to find
     *   out if the field was explicitly set or not.
     */
    public get_stretch(): Stretch;
    /**
     * Gets the style field of a `PangoFontDescription`.
     *
     * See [method#Pango.FontDescription.set_style].
     *
     * @returns The style field for the font description. Use
     *   [method#Pango.FontDescription.get_set_fields] to find
     *   out if the field was explicitly set or not.
     */
    public get_style(): Style;
    /**
     * Gets the variant field of a `PangoFontDescription`.
     *
     * See [method#Pango.FontDescription.set_variant].
     *
     * @returns The variant field for the font description. Use
     *   [method#Pango.FontDescription.get_set_fields] to find
     *   out if the field was explicitly set or not.
     */
    public get_variant(): Variant;
    /**
     * Gets the variations field of a font description.
     *
     * See [method#Pango.FontDescription.set_variations].
     *
     * @returns The variations field for the font description, or
     *   %NULL if not previously set. This has the same life-time
     *   as the font description itself and should not be freed.
     */
    public get_variations(): string | null;
    /**
     * Gets the weight field of a font description.
     *
     * See [method#Pango.FontDescription.set_weight].
     *
     * @returns The weight field for the font description. Use
     *   [method#Pango.FontDescription.get_set_fields] to find
     *   out if the field was explicitly set or not.
     */
    public get_weight(): Weight;
    /**
     * Computes a hash of a `PangoFontDescription` structure.
     *
     * This is suitable to be used, for example, as an argument
     * to {@link G.hash_table_new}. The hash value is independent
     * of #desc->mask.
     *
     * @returns The hash value.
     */
    public hash(): number;
    /**
     * Merges the fields that are set in #desc_to_merge into the
     * fields in #desc.
     *
     * If #replace_existing is %FALSE, only fields in #desc that
     * are not already set are affected. If %TRUE, then fields
     * that are already set will be replaced as well.
     *
     * If #desc_to_merge is %NULL, this function performs
     * nothing.
     *
     * @param desc_to_merge The `PangoFontDescription` to merge
     *   from, or %NULL
     * @param replace_existing If %TRUE, replace fields in #desc
     *   with the corresponding values from #desc_to_merge, even
     *   if they are already exist.
     */
    public merge(
      desc_to_merge: FontDescription | null,
      replace_existing: boolean
    ): void;
    /**
     * Merges the fields that are set in #desc_to_merge into the
     * fields in #desc, without copying allocated fields.
     *
     * This is like [method#Pango.FontDescription.merge], but
     * only a shallow copy is made of the family name and other
     * allocated fields. #desc can only be used until
     * #desc_to_merge is modified or freed. This is meant to be
     * used when the merged font description is only needed
     * temporarily.
     *
     * @param desc_to_merge The `PangoFontDescription` to merge
     *   from
     * @param replace_existing If %TRUE, replace fields in #desc
     *   with the corresponding values from #desc_to_merge, even
     *   if they are already exist.
     */
    public merge_static(
      desc_to_merge: FontDescription,
      replace_existing: boolean
    ): void;
    /**
     * Sets the size field of a font description, in device
     * units.
     *
     * This is mutually exclusive with
     * [method#Pango.FontDescription.set_size] which sets the
     * font size in points.
     *
     * @param size The new size, in Pango units. There are
     *   %PANGO_SCALE Pango units in one device unit. For an
     *   output backend where a device unit is a pixel, a #size
     *   value of 10 * PANGO_SCALE gives a 10 pixel font.
     */
    public set_absolute_size(size: number): void;
    /**
     * Sets the family name field of a font description.
     *
     * The family name represents a family of related font
     * styles, and will resolve to a particular
     * `PangoFontFamily`. In some uses of `PangoFontDescription`,
     * it is also possible to use a comma separated list of
     * family names for this field.
     *
     * @param family A string representing the family name.
     */
    public set_family(family: string): void;
    /**
     * Sets the family name field of a font description, without
     * copying the string.
     *
     * This is like [method#Pango.FontDescription.set_family],
     * except that no copy of #family is made. The caller must
     * make sure that the string passed in stays around until
     * #desc has been freed or the name is set again. This
     * function can be used if #family is a static string such as
     * a C string literal, or if #desc is only needed
     * temporarily.
     *
     * @param family A string representing the family name
     */
    public set_family_static(family: string): void;
    /**
     * Sets the gravity field of a font description.
     *
     * The gravity field specifies how the glyphs should be
     * rotated. If #gravity is %PANGO_GRAVITY_AUTO, this actually
     * unsets the gravity mask on the font description.
     *
     * This function is seldom useful to the user. Gravity should
     * normally be set on a `PangoContext`.
     *
     * @param gravity The gravity for the font description.
     */
    public set_gravity(gravity: Gravity): void;
    /**
     * Sets the size field of a font description in fractional
     * points.
     *
     * This is mutually exclusive with
     * [method#Pango.FontDescription.set_absolute_size].
     *
     * @param size The size of the font in points, scaled by
     *   %PANGO_SCALE. (That is, a #size value of 10 *
     *   PANGO_SCALE is a 10 point font. The conversion factor
     *   between points and device units depends on system
     *   configuration and the output device. For screen display,
     *   a logical DPI of 96 is common, in which case a 10 point
     *   font corresponds to a 10 * (96 / 72) = 13.3 pixel font.
     *   Use [method#Pango.FontDescription.set_absolute_size] if
     *   you need a particular size in device units.
     */
    public set_size(size: number): void;
    /**
     * Sets the stretch field of a font description.
     *
     * The [enum#Pango.Stretch] field specifies how narrow or
     * wide the font should be.
     *
     * @param stretch The stretch for the font description
     */
    public set_stretch(stretch: Stretch): void;
    /**
     * Sets the style field of a `PangoFontDescription`.
     *
     * The [enum#Pango.Style] enumeration describes whether the
     * font is slanted and the manner in which it is slanted; it
     * can be either %PANGO_STYLE_NORMAL, %PANGO_STYLE_ITALIC, or
     * %PANGO_STYLE_OBLIQUE.
     *
     * Most fonts will either have a italic style or an oblique
     * style, but not both, and font matching in Pango will match
     * italic specifications with oblique fonts and vice-versa if
     * an exact match is not found.
     *
     * @param style The style for the font description
     */
    public set_style(style: Style): void;
    /**
     * Sets the variant field of a font description.
     *
     * The [enum#Pango.Variant] can either be
     * %PANGO_VARIANT_NORMAL or %PANGO_VARIANT_SMALL_CAPS.
     *
     * @param variant The variant type for the font description.
     */
    public set_variant(variant: Variant): void;
    /**
     * Sets the variations field of a font description.
     *
     * OpenType font variations allow to select a font instance
     * by specifying values for a number of axes, such as width
     * or weight.
     *
     * The format of the variations string is
     *
     *     AXIS1=VALUE,AXIS2=VALUE...
     *
     * With each AXIS a 4 character tag that identifies a font
     * axis, and each VALUE a floating point number. Unknown axes
     * are ignored, and values are clamped to their allowed
     * range.
     *
     * Pango does not currently have a way to find supported axes
     * of a font. Both harfbuzz or freetype have API for this.
     *
     * @param variations A string representing the variations
     */
    public set_variations(variations: string): void;
    /**
     * Sets the variations field of a font description.
     *
     * This is like
     * [method#Pango.FontDescription.set_variations], except that
     * no copy of #variations is made. The caller must make sure
     * that the string passed in stays around until #desc has
     * been freed or the name is set again. This function can be
     * used if #variations is a static string such as a C string
     * literal, or if #desc is only needed temporarily.
     *
     * @param variations A string representing the variations
     */
    public set_variations_static(variations: string): void;
    /**
     * Sets the weight field of a font description.
     *
     * The weight field specifies how bold or light the font
     * should be. In addition to the values of the
     * [enum#Pango.Weight] enumeration, other intermediate
     * numeric values are possible.
     *
     * @param weight The weight for the font description.
     */
    public set_weight(weight: Weight): void;
    /**
     * Creates a filename representation of a font description.
     *
     * The filename is identical to the result from calling
     * [method#Pango.FontDescription.to_string], but with
     * underscores instead of characters that are untypical in
     * filenames, and in lower case only.
     *
     * @returns A new string that must be freed with
     *   {@link G.free}.
     */
    public to_filename(): string;
    /**
     * Creates a string representation of a font description.
     *
     * See [func#Pango.FontDescription.from_string] for a
     * description of the format of the string representation.
     * The family list in the string description will only have a
     * terminating comma if the last word of the list is a valid
     * style option.
     *
     * @returns A new string that must be freed with
     *   {@link G.free}.
     */
    public to_string(): string;
    /**
     * Unsets some of the fields in a `PangoFontDescription`.
     *
     * The unset fields will get back to their default values.
     *
     * @param to_unset Bitmask of fields in the #desc to unset.
     */
    public unset_fields(to_unset: FontMask): void;
  }

  export interface FontMetricsInitOptions {}
  /**
   * A `PangoFontMetrics` structure holds the overall metric
   * information for a font.
   *
   * The information in a `PangoFontMetrics` structure may be
   * restricted to a script. The fields of this structure are
   * private to implementations of a font backend. See the
   * documentation of the corresponding getters for documentation
   * of their meaning.
   */
  interface FontMetrics {}
  class FontMetrics {
    public constructor(options?: Partial<FontMetricsInitOptions>);
    public readonly ref_count: number;
    public readonly ascent: number;
    public readonly descent: number;
    public readonly height: number;
    public readonly approximate_char_width: number;
    public readonly approximate_digit_width: number;
    public readonly underline_position: number;
    public readonly underline_thickness: number;
    public readonly strikethrough_position: number;
    public readonly strikethrough_thickness: number;
    /**
     * Gets the approximate character width for a font metrics
     * structure.
     *
     * This is merely a representative value useful, for example,
     * for determining the initial size for a window. Actual
     * characters in text will be wider and narrower than this.
     *
     * @returns The character width, in Pango units.
     */
    public get_approximate_char_width(): number;
    /**
     * Gets the approximate digit width for a font metrics
     * structure.
     *
     * This is merely a representative value useful, for example,
     * for determining the initial size for a window. Actual
     * digits in text can be wider or narrower than this, though
     * this value is generally somewhat more accurate than the
     * result of
     * {@link Pango.FontMetrics.get_approximate_char_width} for
     * digits.
     *
     * @returns The digit width, in Pango units.
     */
    public get_approximate_digit_width(): number;
    /**
     * Gets the ascent from a font metrics structure.
     *
     * The ascent is the distance from the baseline to the
     * logical top of a line of text. (The logical top may be
     * above or below the top of the actual drawn ink. It is
     * necessary to lay out the text to figure where the ink will
     * be.)
     *
     * @returns The ascent, in Pango units.
     */
    public get_ascent(): number;
    /**
     * Gets the descent from a font metrics structure.
     *
     * The descent is the distance from the baseline to the
     * logical bottom of a line of text. (The logical bottom may
     * be above or below the bottom of the actual drawn ink. It
     * is necessary to lay out the text to figure where the ink
     * will be.)
     *
     * @returns The descent, in Pango units.
     */
    public get_descent(): number;
    /**
     * Gets the line height from a font metrics structure.
     *
     * The line height is the distance between successive
     * baselines in wrapped text.
     *
     * If the line height is not available, 0 is returned.
     *
     * @returns The height, in Pango units
     */
    public get_height(): number;
    /**
     * Gets the suggested position to draw the strikethrough.
     *
     * The value returned is the distance _above_ the baseline of
     * the top of the strikethrough.
     *
     * @returns The suggested strikethrough position, in Pango
     *   units.
     */
    public get_strikethrough_position(): number;
    /**
     * Gets the suggested thickness to draw for the
     * strikethrough.
     *
     * @returns The suggested strikethrough thickness, in Pango
     *   units.
     */
    public get_strikethrough_thickness(): number;
    /**
     * Gets the suggested position to draw the underline.
     *
     * The value returned is the distance _above_ the baseline of
     * the top of the underline. Since most fonts have underline
     * positions beneath the baseline, this value is typically
     * negative.
     *
     * @returns The suggested underline position, in Pango units.
     */
    public get_underline_position(): number;
    /**
     * Gets the suggested thickness to draw for the underline.
     *
     * @returns The suggested underline thickness, in Pango
     *   units.
     */
    public get_underline_thickness(): number;
    /**
     * Increase the reference count of a font metrics structure
     * by one.
     *
     * @returns #metrics
     */
    public ref(): FontMetrics | null;
    /**
     * Decrease the reference count of a font metrics structure
     * by one. If the result is zero, frees the structure and any
     * associated memory.
     */
    public unref(): void;
  }

  export interface GlyphGeometryInitOptions {}
  /**
   * The `PangoGlyphGeometry` structure contains width and
   * positioning information for a single glyph.
   */
  interface GlyphGeometry {}
  class GlyphGeometry {
    public constructor(options?: Partial<GlyphGeometryInitOptions>);
    /** The logical width to use for the the character. */
    public width: GlyphUnit;
    /** Horizontal offset from nominal character position. */
    public x_offset: GlyphUnit;
    /** Vertical offset from nominal character position. */
    public y_offset: GlyphUnit;
  }

  export interface GlyphInfoInitOptions {}
  /**
   * A `PangoGlyphInfo` structure represents a single glyph with
   * positioning information and visual attributes.
   */
  interface GlyphInfo {}
  class GlyphInfo {
    public constructor(options?: Partial<GlyphInfoInitOptions>);
    /** The glyph itself. */
    public glyph: Glyph;
    /** The positional information about the glyph. */
    public geometry: GlyphGeometry;
    /** The visual attributes of the glyph. */
    public attr: GlyphVisAttr;
  }

  export interface GlyphItemInitOptions {}
  /**
   * A `PangoGlyphItem` is a pair of a `PangoItem` and the glyphs
   * resulting from shaping the items text.
   *
   * As an example of the usage of `PangoGlyphItem`, the results
   * of shaping text with `PangoLayout` is a list of
   * `PangoLayoutLine`, each of which contains a list of
   * `PangoGlyphItem`.
   */
  interface GlyphItem {}
  class GlyphItem {
    public constructor(options?: Partial<GlyphItemInitOptions>);
    /** Corresponding `PangoItem` */
    public item: Item;
    /** Corresponding `PangoGlyphString` */
    public glyphs: GlyphString;
    /**
     * Splits a shaped item (`PangoGlyphItem`) into multiple
     * items based on an attribute list.
     *
     * The idea is that if you have attributes that don't affect
     * shaping, such as color or underline, to avoid affecting
     * shaping, you filter them out
     * ([method#Pango.AttrList.filter]), apply the shaping
     * process and then reapply them to the result using this
     * function.
     *
     * All attributes that start or end inside a cluster are
     * applied to that cluster; for instance, if half of a
     * cluster is underlined and the other-half strikethrough,
     * then the cluster will end up with both underline and
     * strikethrough attributes. In these cases, it may happen
     * that #item->extra_attrs for some of the result items can
     * have multiple attributes of the same type.
     *
     * This function takes ownership of #glyph_item; it will be
     * reused as one of the elements in the list.
     *
     * @param text Text that #list applies to
     * @param list A `PangoAttrList`
     * @returns A list of glyph items resulting from splitting
     *   #glyph_item. Free the elements using
     *   [method#Pango.GlyphItem.free], the list using
     *   {@link G.slist_free}.
     */
    public apply_attrs(text: string, list: AttrList): GLib.SList;
    /**
     * Make a deep copy of an existing `PangoGlyphItem`
     * structure.
     *
     * @returns The newly allocated `PangoGlyphItem`
     */
    public copy(): GlyphItem | null;
    /** Frees a `PangoGlyphItem` and resources to which it points. */
    public free(): void;
    /**
     * Given a `PangoGlyphItem` and the corresponding text,
     * determine the width corresponding to each character.
     *
     * When multiple characters compose a single cluster, the
     * width of the entire cluster is divided equally among the
     * characters.
     *
     * See also [method#Pango.GlyphString.get_logical_widths].
     *
     * @param text Text that #glyph_item corresponds to
     *   (glyph_item->item->offset is an offset from the start of
     *   #text)
     * @param logical_widths An array whose length is the number
     *   of characters in glyph_item (equal to
     *   glyph_item->item->num_chars) to be filled in with the
     *   resulting character widths.
     */
    public get_logical_widths(text: string, logical_widths: number[]): void;
    /**
     * Adds spacing between the graphemes of #glyph_item to give
     * the effect of typographic letter spacing.
     *
     * @param text Text that #glyph_item corresponds to
     *   (glyph_item->item->offset is an offset from the start of
     *   #text)
     * @param log_attrs Logical attributes for the item (the
     *   first logical attribute refers to the position before
     *   the first character in the item)
     * @param letter_spacing Amount of letter spacing to add in
     *   Pango units. May be negative, though too large negative
     *   values will give ugly results.
     */
    public letter_space(
      text: string,
      log_attrs: LogAttr[],
      letter_spacing: number
    ): void;
    /**
     * Modifies #orig to cover only the text after #split_index,
     * and returns a new item that covers the text before
     * #split_index that used to be in #orig.
     *
     * You can think of #split_index as the length of the
     * returned item. #split_index may not be 0, and it may not
     * be greater than or equal to the length of #orig (that is,
     * there must be at least one byte assigned to each item, you
     * can't create a zero-length item).
     *
     * This function is similar in function to
     * {@link Pango.Item.split} (and uses it internally.)
     *
     * @param text Text to which positions in #orig apply
     * @param split_index Byte index of position to split item,
     *   relative to the start of the item
     * @returns The newly allocated item representing text before
     *   #split_index, which should be freed with
     *   {@link Pango.GlyphItem.free}.
     */
    public split(text: string, split_index: number): GlyphItem;
  }

  export interface GlyphItemIterInitOptions {}
  /**
   * A `PangoGlyphItemIter` is an iterator over the clusters in a
   * `PangoGlyphItem`.
   *
   * The _forward direction_ of the iterator is the logical
   * direction of text. That is, with increasing #start_index and
   * #start_char values. If #glyph_item is right-to-left (that
   * is, if `glyph_item->item->analysis.level` is odd), then
   * #start_glyph decreases as the iterator moves forward.
   * Moreover, in right-to-left cases, #start_glyph is greater
   * than #end_glyph.
   *
   * An iterator should be initialized using either
   * {@link Pango.GlyphItemIter.init_start} or
   * pango_glyph_item_iter_init_end(), for forward and backward
   * iteration respectively, and walked over using any desired
   * mixture of pango_glyph_item_iter_next_cluster() and
   * pango_glyph_item_iter_prev_cluster().
   *
   * A common idiom for doing a forward iteration over the
   * clusters is:
   *
   *     PangoGlyphItemIter cluster_iter;
   *     gboolean have_cluster;
   *
   *     for (have_cluster = pango_glyph_item_iter_init_start (&cluster_iter,
   *                                                           glyph_item, text);
   *          have_cluster;
   *          have_cluster = pango_glyph_item_iter_next_cluster (&cluster_iter))
   *     {
   *       ...
   *     }
   *
   * Note that #text is the start of the text for layout, which
   * is then indexed by `glyph_item->item->offset` to get to the
   * text of #glyph_item. The #start_index and #end_index values
   * can directly index into #text. The #start_glyph, #end_glyph,
   * #start_char, and #end_char values however are zero-based for
   * the #glyph_item. For each cluster, the item pointed at by
   * the start variables is included in the cluster while the one
   * pointed at by end variables is not.
   *
   * None of the members of a `PangoGlyphItemIter` should be
   * modified manually.
   */
  interface GlyphItemIter {}
  class GlyphItemIter {
    public constructor(options?: Partial<GlyphItemIterInitOptions>);
    public glyph_item: GlyphItem;
    public text: string;
    public start_glyph: number;
    public start_index: number;
    public start_char: number;
    public end_glyph: number;
    public end_index: number;
    public end_char: number;
    /**
     * Make a shallow copy of an existing `PangoGlyphItemIter`
     * structure.
     *
     * @returns The newly allocated `PangoGlyphItemIter`
     */
    public copy(): GlyphItemIter | null;
    /** Frees a `PangoGlyphItem`Iter. */
    public free(): void;
    /**
     * Initializes a `PangoGlyphItemIter` structure to point to
     * the last cluster in a glyph item.
     *
     * See `PangoGlyphItemIter` for details of cluster orders.
     *
     * @param glyph_item The glyph item to iterate over
     * @param text Text corresponding to the glyph item
     * @returns %FALSE if there are no clusters in the glyph item
     */
    public init_end(glyph_item: GlyphItem, text: string): boolean;
    /**
     * Initializes a `PangoGlyphItemIter` structure to point to
     * the first cluster in a glyph item.
     *
     * See `PangoGlyphItemIter` for details of cluster orders.
     *
     * @param glyph_item The glyph item to iterate over
     * @param text Text corresponding to the glyph item
     * @returns %FALSE if there are no clusters in the glyph item
     */
    public init_start(glyph_item: GlyphItem, text: string): boolean;
    /**
     * Advances the iterator to the next cluster in the glyph
     * item.
     *
     * See `PangoGlyphItemIter` for details of cluster orders.
     *
     * @returns %TRUE if the iterator was advanced, %FALSE if we
     *   were already on the last cluster.
     */
    public next_cluster(): boolean;
    /**
     * Moves the iterator to the preceding cluster in the glyph
     * item. See `PangoGlyphItemIter` for details of cluster
     * orders.
     *
     * @returns %TRUE if the iterator was moved, %FALSE if we
     *   were already on the first cluster.
     */
    public prev_cluster(): boolean;
  }

  export interface GlyphStringInitOptions {}
  /**
   * A `PangoGlyphString` is used to store strings of glyphs with
   * geometry and visual attribute information.
   *
   * The storage for the glyph information is owned by the
   * structure which simplifies memory management.
   */
  interface GlyphString {}
  class GlyphString {
    public constructor(options?: Partial<GlyphStringInitOptions>);
    /**
     * Create a new `PangoGlyphString`.
     *
     * @returns The newly allocated `PangoGlyphString`, which
     *   should be freed with [method#Pango.GlyphString.free].
     */
    public static new(): GlyphString;
    /** Number of the glyphs in this glyph string. */
    public num_glyphs: number;
    /** Array of glyph information for the glyph string. */
    public glyphs: GlyphInfo[];
    /**
     * Logical cluster info, indexed by the byte index within the
     * text corresponding to the glyph string.
     */
    public log_clusters: number;
    public readonly space: number;
    /**
     * Copy a glyph string and associated storage.
     *
     * @returns The newly allocated `PangoGlyphString`
     */
    public copy(): GlyphString | null;
    /**
     * Compute the logical and ink extents of a glyph string.
     *
     * See the documentation for
     * [method#Pango.Font.get_glyph_extents] for details about
     * the interpretation of the rectangles.
     *
     * Examples of logical (red) and ink (green) rects:
     *
     * [](rects1.png) [](rects2.png)
     *
     * @param font A `PangoFont`
     * @returns Rectangle used to store the extents of the glyph
     *   string as drawn
     *
     *   Rectangle used to store the logical extents of the glyph
     *   string
     */
    public extents(
      font: Font
    ): [ink_rect: Rectangle | null, logical_rect: Rectangle | null];
    /**
     * Computes the extents of a sub-portion of a glyph string.
     *
     * The extents are relative to the start of the glyph string
     * range (the origin of their coordinate system is at the
     * start of the range, not at the start of the entire glyph
     * string).
     *
     * @param start Start index
     * @param end End index (the range is the set of bytes with
     *   indices such that start <= index < end)
     * @param font A `PangoFont`
     * @returns Rectangle used to store the extents of the glyph
     *   string range as drawn
     *
     *   Rectangle used to store the logical extents of the glyph
     *   string range
     */
    public extents_range(
      start: number,
      end: number,
      font: Font
    ): [ink_rect: Rectangle | null, logical_rect: Rectangle | null];
    /** Free a glyph string and associated storage. */
    public free(): void;
    /**
     * Given a `PangoGlyphString` and corresponding text,
     * determine the width corresponding to each character.
     *
     * When multiple characters compose a single cluster, the
     * width of the entire cluster is divided equally among the
     * characters.
     *
     * See also [method#Pango.GlyphItem.get_logical_widths].
     *
     * @param text The text corresponding to the glyphs
     * @param length The length of #text, in bytes
     * @param embedding_level The embedding level of the string
     * @param logical_widths An array whose length is the number
     *   of characters in text (equal to `g_utf8_strlen (text,
     *   length)` unless text has `NUL` bytes) to be filled in
     *   with the resulting character widths.
     */
    public get_logical_widths(
      text: string,
      length: number,
      embedding_level: number,
      logical_widths: number[]
    ): void;
    /**
     * Computes the logical width of the glyph string.
     *
     * This can also be computed using
     * [method#Pango.GlyphString.extents]. However, since this
     * only computes the width, it's much faster. This is in fact
     * only a convenience function that computes the sum of
     * #geometry.width for each glyph in the #glyphs.
     *
     * @returns The logical width of the glyph string.
     */
    public get_width(): number;
    /**
     * Converts from character position to x position.
     *
     * The X position is measured from the left edge of the run.
     * Character positions are computed by dividing up each
     * cluster into equal portions.
     *
     * @param text The text for the run
     * @param length The number of bytes (not characters) in
     *   #text.
     * @param analysis The analysis information return from
     *   [func#itemize]
     * @param index_ The byte index within #text
     * @param trailing Whether we should compute the result for
     *   the beginning (%FALSE) or end (%TRUE) of the character.
     * @returns Location to store result
     */
    public index_to_x(
      text: string,
      length: number,
      analysis: Analysis,
      index_: number,
      trailing: boolean
    ): number;
    /**
     * Resize a glyph string to the given length.
     *
     * @param new_len The new length of the string
     */
    public set_size(new_len: number): void;
    /**
     * Convert from x offset to character position.
     *
     * Character positions are computed by dividing up each
     * cluster into equal portions. In scripts where positioning
     * within a cluster is not allowed (such as Thai), the
     * returned value may not be a valid cursor position; the
     * caller must combine the result with the logical attributes
     * for the text to compute the valid cursor position.
     *
     * @param text The text for the run
     * @param length The number of bytes (not characters) in
     *   text.
     * @param analysis The analysis information return from
     *   [func#itemize]
     * @param x_pos The x offset (in Pango units)
     * @returns Location to store calculated byte index within
     *   #text
     *
     *   Location to store a boolean indicating whether the user
     *   clicked on the leading or trailing edge of the
     *   character
     */
    public x_to_index(
      text: string,
      length: number,
      analysis: Analysis,
      x_pos: number
    ): [index_: number, trailing: number];
  }

  export interface GlyphVisAttrInitOptions {}
  /**
   * A `PangoGlyphVisAttr` structure communicates information
   * between the shaping and rendering phases.
   *
   * Currently, it contains only cluster start information. More
   * attributes may be added in the future.
   */
  interface GlyphVisAttr {}
  class GlyphVisAttr {
    public constructor(options?: Partial<GlyphVisAttrInitOptions>);
    /**
     * Set for the first logical glyph in each cluster. (Clusters
     * are stored in visual order, within the cluster, glyphs are
     * always ordered in logical order, since visual order is
     * meaningless; that is, in Arabic text, accent glyphs follow
     * the glyphs for the base character.)
     */
    public is_cluster_start: number;
  }

  export interface ItemInitOptions {}
  /**
   * The `PangoItem` structure stores information about a segment
   * of text.
   *
   * You typically obtain `PangoItems` by itemizing a piece of
   * text with [func#itemize].
   */
  interface Item {}
  class Item {
    public constructor(options?: Partial<ItemInitOptions>);
    /**
     * Creates a new `PangoItem` structure initialized to default
     * values.
     *
     * @returns The newly allocated `PangoItem`, which should be
     *   freed with [method#Pango.Item.free].
     */
    public static new(): Item;
    /** Byte offset of the start of this item in text. */
    public offset: number;
    /** Length of this item in bytes. */
    public length: number;
    /** Number of Unicode characters in the item. */
    public num_chars: number;
    /** Analysis results for the item. */
    public analysis: Analysis;
    /**
     * Add attributes to a `PangoItem`.
     *
     * The idea is that you have attributes that don't affect
     * itemization, such as font features, so you filter them out
     * using [method#Pango.AttrList.filter], itemize your text,
     * then reapply the attributes to the resulting items using
     * this function.
     *
     * The #iter should be positioned before the range of the
     * item, and will be advanced past it. This function is meant
     * to be called in a loop over the items resulting from
     * itemization, while passing the iter to each call.
     *
     * @param iter A `PangoAttrIterator`
     */
    public apply_attrs(iter: AttrIterator): void;
    /**
     * Copy an existing `PangoItem` structure.
     *
     * @returns The newly allocated `PangoItem`
     */
    public copy(): Item | null;
    /** Free a `PangoItem` and all associated memory. */
    public free(): void;
    /**
     * Modifies #orig to cover only the text after #split_index,
     * and returns a new item that covers the text before
     * #split_index that used to be in #orig.
     *
     * You can think of #split_index as the length of the
     * returned item. #split_index may not be 0, and it may not
     * be greater than or equal to the length of #orig (that is,
     * there must be at least one byte assigned to each item, you
     * can't create a zero-length item). #split_offset is the
     * length of the first item in chars, and must be provided
     * because the text used to generate the item isn't
     * available, so {@link `pango.item_split}` can't count the
     * char length of the split items itself.
     *
     * @param split_index Byte index of position to split item,
     *   relative to the start of the item
     * @param split_offset Number of chars between start of #orig
     *   and #split_index
     * @returns New item representing text before #split_index,
     *   which should be freed with [method#Pango.Item.free].
     */
    public split(split_index: number, split_offset: number): Item;
  }

  export interface LanguageInitOptions {}
  /**
   * The `PangoLanguage` structure is used to represent a
   * language.
   *
   * `PangoLanguage` pointers can be efficiently copied and
   * compared with each other.
   */
  interface Language {}
  class Language {
    public constructor(options?: Partial<LanguageInitOptions>);
    /**
     * Get a string that is representative of the characters
     * needed to render a particular language.
     *
     * The sample text may be a pangram, but is not necessarily.
     * It is chosen to be demonstrative of normal text in the
     * language, as well as exposing font feature requirements
     * unique to the language. It is suitable for use as sample
     * text in a font selection dialog.
     *
     * If #language is %NULL, the default language as found by
     * [func#Pango.Language.get_default] is used.
     *
     * If Pango does not have a sample string for #language, the
     * classic "The quick brown fox..." is returned. This can be
     * detected by comparing the returned pointer value to that
     * returned for (non-existent) language code "xx". That is,
     * compare to:
     *
     *     pango_language_get_sample_string(
     *       pango_language_from_string("xx")
     *     );
     *
     * @returns The sample string
     */
    public get_sample_string(): string;
    /**
     * Determines the scripts used to to write #language.
     *
     * If nothing is known about the language tag #language, or
     * if #language is %NULL, then %NULL is returned. The list of
     * scripts returned starts with the script that the language
     * uses most and continues to the one it uses least.
     *
     * The value #num_script points at will be set to the number
     * of scripts in the returned array (or zero if %NULL is
     * returned).
     *
     * Most languages use only one script for writing, but there
     * are some that use two (Latin and Cyrillic for example),
     * and a few use three (Japanese for example). Applications
     * should not make any assumptions on the maximum number of
     * scripts returned though, except that it is positive if the
     * return value is not %NULL, and it is a small number.
     *
     * The [method#Pango.Language.includes_script] function uses
     * this function internally.
     *
     * Note: while the return value is declared as `PangoScript`,
     * the returned values are from the `GUnicodeScript`
     * enumeration, which may have more values. Callers need to
     * handle unknown values.
     *
     * @returns An array of `PangoScript` values, with the number
     *   of entries in the array stored in #num_scripts, or %NULL
     *   if Pango does not have any information about this
     *   particular language tag (also the case if #language is
     *   %NULL).
     *
     *   Location to return number of scripts
     */
    public get_scripts(): [Script[] | null, number | null];
    /**
     * Determines if #script is one of the scripts used to write
     * #language.
     *
     * The returned value is conservative; if nothing is known
     * about the language tag #language, %TRUE will be returned,
     * since, as far as Pango knows, #script might be used to
     * write #language.
     *
     * This routine is used in Pango's itemization process when
     * determining if a supplied language tag is relevant to a
     * particular section of text. It probably is not useful for
     * applications in most circumstances.
     *
     * This function uses [method#Pango.Language.get_scripts]
     * internally.
     *
     * @param script A `PangoScript`
     * @returns %TRUE if #script is one of the scripts used to
     *   write #language or if nothing is known about #language
     *   (including the case that #language is %NULL), %FALSE
     *   otherwise.
     */
    public includes_script(script: Script): boolean;
    /**
     * Checks if a language tag matches one of the elements in a
     * list of language ranges.
     *
     * A language tag is considered to match a range in the list
     * if the range is '*', the range is exactly the tag, or the
     * range is a prefix of the tag, and the character after it
     * in the tag is '-'.
     *
     * @param range_list A list of language ranges, separated by
     *   ';', ':', ',', or space characters. Each element must
     *   either be '*', or a RFC 3066 language range
     *   canonicalized as by [func#Pango.Language.from_string]
     * @returns %TRUE if a match was found
     */
    public matches(range_list: string): boolean;
    /**
     * Gets the RFC-3066 format string representing the given
     * language tag.
     *
     * Returns (transfer none): a string representing the
     * language tag
     *
     * @returns
     */
    public to_string(): string;
  }

  export interface LayoutIterInitOptions {}
  /**
   * A `PangoLayoutIter` can be used to iterate over the visual
   * extents of a `PangoLayout`.
   *
   * To obtain a `PangoLayoutIter`, use
   * [method#Pango.Layout.get_iter].
   *
   * The `PangoLayoutIter` structure is opaque, and has no
   * user-visible fields.
   */
  interface LayoutIter {}
  class LayoutIter {
    public constructor(options?: Partial<LayoutIterInitOptions>);
    /**
     * Determines whether #iter is on the last line of the
     * layout.
     *
     * @returns %TRUE if #iter is on the last line
     */
    public at_last_line(): boolean;
    /**
     * Copies a `PangoLayoutIter`.
     *
     * @returns The newly allocated `PangoLayoutIter`
     */
    public copy(): LayoutIter | null;
    /** Frees an iterator that's no longer in use. */
    public free(): void;
    /**
     * Gets the Y position of the current line's baseline, in
     * layout coordinates.
     *
     * Layout coordinates have the origin at the top left of the
     * entire layout.
     *
     * @returns Baseline of current line
     */
    public get_baseline(): number;
    /**
     * Gets the extents of the current character, in layout
     * coordinates.
     *
     * Layout coordinates have the origin at the top left of the
     * entire layout.
     *
     * Only logical extents can sensibly be obtained for
     * characters; ink extents make sense only down to the level
     * of clusters.
     *
     * @returns Rectangle to fill with logical extents
     */
    public get_char_extents(): Rectangle;
    /**
     * Gets the extents of the current cluster, in layout
     * coordinates.
     *
     * Layout coordinates have the origin at the top left of the
     * entire layout.
     *
     * @returns Rectangle to fill with ink extents
     *
     *   Rectangle to fill with logical extents
     */
    public get_cluster_extents(): [
      ink_rect: Rectangle | null,
      logical_rect: Rectangle | null
    ];
    /**
     * Gets the current byte index.
     *
     * Note that iterating forward by char moves in visual order,
     * not logical order, so indexes may not be sequential. Also,
     * the index may be equal to the length of the text in the
     * layout, if on the %NULL run (see
     * [method#Pango.LayoutIter.get_run]).
     *
     * @returns Current byte index
     */
    public get_index(): number;
    /**
     * Gets the layout associated with a `PangoLayoutIter`.
     *
     * @returns The layout associated with #iter
     */
    public get_layout(): Layout;
    /**
     * Obtains the extents of the `PangoLayout` being iterated
     * over.
     *
     * @returns Rectangle to fill with ink extents
     *
     *   Rectangle to fill with logical extents
     */
    public get_layout_extents(): [
      ink_rect: Rectangle | null,
      logical_rect: Rectangle | null
    ];
    /**
     * Gets the current line.
     *
     * Use the faster [method#Pango.LayoutIter.get_line_readonly]
     * if you do not plan to modify the contents of the line
     * (glyphs, glyph widths, etc.).
     *
     * @returns The current line
     */
    public get_line(): LayoutLine;
    /**
     * Obtains the extents of the current line.
     *
     * Extents are in layout coordinates (origin is the top-left
     * corner of the entire `PangoLayout`). Thus the extents
     * returned by this function will be the same width/height
     * but not at the same x/y as the extents returned from
     * [method#Pango.LayoutLine.get_extents].
     *
     * @returns Rectangle to fill with ink extents
     *
     *   Rectangle to fill with logical extents
     */
    public get_line_extents(): [
      ink_rect: Rectangle | null,
      logical_rect: Rectangle | null
    ];
    /**
     * Gets the current line for read-only access.
     *
     * This is a faster alternative to
     * [method#Pango.LayoutIter.get_line], but the user is not
     * expected to modify the contents of the line (glyphs, glyph
     * widths, etc.).
     *
     * @returns The current line, that should not be modified
     */
    public get_line_readonly(): LayoutLine;
    /**
     * Divides the vertical space in the `PangoLayout` being
     * iterated over between the lines in the layout, and returns
     * the space belonging to the current line.
     *
     * A line's range includes the line's logical extents. plus
     * half of the spacing above and below the line, if
     * [method#Pango.Layout.set_spacing] has been called to set
     * layout spacing. The Y positions are in layout coordinates
     * (origin at top left of the entire layout).
     *
     * Note: Since 1.44, Pango uses line heights for placing
     * lines, and there may be gaps between the ranges returned
     * by this function.
     *
     * @returns Start of line
     *
     *   End of line
     */
    public get_line_yrange(): [y0_: number | null, y1_: number | null];
    /**
     * Gets the current run.
     *
     * When iterating by run, at the end of each line, there's a
     * position with a %NULL run, so this function can return
     * %NULL. The %NULL run at the end of each line ensures that
     * all lines have at least one run, even lines consisting of
     * only a newline.
     *
     * Use the faster [method#Pango.LayoutIter.get_run_readonly]
     * if you do not plan to modify the contents of the run
     * (glyphs, glyph widths, etc.).
     *
     * @returns The current run
     */
    public get_run(): LayoutRun | null;
    /**
     * Gets the extents of the current run in layout coordinates.
     *
     * Layout coordinates have the origin at the top left of the
     * entire layout.
     *
     * @returns Rectangle to fill with ink extents
     *
     *   Rectangle to fill with logical extents
     */
    public get_run_extents(): [
      ink_rect: Rectangle | null,
      logical_rect: Rectangle | null
    ];
    /**
     * Gets the current run for read-only access.
     *
     * When iterating by run, at the end of each line, there's a
     * position with a %NULL run, so this function can return
     * %NULL. The %NULL run at the end of each line ensures that
     * all lines have at least one run, even lines consisting of
     * only a newline.
     *
     * This is a faster alternative to
     * [method#Pango.LayoutIter.get_run], but the user is not
     * expected to modify the contents of the run (glyphs, glyph
     * widths, etc.).
     *
     * @returns The current run, that should not be modified
     */
    public get_run_readonly(): LayoutRun | null;
    /**
     * Moves #iter forward to the next character in visual order.
     *
     * If #iter was already at the end of the layout, returns
     * %FALSE.
     *
     * @returns Whether motion was possible
     */
    public next_char(): boolean;
    /**
     * Moves #iter forward to the next cluster in visual order.
     *
     * If #iter was already at the end of the layout, returns
     * %FALSE.
     *
     * @returns Whether motion was possible
     */
    public next_cluster(): boolean;
    /**
     * Moves #iter forward to the start of the next line.
     *
     * If #iter is already on the last line, returns %FALSE.
     *
     * @returns Whether motion was possible
     */
    public next_line(): boolean;
    /**
     * Moves #iter forward to the next run in visual order.
     *
     * If #iter was already at the end of the layout, returns
     * %FALSE.
     *
     * @returns Whether motion was possible
     */
    public next_run(): boolean;
  }

  export interface LayoutLineInitOptions {}
  /**
   * A `PangoLayoutLine` represents one of the lines resulting
   * from laying out a paragraph via `PangoLayout`.
   *
   * `PangoLayoutLine` structures are obtained by calling
   * [method#Pango.Layout.get_line] and are only valid until the
   * text, attributes, or settings of the parent `PangoLayout`
   * are modified.
   */
  interface LayoutLine {}
  class LayoutLine {
    public constructor(options?: Partial<LayoutLineInitOptions>);
    /** The layout this line belongs to, might be %NULL */
    public layout: Layout;
    /** Start of line as byte index into layout->text */
    public start_index: number;
    /** Length of line in bytes */
    public length: number;
    /** List of runs in the line, from left to right */
    public runs: GLib.SList;
    /** #TRUE if this is the first line of the paragraph */
    public is_paragraph_start: number;
    /** #Resolved PangoDirection of line */
    public resolved_dir: number;
    /**
     * Computes the logical and ink extents of a layout line.
     *
     * See [method#Pango.Font.get_glyph_extents] for details
     * about the interpretation of the rectangles.
     *
     * @returns Rectangle used to store the extents of the glyph
     *   string as drawn
     *
     *   Rectangle used to store the logical extents of the glyph
     *   string
     */
    public get_extents(): [
      ink_rect: Rectangle | null,
      logical_rect: Rectangle | null
    ];
    /**
     * Computes the height of the line, i.e. the distance between
     * this and the previous lines baseline.
     *
     * @returns Return location for the line height
     */
    public get_height(): number | null;
    /**
     * Computes the logical and ink extents of #layout_line in
     * device units.
     *
     * This function just calls
     * [method#Pango.LayoutLine.get_extents] followed by two
     * [func#extents_to_pixels] calls, rounding #ink_rect and
     * #logical_rect such that the rounded rectangles fully
     * contain the unrounded one (that is, passes them as first
     * argument to [func#extents_to_pixels]).
     *
     * @returns Rectangle used to store the extents of the glyph
     *   string as drawn
     *
     *   Rectangle used to store the logical extents of the glyph
     *   string
     */
    public get_pixel_extents(): [
      ink_rect: Rectangle | null,
      logical_rect: Rectangle | null
    ];
    /**
     * Gets a list of visual ranges corresponding to a given
     * logical range.
     *
     * This list is not necessarily minimal - there may be
     * consecutive ranges which are adjacent. The ranges will be
     * sorted from left to right. The ranges are with respect to
     * the left edge of the entire layout, not with respect to
     * the line.
     *
     * @param start_index Start byte index of the logical range.
     *   If this value is less than the start index for the line,
     *   then the first range will extend all the way to the
     *   leading edge of the layout. Otherwise, it will start at
     *   the leading edge of the first character.
     * @param end_index Ending byte index of the logical range.
     *   If this value is greater than the end index for the
     *   line, then the last range will extend all the way to the
     *   trailing edge of the layout. Otherwise, it will end at
     *   the trailing edge of the last character.
     * @returns Location to store a pointer to an array of
     *   ranges. The array will be of length `2*n_ranges`, with
     *   each range starting at `(*ranges)[2*n]` and of width
     *   `(*ranges)[2*n + 1] - (*ranges)[2*n]`. This array must
     *   be freed with {@link G.free}. The coordinates are
     *   relative to the layout and are in Pango units.
     *
     *   The number of ranges stored in #ranges
     */
    public get_x_ranges(
      start_index: number,
      end_index: number
    ): [number[], number];
    /**
     * Converts an index within a line to a X position.
     *
     * @param index_ Byte offset of a grapheme within the layout
     * @param trailing An integer indicating the edge of the
     *   grapheme to retrieve the position of. If > 0, the
     *   trailing edge of the grapheme, if 0, the leading of the
     *   grapheme
     * @returns Location to store the x_offset (in Pango units)
     */
    public index_to_x(index_: number, trailing: boolean): number;
    /**
     * Increase the reference count of a `PangoLayoutLine` by
     * one.
     *
     * @returns The line passed in.
     */
    public ref(): LayoutLine;
    /**
     * Decrease the reference count of a `PangoLayoutLine` by
     * one.
     *
     * If the result is zero, the line and all associated memory
     * will be freed.
     */
    public unref(): void;
    /**
     * Converts from x offset to the byte index of the
     * corresponding character within the text of the layout.
     *
     * If #x_pos is outside the line, #index_ and #trailing will
     * point to the very first or very last position in the line.
     * This determination is based on the resolved direction of
     * the paragraph; for example, if the resolved direction is
     * right-to-left, then an X position to the right of the line
     * (after it) results in 0 being stored in #index_ and
     * #trailing. An X position to the left of the line results
     * in #index_ pointing to the (logical) last grapheme in the
     * line and #trailing being set to the number of characters
     * in that grapheme. The reverse is true for a left-to-right
     * line.
     *
     * @param x_pos The X offset (in Pango units) from the left
     *   edge of the line.
     * @returns %FALSE if #x_pos was outside the line, %TRUE if
     *   inside
     *
     *   Location to store calculated byte index for the grapheme
     *   in which the user clicked
     *
     *   Location to store an integer indicating where in the
     *   grapheme the user clicked. It will either be zero, or
     *   the number of characters in the grapheme. 0 represents
     *   the leading edge of the grapheme.
     */
    public x_to_index(x_pos: number): [boolean, number, number];
  }

  export interface LogAttrInitOptions {}
  /**
   * The `PangoLogAttr` structure stores information about the
   * attributes of a single character.
   */
  interface LogAttr {}
  class LogAttr {
    public constructor(options?: Partial<LogAttrInitOptions>);
    /** If set, can break line in front of character */
    public is_line_break: number;
    /** If set, must break line in front of character */
    public is_mandatory_break: number;
    /** If set, can break here when doing character wrapping */
    public is_char_break: number;
    /** Is whitespace character */
    public is_white: number;
    /**
     * If set, cursor can appear in front of character. i.e. this
     * is a grapheme boundary, or the first character in the
     * text. This flag implements Unicode's [Grapheme Cluster
     * Boundaries](http://www.unicode.org/reports/tr29/)
     * semantics.
     */
    public is_cursor_position: number;
    /** Is first character in a word */
    public is_word_start: number;
    /**
     * Is first non-word char after a word Note that in
     * degenerate cases, you could have both #is_word_start and
     * #is_word_end set for some character.
     */
    public is_word_end: number;
    /**
     * Is a sentence boundary. There are two ways to divide
     * sentences. The first assigns all inter-sentence
     * whitespace/control/format chars to some sentence, so all
     * chars are in some sentence; #is_sentence_boundary denotes
     * the boundaries there. The second way doesn't assign
     * between-sentence spaces, etc. to any sentence, so
     * #is_sentence_start/#is_sentence_end mark the boundaries of
     * those sentences.
     */
    public is_sentence_boundary: number;
    /** Is first character in a sentence */
    public is_sentence_start: number;
    /**
     * Is first char after a sentence. Note that in degenerate
     * cases, you could have both #is_sentence_start and
     * #is_sentence_end set for some character. (e.g. no space
     * after a period, so the next sentence starts right away)
     */
    public is_sentence_end: number;
    /**
     * If set, backspace deletes one character rather than the
     * entire grapheme cluster. This field is only meaningful on
     * grapheme boundaries (where #is_cursor_position is set). In
     * some languages, the full grapheme (e.g. letter +
     * diacritics) is considered a unit, while in others, each
     * decomposed character in the grapheme is a unit. In the
     * default implementation of [func#break], this bit is set on
     * all grapheme boundaries except those following Latin,
     * Cyrillic or Greek base characters.
     */
    public backspace_deletes_character: number;
    /**
     * Is a whitespace character that can possibly be expanded
     * for justification purposes. (Since: 1.18)
     */
    public is_expandable_space: number;
    /**
     * Is a word boundary, as defined by UAX#29. More
     * specifically, means that this is not a position in the
     * middle of a word. For example, both sides of a punctuation
     * mark are considered word boundaries. This flag is
     * particularly useful when selecting text word-by-word. This
     * flag implements Unicode's [Word
     * Boundaries](http://www.unicode.org/reports/tr29/)
     * semantics. (Since: 1.22)
     */
    public is_word_boundary: number;
  }

  export interface MatrixInitOptions {}
  /**
   * A `PangoMatrix` specifies a transformation between
   * user-space and device coordinates.
   *
   * The transformation is given by
   *
   *     x_device = x_user * matrix->xx + y_user * matrix->xy + matrix->x0;
   *     y_device = x_user * matrix->yx + y_user * matrix->yy + matrix->y0;
   */
  interface Matrix {}
  class Matrix {
    public constructor(options?: Partial<MatrixInitOptions>);
    /** 1st component of the transformation matrix */
    public xx: number;
    /** 2nd component of the transformation matrix */
    public xy: number;
    /** 3rd component of the transformation matrix */
    public yx: number;
    /** 4th component of the transformation matrix */
    public yy: number;
    /** X translation */
    public x0: number;
    /** Y translation */
    public y0: number;
    /**
     * Changes the transformation represented by #matrix to be
     * the transformation given by first applying transformation
     * given by #new_matrix then applying the original
     * transformation.
     *
     * @param new_matrix A `PangoMatrix`
     */
    public concat(new_matrix: Matrix): void;
    /**
     * Copies a `PangoMatrix`.
     *
     * @returns The newly allocated `PangoMatrix`
     */
    public copy(): Matrix | null;
    /** Free a `PangoMatrix`. */
    public free(): void;
    /**
     * Returns the scale factor of a matrix on the height of the
     * font.
     *
     * That is, the scale factor in the direction perpendicular
     * to the vector that the X coordinate is mapped to. If the
     * scale in the X coordinate is needed as well, use
     * [method#Pango.Matrix.get_font_scale_factors].
     *
     * @returns The scale factor of #matrix on the height of the
     *   font, or 1.0 if #matrix is %NULL.
     */
    public get_font_scale_factor(): number;
    /**
     * Calculates the scale factor of a matrix on the width and
     * height of the font.
     *
     * That is, #xscale is the scale factor in the direction of
     * the X coordinate, and #yscale is the scale factor in the
     * direction perpendicular to the vector that the X
     * coordinate is mapped to.
     *
     * Note that output numbers will always be non-negative.
     *
     * @returns Output scale factor in the x direction
     *
     *   Output scale factor perpendicular to the x direction
     */
    public get_font_scale_factors(): [
      xscale: number | null,
      yscale: number | null
    ];
    /**
     * Changes the transformation represented by #matrix to be
     * the transformation given by first rotating by #degrees
     * degrees counter-clockwise then applying the original
     * transformation.
     *
     * @param degrees Degrees to rotate counter-clockwise
     */
    public rotate(degrees: number): void;
    /**
     * Changes the transformation represented by #matrix to be
     * the transformation given by first scaling by #sx in the X
     * direction and #sy in the Y direction then applying the
     * original transformation.
     *
     * @param scale_x Amount to scale by in X direction
     * @param scale_y Amount to scale by in Y direction
     */
    public scale(scale_x: number, scale_y: number): void;
    /**
     * Transforms the distance vector (#dx,#dy) by #matrix.
     *
     * This is similar to [method#Pango.Matrix.transform_point],
     * except that the translation components of the
     * transformation are ignored. The calculation of the
     * returned vector is as follows:
     *
     *     dx2 = dx1 * xx + dy1 * xy;
     *     dy2 = dx1 * yx + dy1 * yy;
     *
     * Affine transformations are position invariant, so the same
     * vector always transforms to the same vector. If (#x1,#y1)
     * transforms to (#x2,#y2) then (#x1+#dx1,#y1+#dy1) will
     * transform to (#x1+#dx2,#y1+#dy2) for all values of #x1 and
     * #x2.
     */
    public transform_distance(): void;
    /**
     * First transforms the #rect using #matrix, then calculates
     * the bounding box of the transformed rectangle.
     *
     * This function is useful for example when you want to draw
     * a rotated {@link Layout} to an image buffer, and want to
     * know how large the image should be and how much you should
     * shift the layout when rendering.
     *
     * For better accuracy, you should use
     * [method#Pango.Matrix.transform_rectangle] on original
     * rectangle in Pango units and convert to pixels afterward
     * using [func#extents_to_pixels]'s first argument.
     */
    public transform_pixel_rectangle(): void;
    /** Transforms the point (#x, #y) by #matrix. */
    public transform_point(): void;
    /**
     * First transforms #rect using #matrix, then calculates the
     * bounding box of the transformed rectangle.
     *
     * This function is useful for example when you want to draw
     * a rotated {@link Layout} to an image buffer, and want to
     * know how large the image should be and how much you should
     * shift the layout when rendering.
     *
     * If you have a rectangle in device units (pixels), use
     * [method#Pango.Matrix.transform_pixel_rectangle].
     *
     * If you have the rectangle in Pango units and want to
     * convert to transformed pixel bounding box, it is more
     * accurate to transform it first (using this function) and
     * pass the result to {@link Pango.extents.to_pixels}, first
     * argument, for an inclusive rounded rectangle. However,
     * there are valid reasons that you may want to convert to
     * pixels first and then transform, for example when the
     * transformed coordinates may overflow in Pango units (large
     * matrix translation for example).
     */
    public transform_rectangle(): void;
    /**
     * Changes the transformation represented by #matrix to be
     * the transformation given by first translating by (#tx,
     * #ty) then applying the original transformation.
     *
     * @param tx Amount to translate in the X direction
     * @param ty Amount to translate in the Y direction
     */
    public translate(tx: number, ty: number): void;
  }

  export interface RectangleInitOptions {}
  /**
   * The `PangoRectangle` structure represents a rectangle.
   *
   * `PangoRectangle` is frequently used to represent the logical
   * or ink extents of a single glyph or section of text. (See,
   * for instance, [method#Pango.Font.get_glyph_extents].)
   */
  interface Rectangle {}
  class Rectangle {
    public constructor(options?: Partial<RectangleInitOptions>);
    /** X coordinate of the left side of the rectangle. */
    public x: number;
    /** Y coordinate of the the top side of the rectangle. */
    public y: number;
    /** Width of the rectangle. */
    public width: number;
    /** Height of the rectangle. */
    public height: number;
  }

  export interface ScriptIterInitOptions {}
  /**
   * A `PangoScriptIter` is used to iterate through a string and
   * identify ranges in different scripts.
   */
  interface ScriptIter {}
  class ScriptIter {
    public constructor(options?: Partial<ScriptIterInitOptions>);
    /**
     * Create a new `PangoScriptIter`, used to break a string of
     * Unicode text into runs by Unicode script.
     *
     * No copy is made of #text, so the caller needs to make sure
     * it remains valid until the iterator is freed with
     * [method#Pango.ScriptIter.free].
     *
     * @param text A UTF-8 string
     * @param length Length of #text, or -1 if #text is
     *   nul-terminated.
     * @returns The new script iterator, initialized to point at
     *   the first range in the text, which should be freed with
     *   [method#Pango.ScriptIter.free]. If the string is empty,
     *   it will point at an empty range.
     */
    public static new(text: string, length: number): ScriptIter;
    /** Frees a `PangoScriptIter`. */
    public free(): void;
    /**
     * Gets information about the range to which #iter currently
     * points. The range is the set of locations p where *start
     * <= p < *end. (That is, it doesn't include the character
     * stored at *end)
     *
     * Note that while the type of the #script argument is
     * declared as `PangoScript`, as of Pango 1.18, this function
     * simply returns GUnicodeScript values. Callers must be
     * prepared to handle unknown values.
     *
     * @returns Location to store start position of the range
     *
     *   Location to store end position of the range
     *
     *   Location to store script for range
     */
    public get_range(): [
      start: string | null,
      end: string | null,
      script: Script | null
    ];
    /**
     * Advances a `PangoScriptIter` to the next range.
     *
     * If #iter is already at the end, it is left unchanged and
     * %FALSE is returned.
     *
     * @returns %TRUE if #iter was successfully advanced
     */
    public next(): boolean;
  }

  export interface TabArrayInitOptions {}
  /**
   * A `PangoTabArray` contains an array of tab stops.
   *
   * `PangoTabArray` can be used to set tab stops in a
   * `PangoLayout`. Each tab stop has an alignment and a
   * position.
   */
  interface TabArray {}
  class TabArray {
    public constructor(options?: Partial<TabArrayInitOptions>);
    /**
     * Creates an array of #initial_size tab stops.
     *
     * Tab stops are specified in pixel units if
     * #positions_in_pixels is %TRUE, otherwise in Pango units.
     * All stops are initially at position 0.
     *
     * @param initial_size Initial number of tab stops to
     *   allocate, can be 0
     * @param positions_in_pixels Whether positions are in pixel
     *   units
     * @returns The newly allocated `PangoTabArray`, which should
     *   be freed with [method#Pango.TabArray.free].
     */
    public static new(
      initial_size: number,
      positions_in_pixels: boolean
    ): TabArray;
    /**
     * Creates a `PangoTabArray` and allows you to specify the
     * alignment and position of each tab stop.
     *
     * You **must** provide an alignment and position for #size
     * tab stops.
     *
     * @param size Number of tab stops in the array
     * @param positions_in_pixels Whether positions are in pixel
     *   units
     * @param first_alignment Alignment of first tab stop
     * @param first_position Position of first tab stop
     * @returns The newly allocated `PangoTabArray`, which should
     *   be freed with [method#Pango.TabArray.free].
     */
    public static new_with_positions(
      size: number,
      positions_in_pixels: boolean,
      first_alignment: TabAlign,
      first_position: number
    ): TabArray;
    /**
     * Copies a `PangoTabArray`.
     *
     * @returns The newly allocated `PangoTabArray`, which should
     *   be freed with [method#Pango.TabArray.free].
     */
    public copy(): TabArray;
    /** Frees a tab array and associated resources. */
    public free(): void;
    /**
     * Returns %TRUE if the tab positions are in pixels, %FALSE
     * if they are in Pango units.
     *
     * @returns Whether positions are in pixels.
     */
    public get_positions_in_pixels(): boolean;
    /**
     * Gets the number of tab stops in #tab_array.
     *
     * @returns The number of tab stops in the array.
     */
    public get_size(): number;
    /**
     * Gets the alignment and position of a tab stop.
     *
     * @param tab_index Tab stop index
     * @returns Location to store alignment
     *
     *   Location to store tab position
     */
    public get_tab(
      tab_index: number
    ): [alignment: TabAlign | null, location: number | null];
    /**
     * If non-%NULL, #alignments and #locations are filled with
     * allocated arrays.
     *
     * The arrays are of length [method#Pango.TabArray.get_size].
     * You must free the returned array.
     *
     * @returns Location to store an array of tab stop alignments
     *
     *   Location to store an array of tab positions
     */
    public get_tabs(): [TabAlign | null, number[] | null];
    /**
     * Resizes a tab array.
     *
     * You must subsequently initialize any tabs that were added
     * as a result of growing the array.
     *
     * @param new_size New size of the array
     */
    public resize(new_size: number): void;
    /**
     * Sets the alignment and location of a tab stop.
     *
     * #alignment must always be %PANGO_TAB_LEFT in the current
     * implementation.
     *
     * @param tab_index The index of a tab stop
     * @param alignment Tab alignment
     * @param location Tab location in Pango units
     */
    public set_tab(
      tab_index: number,
      alignment: TabAlign,
      location: number
    ): void;
  }

  /**
   * `PangoAlignment` describes how to align the lines of a
   * `PangoLayout` within the available space.
   *
   * If the `PangoLayout` is set to justify using
   * [method#Pango.Layout.set_justify], this only has effect for
   * partial lines.
   */
  enum Alignment {
    /** Put all available space on the right */
    LEFT = 0,
    /** Center the line within the available space */
    CENTER = 1,
    /** Put all available space on the left */
    RIGHT = 2,
  }

  /**
   * The `PangoAttrType` distinguishes between different types of
   * attributes.
   *
   * Along with the predefined values, it is possible to allocate
   * additional values for custom attributes using
   * [func#AttrType.register]. The predefined values are given
   * below. The type of structure used to store the attribute is
   * listed in parentheses after the description.
   */
  enum AttrType {
    /** Does not happen */
    INVALID = 0,
    /** Language ([struct#Pango.AttrLanguage]) */
    LANGUAGE = 1,
    /** Font family name list ([struct#Pango.AttrString]) */
    FAMILY = 2,
    /** Font slant style ([struct#Pango.AttrInt]) */
    STYLE = 3,
    /** Font weight ([struct#Pango.AttrInt]) */
    WEIGHT = 4,
    /**
     * Font variant (normal or small caps)
     * ([struct#Pango.AttrInt])
     */
    VARIANT = 5,
    /** Font stretch ([struct#Pango.AttrInt]) */
    STRETCH = 6,
    /**
     * Font size in points scaled by %PANGO_SCALE
     * ([struct#Pango.AttrInt])
     */
    SIZE = 7,
    /** Font description ([struct#Pango.AttrFontDesc]) */
    FONT_DESC = 8,
    /** Foreground color ([struct#Pango.AttrColor]) */
    FOREGROUND = 9,
    /** Background color ([struct#Pango.AttrColor]) */
    BACKGROUND = 10,
    /** Whether the text has an underline ([struct#Pango.AttrInt]) */
    UNDERLINE = 11,
    /**
     * Whether the text is struck-through
     * ([struct#Pango.AttrInt])
     */
    STRIKETHROUGH = 12,
    /** Baseline displacement ([struct#Pango.AttrInt]) */
    RISE = 13,
    /** Shape ([struct#Pango.AttrShape]) */
    SHAPE = 14,
    /** Font size scale factor ([struct#Pango.AttrFloat]) */
    SCALE = 15,
    /** Whether fallback is enabled ([struct#Pango.AttrInt]) */
    FALLBACK = 16,
    /** Letter spacing ([struct{@link AttrInt}]) */
    LETTER_SPACING = 17,
    /** Underline color ([struct#Pango.AttrColor]) */
    UNDERLINE_COLOR = 18,
    /** Strikethrough color ([struct#Pango.AttrColor]) */
    STRIKETHROUGH_COLOR = 19,
    /**
     * Font size in pixels scaled by %PANGO_SCALE
     * ([struct#Pango.AttrInt])
     */
    ABSOLUTE_SIZE = 20,
    /** Base text gravity ([struct#Pango.AttrInt]) */
    GRAVITY = 21,
    /** Gravity hint ([struct#Pango.AttrInt]) */
    GRAVITY_HINT = 22,
    /**
     * OpenType font features ([struct#Pango.AttrString]). Since
     * 1.38
     */
    FONT_FEATURES = 23,
    /** Foreground alpha ([struct#Pango.AttrInt]). Since 1.38 */
    FOREGROUND_ALPHA = 24,
    /** Background alpha ([struct#Pango.AttrInt]). Since 1.38 */
    BACKGROUND_ALPHA = 25,
    /**
     * Whether breaks are allowed ([struct#Pango.AttrInt]). Since
     * 1.44
     */
    ALLOW_BREAKS = 26,
    /**
     * How to render invisible characters
     * ([struct#Pango.AttrInt]). Since 1.44
     */
    SHOW = 27,
    /**
     * Whether to insert hyphens at intra-word line breaks
     * ([struct#Pango.AttrInt]). Since 1.44
     */
    INSERT_HYPHENS = 28,
    /**
     * Whether the text has an overline ([struct#Pango.AttrInt]).
     * Since 1.46
     */
    OVERLINE = 29,
    /** Overline color ([struct#Pango.AttrColor]). Since 1.46 */
    OVERLINE_COLOR = 30,
  }

  /**
   * `PangoBidiType` represents the bidirectional character type
   * of a Unicode character as specified by the [Unicode
   * bidirectional
   * algorithm](http://www.unicode.org/reports/tr9/).
   */
  enum BidiType {
    /** Left-to-Right */
    L = 0,
    /** Left-to-Right Embedding */
    LRE = 1,
    /** Left-to-Right Override */
    LRO = 2,
    /** Right-to-Left */
    R = 3,
    /** Right-to-Left Arabic */
    AL = 4,
    /** Right-to-Left Embedding */
    RLE = 5,
    /** Right-to-Left Override */
    RLO = 6,
    /** Pop Directional Format */
    PDF = 7,
    /** European Number */
    EN = 8,
    /** European Number Separator */
    ES = 9,
    /** European Number Terminator */
    ET = 10,
    /** Arabic Number */
    AN = 11,
    /** Common Number Separator */
    CS = 12,
    /** Nonspacing Mark */
    NSM = 13,
    /** Boundary Neutral */
    BN = 14,
    /** Paragraph Separator */
    B = 15,
    /** Segment Separator */
    S = 16,
    /** Whitespace */
    WS = 17,
    /** Other Neutrals */
    ON = 18,
    /** Left-to-Right isolate. Since 1.48.6 */
    LRI = 19,
    /** Right-to-Left isolate. Since 1.48.6 */
    RLI = 20,
    /** First strong isolate. Since 1.48.6 */
    FSI = 21,
    /** Pop directional isolate. Since 1.48.6 */
    PDI = 22,
  }

  /**
   * `PangoCoverageLevel` is used to indicate how well a font can
   * represent a particular Unicode character for a particular
   * script.
   *
   * Since 1.44, only %PANGO_COVERAGE_NONE and
   * %PANGO_COVERAGE_EXACT will be returned.
   */
  enum CoverageLevel {
    /** The character is not representable with the font. */
    NONE = 0,
    /**
     * The character is represented in a way that may be
     * comprehensible but is not the correct graphical form. For
     * instance, a Hangul character represented as a a sequence
     * of Jamos, or a Latin transliteration of a Cyrillic word.
     */
    FALLBACK = 1,
    /**
     * The character is represented as basically the correct
     * graphical form, but with a stylistic variant inappropriate
     * for the current script.
     */
    APPROXIMATE = 2,
    /**
     * The character is represented as the correct graphical
     * form.
     */
    EXACT = 3,
  }

  /**
   * `PangoDirection` represents a direction in the Unicode
   * bidirectional algorithm.
   *
   * Not every value in this enumeration makes sense for every
   * usage of `PangoDirection`; for example, the return value of
   * [func#unichar_direction] and [func#find_base_dir] cannot be
   * %PANGO_DIRECTION_WEAK_LTR or %PANGO_DIRECTION_WEAK_RTL,
   * since every character is either neutral or has a strong
   * direction; on the other hand %PANGO_DIRECTION_NEUTRAL
   * doesn't make sense to pass to [func#itemize_with_base_dir].
   *
   * The %PANGO_DIRECTION_TTB_LTR, %PANGO_DIRECTION_TTB_RTL
   * values come from an earlier interpretation of this
   * enumeration as the writing direction of a block of text and
   * are no longer used; See `PangoGravity` for how vertical text
   * is handled in Pango.
   *
   * If you are interested in text direction, you should really
   * use fribidi directly. `PangoDirection` is only retained
   * because it is used in some public apis.
   */
  enum Direction {
    /** A strong left-to-right direction */
    LTR = 0,
    /** A strong right-to-left direction */
    RTL = 1,
    /**
     * Deprecated value; treated the same as
     * %PANGO_DIRECTION_RTL.
     */
    TTB_LTR = 2,
    /** Deprecated value; treated the same as %PANGO_DIRECTION_LTR */
    TTB_RTL = 3,
    /** A weak left-to-right direction */
    WEAK_LTR = 4,
    /** A weak right-to-left direction */
    WEAK_RTL = 5,
    /** No direction specified */
    NEUTRAL = 6,
  }

  /**
   * `PangoEllipsizeMode` describes what sort of ellipsization
   * should be applied to text.
   *
   * In the ellipsization process characters are removed from the
   * text in order to make it fit to a given width and replaced
   * with an ellipsis.
   */
  enum EllipsizeMode {
    /** No ellipsization */
    NONE = 0,
    /** Omit characters at the start of the text */
    START = 1,
    /** Omit characters in the middle of the text */
    MIDDLE = 2,
    /** Omit characters at the end of the text */
    END = 3,
  }

  /**
   * `PangoGravity` represents the orientation of glyphs in a
   * segment of text.
   *
   * This is useful when rendering vertical text layouts. In
   * those situations, the layout is rotated using a non-identity
   * [struct#Pango.Matrix], and then glyph orientation is
   * controlled using `PangoGravity`.
   *
   * Not every value in this enumeration makes sense for every
   * usage of `PangoGravity`; for example, %PANGO_GRAVITY_AUTO
   * only can be passed to
   * [method#Pango.Context.set_base_gravity] and can only be
   * returned by [method#Pango.Context.get_base_gravity].
   *
   * See also: [enum#Pango.GravityHint]
   */
  enum Gravity {
    /** Glyphs stand upright (default) */
    SOUTH = 0,
    /** Glyphs are rotated 90 degrees clockwise */
    EAST = 1,
    /** Glyphs are upside-down */
    NORTH = 2,
    /** Glyphs are rotated 90 degrees counter-clockwise */
    WEST = 3,
    /** Gravity is resolved from the context matrix */
    AUTO = 4,
  }

  /**
   * `PangoGravityHint` defines how horizontal scripts should
   * behave in a vertical context.
   *
   * That is, English excerpts in a vertical paragraph for
   * example.
   *
   * See also [enum#Pango.Gravity]
   */
  enum GravityHint {
    /**
     * Scripts will take their natural gravity based on the base
     * gravity and the script. This is the default.
     */
    NATURAL = 0,
    /** Always use the base gravity set, regardless of the script. */
    STRONG = 1,
    /**
     * For scripts not in their natural direction (eg. Latin in
     * East gravity), choose per-script gravity such that every
     * script respects the line progression. This means, Latin
     * and Arabic will take opposite gravities and both flow
     * top-to-bottom for example.
     */
    LINE = 2,
  }

  /**
   * The `PangoOverline` enumeration is used to specify whether
   * text should be overlined, and if so, the type of line.
   */
  enum Overline {
    /** No overline should be drawn */
    NONE = 0,
    /**
     * Draw a single line above the ink extents of the text being
     * underlined.
     */
    SINGLE = 1,
  }

  /**
   * `PangoRenderPart` defines different items to render for such
   * purposes as setting colors.
   */
  enum RenderPart {
    /** The text itself */
    FOREGROUND = 0,
    /** The area behind the text */
    BACKGROUND = 1,
    /** Underlines */
    UNDERLINE = 2,
    /** Strikethrough lines */
    STRIKETHROUGH = 3,
    /** Overlines */
    OVERLINE = 4,
  }

  /**
   * The `PangoScript` enumeration identifies different writing
   * systems.
   *
   * The values correspond to the names as defined in the Unicode
   * standard. See [Unicode Standard Annex 24: Script
   * names](http://www.unicode.org/reports/tr24/)
   *
   * Note that this enumeration is deprecated and will not be
   * updated to include values in newer versions of the Unicode
   * standard. Applications should use the `GUnicodeScript`
   * enumeration instead, whose values are interchangeable with
   * `PangoScript`.
   */
  enum Script {
    /**
     * A value never returned from
     * {@link Pango.script.for_unichar}
     */
    INVALID_CODE = -1,
    /** A character used by multiple different scripts */
    COMMON = 0,
    /**
     * A mark glyph that takes its script from the base glyph to
     * which it is attached
     */
    INHERITED = 1,
    /** Arabic */
    ARABIC = 2,
    /** Armenian */
    ARMENIAN = 3,
    /** Bengali */
    BENGALI = 4,
    /** Bopomofo */
    BOPOMOFO = 5,
    /** Cherokee */
    CHEROKEE = 6,
    /** Coptic */
    COPTIC = 7,
    /** Cyrillic */
    CYRILLIC = 8,
    /** Deseret */
    DESERET = 9,
    /** Devanagari */
    DEVANAGARI = 10,
    /** Ethiopic */
    ETHIOPIC = 11,
    /** Georgian */
    GEORGIAN = 12,
    /** Gothic */
    GOTHIC = 13,
    /** Greek */
    GREEK = 14,
    /** Gujarati */
    GUJARATI = 15,
    /** Gurmukhi */
    GURMUKHI = 16,
    /** Han */
    HAN = 17,
    /** Hangul */
    HANGUL = 18,
    /** Hebrew */
    HEBREW = 19,
    /** Hiragana */
    HIRAGANA = 20,
    /** Kannada */
    KANNADA = 21,
    /** Katakana */
    KATAKANA = 22,
    /** Khmer */
    KHMER = 23,
    /** Lao */
    LAO = 24,
    /** Latin */
    LATIN = 25,
    /** Malayalam */
    MALAYALAM = 26,
    /** Mongolian */
    MONGOLIAN = 27,
    /** Myanmar */
    MYANMAR = 28,
    /** Ogham */
    OGHAM = 29,
    /** Old Italic */
    OLD_ITALIC = 30,
    /** Oriya */
    ORIYA = 31,
    /** Runic */
    RUNIC = 32,
    /** Sinhala */
    SINHALA = 33,
    /** Syriac */
    SYRIAC = 34,
    /** Tamil */
    TAMIL = 35,
    /** Telugu */
    TELUGU = 36,
    /** Thaana */
    THAANA = 37,
    /** Thai */
    THAI = 38,
    /** Tibetan */
    TIBETAN = 39,
    /** Canadian Aboriginal */
    CANADIAN_ABORIGINAL = 40,
    /** Yi */
    YI = 41,
    /** Tagalog */
    TAGALOG = 42,
    /** Hanunoo */
    HANUNOO = 43,
    /** Buhid */
    BUHID = 44,
    /** Tagbanwa */
    TAGBANWA = 45,
    /** Braille */
    BRAILLE = 46,
    /** Cypriot */
    CYPRIOT = 47,
    /** Limbu */
    LIMBU = 48,
    /** Osmanya */
    OSMANYA = 49,
    /** Shavian */
    SHAVIAN = 50,
    /** Linear B */
    LINEAR_B = 51,
    /** Tai Le */
    TAI_LE = 52,
    /** Ugaritic */
    UGARITIC = 53,
    /** New Tai Lue. Since 1.10 */
    NEW_TAI_LUE = 54,
    /** Buginese. Since 1.10 */
    BUGINESE = 55,
    /** Glagolitic. Since 1.10 */
    GLAGOLITIC = 56,
    /** Tifinagh. Since 1.10 */
    TIFINAGH = 57,
    /** Syloti Nagri. Since 1.10 */
    SYLOTI_NAGRI = 58,
    /** Old Persian. Since 1.10 */
    OLD_PERSIAN = 59,
    /** Kharoshthi. Since 1.10 */
    KHAROSHTHI = 60,
    /** An unassigned code point. Since 1.14 */
    UNKNOWN = 61,
    /** Balinese. Since 1.14 */
    BALINESE = 62,
    /** Cuneiform. Since 1.14 */
    CUNEIFORM = 63,
    /** Phoenician. Since 1.14 */
    PHOENICIAN = 64,
    /** Phags-pa. Since 1.14 */
    PHAGS_PA = 65,
    /** N'Ko. Since 1.14 */
    NKO = 66,
    /** Kayah Li. Since 1.20.1 */
    KAYAH_LI = 67,
    /** Lepcha. Since 1.20.1 */
    LEPCHA = 68,
    /** Rejang. Since 1.20.1 */
    REJANG = 69,
    /** Sundanese. Since 1.20.1 */
    SUNDANESE = 70,
    /** Saurashtra. Since 1.20.1 */
    SAURASHTRA = 71,
    /** Cham. Since 1.20.1 */
    CHAM = 72,
    /** Ol Chiki. Since 1.20.1 */
    OL_CHIKI = 73,
    /** Vai. Since 1.20.1 */
    VAI = 74,
    /** Carian. Since 1.20.1 */
    CARIAN = 75,
    /** Lycian. Since 1.20.1 */
    LYCIAN = 76,
    /** Lydian. Since 1.20.1 */
    LYDIAN = 77,
    /** Batak. Since 1.32 */
    BATAK = 78,
    /** Brahmi. Since 1.32 */
    BRAHMI = 79,
    /** Mandaic. Since 1.32 */
    MANDAIC = 80,
    /** Chakma. Since: 1.32 */
    CHAKMA = 81,
    /** Meroitic Cursive. Since: 1.32 */
    MEROITIC_CURSIVE = 82,
    /** Meroitic Hieroglyphs. Since: 1.32 */
    MEROITIC_HIEROGLYPHS = 83,
    /** Miao. Since: 1.32 */
    MIAO = 84,
    /** Sharada. Since: 1.32 */
    SHARADA = 85,
    /** Sora Sompeng. Since: 1.32 */
    SORA_SOMPENG = 86,
    /** Takri. Since: 1.32 */
    TAKRI = 87,
    /** Bassa. Since: 1.40 */
    BASSA_VAH = 88,
    /** Caucasian Albanian. Since: 1.40 */
    CAUCASIAN_ALBANIAN = 89,
    /** Duployan. Since: 1.40 */
    DUPLOYAN = 90,
    /** Elbasan. Since: 1.40 */
    ELBASAN = 91,
    /** Grantha. Since: 1.40 */
    GRANTHA = 92,
    /** Kjohki. Since: 1.40 */
    KHOJKI = 93,
    /** Khudawadi, Sindhi. Since: 1.40 */
    KHUDAWADI = 94,
    /** Linear A. Since: 1.40 */
    LINEAR_A = 95,
    /** Mahajani. Since: 1.40 */
    MAHAJANI = 96,
    /** Manichaean. Since: 1.40 */
    MANICHAEAN = 97,
    /** Mende Kikakui. Since: 1.40 */
    MENDE_KIKAKUI = 98,
    /** Modi. Since: 1.40 */
    MODI = 99,
    /** Mro. Since: 1.40 */
    MRO = 100,
    /** Nabataean. Since: 1.40 */
    NABATAEAN = 101,
    /** Old North Arabian. Since: 1.40 */
    OLD_NORTH_ARABIAN = 102,
    /** Old Permic. Since: 1.40 */
    OLD_PERMIC = 103,
    /** Pahawh Hmong. Since: 1.40 */
    PAHAWH_HMONG = 104,
    /** Palmyrene. Since: 1.40 */
    PALMYRENE = 105,
    /** Pau Cin Hau. Since: 1.40 */
    PAU_CIN_HAU = 106,
    /** Psalter Pahlavi. Since: 1.40 */
    PSALTER_PAHLAVI = 107,
    /** Siddham. Since: 1.40 */
    SIDDHAM = 108,
    /** Tirhuta. Since: 1.40 */
    TIRHUTA = 109,
    /** Warang Citi. Since: 1.40 */
    WARANG_CITI = 110,
    /** Ahom. Since: 1.40 */
    AHOM = 111,
    /** Anatolian Hieroglyphs. Since: 1.40 */
    ANATOLIAN_HIEROGLYPHS = 112,
    /** Hatran. Since: 1.40 */
    HATRAN = 113,
    /** Multani. Since: 1.40 */
    MULTANI = 114,
    /** Old Hungarian. Since: 1.40 */
    OLD_HUNGARIAN = 115,
    /** Signwriting. Since: 1.40 */
    SIGNWRITING = 116,
  }

  /**
   * An enumeration specifying the width of the font relative to
   * other designs within a family.
   */
  enum Stretch {
    /** Ultra condensed width */
    ULTRA_CONDENSED = 0,
    /** Extra condensed width */
    EXTRA_CONDENSED = 1,
    /** Condensed width */
    CONDENSED = 2,
    /** Semi condensed width */
    SEMI_CONDENSED = 3,
    /** The normal width */
    NORMAL = 4,
    /** Semi expanded width */
    SEMI_EXPANDED = 5,
    /** Expanded width */
    EXPANDED = 6,
    /** Extra expanded width */
    EXTRA_EXPANDED = 7,
    /** Ultra expanded width */
    ULTRA_EXPANDED = 8,
  }

  /**
   * An enumeration specifying the various slant styles possible
   * for a font.
   */
  enum Style {
    /** The font is upright. */
    NORMAL = 0,
    /** The font is slanted, but in a roman style. */
    OBLIQUE = 1,
    /** The font is slanted in an italic style. */
    ITALIC = 2,
  }

  /**
   * `PangoTabAlign` specifies where a tab stop appears relative
   * to the text.
   */
  enum TabAlign {
    /** The tab stop appears to the left of the text. */
    LEFT = 0,
  }

  /**
   * The `PangoUnderline` enumeration is used to specify whether
   * text should be underlined, and if so, the type of
   * underlining.
   */
  enum Underline {
    /** No underline should be drawn */
    NONE = 0,
    /** A single underline should be drawn */
    SINGLE = 1,
    /** A double underline should be drawn */
    DOUBLE = 2,
    /**
     * A single underline should be drawn at a position beneath
     * the ink extents of the text being underlined. This should
     * be used only for underlining single characters, such as
     * for keyboard accelerators. %PANGO_UNDERLINE_SINGLE should
     * be used for extended portions of text.
     */
    LOW = 3,
    /**
     * An underline indicating an error should be drawn below.
     * The exact style of rendering is up to the `PangoRenderer`
     * in use, but typical styles include wavy or dotted lines.
     * This underline is typically used to indicate an error such
     * as a possible mispelling; in some cases a contrasting
     * color may automatically be used. This type of underlining
     * is available since Pango 1.4.
     */
    ERROR = 4,
    /**
     * Like #PANGO_UNDERLINE_SINGLE, but drawn continuously
     * across multiple runs. This type of underlining is
     * available since Pango 1.46.
     */
    SINGLE_LINE = 5,
    /**
     * Like #PANGO_UNDERLINE_DOUBLE, but drawn continuously
     * across multiple runs. This type of underlining is
     * available since Pango 1.46.
     */
    DOUBLE_LINE = 6,
    /**
     * Like #PANGO_UNDERLINE_ERROR, but drawn continuously across
     * multiple runs. This type of underlining is available since
     * Pango 1.46.
     */
    ERROR_LINE = 7,
  }

  /**
   * An enumeration specifying capitalization variant of the
   * font.
   */
  enum Variant {
    /** A normal font. */
    NORMAL = 0,
    /**
     * A font with the lower case characters replaced by smaller
     * variants of the capital characters.
     */
    SMALL_CAPS = 1,
  }

  /**
   * An enumeration specifying the weight (boldness) of a font.
   *
   * This is a numerical value ranging from 100 to 1000, but
   * there are some predefined values.
   */
  enum Weight {
    /** The thin weight (= 100; Since: 1.24) */
    THIN = 100,
    /** The ultralight weight (= 200) */
    ULTRALIGHT = 200,
    /** The light weight (= 300) */
    LIGHT = 300,
    /** The semilight weight (= 350; Since: 1.36.7) */
    SEMILIGHT = 350,
    /** The book weight (= 380; Since: 1.24) */
    BOOK = 380,
    /** The default weight (= 400) */
    NORMAL = 400,
    /** The normal weight (= 500; Since: 1.24) */
    MEDIUM = 500,
    /** The semibold weight (= 600) */
    SEMIBOLD = 600,
    /** The bold weight (= 700) */
    BOLD = 700,
    /** The ultrabold weight (= 800) */
    ULTRABOLD = 800,
    /** The heavy weight (= 900) */
    HEAVY = 900,
    /** The ultraheavy weight (= 1000; Since: 1.24) */
    ULTRAHEAVY = 1000,
  }

  /**
   * `PangoWrapMode` describes how to wrap the lines of a
   * `PangoLayout` to the desired width.
   *
   * For #PANGO_WRAP_WORD, Pango uses break opportunities that
   * are determined by the Unicode line breaking algorithm. For
   * #PANGO_WRAP_CHAR, Pango allows breaking at grapheme
   * boundaries that are determined by the Unicode text
   * segmentation algorithm.
   */
  enum WrapMode {
    /** Wrap lines at word boundaries. */
    WORD = 0,
    /** Wrap lines at character boundaries. */
    CHAR = 1,
    /**
     * Wrap lines at word boundaries, but fall back to character
     * boundaries if there is not enough space for a full word.
     */
    WORD_CHAR = 2,
  }

  /**
   * The bits in a `PangoFontMask` correspond to the set fields
   * in a `PangoFontDescription`.
   */
  enum FontMask {
    /** The font family is specified. */
    FAMILY = 1,
    /** The font style is specified. */
    STYLE = 2,
    /** The font variant is specified. */
    VARIANT = 4,
    /** The font weight is specified. */
    WEIGHT = 8,
    /** The font stretch is specified. */
    STRETCH = 16,
    /** The font size is specified. */
    SIZE = 32,
    /** The font gravity is specified (Since: 1.16.) */
    GRAVITY = 64,
    /** OpenType font variations are specified (Since: 1.42) */
    VARIATIONS = 128,
  }

  /**
   * Flags influencing the shaping process.
   *
   * `PangoShapeFlags` can be passed to
   * [func#Pango.shape_with_flags].
   */
  enum ShapeFlags {
    /** Default value. */
    NONE = 0,
    /**
     * Round glyph positions and widths to whole device units.
     * This option should be set if the target renderer can't do
     * subpixel positioning of glyphs.
     */
    ROUND_POSITIONS = 1,
  }

  /**
   * These flags affect how Pango treats characters that are
   * normally not visible in the output.
   */
  enum ShowFlags {
    /** No special treatment for invisible characters */
    NONE = 0,
    /** Render spaces, tabs and newlines visibly */
    SPACES = 1,
    /** Render line breaks visibly */
    LINE_BREAKS = 2,
    /** Render default-ignorable Unicode characters visibly */
    IGNORABLES = 4,
  }

  /**
   * Type of a function that can duplicate user data for an
   * attribute.
   */
  interface AttrDataCopyFunc {
    /**
     * Type of a function that can duplicate user data for an
     * attribute.
     *
     * @returns New copy of #user_data.
     */
    (): any | null;
  }

  /** Type of a function filtering a list of attributes. */
  interface AttrFilterFunc {
    /**
     * Type of a function filtering a list of attributes.
     *
     * @param attribute A Pango attribute
     * @returns %TRUE if the attribute should be selected for
     *   filtering, %FALSE otherwise.
     */
    (attribute: Attribute): boolean;
  }

  /**
   * Callback used by {@link Pango.Fontset.foreach} when
   * enumerating fonts in a fontset.
   */
  interface FontsetForeachFunc {
    /**
     * Callback used by {@link Pango.Fontset.foreach} when
     * enumerating fonts in a fontset.
     *
     * @param fontset A `PangoFontset`
     * @param font A font from #fontset
     * @returns If %TRUE, stop iteration and return immediately.
     */
    (fontset: Fontset, font: Font): boolean;
  }

  /**
   * A `PangoGlyph` represents a single glyph in the output form
   * of a string.
   */
  type Glyph = number;

  /**
   * The `PangoGlyphUnit` type is used to store dimensions within
   * Pango.
   *
   * Dimensions are stored in 1/%PANGO_SCALE of a device unit. (A
   * device unit might be a pixel for screen display, or a point
   * on a printer.) %PANGO_SCALE is currently 1024, and may
   * change in the future (unlikely though), but you should not
   * depend on its exact value. The {@link PANGO.PIXELS} macro can
   * be used to convert from glyph units into device units with
   * correct rounding.
   */
  type GlyphUnit = number;

  /**
   * A `PangoLayoutRun` represents a single run within a
   * `PangoLayoutLine`.
   *
   * It is simply an alternate name for [struct#Pango.GlyphItem].
   * See the [struct#Pango.GlyphItem] docs for details on the
   * fields.
   */
  type LayoutRun = GlyphItem;

  /**
   * Create a new allow-breaks attribute.
   *
   * If breaks are disabled, the range will be kept in a single
   * run, as far as possible.
   *
   * @param allow_breaks %TRUE if we line breaks are allowed
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_allow_breaks_new(allow_breaks: boolean): Attribute;

  /**
   * Create a new background alpha attribute.
   *
   * @param alpha The alpha value, between 1 and 65536
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_background_alpha_new(alpha: number): Attribute;

  /**
   * Create a new background color attribute.
   *
   * @param red The red value (ranging from 0 to 65535)
   * @param green The green value
   * @param blue The blue value
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_background_new(
    red: number,
    green: number,
    blue: number
  ): Attribute;

  /**
   * Create a new font fallback attribute.
   *
   * If fallback is disabled, characters will only be used from
   * the closest matching font on the system. No fallback will be
   * done to other fonts on the system that might contain the
   * characters in the text.
   *
   * @param enable_fallback %TRUE if we should fall back on other
   *   fonts for characters the active font is missing
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_fallback_new(enable_fallback: boolean): Attribute;

  /**
   * Create a new font family attribute.
   *
   * @param family The family or comma-separated list of families
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_family_new(family: string): Attribute;

  /**
   * Create a new font description attribute.
   *
   * This attribute allows setting family, style, weight,
   * variant, stretch, and size simultaneously.
   *
   * @param desc The font description
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_font_desc_new(desc: FontDescription): Attribute;

  /**
   * Create a new font features tag attribute.
   *
   * You can use this attribute to select OpenType font features
   * like small-caps, alternative glyphs, ligatures, etc. for
   * fonts that support them.
   *
   * @param features A string with OpenType font features, with
   *   the syntax of the [CSS font-feature-settings
   *   property](https://www.w3.org/TR/css-fonts-4/#font-rend-desc)
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_font_features_new(features: string): Attribute;

  /**
   * Create a new foreground alpha attribute.
   *
   * @param alpha The alpha value, between 1 and 65536
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_foreground_alpha_new(alpha: number): Attribute;

  /**
   * Create a new foreground color attribute.
   *
   * @param red The red value (ranging from 0 to 65535)
   * @param green The green value
   * @param blue The blue value
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_foreground_new(
    red: number,
    green: number,
    blue: number
  ): Attribute;

  /**
   * Create a new gravity hint attribute.
   *
   * @param hint The gravity hint value
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_gravity_hint_new(hint: GravityHint): Attribute;

  /**
   * Create a new gravity attribute.
   *
   * @param gravity The gravity value; should not be
   *   %PANGO_GRAVITY_AUTO
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_gravity_new(gravity: Gravity): Attribute;

  /**
   * Create a new insert-hyphens attribute.
   *
   * Pango will insert hyphens when breaking lines in the middle
   * of a word. This attribute can be used to suppress the
   * hyphen.
   *
   * @param insert_hyphens %TRUE if hyphens should be inserted
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_insert_hyphens_new(insert_hyphens: boolean): Attribute;

  /**
   * Create a new language tag attribute.
   *
   * @param language Language tag
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_language_new(language: Language): Attribute;

  /**
   * Create a new letter-spacing attribute.
   *
   * @param letter_spacing Amount of extra space to add between
   *   graphemes of the text, in Pango units
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_letter_spacing_new(letter_spacing: number): Attribute;

  /**
   * Create a new overline color attribute.
   *
   * This attribute modifies the color of overlines. If not set,
   * overlines will use the foreground color.
   *
   * @param red The red value (ranging from 0 to 65535)
   * @param green The green value
   * @param blue The blue value
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_overline_color_new(
    red: number,
    green: number,
    blue: number
  ): Attribute;

  /**
   * Create a new overline-style attribute.
   *
   * @param overline The overline style
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_overline_new(overline: Overline): Attribute;

  /**
   * Create a new baseline displacement attribute.
   *
   * @param rise The amount that the text should be displaced
   *   vertically, in Pango units. Positive values displace the
   *   text upwards.
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_rise_new(rise: number): Attribute;

  /**
   * Create a new font size scale attribute.
   *
   * The base font for the affected text will have its size
   * multiplied by #scale_factor.
   *
   * @param scale_factor Factor to scale the font
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_scale_new(scale_factor: number): Attribute;

  /**
   * Create a new shape attribute.
   *
   * A shape is used to impose a particular ink and logical
   * rectangle on the result of shaping a particular glyph. This
   * might be used, for instance, for embedding a picture or a
   * widget inside a `PangoLayout`.
   *
   * @param ink_rect Ink rectangle to assign to each character
   * @param logical_rect Logical rectangle to assign to each
   *   character
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_shape_new(
    ink_rect: Rectangle,
    logical_rect: Rectangle
  ): Attribute;

  /**
   * Creates a new shape attribute.
   *
   * Like [func#Pango.AttrShape.new], but a user data pointer is
   * also provided; this pointer can be accessed when later
   * rendering the glyph.
   *
   * @param ink_rect Ink rectangle to assign to each character
   * @param logical_rect Logical rectangle to assign to each
   *   character
   * @param data User data pointer
   * @param copy_func Function to copy #data when the attribute
   *   is copied. If %NULL, #data is simply copied as a pointer
   * @param destroy_func Function to free #data when the
   *   attribute is freed
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_shape_new_with_data(
    ink_rect: Rectangle,
    logical_rect: Rectangle,
    data: any | null,
    copy_func: AttrDataCopyFunc | null,
    destroy_func: GLib.DestroyNotify | null
  ): Attribute;

  /**
   * Create a new attribute that influences how invisible
   * characters are rendered.
   *
   * @param flags `PangoShowFlags` to apply
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_show_new(flags: ShowFlags): Attribute;

  /**
   * Create a new font-size attribute in fractional points.
   *
   * @param size The font size, in %PANGO_SCALE-ths of a point
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_size_new(size: number): Attribute;

  /**
   * Create a new font-size attribute in device units.
   *
   * @param size The font size, in %PANGO_SCALE-ths of a device
   *   unit
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_size_new_absolute(size: number): Attribute;

  /**
   * Create a new font stretch attribute.
   *
   * @param stretch The stretch
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_stretch_new(stretch: Stretch): Attribute;

  /**
   * Create a new strikethrough color attribute.
   *
   * This attribute modifies the color of strikethrough lines. If
   * not set, strikethrough lines will use the foreground color.
   *
   * @param red The red value (ranging from 0 to 65535)
   * @param green The green value
   * @param blue The blue value
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_strikethrough_color_new(
    red: number,
    green: number,
    blue: number
  ): Attribute;

  /**
   * Create a new strike-through attribute.
   *
   * @param strikethrough %TRUE if the text should be
   *   struck-through
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_strikethrough_new(strikethrough: boolean): Attribute;

  /**
   * Create a new font slant style attribute.
   *
   * @param style The slant style
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_style_new(style: Style): Attribute;

  /**
   * Fetches the attribute type name.
   *
   * The attribute type name is the string passed in when
   * registering the type using [func#Pango.AttrType.register].
   *
   * The returned value is an interned string (see
   * {@link G.intern_string} for what that means) that should not
   * be modified or freed.
   *
   * @param type An attribute type ID to fetch the name for
   * @returns The type ID name (which may be %NULL), or %NULL if
   *   #type is a built-in Pango attribute type or invalid.
   */
  function attr_type_get_name(type: AttrType): string | null;

  /**
   * Allocate a new attribute type ID.
   *
   * The attribute type name can be accessed later by using
   * [func#Pango.AttrType.get_name].
   *
   * @param name An identifier for the type
   * @returns The new type ID.
   */
  function attr_type_register(name: string): AttrType;

  /**
   * Create a new underline color attribute.
   *
   * This attribute modifies the color of underlines. If not set,
   * underlines will use the foreground color.
   *
   * @param red The red value (ranging from 0 to 65535)
   * @param green The green value
   * @param blue The blue value
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_underline_color_new(
    red: number,
    green: number,
    blue: number
  ): Attribute;

  /**
   * Create a new underline-style attribute.
   *
   * @param underline The underline style
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_underline_new(underline: Underline): Attribute;

  /**
   * Create a new font variant attribute (normal or small caps).
   *
   * @param variant The variant
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy].
   */
  function attr_variant_new(variant: Variant): Attribute;

  /**
   * Create a new font weight attribute.
   *
   * @param weight The weight
   * @returns The newly allocated `PangoAttribute`, which should
   *   be freed with [method#Pango.Attribute.destroy]
   */
  function attr_weight_new(weight: Weight): Attribute;

  /**
   * Determines the bidirectional type of a character.
   *
   * The bidirectional type is specified in the Unicode Character
   * Database.
   *
   * A simplified version of this function is available as
   * [func#unichar_direction].
   *
   * @param ch A Unicode character
   * @returns The bidirectional character type, as used in the
   *   Unicode bidirectional algorithm.
   */
  function bidi_type_for_unichar(ch: string): BidiType;

  /**
   * Determines possible line, word, and character breaks for a
   * string of Unicode text with a single analysis.
   *
   * For most purposes you may want to use
   * [func#Pango.get_log_attrs].
   *
   * @param text The text to process. Must be valid UTF-8
   * @param length Length of #text in bytes (may be -1 if #text
   *   is nul-terminated)
   * @param analysis `PangoAnalysis` structure for #text
   * @param attrs An array to store character information in
   * @param attrs_len Size of the array passed as #attrs
   */
  // function break(text: string, length: number, analysis: Analysis, attrs: LogAttr[], attrs_len: number): void;

  /**
   * This is the default break algorithm.
   *
   * It applies Unicode rules without language-specific
   * tailoring, therefore the #analyis argument is unused and can
   * be %NULL.
   *
   * See [func#Pango.tailor_break] for language-specific breaks.
   *
   * @param text Text to break. Must be valid UTF-8
   * @param length Length of text in bytes (may be -1 if #text is
   *   nul-terminated)
   * @param analysis A `PangoAnalysis` structure for the #text
   * @param attrs Logical attributes to fill in
   * @param attrs_len Size of the array passed as #attrs
   */
  function default_break(
    text: string,
    length: number,
    analysis: Analysis | null,
    attrs: LogAttr,
    attrs_len: number
  ): void;

  /**
   * Converts extents from Pango units to device units.
   *
   * The conversion is done by dividing by the %PANGO_SCALE
   * factor and performing rounding.
   *
   * The #inclusive rectangle is converted by flooring the x/y
   * coordinates and extending width/height, such that the final
   * rectangle completely includes the original rectangle.
   *
   * The #nearest rectangle is converted by rounding the
   * coordinates of the rectangle to the nearest device unit
   * (pixel).
   *
   * The rule to which argument to use is: if you want the
   * resulting device-space rectangle to completely contain the
   * original rectangle, pass it in as #inclusive. If you want
   * two touching-but-not-overlapping rectangles stay
   * touching-but-not-overlapping after rounding to device units,
   * pass them in as #nearest.
   *
   * @param inclusive Rectangle to round to pixels inclusively
   * @param nearest Rectangle to round to nearest pixels
   */
  function extents_to_pixels(
    inclusive: Rectangle | null,
    nearest: Rectangle | null
  ): void;

  /**
   * Searches a string the first character that has a strong
   * direction, according to the Unicode bidirectional
   * algorithm.
   *
   * @param text The text to process. Must be valid UTF-8
   * @param length Length of #text in bytes (may be -1 if #text
   *   is nul-terminated)
   * @returns The direction corresponding to the first strong
   *   character. If no such character is found, then
   *   %PANGO_DIRECTION_NEUTRAL is returned.
   */
  function find_base_dir(text: string, length: number): Direction;

  /**
   * Locates a paragraph boundary in #text.
   *
   * A boundary is caused by delimiter characters, such as a
   * newline, carriage return, carriage return-newline pair, or
   * Unicode paragraph separator character.
   *
   * The index of the run of delimiters is returned in
   * #paragraph_delimiter_index. The index of the start of the
   * paragrap (index after all delimiters) is stored in
   * #next_paragraph_start.
   *
   * If no delimiters are found, both #paragraph_delimiter_index
   * and #next_paragraph_start are filled with the length of
   * #text (an index one off the end).
   *
   * @param text UTF-8 text
   * @param length Length of #text in bytes, or -1 if
   *   nul-terminated
   * @returns Return location for index of delimiter
   *
   *   Return location for start of next paragraph
   */
  function find_paragraph_boundary(
    text: string,
    length: number
  ): [paragraph_delimiter_index: number, next_paragraph_start: number];

  /**
   * Creates a new font description from a string representation.
   *
   * The string must have the form
   *
   *     "\[FAMILY-LIST] \[STYLE-OPTIONS] \[SIZE] \[VARIATIONS]",
   *
   * Where FAMILY-LIST is a comma-separated list of families
   * optionally terminated by a comma, STYLE_OPTIONS is a
   * whitespace-separated list of words where each word describes
   * one of style, variant, weight, stretch, or gravity, and SIZE
   * is a decimal number (size in points) or optionally followed
   * by the unit modifier "px" for absolute size. VARIATIONS is a
   * comma-separated list of font variation specifications of the
   * form "#axis=value" (the = sign is optional).
   *
   * The following words are understood as styles: "Normal",
   * "Roman", "Oblique", "Italic".
   *
   * The following words are understood as variants:
   * "Small-Caps".
   *
   * The following words are understood as weights: "Thin",
   * "Ultra-Light", "Extra-Light", "Light", "Semi-Light",
   * "Demi-Light", "Book", "Regular", "Medium", "Semi-Bold",
   * "Demi-Bold", "Bold", "Ultra-Bold", "Extra-Bold", "Heavy",
   * "Black", "Ultra-Black", "Extra-Black".
   *
   * The following words are understood as stretch values:
   * "Ultra-Condensed", "Extra-Condensed", "Condensed",
   * "Semi-Condensed", "Semi-Expanded", "Expanded",
   * "Extra-Expanded", "Ultra-Expanded".
   *
   * The following words are understood as gravity values:
   * "Not-Rotated", "South", "Upside-Down", "North",
   * "Rotated-Left", "East", "Rotated-Right", "West".
   *
   * Any one of the options may be absent. If FAMILY-LIST is
   * absent, then the family_name field of the resulting font
   * description will be initialized to %NULL. If STYLE-OPTIONS
   * is missing, then all style options will be set to the
   * default values. If SIZE is missing, the size in the
   * resulting font description will be set to 0.
   *
   * A typical example:
   *
   *     "Cantarell Italic Light 15 \#wght=200";
   *
   * @param str String representation of a font description.
   * @returns A new `PangoFontDescription`.
   */
  function font_description_from_string(str: string): FontDescription;

  /**
   * Computes a `PangoLogAttr` for each character in #text.
   *
   * The #log_attrs array must have one `PangoLogAttr` for each
   * position in #text; if #text contains N characters, it has
   * N+1 positions, including the last position at the end of the
   * text. #text should be an entire paragraph; logical
   * attributes can't be computed without context (for example
   * you need to see spaces on either side of a word to know the
   * word is a word).
   *
   * @param text Text to process. Must be valid UTF-8
   * @param length Length in bytes of #text
   * @param level Embedding level, or -1 if unknown
   * @param language Language tag
   * @param log_attrs Array with one `PangoLogAttr` per character
   *   in #text, plus one extra, to be filled in
   * @param attrs_len Length of #log_attrs array
   */
  function get_log_attrs(
    text: string,
    length: number,
    level: number,
    language: Language,
    log_attrs: LogAttr[],
    attrs_len: number
  ): void;

  /**
   * Returns the mirrored character of a Unicode character.
   *
   * Mirror characters are determined by the Unicode mirrored
   * property.
   *
   * @param ch A Unicode character
   * @param mirrored_ch Location to store the mirrored character
   * @returns %TRUE if #ch has a mirrored character and
   *   #mirrored_ch is filled in, %FALSE otherwise
   */
  function get_mirror_char(ch: string, mirrored_ch: string): boolean;

  /**
   * Finds the gravity that best matches the rotation component
   * in a `PangoMatrix`.
   *
   * @param matrix A `PangoMatrix`
   * @returns The gravity of #matrix, which will never be
   *   %PANGO_GRAVITY_AUTO, or %PANGO_GRAVITY_SOUTH if #matrix is
   *   %NULL
   */
  function gravity_get_for_matrix(matrix: Matrix | null): Gravity;

  /**
   * Returns the gravity to use in laying out a `PangoItem`.
   *
   * The gravity is determined based on the script, base gravity,
   * and hint.
   *
   * If #base_gravity is %PANGO_GRAVITY_AUTO, it is first
   * replaced with the preferred gravity of #script. To get the
   * preferred gravity of a script, pass %PANGO_GRAVITY_AUTO and
   * %PANGO_GRAVITY_HINT_STRONG in.
   *
   * @param script `PangoScript` to query
   * @param base_gravity Base gravity of the paragraph
   * @param hint Orientation hint
   * @returns Resolved gravity suitable to use for a run of text
   *   with #script
   */
  function gravity_get_for_script(
    script: Script,
    base_gravity: Gravity,
    hint: GravityHint
  ): Gravity;

  /**
   * Returns the gravity to use in laying out a single character
   * or `PangoItem`.
   *
   * The gravity is determined based on the script, East Asian
   * width, base gravity, and hint,
   *
   * This function is similar to
   * [func#Pango.Gravity.get_for_script] except that this
   * function makes a distinction between narrow/half-width and
   * wide/full-width characters also. Wide/full-width characters
   * always stand _upright_, that is, they always take the base
   * gravity, whereas narrow/full-width characters are always
   * rotated in vertical context.
   *
   * If #base_gravity is %PANGO_GRAVITY_AUTO, it is first
   * replaced with the preferred gravity of #script.
   *
   * @param script `PangoScript` to query
   * @param wide %TRUE for wide characters as returned by
   *   {@link G.unichar_iswide}
   * @param base_gravity Base gravity of the paragraph
   * @param hint Orientation hint
   * @returns Resolved gravity suitable to use for a run of text
   *   with #script and #wide.
   */
  function gravity_get_for_script_and_width(
    script: Script,
    wide: boolean,
    base_gravity: Gravity,
    hint: GravityHint
  ): Gravity;

  /**
   * Converts a `PangoGravity` value to its natural rotation in
   * radians.
   *
   * Note that [method#Pango.Matrix.rotate] takes angle in
   * degrees, not radians. So, to call
   * [method#Pango.Matrix,rotate] with the output of this
   * function you should multiply it by (180. / G_PI).
   *
   * @param gravity Gravity to query, should not be
   *   %PANGO_GRAVITY_AUTO
   * @returns The rotation value corresponding to #gravity.
   */
  function gravity_to_rotation(gravity: Gravity): number;

  /**
   * Checks if a character that should not be normally rendered.
   *
   * This includes all Unicode characters with "ZERO WIDTH" in
   * their name, as well as _bidi_ formatting characters, and a
   * few other ones. This is totally different from
   * {@link G.unichar_iszerowidth} and is at best misnamed.
   *
   * @param ch A Unicode character
   * @returns %TRUE if #ch is a zero-width character, %FALSE
   *   otherwise
   */
  function is_zero_width(ch: string): boolean;

  /**
   * Breaks a piece of text into segments with consistent
   * directional level and font.
   *
   * Each byte of #text will be contained in exactly one of the
   * items in the returned list; the generated list of items will
   * be in logical order (the start offsets of the items are
   * ascending).
   *
   * #cached_iter should be an iterator over #attrs currently
   * positioned at a range before or containing #start_index;
   * #cached_iter will be advanced to the range covering the
   * position just after #start_index + #length. (i.e. if
   * itemizing in a loop, just keep passing in the same
   * #cached_iter).
   *
   * @param context A structure holding information that affects
   *   the itemization process.
   * @param text The text to itemize. Must be valid UTF-8
   * @param start_index First byte in #text to process
   * @param length The number of bytes (not characters) to
   *   process after #start_index. This must be >= 0.
   * @param attrs The set of attributes that apply to #text.
   * @param cached_iter Cached attribute iterator
   * @returns A `GList` of [struct#Pango.Item] structures. The
   *   items should be freed using [method#Pango.Item.free]
   *   probably in combination with {@link G.list_free_full}.
   */
  function itemize(
    context: Context,
    text: string,
    start_index: number,
    length: number,
    attrs: AttrList,
    cached_iter: AttrIterator | null
  ): GLib.List;

  /**
   * Like {@link `pango.itemize}`, but with an explicitly
   * specified base direction.
   *
   * The base direction is used when computing bidirectional
   * levels. (see [method#Pango.Context.set_base_dir]).
   * [func#itemize] gets the base direction from the
   * `PangoContext`.
   *
   * @param context A structure holding information that affects
   *   the itemization process.
   * @param base_dir Base direction to use for bidirectional
   *   processing
   * @param text The text to itemize.
   * @param start_index First byte in #text to process
   * @param length The number of bytes (not characters) to
   *   process after #start_index. This must be >= 0.
   * @param attrs The set of attributes that apply to #text.
   * @param cached_iter Cached attribute iterator
   * @returns A `GList` of [struct#Pango.Item] structures. The
   *   items should be freed using [method#Pango.Item.free]
   *   probably in combination with {@link G.list_free_full}.
   */
  function itemize_with_base_dir(
    context: Context,
    base_dir: Direction,
    text: string,
    start_index: number,
    length: number,
    attrs: AttrList,
    cached_iter: AttrIterator | null
  ): GLib.List;

  /**
   * Convert a language tag to a `PangoLanguage`.
   *
   * The language tag must be in a RFC-3066 format.
   * `PangoLanguage` pointers can be efficiently copied (copy the
   * pointer) and compared with other language tags (compare the
   * pointer.)
   *
   * This function first canonicalizes the string by converting
   * it to lowercase, mapping '_' to '-', and stripping all
   * characters other than letters and '-'.
   *
   * Use [func#Pango.Language.get_default] if you want to get the
   * `PangoLanguage` for the current locale of the process.
   *
   * @param language A string representing a language tag
   * @returns A `PangoLanguage`
   */
  function language_from_string(language: string | null): Language | null;

  /**
   * Returns the `PangoLanguage` for the current locale of the
   * process.
   *
   * On Unix systems, this is the return value is derived from
   * `setlocale (LC_CTYPE, NULL)`, and the user can affect this
   * through the environment variables LC_ALL, LC_CTYPE or LANG
   * (checked in that order). The locale string typically is in
   * the form lang_COUNTRY, where lang is an ISO-639 language
   * code, and COUNTRY is an ISO-3166 country code. For instance,
   * sv_FI for Swedish as written in Finland or pt_BR for
   * Portuguese as written in Brazil.
   *
   * On Windows, the C library does not use any such environment
   * variables, and setting them won't affect the behavior of
   * functions like ctime(). The user sets the locale through the
   * Regional Options in the Control Panel. The C library (in the
   * setlocale() function) does not use country and language
   * codes, but country and language names spelled out in
   * English. However, this function does check the above
   * environment variables, and does return a Unix-style locale
   * string based on either said environment variables or the
   * thread's current locale.
   *
   * Your application should call `setlocale(LC_ALL, "")` for the
   * user settings to take effect. GTK does this in its
   * initialization functions automatically (by calling
   * gtk_set_locale()). See the setlocale() manpage for more
   * details.
   *
   * Note that the default language can change over the life of
   * an application.
   *
   * @returns The default language as a `PangoLanguage`
   */
  function language_get_default(): Language;

  /**
   * Returns the list of languages that the user prefers.
   *
   * The list is specified by the `PANGO_LANGUAGE` or `LANGUAGE`
   * environment variables, in order of preference. Note that
   * this list does not necessarily include the language returned
   * by [func#Pango.Language.get_default].
   *
   * When choosing language-specific resources, such as the
   * sample text returned by
   * [method#Pango.Language.get_sample_string], you should first
   * try the default language, followed by the languages returned
   * by this function.
   *
   * @returns A %NULL-terminated array of `PangoLanguage`*
   */
  function language_get_preferred(): Language | null;

  /**
   * Return the bidirectional embedding levels of the input
   * paragraph.
   *
   * The bidirectional embedding levels are defined by the
   * Unicode Bidirectional Algorithm available at:
   *
   * http://www.unicode.org/reports/tr9/
   *
   * If the input base direction is a weak direction, the
   * direction of the characters in the text will determine the
   * final resolved direction.
   *
   * @param text The text to itemize.
   * @param length The number of bytes (not characters) to
   *   process, or -1 if #text is nul-terminated and the length
   *   should be calculated.
   * @param pbase_dir Input base direction, and output resolved
   *   direction.
   * @returns A newly allocated array of embedding levels, one
   *   item per character (not byte), that should be freed using
   *   {@link G.free}.
   */
  function log2vis_get_embedding_levels(
    text: string,
    length: number,
    pbase_dir: Direction
  ): number;

  /**
   * Finishes parsing markup.
   *
   * After feeding a Pango markup parser some data with
   * {@link G.markup_parse_context_parse}, use this function to
   * get the list of attributes and text out of the markup. This
   * function will not free #context, use
   * g_markup_parse_context_free() to do so.
   *
   * @param context A valid parse context that was returned from
   *   [func#markup_parser_new]
   * @returns %FALSE if #error is set, otherwise %TRUE
   *
   *   Address of return location for a `PangoAttrList`
   *
   *   Address of return location for text with tags stripped
   *
   *   Address of return location for accelerator char
   */
  function markup_parser_finish(
    context: GLib.MarkupParseContext
  ): [boolean, AttrList | null, string | null, string | null];

  /**
   * Incrementally parses marked-up text to create a plain-text
   * string and an attribute list.
   *
   * See the [Pango Markup](pango_markup.html) docs for details
   * about the supported markup.
   *
   * If #accel_marker is nonzero, the given character will mark
   * the character following it as an accelerator. For example,
   * #accel_marker might be an ampersand or underscore. All
   * characters marked as an accelerator will receive a
   * %PANGO_UNDERLINE_LOW attribute, and the first character so
   * marked will be returned in #accel_char, when calling
   * [func#markup_parser_finish]. Two #accel_marker characters
   * following each other produce a single literal #accel_marker
   * character.
   *
   * To feed markup to the parser, use
   * {@link G.markup_parse_context_parse} on the returned
   * `GMarkupParseContext`. When done with feeding markup to the
   * parser, use [func#markup_parser_finish] to get the data out
   * of it, and then use g_markup_parse_context_free() to free
   * it.
   *
   * This function is designed for applications that read Pango
   * markup from streams. To simply parse a string containing
   * Pango markup, the [func#parse_markup] API is recommended
   * instead.
   *
   * @param accel_marker Character that precedes an accelerator,
   *   or 0 for none
   * @returns A `GMarkupParseContext` that should be destroyed
   *   with {@link G.markup_parse_context_free}.
   */
  function markup_parser_new(accel_marker: string): GLib.MarkupParseContext;

  /**
   * Parses an enum type and stores the result in #value.
   *
   * If #str does not match the nick name of any of the possible
   * values for the enum and is not an integer, %FALSE is
   * returned, a warning is issued if #warn is %TRUE, and a
   * string representing the list of possible values is stored in
   * #possible_values. The list is slash-separated, eg.
   * "none/start/middle/end".
   *
   * If failed and #possible_values is not %NULL, returned string
   * should be freed using {@link G.free}.
   *
   * @param type Enum type to parse, eg.
   *   %PANGO_TYPE_ELLIPSIZE_MODE
   * @param str String to parse
   * @param warn If %TRUE, issue a {@link G.warning} on bad input
   * @returns %TRUE if #str was successfully parsed
   *
   *   Integer to store the result in
   *
   *   Place to store list of possible values on failure
   */
  function parse_enum(
    type: GObject.Type,
    str: string | null,
    warn: boolean
  ): [boolean, number | null, string | null];

  /**
   * Parses marked-up text to create a plain-text string and an
   * attribute list.
   *
   * See the [Pango Markup](pango_markup.html) docs for details
   * about the supported markup.
   *
   * If #accel_marker is nonzero, the given character will mark
   * the character following it as an accelerator. For example,
   * #accel_marker might be an ampersand or underscore. All
   * characters marked as an accelerator will receive a
   * %PANGO_UNDERLINE_LOW attribute, and the first character so
   * marked will be returned in #accel_char. Two #accel_marker
   * characters following each other produce a single literal
   * #accel_marker character.
   *
   * To parse a stream of pango markup incrementally, use
   * [func#markup_parser_new].
   *
   * If any error happens, none of the output arguments are
   * touched except for #error.
   *
   * @param markup_text Markup to parse (see the Pango Markup
   *   docs)
   * @param length Length of #markup_text, or -1 if
   *   nul-terminated
   * @param accel_marker Character that precedes an accelerator,
   *   or 0 for none
   * @returns %FALSE if #error is set, otherwise %TRUE
   *
   *   Address of return location for a `PangoAttrList`
   *
   *   Address of return location for text with tags stripped
   *
   *   Address of return location for accelerator char
   */
  function parse_markup(
    markup_text: string,
    length: number,
    accel_marker: string
  ): [boolean, AttrList | null, string | null, string | null];

  /**
   * Parses a font stretch.
   *
   * The allowed values are "ultra_condensed", "extra_condensed",
   * "condensed", "semi_condensed", "normal", "semi_expanded",
   * "expanded", "extra_expanded" and "ultra_expanded". Case
   * variations are ignored and the '_' characters may be
   * omitted.
   *
   * @param str A string to parse.
   * @param warn If %TRUE, issue a {@link G.warning} on bad input.
   * @returns %TRUE if #str was successfully parsed.
   *
   *   A `PangoStretch` to store the result in.
   */
  function parse_stretch(str: string, warn: boolean): [boolean, Stretch];

  /**
   * Parses a font style.
   *
   * The allowed values are "normal", "italic" and "oblique",
   * case variations being ignored.
   *
   * @param str A string to parse.
   * @param warn If %TRUE, issue a {@link G.warning} on bad input.
   * @returns %TRUE if #str was successfully parsed.
   *
   *   A `PangoStyle` to store the result in.
   */
  function parse_style(str: string, warn: boolean): [boolean, Style];

  /**
   * Parses a font variant.
   *
   * The allowed values are "normal" and "smallcaps" or
   * "small_caps", case variations being ignored.
   *
   * @param str A string to parse.
   * @param warn If %TRUE, issue a {@link G.warning} on bad input.
   * @returns %TRUE if #str was successfully parsed.
   *
   *   A `PangoVariant` to store the result in.
   */
  function parse_variant(str: string, warn: boolean): [boolean, Variant];

  /**
   * Parses a font weight.
   *
   * The allowed values are "heavy", "ultrabold", "bold",
   * "normal", "light", "ultraleight" and integers. Case
   * variations are ignored.
   *
   * @param str A string to parse.
   * @param warn If %TRUE, issue a {@link G.warning} on bad input.
   * @returns %TRUE if #str was successfully parsed.
   *
   *   A `PangoWeight` to store the result in.
   */
  function parse_weight(str: string, warn: boolean): [boolean, Weight];

  /**
   * Quantizes the thickness and position of a line to whole
   * device pixels.
   *
   * This is typically used for underline or strikethrough. The
   * purpose of this function is to avoid such lines looking
   * blurry.
   *
   * Care is taken to make sure #thickness is at least one pixel
   * when this function returns, but returned #position may
   * become zero as a result of rounding.
   */
  function quantize_line_geometry(): void;

  /**
   * Reads an entire line from a file into a buffer.
   *
   * Lines may be delimited with '\n', '\r', '\n\r', or '\r\n'.
   * The delimiter is not written into the buffer. Text after a
   * '#' character is treated as a comment and skipped. '' can be
   * used to escape a # character. '' proceeding a line delimiter
   * combines adjacent lines. A '' proceeding any other character
   * is ignored and written into the output buffer unmodified.
   *
   * @param stream A stdio stream
   * @param str `GString` buffer into which to write the result
   * @returns 0 if the stream was already at an %EOF character,
   *   otherwise the number of lines read (this is useful for
   *   maintaining a line number counter which doesn't combine
   *   lines with '')
   */
  function read_line(stream: any | null, str: GLib.String): number;

  /**
   * Reorder items from logical order to visual order.
   *
   * The visual order is determined from the associated
   * directional levels of the items. The original list is
   * unmodified.
   *
   * (Please open a bug if you use this function. It is not a
   * particularly convenient interface, and the code is
   * duplicated elsewhere in Pango for that reason.)
   *
   * @param logical_items A `GList` of `PangoItem` in logical
   *   order.
   * @returns A `GList` of `PangoItem` structures in visual
   *   order.
   */
  function reorder_items(logical_items: GLib.List): GLib.List;

  /**
   * Scans an integer.
   *
   * Leading white space is skipped.
   *
   * @returns %FALSE if a parse error occurred
   *
   *   An int into which to write the result
   */
  function scan_int(): [boolean, number];

  /**
   * Scans a string into a `GString` buffer.
   *
   * The string may either be a sequence of non-white-space
   * characters, or a quoted string with '"'. Instead a quoted
   * string, '"' represents a literal quote. Leading white space
   * outside of quotes is skipped.
   *
   * @param out A `GString` into which to write the result
   * @returns %FALSE if a parse error occurred
   */
  function scan_string(out: GLib.String): boolean;

  /**
   * Scans a word into a `GString` buffer.
   *
   * A word consists of [A-Za-z_] followed by zero or more
   * [A-Za-z_0-9]. Leading white space is skipped.
   *
   * @param out A `GString` into which to write the result
   * @returns %FALSE if a parse error occurred
   */
  function scan_word(out: GLib.String): boolean;

  /**
   * Looks up the script for a particular character.
   *
   * The script of a character is defined by Unicode Standard
   * Annex #24. No check is made for #ch being a valid Unicode
   * character; if you pass in invalid character, the result is
   * undefined.
   *
   * Note that while the return type of this function is declared
   * as `PangoScript`, as of Pango 1.18, this function simply
   * returns the return value of {@link G.unichar_get_script}.
   * Callers must be prepared to handle unknown values.
   *
   * @param ch A Unicode character
   * @returns The `PangoScript` for the character.
   */
  function script_for_unichar(ch: string): Script;

  /**
   * Finds a language tag that is reasonably representative of
   * #script.
   *
   * The language will usually be the most widely spoken or used
   * language written in that script: for instance, the sample
   * language for %PANGO_SCRIPT_CYRILLIC is ru (Russian), the
   * sample language for %PANGO_SCRIPT_ARABIC is ar.
   *
   * For some scripts, no sample language will be returned
   * because there is no language that is sufficiently
   * representative. The best example of this is
   * %PANGO_SCRIPT_HAN, where various different variants of
   * written Chinese, Japanese, and Korean all use significantly
   * different sets of Han characters and forms of shared
   * characters. No sample language can be provided for many
   * historical scripts as well.
   *
   * As of 1.18, this function checks the environment variables
   * `PANGO_LANGUAGE` and `LANGUAGE` (checked in that order)
   * first. If one of them is set, it is parsed as a list of
   * language tags separated by colons or other separators. This
   * function will return the first language in the parsed list
   * that Pango believes may use #script for writing. This last
   * predicate is tested using
   * [method#Pango.Language.includes_script]. This can be used to
   * control Pango's font selection for non-primary languages.
   * For example, a `PANGO_LANGUAGE` enviroment variable set to
   * "en:fa" makes Pango choose fonts suitable for Persian (fa)
   * instead of Arabic (ar) when a segment of Arabic text is
   * found in an otherwise non-Arabic text. The same trick can be
   * used to choose a default language for %PANGO_SCRIPT_HAN when
   * setting context language is not feasible.
   *
   * @param script A `PangoScript`
   * @returns A `PangoLanguage` that is representative of the
   *   script
   */
  function script_get_sample_language(script: Script): Language | null;

  /**
   * Convert the characters in #text into glyphs.
   *
   * Given a segment of text and the corresponding
   * `PangoAnalysis` structure returned from [func#itemize],
   * convert the characters into glyphs. You may also pass in
   * only a substring of the item from [func#itemize].
   *
   * It is recommended that you use [func#shape_full] instead,
   * since that API allows for shaping interaction happening
   * across text item boundaries.
   *
   * Note that the extra attributes in the #analyis that is
   * returned from [func#itemize] have indices that are relative
   * to the entire paragraph, so you need to subtract the item
   * offset from their indices before calling [func#shape].
   *
   * @param text The text to process
   * @param length The length (in bytes) of #text
   * @param analysis `PangoAnalysis` structure from
   *   [func#itemize]
   * @param glyphs Glyph string in which to store results
   */
  function shape(
    text: string,
    length: number,
    analysis: Analysis,
    glyphs: GlyphString
  ): void;

  /**
   * Convert the characters in #text into glyphs.
   *
   * Given a segment of text and the corresponding
   * `PangoAnalysis` structure returned from [func#itemize],
   * convert the characters into glyphs. You may also pass in
   * only a substring of the item from [func#itemize].
   *
   * This is similar to [func#shape], except it also can
   * optionally take the full paragraph text as input, which will
   * then be used to perform certain cross-item shaping
   * interactions. If you have access to the broader text of
   * which #item_text is part of, provide the broader text as
   * #paragraph_text. If #paragraph_text is %NULL, item text is
   * used instead.
   *
   * Note that the extra attributes in the #analyis that is
   * returned from [func#itemize] have indices that are relative
   * to the entire paragraph, so you do not pass the full
   * paragraph text as #paragraph_text, you need to subtract the
   * item offset from their indices before calling
   * [func#shape_full].
   *
   * @param item_text Valid UTF-8 text to shape.
   * @param item_length The length (in bytes) of #item_text. -1
   *   means nul-terminated text.
   * @param paragraph_text Text of the paragraph (see details).
   *   May be %NULL.
   * @param paragraph_length The length (in bytes) of
   *   #paragraph_text. -1 means nul-terminated text.
   * @param analysis `PangoAnalysis` structure from
   *   [func#itemize].
   * @param glyphs Glyph string in which to store results.
   */
  function shape_full(
    item_text: string,
    item_length: number,
    paragraph_text: string | null,
    paragraph_length: number,
    analysis: Analysis,
    glyphs: GlyphString
  ): void;

  /**
   * Convert the characters in #text into glyphs.
   *
   * Given a segment of text and the corresponding
   * `PangoAnalysis` structure returned from [func#itemize],
   * convert the characters into glyphs. You may also pass in
   * only a substring of the item from [func#itemize].
   *
   * This is similar to [func#shape_full], except it also takes
   * flags that can influence the shaping process.
   *
   * Note that the extra attributes in the #analyis that is
   * returned from [func#itemize] have indices that are relative
   * to the entire paragraph, so you do not pass the full
   * paragraph text as #paragraph_text, you need to subtract the
   * item offset from their indices before calling
   * [func#shape_with_flags].
   *
   * @param item_text Valid UTF-8 text to shape
   * @param item_length The length (in bytes) of #item_text. -1
   *   means nul-terminated text.
   * @param paragraph_text Text of the paragraph (see details).
   *   May be %NULL.
   * @param paragraph_length The length (in bytes) of
   *   #paragraph_text. -1 means nul-terminated text.
   * @param analysis `PangoAnalysis` structure from
   *   [func#itemize]
   * @param glyphs Glyph string in which to store results
   * @param flags Flags influencing the shaping process
   */
  function shape_with_flags(
    item_text: string,
    item_length: number,
    paragraph_text: string | null,
    paragraph_length: number,
    analysis: Analysis,
    glyphs: GlyphString,
    flags: ShapeFlags
  ): void;

  /**
   * Skips 0 or more characters of white space.
   *
   * @returns %FALSE if skipping the white space leaves the
   *   position at a '\0' character.
   */
  function skip_space(): boolean;

  /**
   * Splits a %G_SEARCHPATH_SEPARATOR-separated list of files,
   * stripping white space and substituting ~/ with $HOME/.
   *
   * @param str A %G_SEARCHPATH_SEPARATOR separated list of
   *   filenames
   * @returns A list of strings to be freed with
   *   {@link G.strfreev}
   */
  function split_file_list(str: string): string[];

  /**
   * Apply language-specific tailoring to the breaks in
   * #log_attrs.
   *
   * The line breaks are assumed to have been produced by
   * [func#Pango.default_break].
   *
   * If #offset is not -1, it is used to apply attributes from
   * #analysis that are relevant to line breaking.
   *
   * @param text Text to process. Must be valid UTF-8
   * @param length Length in bytes of #text
   * @param analysis `PangoAnalysis` for #text
   * @param offset Byte offset of #text from the beginning of the
   *   paragraph, or -1 to ignore attributes from #analysis
   * @param log_attrs Array with one `PangoLogAttr` per character
   *   in #text, plus one extra, to be filled in
   * @param log_attrs_len Length of #log_attrs array
   */
  function tailor_break(
    text: string,
    length: number,
    analysis: Analysis,
    offset: number,
    log_attrs: LogAttr[],
    log_attrs_len: number
  ): void;

  /**
   * Trims leading and trailing whitespace from a string.
   *
   * @param str A string
   * @returns A newly-allocated string that must be freed with
   *   {@link G.free}
   */
  function trim_string(str: string): string;

  /**
   * Determines the inherent direction of a character.
   *
   * The inherent direction is either %PANGO_DIRECTION_LTR,
   * %PANGO_DIRECTION_RTL, or %PANGO_DIRECTION_NEUTRAL.
   *
   * This function is useful to categorize characters into
   * left-to-right letters, right-to-left letters, and everything
   * else. If full Unicode bidirectional type of a character is
   * needed, [func#Pango.BidiType.for_unichar] can be used
   * instead.
   *
   * @param ch A Unicode character
   * @returns The direction of the character.
   */
  function unichar_direction(ch: string): Direction;

  /**
   * Converts a floating-point number to Pango units.
   *
   * The conversion is done by multiplying #d by %PANGO_SCALE and
   * rounding the result to nearest integer.
   *
   * @param d Double floating-point value
   * @returns The value in Pango units.
   */
  function units_from_double(d: number): number;

  /**
   * Converts a number in Pango units to floating-point.
   *
   * The conversion is done by dividing #i by %PANGO_SCALE.
   *
   * @param i Value in Pango units
   * @returns The double value.
   */
  function units_to_double(i: number): number;

  /**
   * Returns the encoded version of Pango available at run-time.
   *
   * This is similar to the macro %PANGO_VERSION except that the
   * macro returns the encoded version available at compile-time.
   * A version number can be encoded into an integer using
   * {@link PANGO.VERSION_ENCODE}.
   *
   * @returns The encoded version of Pango library available at
   *   run time.
   */
  function version(): number;

  /**
   * Checks that the Pango library in use is compatible with the
   * given version.
   *
   * Generally you would pass in the constants
   * %PANGO_VERSION_MAJOR, %PANGO_VERSION_MINOR,
   * %PANGO_VERSION_MICRO as the three arguments to this
   * function; that produces a check that the library in use at
   * run-time is compatible with the version of Pango the
   * application or module was compiled against.
   *
   * Compatibility is defined by two things: first the version of
   * the running library is newer than the version
   * #required_major.required_minor.#required_micro. Second the
   * running library must be binary compatible with the version
   * #required_major.required_minor.#required_micro (same major
   * version.)
   *
   * For compile-time version checking use
   * {@link PANGO.VERSION_CHECK}.
   *
   * @param required_major The required major version
   * @param required_minor The required minor version
   * @param required_micro The required major version
   * @returns %NULL if the Pango library is compatible with the
   *   given version, or a string describing the version
   *   mismatch. The returned string is owned by Pango and should
   *   not be modified or freed.
   */
  function version_check(
    required_major: number,
    required_minor: number,
    required_micro: number
  ): string | null;

  /**
   * Returns the version of Pango available at run-time.
   *
   * This is similar to the macro %PANGO_VERSION_STRING except
   * that the macro returns the version available at
   * compile-time.
   *
   * @returns A string containing the version of Pango library
   *   available at run time. The returned string is owned by
   *   Pango and should not be modified or freed.
   */
  function version_string(): string;

  /**
   * Whether the segment should be shifted to center around the
   * baseline.
   *
   * This is mainly used in vertical writing directions.
   *
   * @returns Whether the segment should be shifted to center
   *   around the baseline.
   *
   *   This is mainly used in vertical writing directions.
   */
  const ANALYSIS_FLAG_CENTERED_BASELINE: number;

  /**
   * Whether this run holds ellipsized text.
   *
   * @returns Whether this run holds ellipsized text.
   */
  const ANALYSIS_FLAG_IS_ELLIPSIS: number;

  /**
   * Whether to add a hyphen at the end of the run during
   * shaping.
   *
   * @returns Whether to add a hyphen at the end of the run
   *   during shaping.
   */
  const ANALYSIS_FLAG_NEED_HYPHEN: number;

  /**
   * Value for #start_index in `PangoAttribute` that indicates
   * the beginning of the text.
   *
   * @returns Value for #start_index in `PangoAttribute` that
   *   indicates the beginning of the text.
   */
  const ATTR_INDEX_FROM_TEXT_BEGINNING: number;

  /**
   * Value for #end_index in `PangoAttribute` that indicates the
   * end of the text.
   *
   * @returns Value for #end_index in `PangoAttribute` that
   *   indicates the end of the text.
   */
  const ATTR_INDEX_TO_TEXT_END: number;

  /**
   * A `PangoGlyph` value that indicates a zero-width empty
   * glpyh.
   *
   * This is useful for example in shaper modules, to use as the
   * glyph for various zero-width Unicode characters (those
   * passing [func#is_zero_width]).
   *
   * @returns A `PangoGlyph` value that indicates a zero-width
   *   empty glpyh.
   *
   *   This is useful for example in shaper modules, to use as the
   *   glyph for various zero-width Unicode characters (those
   *   passing [func#is_zero_width]).
   */
  const GLYPH_EMPTY: Glyph;

  /**
   * A `PangoGlyph` value for invalid input.
   *
   * `PangoLayout` produces one such glyph per invalid input
   * UTF-8 byte and such a glyph is rendered as a crossed box.
   *
   * Note that this value is defined such that it has the
   * %PANGO_GLYPH_UNKNOWN_FLAG set.
   *
   * @returns A `PangoGlyph` value for invalid input.
   *
   *   `PangoLayout` produces one such glyph per invalid input
   *   UTF-8 byte and such a glyph is rendered as a crossed box.
   *
   *   Note that this value is defined such that it has the
   *   %PANGO_GLYPH_UNKNOWN_FLAG set.
   */
  const GLYPH_INVALID_INPUT: Glyph;

  /**
   * Flag used in `PangoGlyph` to turn a `gunichar` value of a
   * valid Unicode character into an unknown-character glyph for
   * that `gunichar`.
   *
   * Such unknown-character glyphs may be rendered as a 'hex
   * box'.
   *
   * @returns Flag used in `PangoGlyph` to turn a `gunichar`
   *   value of a valid Unicode character into an
   *   unknown-character glyph for that `gunichar`.
   *
   *   Such unknown-character glyphs may be rendered as a 'hex
   *   box'.
   */
  const GLYPH_UNKNOWN_FLAG: Glyph;

  /**
   * The scale between dimensions used for Pango distances and
   * device units.
   *
   * The definition of device units is dependent on the output
   * device; it will typically be pixels for a screen, and points
   * for a printer. %PANGO_SCALE is currently 1024, but this may
   * be changed in the future.
   *
   * When setting font sizes, device units are always considered
   * to be points (as in "12 point font"), rather than pixels.
   *
   * @returns The scale between dimensions used for Pango
   *   distances and device units.
   *
   *   The definition of device units is dependent on the output
   *   device; it will typically be pixels for a screen, and
   *   points for a printer. %PANGO_SCALE is currently 1024, but
   *   this may be changed in the future.
   *
   *   When setting font sizes, device units are always considered
   *   to be points (as in "12 point font"), rather than pixels.
   */
  const SCALE: number;

  /**
   * The major component of the version of Pango available at
   * compile-time.
   *
   * @returns The major component of the version of Pango
   *   available at compile-time.
   */
  const VERSION_MAJOR: number;

  /**
   * The micro component of the version of Pango available at
   * compile-time.
   *
   * @returns The micro component of the version of Pango
   *   available at compile-time.
   */
  const VERSION_MICRO: number;

  /**
   * The minor component of the version of Pango available at
   * compile-time.
   *
   * @returns The minor component of the version of Pango
   *   available at compile-time.
   */
  const VERSION_MINOR: number;

  /**
   * A string literal containing the version of Pango available
   * at compile-time.
   *
   * @returns A string literal containing the version of Pango
   *   available at compile-time.
   */
  const VERSION_STRING: string;
}
