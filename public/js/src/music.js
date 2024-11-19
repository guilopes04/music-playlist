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
          <h4>${musica.titulo} - ${musica.artista}</h4>
          ${Helpers.getMusicPlayer(musica.link)}
          <br/>
          <button
            class="btn btn-warning"
            data-toggle="modal"
            data-target="#editMusicModal"
            data-id="${musica.id}"
            data-name="${musica.titulo}"
            data-url="${musica.link}"
            data-artist="${musica.artista}"
            data-platform="${musica.plataforma}"
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

  const adicionarMusica = async () => {
    const titulo = $('#music-name-input').val().trim()
    const link = $('#music-url-input').val().trim()
    const artista = $('#music-artist-input').val().trim()
    const plataforma = $('#music-platform-input').val().trim()

    const validLinkRegex =
      /^(https?:\/\/)?(www\.)?(open\.spotify\.com|spotify\.com|youtu\.be|youtube\.com|soundcloud\.com)\/.+$/

    if (!titulo || !link || !artista || !plataforma) {
      alert('Preencha todos os campos.')
      return
    }

    if (!validLinkRegex.test(link)) {
      alert('O link precisa ser do Spotify, YouTube ou SoundCloud.')
      return
    }

    try {
      await storage.save({
        titulo,
        link,
        artista,
        plataforma,
        playlist_id: localStorage.getItem('currentPlaylistId')
      })

      $('#addMusicModal').modal('hide')
      await exibirMusicas(
        localStorage.getItem('currentPlaylistId'),
        localStorage.getItem('currentPlaylistName')
      )
    } catch (error) {
      console.error('Erro ao adicionar música:', error)
      alert('Erro ao adicionar música. Tente novamente.')
    }
  }

  const removerMusica = async () => {
    const playlistId = localStorage.getItem('currentPlaylistId')
    const playlistName = localStorage.getItem('currentPlaylistName')

    const id = $('#remove-music-btn').data('id')

    storage.setResource(`musicas.php?playlist_id=${playlistId}&musica_id=${id}`)

    try {
      await storage.removeItem()

      $('#deleteMusicModal').modal('hide')

      await exibirMusicas(playlistId, playlistName)
    } catch (error) {
      console.error('Erro ao remover música:', error)
      alert('Erro ao remover música. Tente novamente.')
    }
  }

  const editarMusica = async () => {
    const id = $('#save-edit-music-btn').data('id')

    storage.setResource(`musicas.php?musica_id=${id}`)

    const titulo = $('#edit-music-name-input').val().trim()
    const link = $('#edit-music-url-input').val().trim()
    const artista = $('#edit-music-artist-input').val().trim()
    const plataforma = $('#edit-music-platform-input').val().trim()

    if (!titulo || !link || !artista || !plataforma) {
      alert('Preencha todos os campos.')
      return
    }

    const validLinkRegex =
      /^(https?:\/\/)?(www\.)?(open\.spotify\.com|spotify\.com|youtu\.be|youtube\.com|soundcloud\.com)\/.+$/

    if (!validLinkRegex.test(link)) {
      alert('O link precisa ser do Spotify, YouTube ou SoundCloud.')
      return
    }

    try {
      await storage.editItem({ titulo, link, artista, plataforma })

      $('#editMusicModal').modal('hide')
      await exibirMusicas(
        localStorage.getItem('currentPlaylistId'),
        localStorage.getItem('currentPlaylistName')
      )
    } catch (error) {
      console.error('Erro ao editar música:', error)
      alert('Erro ao editar música. Tente novamente.')
    }
  }

  return { exibirMusicas, adicionarMusica, removerMusica, editarMusica }
}

document.addEventListener('DOMContentLoaded', () => {
  $(document).on('click', '[data-target="#editMusicModal"]', function () {
    const id = $(this).data('id')
    const name = $(this).data('name')
    const url = $(this).data('url')
    const artist = $(this).data('artist')
    const platform = $(this).data('platform')

    $('#edit-music-name-input').val(name)
    $('#edit-music-url-input').val(url)
    $('#edit-music-artist-input').val(artist)
    $('#edit-music-platform-input').val(platform)
    $('#save-edit-music-btn').data('id', id)
  })

  $(document).on('click', '[data-target="#deleteMusicModal"]', function () {
    const id = $(this).data('id')
    const name = $(this).data('name')

    $('#delete-music-name').text(name)
    $('#remove-music-btn').data('id', id)
  })
})
