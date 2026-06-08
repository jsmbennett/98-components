/**
 * Main entry point for the component library demo
 * 
 * This file imports and initializes all example modules
 */
import '../src/index.js';

// Setup icons first (registers them with the iconRegistry)
import { setupTaskbarIcons } from './setup-icons.js';

// Import example registration functions
import { registerWindowExamples } from './examples/window-examples.js';
import { registerButtonExamples } from './examples/button-examples.js';
import { registerSelectExamples } from './examples/select-examples.js';
import { registerStartMenuExample } from './examples/start-menu-example.js';
import { registerDesktopDemo } from './examples/desktop-demo.js';

// Initialize taskbar icons
setupTaskbarIcons();

// Get shared DOM elements
const stage = document.getElementById('example-stage');
const desktop = document.querySelector('win98-desktop');

// Utility functions shared by all examples
function clearStage() {
  stage.innerHTML = '';
}

function setActiveLink(id) {
  document.querySelectorAll('.tree-view a').forEach(a => a.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
}

// Register all component examples
registerWindowExamples(stage, clearStage, setActiveLink);
registerButtonExamples(stage, clearStage, setActiveLink);
registerSelectExamples(stage, clearStage, setActiveLink);
registerStartMenuExample(stage, clearStage, setActiveLink);
registerDesktopDemo(stage, clearStage, setActiveLink, desktop);
