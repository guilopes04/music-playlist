import { Helpers } from './helpers.js'

export const Music = (storage) => {
  const exibirMusicas = async (id, playlistName) => {
    storage.setResource(`musicas.php?playlist_id=${id}`)

    const musicas = await storage.getItems()

    if (!musicas) {
      alert('Playlist não encontrada.')
      return
    }

    console.log('musicas', musicas)

    const titlePlaylistMusics = document.getElementById('title-list-musics')
    titlePlaylistMusics.innerHTML = `<h2 id="title-list-musics" class="text-center">Músicas da Playlist </br> ${playlistName}</h2> </br>`

    const container = document.getElementById('music-container')
    container.innerHTML = ''

    if (!musicas.length) {
      Helpers.callMusicEventListeners()
      return
    }

    musicas.forEach((musica) => {
      container.innerHTML += `
        <div>
          <h4>${musica.titulo}</h4>
          ${Helpers.getMusicPlayer(musica.link)}
          <br/>
          <button
            class="btn btn-warning"
            data-toggle="modal"
            data-target="#editMusicModal"
            data-id="${musica.id}"
            data-name="${musica.titulo}"
            data-url="${musica.link}"
          >
            Editar
          </button>
          <button
            class="btn btn-danger"
            data-toggle="modal"
            data-target="#deleteMusicModal"
            data-id="${musica.id}"
            data-name="${musica.titulo}"
          >
            Remover
          </button>
        </div>
        <hr/>
      `
    })

    Helpers.callMusicEventListeners()
  }

  const adicionarMusica = () => {
    const titulo = prompt('Digite o título da música:')
    const link = prompt('Digite o link da música:')

    const validLinkRegex =
      /^(https?:\/\/)?(www\.)?(open\.spotify\.com|spotify\.com|youtu\.be|youtube\.com|soundcloud\.com)\/.+$/

    if (!titulo || !link) {
      alert('Título ou link não pode ser vazio.')
      return
    }

    if (!validLinkRegex.test(link)) {
      alert('O link precisa ser do Spotify, YouTube ou SoundCloud.')
      return
    }

    const playlistIndex = localStorage.getItem('currentPlaylistIndex')
    const playlists = storage.getItems()
    const currentPlaylist = playlists[playlistIndex]
    currentPlaylist.musicas.push({ id: Helpers.generateUUID(), titulo, link })

    storage.editItem(playlistIndex, currentPlaylist)
    exibirMusicas()
  }

  const removerMusica = (index) => {
    const playlistIndex = localStorage.getItem('currentPlaylistIndex')
    const playlists = storage.getItems()
    const currentPlaylist = playlists[playlistIndex]

    currentPlaylist.musicas.splice(index, 1)

    storage.saveItems(playlists)

    exibirMusicas()
  }

  const editarMusica = (index) => {
    const playlistIndex = localStorage.getItem('currentPlaylistIndex')
    const playlists = storage.getItems()
    const currentPlaylist = playlists[playlistIndex]
    const novoTitulo = prompt(
      'Editar título da música:',
      currentPlaylist.musicas[index].titulo
    )
    const novoLink = prompt(
      'Editar link da música:',
      currentPlaylist.musicas[index].link
    )

    currentPlaylist.musicas[index] = {
      titulo: novoTitulo,
      link: novoLink
    }

    if (novoTitulo && novoLink) {
      storage.editItem(playlistIndex, currentPlaylist)
      exibirMusicas()
    }
  }

  return { exibirMusicas, adicionarMusica, removerMusica, editarMusica }
}

document.addEventListener('DOMContentLoaded', () => {
  $(document).on('click', '[data-target="#editMusicModal"]', function () {
    const id = $(this).data('id')
    const name = $(this).data('name')
    const url = $(this).data('url')

    $('#edit-music-name-input').val(name)
    $('#edit-music-url-input').val(url)
    $('#save-edit-music-btn').data('id', id)
  })

  $(document).on('click', '[data-target="#deleteMusicModal"]', function () {
    const id = $(this).data('id')
    const name = $(this).data('name')

    $('#delete-music-name').text(name)
    $('#remove-music-btn').data('id', id)
  })
})
