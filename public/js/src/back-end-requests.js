export class Storage {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
    this.url = ''
  }

  setResource(resource) {
    this.url = this.baseUrl + `/${resource}`
  }

  getUrl() {
    return this.url
  }

  async getItems() {
    const response = await fetch(`${this.url}`)
    if (!response.ok) throw new Error('Erro ao buscar itens')
    return await response.json()
  }

  async getItem() {}

  async save(item) {
    const response = await fetch(`${this.url}`, {
      method: 'POST',
      body: JSON.stringify(item)
    })
    if (!response.ok) throw new Error('Erro ao salvar item')
  }

  async removeItem() {
    const response = await fetch(`${this.url}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Erro ao remover item')
  }

  async editItem(item) {
    const response = await fetch(`${this.url}`, {
      method: 'PUT',
      body: JSON.stringify(item)
    })
    if (!response.ok) throw new Error('Erro ao editar item')
  }
}
