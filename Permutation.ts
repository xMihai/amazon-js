export default class Permutation<T> {
  private index: number[] = []
  private started: boolean = false

  constructor(private items: T[], private size: number) {
    if (items.length < size) throw new Error('size error')

    for (let i = 0; i < size; i++) {
      this.index[i] = i
    }
  }

  public next(): any[] | null {
    if (!this.started) {
      this.started = true
    } else if (this.size === 0) {
      return null
    } else {
      try {
        this.increase(this.size - 1)
      } catch (e) {
        return null
      }
    }

    return this.index.map(i => this.items[i])
  }

  private increase(position: number) {
    this.index[position]++

    if (this.index[position] >= this.items.length - (this.size - 1 - position)) {
      if (position !== 0) {
        this.index[position] = this.increase(position - 1)
      } else {
        throw new Error('')
      }
    }

    return this.index[position] + 1
  }
}
