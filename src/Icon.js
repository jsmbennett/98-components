export default class Icon {
    constructor({ small, large }) {
        this.small = small;
        this.large = large;
    }

    get(size) {
        if (size === 16 || size === 'small') return this.small;
        if (size === 32 || size === 'large') return this.large;
        return this.large || this.small;
    }
}
