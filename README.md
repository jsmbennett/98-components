# 98-components

A modern Windows 98 UI component library built with Web Components (ES2022), with 98.css as its only dependency.

## Quick Start

### Installation

```bash
npm install 98-components
# or
pnpm add 98-components
# or
yarn add 98-components
```

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import '98-components';
  </script>
</head>
<body>
  <win98-desktop>
    <win98-window 
      title="My First Window" 
      resizable
      style="top: 50px; left: 50px; width: 400px; height: 300px;">
      <div class="window-body">
        <p>Hello, Windows 98!</p>
      </div>
    </win98-window>

    <win98-taskbar slot="taskbar"></win98-taskbar>
  </win98-desktop>
</body>
</html>
```

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm run dev

# Build library
pnpm run build

# Build test page
pnpm run build:test
```


## License

MIT

## Acknowledgments

* [98.css](https://github.com/jdan/98.css)
