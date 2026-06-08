import Icon from '../Icon';

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
  private icons: Map<string, Icon> = new Map();

  /**
   * Register a single icon with the registry
   */
  register(name: string, iconModule: Icon): void {
    if (!iconModule || typeof iconModule.get !== 'function') {
      console.warn(`IconRegistry: Invalid icon module for "${name}". Expected Icon instance with get() method.`);
      return;
    }
    this.icons.set(name, iconModule);
  }

  /**
   * Register multiple icons at once
   */
  registerBatch(icons: Record<string, Icon>): void {
    Object.entries(icons).forEach(([name, iconModule]) => {
      this.register(name, iconModule);
    });
  }

  /**
   * Get an icon URL by name and size
   */
  get(name: string, size: 'small' | 'large' | 16 | 32 = 'small'): string | null {
    const icon = this.icons.get(name);
    if (!icon) {
      console.warn(`IconRegistry: Icon "${name}" not found. Make sure to register it first.`);
      return null;
    }
    return icon.get(size);
  }

  /**
   * Get the raw Icon instance by name
   */
  getIcon(name: string): Icon | null {
    return this.icons.get(name) || null;
  }

  /**
   * Check if an icon is registered
   */
  has(name: string): boolean {
    return this.icons.has(name);
  }

  /**
   * Get all registered icon names
   */
  getRegisteredNames(): string[] {
    return Array.from(this.icons.keys());
  }

  /**
   * Clear all registered icons
   */
  clear(): void {
    this.icons.clear();
  }
}

export const iconRegistry = new IconRegistry();
