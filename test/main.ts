/**
 * Main entry point for the component library demo
 *
 * This file imports and initializes all example modules
 */
import '../src/index.ts';

// Setup icons first (registers them with the iconRegistry)
import { setupTaskbarIcons } from './setup-icons';

// Import example registration functions
import { registerWindowExamples } from './examples/window-examples';
import { registerButtonExamples } from './examples/button-examples';
import { registerSelectExamples } from './examples/select-examples';
import { registerStartMenuExample } from './examples/start-menu-example';
import { registerDesktopDemo } from './examples/desktop-demo';

// Initialize taskbar icons
setupTaskbarIcons();

// Get shared DOM elements
const stage = document.getElementById('example-stage') as HTMLElement;
const desktop = document.querySelector('win98-desktop') as HTMLElement;

// Utility functions shared by all examples
function clearStage(): void {
  stage.innerHTML = '';
}

function setActiveLink(id: string): void {
  document.querySelectorAll('.tree-view a').forEach(a => a.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
}

// Register all component examples
registerWindowExamples(stage, clearStage, setActiveLink);
registerButtonExamples(stage, clearStage, setActiveLink);
registerSelectExamples(stage, clearStage, setActiveLink);
registerStartMenuExample(stage, clearStage, setActiveLink);
registerDesktopDemo(stage, clearStage, setActiveLink, desktop);
