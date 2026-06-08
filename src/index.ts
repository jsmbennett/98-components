import "98.css";
import "./css/98-overrides.css";

export { default as Win98Window } from "./components/window";
export { default as Win98Button } from "./components/button";
export { default as Win98Select } from "./components/select";
export { default as Win98Desktop } from "./components/desktop";
export { default as Win98Taskbar } from "./components/taskbar";
export { default as Win98StartMenu } from "./components/startmenu";
export { default as Win98MenuItem } from "./components/menuitem";
export { default as Win98MenuSeparator } from "./components/menuseparator";
export { default as Win98ContextMenu } from "./components/contextmenu";

export { windowManager } from "./services/WindowManager";
export { iconRegistry } from "./services/IconRegistry";

export { default as Icon } from "./Icon";
