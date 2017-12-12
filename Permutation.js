"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Permutation {
    constructor(items, size) {
        this.items = items;
        this.size = size;
        this.index = [];
        this.started = false;
        if (items.length < size)
            throw new Error('size error');
        for (let i = 0; i < size; i++) {
            this.index[i] = i;
        }
    }
    next() {
        if (!this.started) {
            this.started = true;
        }
        else if (this.size === 0) {
            return null;
        }
        else {
            try {
                this.increase(this.size - 1);
            }
            catch (e) {
                return null;
            }
        }
        return this.index.map(i => this.items[i]);
    }
    increase(position) {
        this.index[position]++;
        if (this.index[position] >= this.items.length - (this.size - 1 - position)) {
            if (position !== 0) {
                this.index[position] = this.increase(position - 1);
            }
            else {
                throw new Error('');
            }
        }
        return this.index[position] + 1;
    }
}
exports.default = Permutation;
