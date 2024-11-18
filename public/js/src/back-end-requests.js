export class Storage {
  constructor(endpoint) {
    this.endpoint = endpoint
  }

  setResource(resource) {
    this.endpoint = this.endpoint + `/${resource}`
  }

  getEndpoint() {
    return this.endpoint
  }

  async getItems() {
    const response = await fetch(`${this.endpoint}?action=getAll`)
    if (!response.ok) throw new Error('Erro ao buscar itens')
    return await response.json()
  }

  async save(item) {
    const response = await fetch(`${this.endpoint}?action=add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    })
    if (!response.ok) throw new Error('Erro ao salvar item')
  }

  async removeItem(id) {
    const response = await fetch(`${this.endpoint}?action=delete&id=${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Erro ao remover item')
  }

  async editItem(id, newItem) {
    const response = await fetch(`${this.endpoint}?action=edit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...newItem })
    })
    if (!response.ok) throw new Error('Erro ao editar item')
  }
}
