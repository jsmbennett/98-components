import '../src/index.js';
import { windowManager } from '../src/services/WindowManager.js';

const stage = document.getElementById('example-stage');
const desktop = document.querySelector('win98-desktop');

function clearStage() {
  stage.innerHTML = '';
}

function setActiveLink(id) {
  document.querySelectorAll('.tree-view a').forEach(a => a.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
}

// --- Component Examples ---

// Basic Window
document.getElementById('nav-window-basic')?.addEventListener('click', (e) => {
  e.preventDefault();
  setActiveLink('nav-window-basic');
  clearStage();

  const win = document.createElement('win98-window');
  win.setAttribute('title', 'Basic Window');
  win.setAttribute('no-drag', ''); // Disable dragging inside the library
  win.style.position = 'relative'; // Make it flow in the container
  win.style.width = '300px';
  win.style.height = '200px';
  win.innerHTML = `
    <div style="padding: 16px;">
      <p>A basic window with all default controls.</p>
    </div>
  `;
  stage.appendChild(win);
});

// Resizable Window
document.getElementById('nav-window-resizable')?.addEventListener('click', (e) => {
  e.preventDefault();
  setActiveLink('nav-window-resizable');
  clearStage();

  const win = document.createElement('win98-window');
  win.setAttribute('title', 'Resizable Window');
  win.setAttribute('resizable', '');
  win.setAttribute('no-drag', '');
  win.style.position = 'relative';
  win.style.width = '300px';
  win.style.height = '200px';
  win.innerHTML = `
    <div style="padding: 16px;">
      <p>This window can be resized by dragging the bottom-right corner.</p>
    </div>
  `;
  stage.appendChild(win);
});

// Window with Status Bar
document.getElementById('nav-window-status')?.addEventListener('click', (e) => {
  e.preventDefault();
  setActiveLink('nav-window-status');
  clearStage();

  const win = document.createElement('win98-window');
  win.setAttribute('title', 'Window with Status Bar');
  win.setAttribute('resizable', '');
  win.setAttribute('status-bar', '');
  win.setAttribute('no-drag', '');
  win.style.position = 'relative';
  win.style.width = '320px';
  win.style.height = '250px';
  win.innerHTML = `
    <div style="padding: 16px;">
      <p>This window has a status bar at the bottom.</p>
      <p>You can add multiple status fields using slotted content.</p>
    </div>
    <p slot="status" class="status-bar-field">Ready</p>
    <p slot="status" class="status-bar-field">CPU: 14%</p>
  `;
  stage.appendChild(win);
});

// Inactive Window
document.getElementById('nav-window-inactive')?.addEventListener('click', (e) => {
  e.preventDefault();
  setActiveLink('nav-window-inactive');
  clearStage();

  const win = document.createElement('win98-window');
  win.setAttribute('title', 'Inactive Window');
  win.setAttribute('inactive', '');
  win.setAttribute('no-drag', '');
  win.style.position = 'relative';
  win.style.width = '300px';
  win.style.height = '200px';
  win.innerHTML = `
    <div style="padding: 16px;">
      <p>This window appears inactive/unfocused.</p>
      <p>Notice the grayed-out title bar.</p>
    </div>
  `;
  stage.appendChild(win);
});

// Help Button Window
document.getElementById('nav-window-help')?.addEventListener('click', (e) => {
  e.preventDefault();
  setActiveLink('nav-window-help');
  clearStage();

  const win = document.createElement('win98-window');
  win.setAttribute('title', 'Help Window');
  win.setAttribute('show-help', '');
  win.setAttribute('no-drag', '');
  win.style.position = 'relative';
  win.style.width = '300px';
  win.style.height = '200px';
  win.innerHTML = `
    <div style="padding: 16px;">
      <p>This window has a Help button (?) instead of Minimize.</p>
      <p>Common in dialog boxes and help windows.</p>
    </div>
  `;
  win.addEventListener('window-help', () => {
    alert('Help button clicked!');
  });
  stage.appendChild(win);
});

// Basic Button
document.getElementById('nav-button-basic')?.addEventListener('click', (e) => {
  e.preventDefault();
  setActiveLink('nav-button-basic');
  clearStage();

  const div = document.createElement('div');
  div.style.padding = '20px';
  div.innerHTML = `
      <win98-button>Click Me</win98-button>
      <p style="margin-top: 16px; ">A standard button with default styling.</p>
  `;
  div.querySelector('win98-button').addEventListener('button-click', () => {
    alert('Button clicked!');
  });
  stage.appendChild(div);
});

// Default Button
document.getElementById('nav-button-default')?.addEventListener('click', (e) => {
  e.preventDefault();
  setActiveLink('nav-button-default');
  clearStage();

  const div = document.createElement('div');
  div.style.padding = '20px';
  div.innerHTML = `
      <win98-button default>OK</win98-button>
      <win98-button style="margin-left: 8px;">Cancel</win98-button>
      <p style="margin-top: 16px; ">The default button has a darker border, indicating it's the primary action.</p>
  `;
  stage.appendChild(div);
});

// Disabled Button
document.getElementById('nav-button-disabled')?.addEventListener('click', (e) => {
  e.preventDefault();
  setActiveLink('nav-button-disabled');
  clearStage();

  const div = document.createElement('div');
  div.style.padding = '20px';
  div.innerHTML = `
      <win98-button disabled>I cannot be clicked</win98-button>
      <p style="margin-top: 16px; ">Disabled buttons have a washed-out appearance.</p>
  `;
  stage.appendChild(div);
});

// Select / Dropdown
document.getElementById('nav-select')?.addEventListener('click', (e) => {
  e.preventDefault();
  setActiveLink('nav-select');
  clearStage();

  const div = document.createElement('div');
  div.style.padding = '20px';
  div.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px; width: 300px;">
      <form id="demo-form">
        <label style="display: block; margin-bottom: 4px;">Choose an option:</label>
        <win98-select name="demo-select" id="select-demo">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
          <option value="4">Option 4</option>
          <option value="5">Option 5</option>
        </win98-select>
        <div style="margin-top: 16px;">
          <win98-button type="submit">Submit Form</win98-button>
        </div>
      </form>
      <p>Custom &lt;win98-select&gt; component with fully styled dropdown.</p>
      <p id="select-output">Selected: Option 1</p>
      <p id="form-output" style="color: blue;"></p>
    </div>
  `;

  const form = div.querySelector('#demo-form');
  const select = div.querySelector('win98-select');
  const output = div.querySelector('#select-output');
  const formOutput = div.querySelector('#form-output');

  select.addEventListener('change', (e) => {
    output.textContent = `Selected: Option ${e.detail.value} (Index: ${e.detail.index})`;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const value = formData.get('demo-select');
    formOutput.textContent = `Form Submitted! Value: ${value}`;
  });

  stage.appendChild(div);
});


// Start Menu
document.getElementById('nav-start-menu')?.addEventListener('click', (e) => {
  e.preventDefault();
  setActiveLink('nav-start-menu');
  clearStage();

  const div = document.createElement('div');
  div.style.height = '400px';
  div.style.position = 'relative';

  div.innerHTML = `
      <p>The Start Menu component with slotted content.</p>
      <win98-start-menu visible style="position: absolute; top: 50px; left: 20px; z-index: auto;">
        <win98-menu-item label="Windows Update" large></win98-menu-item>
        <win98-menu-separator></win98-menu-separator>
        <win98-menu-item label="Programs" large>
            <div slot="submenu">
                <win98-menu-item label="Accessories">
                    <div slot="submenu">
                        <win98-menu-item label="Calculator"></win98-menu-item>
                        <win98-menu-item label="Notepad"></win98-menu-item>
                    </div>
                </win98-menu-item>
                <win98-menu-item label="MS-DOS Prompt"></win98-menu-item>
            </div>
        </win98-menu-item>
        <win98-menu-item label="Favorites" large></win98-menu-item>
        <win98-menu-item label="Documents" large></win98-menu-item>
        <win98-menu-item label="Settings" large></win98-menu-item>
        <win98-menu-item label="Find" large></win98-menu-item>
        <win98-menu-item label="Help" large></win98-menu-item>
        <win98-menu-item label="Run..." large></win98-menu-item>
        <win98-menu-separator></win98-menu-separator>
        <win98-menu-item label="Log Off..." large></win98-menu-item>
        <win98-menu-item label="Shut Down..." large></win98-menu-item>
      </win98-start-menu>
  `;
  stage.appendChild(div);
});


// --- Desktop Demo Integration ---

document.getElementById('nav-desktop-demo')?.addEventListener('click', (e) => {
  e.preventDefault();
  setActiveLink('nav-desktop-demo');
  clearStage();
  stage.innerHTML = '<p>Desktop demo windows have been launched on the desktop.</p>';

  launchDesktopDemo();
});

let demoLaunched = false;
function launchDesktopDemo() {
  if (demoLaunched) return;
  demoLaunched = true;

  // Notepad
  desktop.createWindow({
    title: 'Notepad',
    resizable: true,
    statusBar: true,
    x: 500,
    y: 100,
    width: 450,
    height: 350,
    content: `
        <textarea style="width: 100%; height: 100%; resize: none;">Welcome to Notepad!</textarea>
        `
  });

  // Window Creator
  const controlPanel = desktop.createWindow({
    title: 'Window Creator',
    x: 200,
    y: 150,
    width: 320,
    height: 120,
    content: `
          <p><strong>Window Management:</strong></p>
          <button id="create-window-btn">Create New Window</button>
          <button id="create-dialog-btn">Create Dialog</button>
          <p>
              Open windows: <span id="window-count">0</span>
          </p>
=        `
  });

  // Wire up Control Panel buttons
  // Note: We need to wait for the window to be in DOM or just use event delegation if possible, 
  // but since we have the element, we can query inside it.

  let windowCounter = 1;

  const createWindowBtn = controlPanel.querySelector('#create-window-btn');
  createWindowBtn?.addEventListener('click', () => {
    const offset = windowCounter * 30;
    desktop.createWindow({
      title: `New Window ${windowCounter}`,
      resizable: true,
      x: 100 + offset,
      y: 100 + offset,
      width: 350,
      height: 250,
      content: `
              <p><strong>Window ${windowCounter}</strong></p>
              <p>This window was created programmatically.</p>
              <button onclick="this.closest('win98-window').remove()">Close This Window</button>
            `
    });
    windowCounter++;
  });

  const createDialogBtn = controlPanel.querySelector('#create-dialog-btn');
  createDialogBtn?.addEventListener('click', () => {
    const offset = windowCounter * 20;
    desktop.createWindow({
      title: 'Information',
      x: 300 + offset,
      y: 200 + offset,
      width: 300,
      height: 150,
      showMinimize: false,
      showMaximize: false,
      content: `
              <div class="window-body">
                <p>This is a dialog window.</p>
                <div style="text-align: center; margin-top: 20px;">
                  <button onclick="this.closest('win98-window').remove()">OK</button>
                </div>
              </div>
            `
    });
    windowCounter++;
  });

  const cascadeBtn = controlPanel.querySelector('#cascade-btn');
  cascadeBtn?.addEventListener('click', () => {
    desktop.cascadeWindows();
  });

  const tileBtn = controlPanel.querySelector('#tile-btn');
  tileBtn?.addEventListener('click', () => {
    desktop.tileWindows();
  });

  // Update window count
  const windowCountSpan = controlPanel.querySelector('#window-count');
  function updateWindowCount() {
    if (windowCountSpan) {
      windowCountSpan.textContent = desktop.getWindowCount();
    }
  }
  windowManager.addEventListener('window-registered', updateWindowCount);
  windowManager.addEventListener('window-unregistered', updateWindowCount);
  updateWindowCount();
}
