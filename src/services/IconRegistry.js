/**
 * IconRegistry - Singleton service for managing icon references
 * 
 * Allows components to reference icons by name instead of requiring
 * direct imports and JS property assignment.
 * 
 * @example
 * // Register icons (typically in app initialization)
 * import { iconRegistry } from '98-components';
 * import directoryClosed from '98-components/icons/directoryClosed';
 * 
 * iconRegistry.register('directoryClosed', directoryClosed);
 * // Or batch register
 * iconRegistry.registerBatch({ directoryClosed, notepad, calculator });
 * 
 * // Then use declaratively in HTML
 * // <win98-menu-item icon-name="directoryClosed" label="My Folder"></win98-menu-item>
 */
class IconRegistry {
  constructor() {
    this.icons = new Map();
  }

  /**
   * Register a single icon with the registry
   * @param {string} name - The name to reference this icon by
   * @param {Icon} iconModule - The Icon instance (with get() method)
   */
  register(name, iconModule) {
    if (!iconModule || typeof iconModule.get !== 'function') {
      console.warn(`IconRegistry: Invalid icon module for "${name}". Expected Icon instance with get() method.`);
      return;
    }
    this.icons.set(name, iconModule);
  }

  /**
   * Register multiple icons at once
   * @param {Object} icons - Object where keys are names and values are Icon instances
   * @example iconRegistry.registerBatch({ directoryClosed, notepad, calculator });
   */
  registerBatch(icons) {
    Object.entries(icons).forEach(([name, iconModule]) => {
      this.register(name, iconModule);
    });
  }

  /**
   * Get an icon URL by name and size
   * @param {string} name - The registered icon name
   * @param {'small'|'large'|16|32} [size='small'] - The desired icon size
   * @returns {string|null} The icon URL or null if not found
   */
  get(name, size = 'small') {
    const icon = this.icons.get(name);
    if (!icon) {
      console.warn(`IconRegistry: Icon "${name}" not found. Make sure to register it first.`);
      return null;
    }
    return icon.get(size);
  }

  /**
   * Get the raw Icon instance by name
   * @param {string} name - The registered icon name
   * @returns {Icon|null} The Icon instance or null if not found
   */
  getIcon(name) {
    return this.icons.get(name) || null;
  }

  /**
   * Check if an icon is registered
   * @param {string} name - The icon name to check
   * @returns {boolean}
   */
  has(name) {
    return this.icons.has(name);
  }

  /**
   * Get all registered icon names
   * @returns {string[]}
   */
  getRegisteredNames() {
    return Array.from(this.icons.keys());
  }

  /**
   * Clear all registered icons
   */
  clear() {
    this.icons.clear();
  }
}

// Export singleton instance
export const iconRegistry = new IconRegistry();
