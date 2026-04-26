type FontSource = {
  family: string;
  url: string;
  format: "truetype" | "opentype" | "woff" | "woff2";
  weight: string;
  style: "normal" | "italic";
};

type FontDefinition = {
  labelKey: string;
  value: string;
  aliases: string[];
  sources: FontSource[];
};

export type LocalFontFormat = "truetype" | "opentype" | "woff" | "woff2";

export type LocalFontDefinition = {
  family: string;
  dataUrl: string;
  format: LocalFontFormat;
};

export const DEFAULT_FONT_FAMILY = "\"Alibaba PuHuiTi\", sans-serif";

const FONT_DEFINITIONS: FontDefinition[] = [
  {
    labelKey: "alibaba",
    value: DEFAULT_FONT_FAMILY,
    aliases: [
      "Alibaba PuHuiTi, sans-serif",
      "\"Alibaba PuHuiTi\", sans-serif"
    ],
    sources: [
      {
        family: "Alibaba PuHuiTi",
        url: "/fonts/AlibabaPuHuiTi-3-55-Regular.ttf",
        format: "truetype",
        weight: "400",
        style: "normal"
      },
      {
        family: "Alibaba PuHuiTi",
        url: "/fonts/AlibabaPuHuiTi-3-85-Bold.ttf",
        format: "truetype",
        weight: "700",
        style: "normal"
      }
    ]
  },
  {
    labelKey: "misans",
    value: "\"MiSans\", sans-serif",
    aliases: [
      "\"MiSans\", \"Microsoft YaHei\", \"微软雅黑\", sans-serif",
      "\"Microsoft YaHei\", \"微软雅黑\", sans-serif",
      "\"Microsoft YaHei Local\", \"Microsoft YaHei\", \"微软雅黑\", sans-serif",
      "\"MiSans\", sans-serif",
      "MiSans, sans-serif",
      "Microsoft YaHei, sans-serif"
    ],
    sources: [
      {
        family: "MiSans",
        url: "/fonts/MiSans-Normal.ttf",
        format: "truetype",
        weight: "400",
        style: "normal"
      },
      {
        family: "MiSans",
        url: "/fonts/MiSans-Bold.ttf",
        format: "truetype",
        weight: "700",
        style: "normal"
      }
    ]
  },
  {
    labelKey: "notosanssc",
    value: "\"Noto Sans SC\", \"Noto Sans CJK SC\", sans-serif",
    aliases: [
      "\"Noto Sans SC\", \"Noto Sans CJK SC\", sans-serif",
      "Noto Sans SC, sans-serif"
    ],
    sources: [
      {
        family: "Noto Sans SC",
        url: "/fonts/NotoSansSC-Regular.otf",
        format: "opentype",
        weight: "400",
        style: "normal"
      },
      {
        family: "Noto Sans SC",
        url: "/fonts/NotoSansSC-Medium.otf",
        format: "opentype",
        weight: "500",
        style: "normal"
      },
      {
        family: "Noto Sans SC",
        url: "/fonts/NotoSansSC-Bold.otf",
        format: "opentype",
        weight: "700",
        style: "normal"
      }
    ]
  },
  {
    labelKey: "sourcehanserifsc",
    value: "\"Source Han Serif SC\", \"Noto Serif SC\", serif",
    aliases: [
      "\"Source Han Serif SC\", \"Noto Serif SC\", serif",
      "\"Noto Serif SC\", \"Source Han Serif SC\", serif",
      "Source Han Serif SC, serif",
      "Noto Serif SC, serif"
    ],
    sources: [
      {
        family: "Source Han Serif SC",
        url: "/fonts/SourceHanSerifSC-Regular.otf",
        format: "opentype",
        weight: "400",
        style: "normal"
      },
      {
        family: "Source Han Serif SC",
        url: "/fonts/SourceHanSerifSC-Medium.otf",
        format: "opentype",
        weight: "500",
        style: "normal"
      },
      {
        family: "Source Han Serif SC",
        url: "/fonts/SourceHanSerifSC-Bold.otf",
        format: "opentype",
        weight: "700",
        style: "normal"
      }
    ]
  },
  {
    labelKey: "nanumgothic",
    value: "\"Nanum Gothic\", sans-serif",
    aliases: [
      "\"Nanum Gothic\", sans-serif",
      "Nanum Gothic, sans-serif"
    ],
    sources: [
      {
        family: "Nanum Gothic",
        url: "/fonts/NANUMGOTHIC.TTF",
        format: "truetype",
        weight: "400",
        style: "normal"
      },
      {
        family: "Nanum Gothic",
        url: "/fonts/NANUMGOTHICBOLD.TTF",
        format: "truetype",
        weight: "700",
        style: "normal"
      }
    ]
  },
  {
    labelKey: "nanummyeongjo",
    value: "\"Nanum Myeongjo\", serif",
    aliases: [
      "\"Nanum Myeongjo\", serif",
      "Nanum Myeongjo, serif"
    ],
    sources: [
      {
        family: "Nanum Myeongjo",
        url: "/fonts/NANUMMYEONGJO.TTF",
        format: "truetype",
        weight: "400",
        style: "normal"
      },
      {
        family: "Nanum Myeongjo",
        url: "/fonts/NANUMMYEONGJOBOLD.TTF",
        format: "truetype",
        weight: "700",
        style: "normal"
      }
    ]
  },
  {
    labelKey: "notosanskr",
    value: "\"Noto Sans KR\", sans-serif",
    aliases: [
      "\"Noto Sans KR\", sans-serif",
      "Noto Sans KR, sans-serif"
    ],
    sources: [
      {
        family: "Noto Sans KR",
        url: "/fonts/NOTOSANSKR-VF.TTF",
        format: "truetype",
        weight: "400",
        style: "normal"
      },
      {
        family: "Noto Sans KR",
        url: "/fonts/NOTOSANSKR-VF.TTF",
        format: "truetype",
        weight: "700",
        style: "normal"
      }
    ]
  },
  {
    labelKey: "pretendard",
    value: "\"Pretendard\", sans-serif",
    aliases: [
      "\"Pretendard\", sans-serif",
      "Pretendard, sans-serif"
    ],
    sources: [
      {
        family: "Pretendard",
        url: "/fonts/Pretendard-Regular.ttf",
        format: "truetype",
        weight: "400",
        style: "normal"
      },
      {
        family: "Pretendard",
        url: "/fonts/Pretendard-Bold.ttf",
        format: "truetype",
        weight: "700",
        style: "normal"
      }
    ]
  }
];

const fontDataUrlCache = new Map<string, Promise<string>>();

const toDataUrl = async (url: string) => {
  if (!fontDataUrlCache.has(url)) {
    fontDataUrlCache.set(
      url,
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to load font: ${url}`);
          }
          return response.blob();
        })
        .then(
          (blob) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = () => reject(new Error(`Failed to read font: ${url}`));
              reader.readAsDataURL(blob);
            })
        )
    );
  }

  return fontDataUrlCache.get(url)!;
};

const findFontDefinition = (fontFamily?: string) => {
  const normalizedValue = fontFamily?.trim();
  if (!normalizedValue) {
    return FONT_DEFINITIONS[0];
  }

  return FONT_DEFINITIONS.find(
    (definition) =>
      definition.value === normalizedValue ||
      definition.aliases.includes(normalizedValue) ||
      definition.aliases.some((alias) =>
        normalizedValue.includes(alias.replace(/"/g, ""))
      )
  );
};

const buildFontFaceRule = (source: FontSource, resolvedUrl: string) => `@font-face {
  font-family: "${source.family}";
  src: url("${resolvedUrl}") format("${source.format}");
  font-weight: ${source.weight};
  font-style: ${source.style};
  font-display: swap;
}`;

const buildLocalFontFaceRule = (localFont: LocalFontDefinition) => `@font-face {
  font-family: "${localFont.family}";
  src: url("${localFont.dataUrl}") format("${localFont.format}");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}`;

export const normalizeFontFamily = (fontFamily?: string) =>
  findFontDefinition(fontFamily)?.value || fontFamily?.trim() || DEFAULT_FONT_FAMILY;

export const getFontOptions = (t: (key: string) => string) =>
  FONT_DEFINITIONS.map((definition) => ({
    value: definition.value,
    label: t(definition.labelKey)
  }));

export const getFontFaceCss = async (
  fontFamily?: string,
  inline = false,
  localFont?: LocalFontDefinition
) => {
  const normalizedValue = fontFamily?.trim();
  if (localFont && fontFamily?.includes(localFont.family)) {
    return buildLocalFontFaceRule(localFont);
  }

  const definition = findFontDefinition(normalizedValue);
  if (!definition) {
    return "";
  }

  const rules = await Promise.all(
    definition.sources.map(async (source) => {
      const resolvedUrl = inline ? await toDataUrl(source.url) : source.url;
      return buildFontFaceRule(source, resolvedUrl);
    })
  );

  return rules.join("\n");
};
