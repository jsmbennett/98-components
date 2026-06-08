/**
 * Start Menu component example
 * 
 * This example demonstrates using the icon-name attribute
 * with the iconRegistry for declarative icon assignment.
 */

export function registerStartMenuExample(stage, clearStage, setActiveLink) {
  document.getElementById('nav-start-menu')?.addEventListener('click', (e) => {
    e.preventDefault();
    setActiveLink('nav-start-menu');
    clearStage();

    const div = document.createElement('div');
    div.style.height = '500px';
    div.style.position = 'relative';

    // Using icon-name attribute with registry (declarative approach)
    div.innerHTML = `
      <p>The Start Menu component with slotted content.</p>
      <p style="font-size: 11px; color: #666;">
        Icons are assigned using the <code>icon-name</code> attribute with the iconRegistry.
      </p>
      <win98-start-menu visible style="position: absolute; top: 70px; left: 20px; z-index: auto;">
        <win98-menu-item icon-name="windowsUpdateSmall" label="Windows Update" large></win98-menu-item>
        <win98-menu-separator></win98-menu-separator>
        <win98-menu-item icon-name="directoryClosed" label="Programs" large>
          <div slot="submenu">
            <win98-menu-item icon-name="directoryClosed" label="Accessories">
              <div slot="submenu">
                <win98-menu-item icon-name="calculator" label="Calculator"></win98-menu-item>
                <win98-menu-item icon-name="charmap" label="Character Map"></win98-menu-item>
                <win98-menu-item icon-name="kodakImaging" label="Imaging"></win98-menu-item>
                <win98-menu-item icon-name="notepad" label="Notepad"></win98-menu-item>
                <win98-menu-item icon-name="paintOld" label="Paint"></win98-menu-item>
                <win98-menu-item icon-name="writeWordpad" label="WordPad"></win98-menu-item>
              </div>
            </win98-menu-item>
            <win98-menu-item icon-name="directoryClosed" label="Games">
              <div slot="submenu">
                <win98-menu-item icon-name="gameFreecell" label="FreeCell"></win98-menu-item>
                <win98-menu-item icon-name="gameSolitaire" label="Solitaire"></win98-menu-item>
              </div>
            </win98-menu-item>
            <win98-menu-item icon-name="msie2" label="Internet Explorer">
              <div slot="submenu">
                <win98-menu-item icon-name="addressBook" label="Address Book"></win98-menu-item>
                <win98-menu-item icon-name="msie2" label="Internet Explorer"></win98-menu-item>
                <win98-menu-item icon-name="outlookExpress" label="Outlook Express"></win98-menu-item>
              </div>
            </win98-menu-item>
            <win98-menu-separator></win98-menu-separator>
            <win98-menu-item icon-name="mediaPlayer" label="Windows Media Player"></win98-menu-item>
            <win98-menu-item icon-name="msDos2" label="MS-DOS Prompt"></win98-menu-item>
          </div>
        </win98-menu-item>
        <win98-menu-item icon-name="directoryFavorites" label="Favorites" large></win98-menu-item>
        <win98-menu-item icon-name="directoryMydocs" label="Documents" large></win98-menu-item>
        <win98-menu-item icon-name="settingsGear" label="Settings" large></win98-menu-item>
        <win98-menu-item icon-name="magnifyingGlass" label="Find" large></win98-menu-item>
        <win98-menu-item icon-name="helpQuestionMark" label="Help" large></win98-menu-item>
        <win98-menu-item icon-name="executableScript" label="Run..." large></win98-menu-item>
        <win98-menu-separator></win98-menu-separator>
        <win98-menu-item icon-name="keyWin" label="Log Off..." large></win98-menu-item>
        <win98-menu-item icon-name="shutDownNormal" label="Shut Down..." large></win98-menu-item>
      </win98-start-menu>
    `;

    stage.appendChild(div);
  });
}
