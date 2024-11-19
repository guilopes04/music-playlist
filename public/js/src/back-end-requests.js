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

  async save(item) {
    const response = await fetch(`${this.url}`, {
      method: 'POST',
      body: JSON.stringify(item)
    })
    if (!response.ok) throw new Error('Erro ao salvar item')
  }

  async removeItem(id) {
    const response = await fetch(`${this.url}?action=delete&id=${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Erro ao remover item')
  }

  async editItem(id, newItem) {
    const response = await fetch(`${this.url}?action=edit`, {
      method: 'POST',
      body: JSON.stringify({ id, ...newItem })
    })
    if (!response.ok) throw new Error('Erro ao editar item')
  }
}
