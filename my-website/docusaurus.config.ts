import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import type * as OpenApiPlugin from "docusaurus-plugin-openapi-docs";
import fs from "fs";
import path from "path";

// Путь к папке с OpenAPI спецификациями
const API_SPEC_DIR = path.join(__dirname, "specs");
const OUTPUT_DIR = "docs/open-api"; // Где будут генерироваться MDX

// Рекурсивно сканируем папку specs и строим config
function buildApiConfig(
  dirPath: string,
  basePath: string = ""
): Record<string, OpenApiPlugin.Options> {
  const config: Record<string, OpenApiPlugin.Options> = {};
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    const relativePath = basePath ? `${basePath}/${file}` : file;

    if (stats.isDirectory()) {
      // Рекурсивно обрабатываем подпапки
      Object.assign(config, buildApiConfig(filePath, relativePath));
    } else if (file.endsWith(".yaml") || file.endsWith(".yml")) {
      // Нашли OpenAPI-файл — добавляем в config
      const outputSubDir = path.dirname(relativePath);
      const outputBase =
        outputSubDir === "." ? OUTPUT_DIR : `${OUTPUT_DIR}/${outputSubDir}`;
      const fileName = path.basename(file, path.extname(file));

      config[`${relativePath}#${fileName}`] = {
        specPath: `specs/${relativePath}`,
        outputDir: `${outputBase}/${fileName}`,
        sidebarOptions: {
          groupPathsBy: "tag",
        },
      };
    }
  }

  return config;
}

// Генерируем конфиг для плагина
const openApiConfig = fs.existsSync(API_SPEC_DIR)
  ? buildApiConfig(API_SPEC_DIR)
  : {};

// Проверяем, есть ли хотя бы один API
if (Object.keys(openApiConfig).length === 0) {
  console.warn(
    "⚠️ Не найдено ни одного OpenAPI-файла в папке 'specs/'. Проверьте путь и расширения (.yaml, .yml)."
  );
}

const config: Config = {
  title: "My Site",
  tagline: "Dinosaurs are cool",
  favicon: "img/favicon.ico",

  future: {
    v4: true,
  },

  url: "https://your-docusaurus-site.example.com",
  baseUrl: "/",

  organizationName: "facebook",
  projectName: "docusaurus",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          docItemComponent: "@theme/ApiItem",
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      "docusaurus-plugin-openapi-docs",
      {
        id: "api",
        docsPluginId: "classic",
        config: openApiConfig, // ✅ Автоматически сгенерированный config
      },
    ],
  ],
  themes: ["docusaurus-theme-openapi-docs"],

  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "My Site",
      logo: {
        alt: "My Site Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Tutorial",
        },
        { to: "/blog", label: "Blog", position: "left" },
        {
          href: "https://github.com/facebook/docusaurus",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Tutorial",
              to: "/docs/intro",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/docusaurus",
            },
            {
              label: "Discord",
              href: "https://discordapp.com/invite/docusaurus",
            },
            {
              label: "X",
              href: "https://x.com/docusaurus",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/facebook/docusaurus",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
