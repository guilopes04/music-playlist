import { Helpers } from './helpers.js'

export const Playlist = (storage) => {
  const exibirPlaylists = async () => {
    storage.setResource('playlists.php')

    const playlists = await storage.getItems()
    console.log('exibirPlaylists', playlists)

    const container = document.getElementById('playlist-container')

    container.innerHTML = ''

    playlists.forEach((playlist) => {
      container.innerHTML += `
        <div class="playlist-item d-flex justify-content-between align-items-center">
          <div>
        <h4>${playlist.titulo}</h4>
        <p>${playlist.descricao}</p>
        </br>
        <p>Criado em: ${new Date(playlist.criado_em).toLocaleDateString(
          'pt-BR'
        )}</p>
        <button class="btn btn-warning btn-sm" data-id="${
          playlist.id
        }" name="edit-playlist-btn">Editar</button>
        <button class="btn btn-danger btn-sm" data-id="${
          playlist.id
        }" name="remove-playlist-btn">Remover</button>
          </div>
          <button class="btn btn-secondary btn-sm" data-id="${
            playlist.id
          }" name="get-music-of-playlist-btn">Ver Músicas</button>
        </div>
        <hr/>
      `
    })

    Helpers.callPlaylistEventListeners()
  }

  const adicionarPlaylist = () => {
    const nome = prompt('Digite o nome da nova playlist:')
    if (nome) {
      storage.save({ id: Helpers.generateUUID(), nome, musicas: [] })
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
