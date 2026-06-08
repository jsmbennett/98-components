/**
 * Icon Setup - Registers all icons used in the demo with the icon registry
 */
import { iconRegistry } from '../src/services/IconRegistry';

// Import all icons used in the demos
import windowsUpdateLarge from '../src/gen/icons/windowsUpdateLarge';
import windowsUpdateSmall from '../src/gen/icons/windowsUpdateSmall';
import directoryClosed from '../src/gen/icons/directoryClosed';
import directoryFavorites from '../src/gen/icons/directoryFavorites';
import directoryMydocs from '../src/gen/icons/directoryMydocs';
import settingsGear from '../src/gen/icons/settingsGear';
import magnifyingGlass from '../src/gen/icons/magnifyingGlass';
import helpQuestionMark from '../src/gen/icons/helpQuestionMark';
import executableScript from '../src/gen/icons/executableScript';
import shutDownNormal from '../src/gen/icons/shutDownNormal';
import calculator from '../src/gen/icons/calculator';
import notepad from '../src/gen/icons/notepad';
import msDos2 from '../src/gen/icons/msDos2';
import keyWin from '../src/gen/icons/keyWin';
import paintOld from '../src/gen/icons/paintOld';
import writeWordpad from '../src/gen/icons/writeWordpad';
import msie2 from '../src/gen/icons/msie2';
import outlookExpress from '../src/gen/icons/outlookExpress';
import mediaPlayer from '../src/gen/icons/mediaPlayer';
import addressBook from '../src/gen/icons/addressBook';
import gameSolitaire from '../src/gen/icons/gameSolitaire';
import gameFreecell from '../src/gen/icons/gameFreecell';
import charmap from '../src/gen/icons/charmap';
import kodakImaging from '../src/gen/icons/kodakImaging';

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
export function setupTaskbarIcons(): void {
  const iconAssignments: Record<string, string> = {
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
    'start-menu-accessories': 'directoryClosed',
    'start-menu-calculator': 'calculator',
    'start-menu-notepad': 'notepad',
    'start-menu-paint': 'paintOld',
    'start-menu-wordpad': 'writeWordpad',
    'start-menu-charmap': 'charmap',
    'start-menu-imaging': 'kodakImaging',
    'start-menu-games': 'directoryClosed',
    'start-menu-solitaire': 'gameSolitaire',
    'start-menu-freecell': 'gameFreecell',
    'start-menu-internet': 'directoryClosed',
    'start-menu-ie': 'msie2',
    'start-menu-outlook': 'outlookExpress',
    'start-menu-addressbook': 'addressBook',
    'start-menu-msdos': 'msDos2',
    'start-menu-mediaplayer': 'mediaPlayer',
  };

  Object.entries(iconAssignments).forEach(([id, iconName]) => {
    const el = document.getElementById(id);
    if (el) {
      (el as any).icon = iconRegistry.getIcon(iconName);
    }
  });
}

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
