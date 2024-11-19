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
            <p>Criado em: ${new Date(playlist.criado_em).toLocaleDateString(
              'pt-BR'
            )}</p>
            <button
              class="btn btn-warning btn-sm"
              data-toggle="modal"
              data-target="#editPlaylistModal"
              data-id="${playlist.id}"
              data-title="${playlist.titulo}"
              data-description="${playlist.descricao}"
            >
              Editar
            </button>
            <button
              class="btn btn-danger btn-sm"
              data-toggle="modal"
              data-target="#deletePlaylistModal"
              data-id="${playlist.id}"
              data-title="${playlist.titulo}"
            >
              Remover
            </button>
          </div>
          <button
            class="btn btn-secondary btn-sm"
            data-id="${playlist.id}"
            data-title="${playlist.titulo}"
            id="get-music-of-playlist-btn"
          >
            Ver Músicas
          </button>
        </div>
        <hr/>
      `
    })

    Helpers.callPlaylistEventListeners()
  }

  const adicionarPlaylist = async () => {
    const titulo = document.getElementById('playlist-name-input').value.trim()
    const descricao = document
      .getElementById('playlist-description-input')
      ?.value?.trim()

    // if (!titulo) {
    //   alert('Por favor, insira o título da playlist.')
    //   return
    // }

    await storage.save({ titulo, descricao, usuario_id: 1 })
    $('#addPlaylistModal').modal('hide')
    await exibirPlaylists()
  }

  const removerPlaylist = async () => {
    const id = $('#remove-playlist-btn').data('id')

    storage.setResource(`playlists.php?id=${id}`)

    await storage.removeItem()

    $('#deletePlaylistModal').modal('hide')
    await exibirPlaylists()
  }

  const editarPlaylist = async () => {
    const id = $('#save-edit-playlist-btn').data('id')

    storage.setResource(`playlists.php?id=${id}`)

    const novoTitulo = document
      .getElementById('edit-playlist-name-input')
      .value.trim()
    const novaDescricao = document
      .getElementById('edit-playlist-description-input')
      .value.trim()

    if (!novoTitulo) {
      alert('Por favor, insira o titulo.')
      return
    }

    await storage.editItem({ titulo: novoTitulo, descricao: novaDescricao })

    $('#editPlaylistModal').modal('hide')
    await exibirPlaylists()
  }

  const acessarPlaylist = async (event) => {
    const id = event.target.dataset.id
    const title = event.target.dataset.title

    if (!id) {
      console.error('ID da playlist não encontrado.')
      return
    }

    window.location.href =
      'music.html' + '?playlist_id=' + id + '&playlist_name=' + title
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Configurações dos modais
    $(document).on('click', '[data-target="#editPlaylistModal"]', function () {
      const id = $(this).data('id')
      const title = $(this).data('title')
      const description = $(this).data('description')

      $('#edit-playlist-name-input').val(title)
      $('#edit-playlist-description-input').val(description)
      $('#save-edit-playlist-btn').data('id', id)
    })

    $(document).on(
      'click',
      '[data-target="#deletePlaylistModal"]',
      function () {
        const id = $(this).data('id')
        const title = $(this).data('title')

        $('#delete-playlist-name').text(title)
        $('#remove-playlist-btn').data('id', id)
      }
    )
  })

  return {
    exibirPlaylists,
    adicionarPlaylist,
    removerPlaylist,
    editarPlaylist,
    acessarPlaylist
  }
}
