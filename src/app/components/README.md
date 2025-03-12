# Components

Any components/directives which are not a page should be here.

When some components/directives are only used for specific page, create directory with page name and put them in there.

For example,

```
app/
├ components/
│ ├ common/
│ │ └ header/
│ │   ├ header.component.html
│ │   ├ header.component.scss
│ │   └ header.component.ts
| └ pages/ # Directory to contain page specific components
│   └ main-page/ # Directory for components that are only used for `main-page`
│     └ banner/
│       ├ banner.component.html
│       ├ banner.component.scss
│       └ banner.component.ts
└ pages/
  └ main-page/
    ├ main-page.component.html
    ├ main-page.component.scss
    └ main-page.component.ts
```
