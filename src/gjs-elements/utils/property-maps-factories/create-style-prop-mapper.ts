import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type { PropCaseCollector } from "../element-extenders/map-properties";
import { generateName } from "../generate-uid";

export const createStylePropMapper = (
  widget: Gtk.Widget,
  defaults?: StyleSheet
) => {
  const widgetClassName = generateName(16);
  const styleContext = widget.get_style_context();
  styleContext.add_class(widgetClassName);

  return (props: PropCaseCollector<keyof StyleProps, any>) =>
    props.style(DataType.RecordOf({}), (v) => {
      const finalStyles = v
        ? (Object.assign(defaults ?? {}, v) as any as StyleSheet)
        : defaults;

      if (finalStyles) {
        const { buffer, stylesheet } = stylesToData(
          finalStyles,
          widgetClassName
        );

        try {
          const provider = new Gtk.CssProvider();
          provider.load_from_data(buffer);

          styleContext.add_provider(
            provider,
            Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
          );

          return () => styleContext.remove_provider(provider);
        } catch (e) {
          console.error(stylesheet);
          throw new Error("Failed to apply the above CSS styles.");
        }
      }
    });
};

function pascalCaseToKebabCase(name: string): string {
  let kebabCase = "";

  // Loop through each character in the name
  for (let i = 0; i < name.length; i++) {
    // If the current character is uppercase, add a dash before it
    if (name[i] === name[i].toUpperCase()) {
      kebabCase += "-";
    }
    // Add the current character to the kebab case name
    kebabCase += name[i].toLowerCase();
  }

  return kebabCase;
}

function parseCssValue(value: CssPropertyValue) {
  if (typeof value === "number") {
    return `${value}pt`;
  }

  return value;
}

function parseCssRulesToString(styles: CssRules) {
  return Object.entries(styles)
    .map(
      ([name, value]) =>
        `${pascalCaseToKebabCase(name)}: ${parseCssValue(value)};`
    )
    .join("\n");
}

function parseToCss(styles: StyleSheet, className: string) {
  const mainRule = `.${className} {
    ${Object.entries(styles)
      .filter(
        (entry): entry is [string, string | number] => !entry[0].startsWith(":")
      )
      .map(
        ([name, value]) =>
          `${pascalCaseToKebabCase(name)}: ${parseCssValue(value)};`
      )
      .join("\n")}
}`;

  const rules = [mainRule];

  const hover = styles[":hover"];
  const active = styles[":active"];
  const focus = styles[":focus"];
  const disabled = styles[":disabled"];
  const selected = styles[":selected"];
  const checked = styles[":checked"];
  const indeterminate = styles[":indeterminate"];
  const backdrop = styles[":backdrop"];
  const link = styles[":link"];
  const visited = styles[":visited"];

  if (hover) {
    rules.push(
      `.${className}:hover {
        ${parseCssRulesToString(hover)}\n}`
    );
  }

  if (active) {
    rules.push(
      `.${className}:active {
        ${parseCssRulesToString(active)}\n}`
    );
  }

  if (focus) {
    rules.push(
      `.${className}:focus {
        ${parseCssRulesToString(focus)}\n}`
    );
  }

  if (disabled) {
    rules.push(
      `.${className}:disabled {
        ${parseCssRulesToString(disabled)}\n}`
    );
  }

  if (selected) {
    rules.push(
      `.${className}:selected {
        ${parseCssRulesToString(selected)}\n}`
    );
  }

  if (checked) {
    rules.push(
      `.${className}:checked {
        ${parseCssRulesToString(checked)}\n}`
    );
  }

  if (indeterminate) {
    rules.push(
      `.${className}:indeterminate {
        ${parseCssRulesToString(indeterminate)}\n}`
    );
  }

  if (backdrop) {
    rules.push(
      `.${className}:backdrop {
        ${parseCssRulesToString(backdrop)}\n}`
    );
  }

  if (link) {
    rules.push(
      `.${className}:link {
        ${parseCssRulesToString(link)}\n}`
    );
  }

  if (visited) {
    rules.push(
      `.${className}:visited {
        ${parseCssRulesToString(visited)}\n}`
    );
  }

  return rules.join("\n");
}

function stringToUint8Array(str: string): Uint8Array {
  const arr = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    arr[i] = str.charCodeAt(i);
  }
  return arr;
}

function stylesToData(styles: StyleSheet, className: string) {
  const css = parseToCss(styles, className);
  const data = stringToUint8Array(css);
  return { buffer: data, stylesheet: css };
}

export type CssPropertyValue = string | number;

export type StyleSheet = CssRules & {
  ":hover"?: CssRules;
  ":active"?: CssRules;
  ":focus"?: CssRules;
  ":disabled"?: CssRules;
  ":selected"?: CssRules;
  ":checked"?: CssRules;
  ":indeterminate"?: CssRules;
  ":backdrop"?: CssRules;
  ":link"?: CssRules;
  ":visited"?: CssRules;
};
export type StyleProps = { style?: StyleSheet };

export type CssRules = {
  accentColor?: CssPropertyValue;
  alignContent?: CssPropertyValue;
  alignItems?: CssPropertyValue;
  alignSelf?: CssPropertyValue;
  alignmentBaseline?: CssPropertyValue;
  all?: CssPropertyValue;
  animation?: CssPropertyValue;
  animationDelay?: CssPropertyValue;
  animationDelayEnd?: CssPropertyValue;
  animationDelayStart?: CssPropertyValue;
  animationDirection?: CssPropertyValue;
  animationDuration?: CssPropertyValue;
  animationFillMode?: CssPropertyValue;
  animationIterationCount?: CssPropertyValue;
  animationName?: CssPropertyValue;
  animationPlayState?: CssPropertyValue;
  animationRange?: CssPropertyValue;
  animationTimingFunction?: CssPropertyValue;
  appearance?: CssPropertyValue;
  aspectRatio?: CssPropertyValue;
  azimuth?: CssPropertyValue;
  backfaceVisibility?: CssPropertyValue;
  background?: CssPropertyValue;
  backgroundAttachment?: CssPropertyValue;
  backgroundBlendMode?: CssPropertyValue;
  backgroundClip?: CssPropertyValue;
  backgroundColor?: CssPropertyValue;
  backgroundImage?: CssPropertyValue;
  backgroundOrigin?: CssPropertyValue;
  backgroundPosition?: CssPropertyValue;
  backgroundRepeat?: CssPropertyValue;
  backgroundSize?: CssPropertyValue;
  baselineShift?: CssPropertyValue;
  baselineSource?: CssPropertyValue;
  blockEllipsis?: CssPropertyValue;
  blockSize?: CssPropertyValue;
  blockStep?: CssPropertyValue;
  blockStepAlign?: CssPropertyValue;
  blockStepInsert?: CssPropertyValue;
  blockStepRound?: CssPropertyValue;
  blockStepSize?: CssPropertyValue;
  bookmarkLabel?: CssPropertyValue;
  bookmarkLevel?: CssPropertyValue;
  bookmarkState?: CssPropertyValue;
  border?: CssPropertyValue;
  borderBlock?: CssPropertyValue;
  borderBlockColor?: CssPropertyValue;
  borderBlockEnd?: CssPropertyValue;
  borderBlockEndColor?: CssPropertyValue;
  borderBlockEndStyle?: CssPropertyValue;
  borderBlockEndWidth?: CssPropertyValue;
  borderBlockStart?: CssPropertyValue;
  borderBlockStartColor?: CssPropertyValue;
  borderBlockStartStyle?: CssPropertyValue;
  borderBlockStartWidth?: CssPropertyValue;
  borderBlockStyle?: CssPropertyValue;
  borderBlockWidth?: CssPropertyValue;
  borderBottom?: CssPropertyValue;
  borderBottomColor?: CssPropertyValue;
  borderBottomLeftRadius?: CssPropertyValue;
  borderBottomRightRadius?: CssPropertyValue;
  borderBottomStyle?: CssPropertyValue;
  borderBottomWidth?: CssPropertyValue;
  borderBoundary?: CssPropertyValue;
  borderCollapse?: CssPropertyValue;
  borderColor?: CssPropertyValue;
  borderEndEndRadius?: CssPropertyValue;
  borderEndStartRadius?: CssPropertyValue;
  borderImage?: CssPropertyValue;
  borderImageOutset?: CssPropertyValue;
  borderImageRepeat?: CssPropertyValue;
  borderImageSlice?: CssPropertyValue;
  borderImageSource?: CssPropertyValue;
  borderImageWidth?: CssPropertyValue;
  borderInline?: CssPropertyValue;
  borderInlineColor?: CssPropertyValue;
  borderInlineEnd?: CssPropertyValue;
  borderInlineEndColor?: CssPropertyValue;
  borderInlineEndStyle?: CssPropertyValue;
  borderInlineEndWidth?: CssPropertyValue;
  borderInlineStart?: CssPropertyValue;
  borderInlineStartColor?: CssPropertyValue;
  borderInlineStartStyle?: CssPropertyValue;
  borderInlineStartWidth?: CssPropertyValue;
  borderInlineStyle?: CssPropertyValue;
  borderInlineWidth?: CssPropertyValue;
  borderLeft?: CssPropertyValue;
  borderLeftColor?: CssPropertyValue;
  borderLeftStyle?: CssPropertyValue;
  borderLeftWidth?: CssPropertyValue;
  borderRadius?: CssPropertyValue;
  borderRight?: CssPropertyValue;
  borderRightColor?: CssPropertyValue;
  borderRightStyle?: CssPropertyValue;
  borderRightWidth?: CssPropertyValue;
  borderSpacing?: CssPropertyValue;
  borderStartEndRadius?: CssPropertyValue;
  borderStartStartRadius?: CssPropertyValue;
  borderStyle?: CssPropertyValue;
  borderTop?: CssPropertyValue;
  borderTopColor?: CssPropertyValue;
  borderTopLeftRadius?: CssPropertyValue;
  borderTopRightRadius?: CssPropertyValue;
  borderTopStyle?: CssPropertyValue;
  borderTopWidth?: CssPropertyValue;
  borderWidth?: CssPropertyValue;
  bottom?: CssPropertyValue;
  boxDecorationBreak?: CssPropertyValue;
  boxShadow?: CssPropertyValue;
  boxSizing?: CssPropertyValue;
  boxSnap?: CssPropertyValue;
  breakAfter?: CssPropertyValue;
  breakBefore?: CssPropertyValue;
  breakInside?: CssPropertyValue;
  captionSide?: CssPropertyValue;
  caret?: CssPropertyValue;
  caretColor?: CssPropertyValue;
  caretShape?: CssPropertyValue;
  chains?: CssPropertyValue;
  clear?: CssPropertyValue;
  clip?: CssPropertyValue;
  clipPath?: CssPropertyValue;
  clipRule?: CssPropertyValue;
  color?: CssPropertyValue;
  colorAdjust?: CssPropertyValue;
  colorInterpolationFilters?: CssPropertyValue;
  colorScheme?: CssPropertyValue;
  columnCount?: CssPropertyValue;
  columnFill?: CssPropertyValue;
  columnGap?: CssPropertyValue;
  columnRule?: CssPropertyValue;
  columnRuleColor?: CssPropertyValue;
  columnRuleStyle?: CssPropertyValue;
  columnRuleWidth?: CssPropertyValue;
  columnSpan?: CssPropertyValue;
  columnWidth?: CssPropertyValue;
  columns?: CssPropertyValue;
  contain?: CssPropertyValue;
  containIntrinsicBlockSize?: CssPropertyValue;
  containIntrinsicHeight?: CssPropertyValue;
  containIntrinsicInlineSize?: CssPropertyValue;
  containIntrinsicSize?: CssPropertyValue;
  containIntrinsicWidth?: CssPropertyValue;
  container?: CssPropertyValue;
  containerName?: CssPropertyValue;
  containerType?: CssPropertyValue;
  content?: CssPropertyValue;
  contentVisibility?: CssPropertyValue;
  continue?: CssPropertyValue;
  counterIncrement?: CssPropertyValue;
  counterReset?: CssPropertyValue;
  counterSet?: CssPropertyValue;
  cue?: CssPropertyValue;
  cueAfter?: CssPropertyValue;
  cueBefore?: CssPropertyValue;
  cursor?: CssPropertyValue;
  direction?: CssPropertyValue;
  display?: CssPropertyValue;
  dominantBaseline?: CssPropertyValue;
  elevation?: CssPropertyValue;
  emptyCells?: CssPropertyValue;
  fill?: CssPropertyValue;
  fillBreak?: CssPropertyValue;
  fillColor?: CssPropertyValue;
  fillImage?: CssPropertyValue;
  fillOpacity?: CssPropertyValue;
  fillOrigin?: CssPropertyValue;
  fillPosition?: CssPropertyValue;
  fillRepeat?: CssPropertyValue;
  fillRule?: CssPropertyValue;
  fillSize?: CssPropertyValue;
  filter?: CssPropertyValue;
  flex?: CssPropertyValue;
  flexBasis?: CssPropertyValue;
  flexDirection?: CssPropertyValue;
  flexFlow?: CssPropertyValue;
  flexGrow?: CssPropertyValue;
  flexShrink?: CssPropertyValue;
  flexWrap?: CssPropertyValue;
  float?: CssPropertyValue;
  floatDefer?: CssPropertyValue;
  floatOffset?: CssPropertyValue;
  floatReference?: CssPropertyValue;
  floodColor?: CssPropertyValue;
  floodOpacity?: CssPropertyValue;
  flow?: CssPropertyValue;
  flowFrom?: CssPropertyValue;
  flowInto?: CssPropertyValue;
  font?: CssPropertyValue;
  fontFamily?: CssPropertyValue;
  fontFeatureSettings?: CssPropertyValue;
  fontKerning?: CssPropertyValue;
  fontLanguageOverride?: CssPropertyValue;
  fontOpticalSizing?: CssPropertyValue;
  fontPalette?: CssPropertyValue;
  fontSize?: CssPropertyValue;
  fontSizeAdjust?: CssPropertyValue;
  fontStretch?: CssPropertyValue;
  fontStyle?: CssPropertyValue;
  fontSynthesis?: CssPropertyValue;
  fontSynthesisSmallCaps?: CssPropertyValue;
  fontSynthesisStyle?: CssPropertyValue;
  fontSynthesisWeight?: CssPropertyValue;
  fontVariant?: CssPropertyValue;
  fontVariantAlternates?: CssPropertyValue;
  fontVariantCaps?: CssPropertyValue;
  fontVariantEastAsian?: CssPropertyValue;
  fontVariantEmoji?: CssPropertyValue;
  fontVariantLigatures?: CssPropertyValue;
  fontVariantNumeric?: CssPropertyValue;
  fontVariantPosition?: CssPropertyValue;
  fontVariationSettings?: CssPropertyValue;
  fontWeight?: CssPropertyValue;
  footnoteDisplay?: CssPropertyValue;
  footnotePolicy?: CssPropertyValue;
  forcedColorAdjust?: CssPropertyValue;
  gap?: CssPropertyValue;
  glyphOrientationVertical?: CssPropertyValue;
  grid?: CssPropertyValue;
  gridArea?: CssPropertyValue;
  gridAutoColumns?: CssPropertyValue;
  gridAutoFlow?: CssPropertyValue;
  gridAutoRows?: CssPropertyValue;
  gridColumn?: CssPropertyValue;
  gridColumnEnd?: CssPropertyValue;
  gridColumnStart?: CssPropertyValue;
  gridRow?: CssPropertyValue;
  gridRowEnd?: CssPropertyValue;
  gridRowStart?: CssPropertyValue;
  gridTemplate?: CssPropertyValue;
  gridTemplateAreas?: CssPropertyValue;
  gridTemplateColumns?: CssPropertyValue;
  gridTemplateRows?: CssPropertyValue;
  hangingPunctuation?: CssPropertyValue;
  height?: CssPropertyValue;
  hyphenateCharacter?: CssPropertyValue;
  hyphenateLimitChars?: CssPropertyValue;
  hyphenateLimitLast?: CssPropertyValue;
  hyphenateLimitLines?: CssPropertyValue;
  hyphenateLimitZone?: CssPropertyValue;
  hyphens?: CssPropertyValue;
  imageOrientation?: CssPropertyValue;
  imageRendering?: CssPropertyValue;
  imageResolution?: CssPropertyValue;
  initialLetter?: CssPropertyValue;
  initialLetterAlign?: CssPropertyValue;
  initialLetterWrap?: CssPropertyValue;
  inlineSize?: CssPropertyValue;
  inlineSizing?: CssPropertyValue;
  inset?: CssPropertyValue;
  insetBlock?: CssPropertyValue;
  insetBlockEnd?: CssPropertyValue;
  insetBlockStart?: CssPropertyValue;
  insetInline?: CssPropertyValue;
  insetInlineEnd?: CssPropertyValue;
  insetInlineStart?: CssPropertyValue;
  isolation?: CssPropertyValue;
  justifyContent?: CssPropertyValue;
  justifyItems?: CssPropertyValue;
  justifySelf?: CssPropertyValue;
  leadingTrim?: CssPropertyValue;
  left?: CssPropertyValue;
  letterSpacing?: CssPropertyValue;
  lightingColor?: CssPropertyValue;
  lineBreak?: CssPropertyValue;
  lineClamp?: CssPropertyValue;
  lineGrid?: CssPropertyValue;
  lineHeight?: CssPropertyValue;
  lineHeightStep?: CssPropertyValue;
  linePadding?: CssPropertyValue;
  lineSnap?: CssPropertyValue;
  listStyle?: CssPropertyValue;
  listStyleImage?: CssPropertyValue;
  listStylePosition?: CssPropertyValue;
  listStyleType?: CssPropertyValue;
  margin?: CssPropertyValue;
  marginBlock?: CssPropertyValue;
  marginBlockEnd?: CssPropertyValue;
  marginBlockStart?: CssPropertyValue;
  marginBottom?: CssPropertyValue;
  marginBreak?: CssPropertyValue;
  marginInline?: CssPropertyValue;
  marginInlineEnd?: CssPropertyValue;
  marginInlineStart?: CssPropertyValue;
  marginLeft?: CssPropertyValue;
  marginRight?: CssPropertyValue;
  marginTop?: CssPropertyValue;
  marginTrim?: CssPropertyValue;
  marker?: CssPropertyValue;
  markerEnd?: CssPropertyValue;
  markerKnockoutLeft?: CssPropertyValue;
  markerKnockoutRight?: CssPropertyValue;
  markerMid?: CssPropertyValue;
  markerPattern?: CssPropertyValue;
  markerSegment?: CssPropertyValue;
  markerSide?: CssPropertyValue;
  markerStart?: CssPropertyValue;
  mask?: CssPropertyValue;
  maskBorder?: CssPropertyValue;
  maskBorderMode?: CssPropertyValue;
  maskBorderOutset?: CssPropertyValue;
  maskBorderRepeat?: CssPropertyValue;
  maskBorderSlice?: CssPropertyValue;
  maskBorderSource?: CssPropertyValue;
  maskBorderWidth?: CssPropertyValue;
  maskClip?: CssPropertyValue;
  maskComposite?: CssPropertyValue;
  maskImage?: CssPropertyValue;
  maskMode?: CssPropertyValue;
  maskOrigin?: CssPropertyValue;
  maskPosition?: CssPropertyValue;
  maskRepeat?: CssPropertyValue;
  maskSize?: CssPropertyValue;
  maskType?: CssPropertyValue;
  maxBlockSize?: CssPropertyValue;
  maxHeight?: CssPropertyValue;
  maxInlineSize?: CssPropertyValue;
  maxLines?: CssPropertyValue;
  maxWidth?: CssPropertyValue;
  minBlockSize?: CssPropertyValue;
  minHeight?: CssPropertyValue;
  minInlineSize?: CssPropertyValue;
  minIntrinsicSizing?: CssPropertyValue;
  minWidth?: CssPropertyValue;
  mixBlendMode?: CssPropertyValue;
  navDown?: CssPropertyValue;
  navLeft?: CssPropertyValue;
  navRight?: CssPropertyValue;
  navUp?: CssPropertyValue;
  objectFit?: CssPropertyValue;
  objectPosition?: CssPropertyValue;
  offset?: CssPropertyValue;
  offsetAnchor?: CssPropertyValue;
  offsetDistance?: CssPropertyValue;
  offsetPath?: CssPropertyValue;
  offsetPosition?: CssPropertyValue;
  offsetRotate?: CssPropertyValue;
  opacity?: CssPropertyValue;
  order?: CssPropertyValue;
  orphans?: CssPropertyValue;
  outline?: CssPropertyValue;
  outlineColor?: CssPropertyValue;
  outlineOffset?: CssPropertyValue;
  outlineStyle?: CssPropertyValue;
  outlineWidth?: CssPropertyValue;
  overflow?: CssPropertyValue;
  overflowAnchor?: CssPropertyValue;
  overflowBlock?: CssPropertyValue;
  overflowClipMargin?: CssPropertyValue;
  overflowInline?: CssPropertyValue;
  overflowWrap?: CssPropertyValue;
  overflowX?: CssPropertyValue;
  overflowY?: CssPropertyValue;
  overscrollBehavior?: CssPropertyValue;
  overscrollBehaviorBlock?: CssPropertyValue;
  overscrollBehaviorInline?: CssPropertyValue;
  overscrollBehaviorX?: CssPropertyValue;
  overscrollBehaviorY?: CssPropertyValue;
  padding?: CssPropertyValue;
  paddingBlock?: CssPropertyValue;
  paddingBlockEnd?: CssPropertyValue;
  paddingBlockStart?: CssPropertyValue;
  paddingBottom?: CssPropertyValue;
  paddingInline?: CssPropertyValue;
  paddingInlineEnd?: CssPropertyValue;
  paddingInlineStart?: CssPropertyValue;
  paddingLeft?: CssPropertyValue;
  paddingRight?: CssPropertyValue;
  paddingTop?: CssPropertyValue;
  page?: CssPropertyValue;
  pageBreakAfter?: CssPropertyValue;
  pageBreakBefore?: CssPropertyValue;
  pageBreakInside?: CssPropertyValue;
  pause?: CssPropertyValue;
  pauseAfter?: CssPropertyValue;
  pauseBefore?: CssPropertyValue;
  perspective?: CssPropertyValue;
  perspectiveOrigin?: CssPropertyValue;
  pitch?: CssPropertyValue;
  pitchRange?: CssPropertyValue;
  placeContent?: CssPropertyValue;
  placeItems?: CssPropertyValue;
  placeSelf?: CssPropertyValue;
  playDuring?: CssPropertyValue;
  position?: CssPropertyValue;
  printColorAdjust?: CssPropertyValue;
  quotes?: CssPropertyValue;
  regionFragment?: CssPropertyValue;
  resize?: CssPropertyValue;
  rest?: CssPropertyValue;
  restAfter?: CssPropertyValue;
  restBefore?: CssPropertyValue;
  richness?: CssPropertyValue;
  right?: CssPropertyValue;
  rotate?: CssPropertyValue;
  rowGap?: CssPropertyValue;
  rubyAlign?: CssPropertyValue;
  rubyMerge?: CssPropertyValue;
  rubyOverhang?: CssPropertyValue;
  rubyPosition?: CssPropertyValue;
  running?: CssPropertyValue;
  scale?: CssPropertyValue;
  scrollBehavior?: CssPropertyValue;
  scrollMargin?: CssPropertyValue;
  scrollMarginBlock?: CssPropertyValue;
  scrollMarginBlockEnd?: CssPropertyValue;
  scrollMarginBlockStart?: CssPropertyValue;
  scrollMarginBottom?: CssPropertyValue;
  scrollMarginInline?: CssPropertyValue;
  scrollMarginInlineEnd?: CssPropertyValue;
  scrollMarginInlineStart?: CssPropertyValue;
  scrollMarginLeft?: CssPropertyValue;
  scrollMarginRight?: CssPropertyValue;
  scrollMarginTop?: CssPropertyValue;
  scrollPadding?: CssPropertyValue;
  scrollPaddingBlock?: CssPropertyValue;
  scrollPaddingBlockEnd?: CssPropertyValue;
  scrollPaddingBlockStart?: CssPropertyValue;
  scrollPaddingBottom?: CssPropertyValue;
  scrollPaddingInline?: CssPropertyValue;
  scrollPaddingInlineEnd?: CssPropertyValue;
  scrollPaddingInlineStart?: CssPropertyValue;
  scrollPaddingLeft?: CssPropertyValue;
  scrollPaddingRight?: CssPropertyValue;
  scrollPaddingTop?: CssPropertyValue;
  scrollSnapAlign?: CssPropertyValue;
  scrollSnapStop?: CssPropertyValue;
  scrollSnapType?: CssPropertyValue;
  scrollTimeline?: CssPropertyValue;
  scrollTimelineAxis?: CssPropertyValue;
  scrollTimelineName?: CssPropertyValue;
  scrollbarColor?: CssPropertyValue;
  scrollbarGutter?: CssPropertyValue;
  scrollbarWidth?: CssPropertyValue;
  shapeImageThreshold?: CssPropertyValue;
  shapeInside?: CssPropertyValue;
  shapeMargin?: CssPropertyValue;
  shapeOutside?: CssPropertyValue;
  spatialNavigationAction?: CssPropertyValue;
  spatialNavigationContain?: CssPropertyValue;
  spatialNavigationFunction?: CssPropertyValue;
  speak?: CssPropertyValue;
  speakAs?: CssPropertyValue;
  speakHeader?: CssPropertyValue;
  speakNumeral?: CssPropertyValue;
  speakPunctuation?: CssPropertyValue;
  speechRate?: CssPropertyValue;
  stress?: CssPropertyValue;
  stringSet?: CssPropertyValue;
  stroke?: CssPropertyValue;
  strokeAlign?: CssPropertyValue;
  strokeAlignment?: CssPropertyValue;
  strokeBreak?: CssPropertyValue;
  strokeColor?: CssPropertyValue;
  strokeDashCorner?: CssPropertyValue;
  strokeDashJustify?: CssPropertyValue;
  strokeDashadjust?: CssPropertyValue;
  strokeDasharray?: CssPropertyValue;
  strokeDashcorner?: CssPropertyValue;
  strokeDashoffset?: CssPropertyValue;
  strokeImage?: CssPropertyValue;
  strokeLinecap?: CssPropertyValue;
  strokeLinejoin?: CssPropertyValue;
  strokeMiterlimit?: CssPropertyValue;
  strokeOpacity?: CssPropertyValue;
  strokeOrigin?: CssPropertyValue;
  strokePosition?: CssPropertyValue;
  strokeRepeat?: CssPropertyValue;
  strokeSize?: CssPropertyValue;
  strokeWidth?: CssPropertyValue;
  tabSize?: CssPropertyValue;
  tableLayout?: CssPropertyValue;
  textAlign?: CssPropertyValue;
  textAlignAll?: CssPropertyValue;
  textAlignLast?: CssPropertyValue;
  textCombineUpright?: CssPropertyValue;
  textDecoration?: CssPropertyValue;
  textDecorationColor?: CssPropertyValue;
  textDecorationLine?: CssPropertyValue;
  textDecorationSkip?: CssPropertyValue;
  textDecorationSkipBox?: CssPropertyValue;
  textDecorationSkipInk?: CssPropertyValue;
  textDecorationSkipInset?: CssPropertyValue;
  textDecorationSkipSelf?: CssPropertyValue;
  textDecorationSkipSpaces?: CssPropertyValue;
  textDecorationStyle?: CssPropertyValue;
  textDecorationThickness?: CssPropertyValue;
  textEdge?: CssPropertyValue;
  textEmphasis?: CssPropertyValue;
  textEmphasisColor?: CssPropertyValue;
  textEmphasisPosition?: CssPropertyValue;
  textEmphasisSkip?: CssPropertyValue;
  textEmphasisStyle?: CssPropertyValue;
  textGroupAlign?: CssPropertyValue;
  textIndent?: CssPropertyValue;
  textJustify?: CssPropertyValue;
  textOrientation?: CssPropertyValue;
  textOverflow?: CssPropertyValue;
  textShadow?: CssPropertyValue;
  textSpaceCollapse?: CssPropertyValue;
  textSpaceTrim?: CssPropertyValue;
  textSpacing?: CssPropertyValue;
  textTransform?: CssPropertyValue;
  textUnderlineOffset?: CssPropertyValue;
  textUnderlinePosition?: CssPropertyValue;
  textWrap?: CssPropertyValue;
  top?: CssPropertyValue;
  transform?: CssPropertyValue;
  transformBox?: CssPropertyValue;
  transformOrigin?: CssPropertyValue;
  transformStyle?: CssPropertyValue;
  transition?: CssPropertyValue;
  transitionDelay?: CssPropertyValue;
  transitionDuration?: CssPropertyValue;
  transitionProperty?: CssPropertyValue;
  transitionTimingFunction?: CssPropertyValue;
  translate?: CssPropertyValue;
  unicodeBidi?: CssPropertyValue;
  userSelect?: CssPropertyValue;
  verticalAlign?: CssPropertyValue;
  viewTimeline?: CssPropertyValue;
  viewTimelineAxis?: CssPropertyValue;
  viewTimelineInset?: CssPropertyValue;
  viewTimelineName?: CssPropertyValue;
  viewTransitionName?: CssPropertyValue;
  visibility?: CssPropertyValue;
  voiceBalance?: CssPropertyValue;
  voiceDuration?: CssPropertyValue;
  voiceFamily?: CssPropertyValue;
  voicePitch?: CssPropertyValue;
  voiceRange?: CssPropertyValue;
  voiceRate?: CssPropertyValue;
  voiceStress?: CssPropertyValue;
  voiceVolume?: CssPropertyValue;
  volume?: CssPropertyValue;
  whiteSpace?: CssPropertyValue;
  widows?: CssPropertyValue;
  width?: CssPropertyValue;
  willChange?: CssPropertyValue;
  wordBoundaryDetection?: CssPropertyValue;
  wordBoundaryExpansion?: CssPropertyValue;
  wordBreak?: CssPropertyValue;
  wordSpacing?: CssPropertyValue;
  wordWrap?: CssPropertyValue;
  wrapAfter?: CssPropertyValue;
  wrapBefore?: CssPropertyValue;
  wrapFlow?: CssPropertyValue;
  wrapInside?: CssPropertyValue;
  wrapThrough?: CssPropertyValue;
  writingMode?: CssPropertyValue;
  zIndex?: CssPropertyValue;
};
