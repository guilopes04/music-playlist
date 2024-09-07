export class Storage {
  constructor(key) {
    this.key = key
  }

  getItems() {
    return JSON.parse(localStorage.getItem(this.key)) || []
  }

  saveItems(items) {
    localStorage.setItem(this.key, JSON.stringify(items))
  }

  removeItem(index) {
    let items = this.getItems()
    items.splice(index, 1)
    this.saveItems(items)
  }

  editItem(index, newItem) {
    let items = this.getItems()
    items[index] = newItem
    this.saveItems(items)
  }

  addItem(item) {
    let items = this.getItems()
    items.push(item)
    this.saveItems(items)
  }
}
