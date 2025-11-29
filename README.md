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


**Programmatic Window Creation:**

```javascript
const desktop = document.querySelector('win98-desktop');

desktop.createWindow({
  title: 'New Window',
  resizable: true,
  x: 100,
  y: 100,
  width: 400,
  height: 300,
  content: '<div class="window-body">Content here</div>'
});
```

**Helper Methods:**

```javascript
// Get window count
const count = desktop.getWindowCount();

// Get all windows
const windows = desktop.getAllWindows();

// Cascade windows (staggered arrangement)
desktop.cascadeWindows({
  startX: 50,
  startY: 50,
  offsetX: 30,
  offsetY: 30,
  width: 400,
  height: 300
});

// Tile windows (grid arrangement)
desktop.tileWindows({
  padding: 10
});
```

### Window

Draggable, resizable windows with title bar controls.

**Attributes:**
- `title` - Window title
- `resizable` - Enable resize handle
- `inactive` - Render as inactive
- `show-help` - Show help button
- `status-bar` - Show status bar
- `show-minimize` - Show minimize button (default: true)
- `show-maximize` - Show maximize button (default: true)

**Example:**

```html
<win98-window 
  title="Notepad" 
  resizable 
  status-bar
  style="top: 100px; left: 100px; width: 400px; height: 300px;">
  
  <div class="window-body">
    <textarea style="width: 100%; height: 100%;"></textarea>
  </div>
  
  <div slot="status">Ready</div>
</win98-window>
```

### Taskbar

Displays Start button, task buttons for open windows, and system clock.

```html
<win98-taskbar slot="taskbar"></win98-taskbar>
```

The taskbar automatically syncs with the WindowManager and updates when windows are opened, closed, minimized, or focused.

### Button

Windows 98 styled button component.

```html
<win98-button>Click Me</win98-button>
<win98-button default>OK</win98-button>
<win98-button disabled>Disabled</win98-button>
```

### Select

Custom dropdown/select component with Windows 98 styling.

```html
<win98-select name="options">
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
  <option value="3">Option 3</option>
</win98-select>
```

## WindowManager API

The WindowManager is a singleton service for managing window state.

```javascript
import { windowManager } from '98-components';

// Focus a window
windowManager.focus(windowId);

// Minimize a window
windowManager.minimize(windowId);

// Restore a minimized window
windowManager.restore(windowId);

// Get all windows
const windows = windowManager.getAllWindows();

// Listen to events
windowManager.addEventListener('window-focused', (e) => {
  console.log('Focused:', e.detail.title);
});
```

**Events:**
- `window-registered` - New window added
- `window-unregistered` - Window removed
- `window-focused` - Window gained focus
- `window-minimized` - Window minimized
- `window-restored` - Window restored
- `window-updated` - Window metadata changed

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
