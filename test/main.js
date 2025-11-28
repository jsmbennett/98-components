import '98.css';
import '../src/index.js';

console.log('98-components frontend loaded');

const stage = document.getElementById('desktop-stage');

function clearStage() {
    stage.innerHTML = '';
}

// Basic Window
document.getElementById('nav-window-basic')?.addEventListener('click', (e) => {
    e.preventDefault();
    clearStage();

    const win = document.createElement('win98-window');
    win.setAttribute('title', 'Basic Window');
    win.style.top = '50px';
    win.style.left = '300px';
    win.style.width = '300px';
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
    clearStage();

    const win = document.createElement('win98-window');
    win.setAttribute('title', 'Resizable Window');
    win.setAttribute('resizable', '');
    win.style.top = '50px';
    win.style.left = '300px';
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
    clearStage();

    const win = document.createElement('win98-window');
    win.setAttribute('title', 'Window with Status Bar');
    win.setAttribute('resizable', '');
    win.setAttribute('status-bar', '');
    win.style.top = '50px';
    win.style.left = '300px';
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
    clearStage();

    const win = document.createElement('win98-window');
    win.setAttribute('title', 'Inactive Window');
    win.setAttribute('inactive', '');
    win.style.top = '50px';
    win.style.left = '300px';
    win.style.width = '300px';
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
    clearStage();

    const win = document.createElement('win98-window');
    win.setAttribute('title', 'Help Window');
    win.setAttribute('show-help', '');
    win.style.top = '50px';
    win.style.left = '300px';
    win.style.width = '300px';
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
    clearStage();

    const win = document.createElement('win98-window');
    win.setAttribute('title', 'Basic Button');
    win.style.top = '50px';
    win.style.left = '300px';
    win.style.width = '300px';
    win.innerHTML = `
    <div style="padding: 16px; text-align: center;">
      <win98-button>Click Me</win98-button>
      <p style="margin-top: 16px; font-size: 12px;">A standard button with default styling.</p>
    </div>
  `;

    win.querySelector('win98-button').addEventListener('button-click', () => {
        alert('Button clicked!');
    });

    stage.appendChild(win);
});

// Default Button
document.getElementById('nav-button-default')?.addEventListener('click', (e) => {
    e.preventDefault();
    clearStage();

    const win = document.createElement('win98-window');
    win.setAttribute('title', 'Default Button');
    win.style.top = '50px';
    win.style.left = '300px';
    win.style.width = '300px';
    win.innerHTML = `
    <div style="padding: 16px; text-align: center;">
      <win98-button default>OK</win98-button>
      <win98-button style="margin-left: 8px;">Cancel</win98-button>
      <p style="margin-top: 16px; font-size: 12px;">The default button has a darker border, indicating it's the primary action.</p>
    </div>
  `;

    stage.appendChild(win);
});

// Disabled Button
document.getElementById('nav-button-disabled')?.addEventListener('click', (e) => {
    e.preventDefault();
    clearStage();

    const win = document.createElement('win98-window');
    win.setAttribute('title', 'Disabled Button');
    win.style.top = '50px';
    win.style.left = '300px';
    win.style.width = '300px';
    win.innerHTML = `
    <div style="padding: 16px; text-align: center;">
      <win98-button disabled>I cannot be clicked</win98-button>
      <p style="margin-top: 16px; font-size: 12px;">Disabled buttons have a washed-out appearance.</p>
    </div>
  `;

    stage.appendChild(win);
});

// Load Basic Button by default
document.getElementById('nav-button-basic')?.click();
