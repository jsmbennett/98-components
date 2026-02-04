/**
 * Window component examples
 */

export function registerWindowExamples(stage, clearStage, setActiveLink) {
  // Basic Window
  document.getElementById('nav-window-basic')?.addEventListener('click', (e) => {
    e.preventDefault();
    setActiveLink('nav-window-basic');
    clearStage();

    const win = document.createElement('win98-window');
    win.setAttribute('title', 'Basic Window');
    win.setAttribute('no-drag', '');
    win.style.position = 'relative';
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
}
