import { Helpers } from './helpers.js'

export const Playlist = (storage) => {
  const exibirPlaylists = async () => {
    storage.setResource('playlists.php?usuario_id=1')

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
          }" id="get-music-of-playlist-btn">Ver Músicas</button>
        </div>
        <hr/>
      `
    })

    Helpers.callPlaylistEventListeners()
  }

  const adicionarPlaylist = async () => {
    storage.setResource('playlists.php')

    const titulo = document.getElementById('playlist-name-input').value.trim()
    const descricao = document
      .getElementById('playlist-description-input')
      ?.value?.trim()

    if (!titulo) {
      alert('Por favor, insira o titulo da playlist.')
      return
    }

    await storage.save({ titulo, descricao, usuario_id: 1 })

    $('#addPlaylistModal').modal('hide')
    exibirPlaylists()
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
