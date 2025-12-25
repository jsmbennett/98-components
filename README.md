# 98-components

A modern Windows 98 UI component library built with Web Components (ES2022), with 98.css as its only dependency. This project started as a sub-project of another project but I got a little carried away. The goals are:

1) Build off the work of 98.css to provide specific interactable components beyond simple CSS styling: A Desktop, basic window management, start menu, and more.
2) Learn how to build something (even if badly) using pure modern browser APIs (no React, Vue, etc).
3) Provide a subset of a Windows 98 desktop experience as accurately as possible.

To see it in action, visit the [demo](https://jsmbennett.github.io/98-components/).

## Quick Start

### Installation

```bash
npm install 98-components
# or
pnpm add 98-components
# or
yarn add 98-components
```

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm run dev

# Build library
pnpm run build

# Build test page (Github Pages)
pnpm run build:test
```


## License

MIT

## Acknowledgments

* [98.css](https://github.com/jdan/98.css)
