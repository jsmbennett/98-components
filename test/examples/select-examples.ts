/**
 * Select/Dropdown component examples
 */

export function registerSelectExamples(
  stage: HTMLElement,
  clearStage: () => void,
  setActiveLink: (id: string) => void
): void {
  // Select / Dropdown
  document.getElementById('nav-select')?.addEventListener('click', (e: Event) => {
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

    const form = div.querySelector('#demo-form') as HTMLFormElement;
    const select = div.querySelector('win98-select') as HTMLElement;
    const output = div.querySelector('#select-output') as HTMLElement;
    const formOutput = div.querySelector('#form-output') as HTMLElement;

    select.addEventListener('change', (e: any) => {
      output.textContent = `Selected: Option ${e.detail.value} (Index: ${e.detail.index})`;
    });

    form.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      const formData = new FormData(form);
      const value = formData.get('demo-select');
      formOutput.textContent = `Form Submitted! Value: ${value}`;
    });

    stage.appendChild(div);
  });
}
