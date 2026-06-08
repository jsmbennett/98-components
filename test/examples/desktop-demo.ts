/**
 * Desktop Demo - Demonstrates window management features
 */
import { windowManager } from '../../src/services/WindowManager';

let demoLaunched: boolean = false;

export function registerDesktopDemo(
  stage: HTMLElement,
  clearStage: () => void,
  setActiveLink: (id: string) => void,
  desktop: HTMLElement
): void {
  document.getElementById('nav-desktop-demo')?.addEventListener('click', (e: Event) => {
    e.preventDefault();
    setActiveLink('nav-desktop-demo');
    clearStage();
    stage.innerHTML = '<p>Desktop demo windows have been launched on the desktop.</p>';

    launchDesktopDemo(desktop);
  });
}

function launchDesktopDemo(desktop: HTMLElement): void {
  if (demoLaunched) return;
  demoLaunched = true;

  // Notepad
  (desktop as any).createWindow({
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
  const controlPanel = (desktop as any).createWindow({
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

  let windowCounter: number = 1;

  const createWindowBtn = controlPanel.querySelector('#create-window-btn') as HTMLElement | null;
  createWindowBtn?.addEventListener('click', () => {
    const offset = windowCounter * 30;
    (desktop as any).createWindow({
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

  const createDialogBtn = controlPanel.querySelector('#create-dialog-btn') as HTMLElement | null;
  createDialogBtn?.addEventListener('click', () => {
    const offset = windowCounter * 20;
    (desktop as any).createWindow({
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
  const windowCountSpan = controlPanel.querySelector('#window-count') as HTMLElement | null;
  const updateWindowCount = (): void => {
    if (windowCountSpan) {
      windowCountSpan.textContent = (desktop as any).getWindowCount();
    }
  };
  windowManager.addEventListener('window-registered', updateWindowCount);
  windowManager.addEventListener('window-unregistered', updateWindowCount);
  updateWindowCount();
}
