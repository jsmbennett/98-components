/**
 * Desktop Demo - Demonstrates window management features
 */
import { windowManager } from '../../src/services/WindowManager.js';

let demoLaunched = false;

export function registerDesktopDemo(stage, clearStage, setActiveLink, desktop) {
  document.getElementById('nav-desktop-demo')?.addEventListener('click', (e) => {
    e.preventDefault();
    setActiveLink('nav-desktop-demo');
    clearStage();
    stage.innerHTML = '<p>Desktop demo windows have been launched on the desktop.</p>';

    launchDesktopDemo(desktop);
  });
}

function launchDesktopDemo(desktop) {
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
    `
  });

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
