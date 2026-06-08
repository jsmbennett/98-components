/**
 * Button component examples
 */

export function registerButtonExamples(stage, clearStage, setActiveLink) {
  // Basic Button
  document.getElementById('nav-button-basic')?.addEventListener('click', (e) => {
    e.preventDefault();
    setActiveLink('nav-button-basic');
    clearStage();

    const div = document.createElement('div');
    div.style.padding = '20px';
    div.innerHTML = `
      <win98-button>Click Me</win98-button>
      <p style="margin-top: 16px;">A standard button with default styling.</p>
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
      <p style="margin-top: 16px;">The default button has a darker border, indicating it's the primary action.</p>
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
      <p style="margin-top: 16px;">Disabled buttons have a washed-out appearance.</p>
    `;
    stage.appendChild(div);
  });
}
