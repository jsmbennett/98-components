export interface IconSize {
  small: string;
  large: string;
}

export default class Icon {
  private small: string;
  private large: string;

  constructor({ small, large }: IconSize) {
    this.small = small;
    this.large = large;
  }

  get(size: number | 'small' | 'large'): string {
    if (size === 16 || size === 'small') return this.small;
    if (size === 32 || size === 'large') return this.large;
    return this.large || this.small;
  }
}
