/**
 * Icon Setup - Registers all icons used in the demo with the icon registry
 */
import { iconRegistry } from '../src/services/IconRegistry.js';

// Import all icons used in the demos
import windowsUpdateLarge from '../src/gen/icons/windowsUpdateLarge.js';
import windowsUpdateSmall from '../src/gen/icons/windowsUpdateSmall.js';
import directoryClosed from '../src/gen/icons/directoryClosed.js';
import directoryFavorites from '../src/gen/icons/directoryFavorites.js';
import directoryMydocs from '../src/gen/icons/directoryMydocs.js';
import settingsGear from '../src/gen/icons/settingsGear.js';
import magnifyingGlass from '../src/gen/icons/magnifyingGlass.js';
import helpQuestionMark from '../src/gen/icons/helpQuestionMark.js';
import executableScript from '../src/gen/icons/executableScript.js';
import shutDownNormal from '../src/gen/icons/shutDownNormal.js';
import calculator from '../src/gen/icons/calculator.js';
import notepad from '../src/gen/icons/notepad.js';
import msDos2 from '../src/gen/icons/msDos2.js';
// Additional classic Windows 98 program icons
import keyWin from '../src/gen/icons/keyWin.js';
import paintOld from '../src/gen/icons/paintOld.js';
import writeWordpad from '../src/gen/icons/writeWordpad.js';
import msie2 from '../src/gen/icons/msie2.js';
import outlookExpress from '../src/gen/icons/outlookExpress.js';
import mediaPlayer from '../src/gen/icons/mediaPlayer.js';
import addressBook from '../src/gen/icons/addressBook.js';
import gameSolitaire from '../src/gen/icons/gameSolitaire.js';
import gameFreecell from '../src/gen/icons/gameFreecell.js';
import charmap from '../src/gen/icons/charmap.js';
import kodakImaging from '../src/gen/icons/kodakImaging.js';

// Register all icons with the registry
iconRegistry.registerBatch({
  windowsUpdateLarge,
  windowsUpdateSmall,
  directoryClosed,
  directoryFavorites,
  directoryMydocs,
  settingsGear,
  magnifyingGlass,
  helpQuestionMark,
  executableScript,
  shutDownNormal,
  calculator,
  notepad,
  msDos2,
  // Additional classic Windows 98 program icons
  keyWin,
  paintOld,
  writeWordpad,
  msie2,
  outlookExpress,
  mediaPlayer,
  addressBook,
  gameSolitaire,
  gameFreecell,
  charmap,
  kodakImaging,
});

/**
 * Setup icons for the main taskbar start menu (in index.html)
 * This function assigns icons to menu items by ID using the registry
 */
export function setupTaskbarIcons() {
  const iconAssignments = {
    'start-menu-update': 'windowsUpdateLarge',
    'start-menu-programs': 'directoryClosed',
    'start-menu-favorites': 'directoryFavorites',
    'start-menu-documents': 'directoryMydocs',
    'start-menu-settings': 'settingsGear',
    'start-menu-find': 'magnifyingGlass',
    'start-menu-help': 'helpQuestionMark',
    'start-menu-run': 'executableScript',
    'start-menu-logoff': 'keyWin',
    'start-menu-shutdown': 'shutDownNormal',
    // Accessories
    'start-menu-accessories': 'directoryClosed',
    'start-menu-calculator': 'calculator',
    'start-menu-notepad': 'notepad',
    'start-menu-paint': 'paintOld',
    'start-menu-wordpad': 'writeWordpad',
    'start-menu-charmap': 'charmap',
    'start-menu-imaging': 'kodakImaging',
    // Games
    'start-menu-games': 'directoryClosed',
    'start-menu-solitaire': 'gameSolitaire',
    'start-menu-freecell': 'gameFreecell',
    // Internet
    'start-menu-internet': 'directoryClosed',
    'start-menu-ie': 'msie2',
    'start-menu-outlook': 'outlookExpress',
    'start-menu-addressbook': 'addressBook',
    // Other programs
    'start-menu-msdos': 'msDos2',
    'start-menu-mediaplayer': 'mediaPlayer',
  };

  Object.entries(iconAssignments).forEach(([id, iconName]) => {
    const el = document.getElementById(id);
    if (el) {
      el.icon = iconRegistry.getIcon(iconName);
    }
  });
}

// Re-export individual icons for examples that still need direct access
export {
  windowsUpdateLarge,
  windowsUpdateSmall,
  directoryClosed,
  directoryFavorites,
  directoryMydocs,
  settingsGear,
  magnifyingGlass,
  helpQuestionMark,
  executableScript,
  shutDownNormal,
  calculator,
  notepad,
  msDos2,
  // Additional classic Windows 98 program icons
  keyWin,
  paintOld,
  writeWordpad,
  msie2,
  outlookExpress,
  mediaPlayer,
  addressBook,
  gameSolitaire,
  gameFreecell,
  charmap,
  kodakImaging,
};
