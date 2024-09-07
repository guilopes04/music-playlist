import { Helpers } from './helpers.js'

export const Playlist = (storage) => {
  const exibirPlaylists = () => {
    const playlists = storage.getItems()
    const container = document.getElementById('playlist-container')
    container.innerHTML = ''

    playlists.forEach((playlist, index) => {
      container.innerHTML += `
          <div class="playlist-item d-flex justify-content-between align-items-center">
            <div>
              <h4>${playlist.nome}</h4>
              <br/>
              <button class="btn btn-warning" name="edit-playlist-btn">Editar</button>
              <button class="btn btn-danger" name="remove-playlist-btn">Remover</button>
            </div>
            <button class="btn btn-secondary" name="get-music-of-playlist-btn">&gt;</button>
          </div>
          <hr/>
        `
    })

    Helpers.callPlaylistEventListeners()
  }

  const adicionarPlaylist = () => {
    const nome = prompt('Digite o nome da nova playlist:')
    if (nome) {
      storage.addItem({ id: Helpers.generateUUID(), nome, musicas: [] })
      exibirPlaylists()
    }
  }

  const removerPlaylist = (index) => {
    storage.removeItem(index)
    exibirPlaylists()
  }

  const editarPlaylist = (index) => {
    const playlists = storage.getItems()
    const novoNome = prompt('Editar nome da playlist:', playlists[index].nome)
    if (novoNome) {
      storage.editItem(index, { ...playlists[index], nome: novoNome })
      exibirPlaylists()
    }
  }

  const acessarPlaylist = (index) => {
    localStorage.setItem('currentPlaylistIndex', index)
    window.location.href = 'music.html'
  }

  return {
    exibirPlaylists,
    adicionarPlaylist,
    removerPlaylist,
    editarPlaylist,
    acessarPlaylist
  }
}
