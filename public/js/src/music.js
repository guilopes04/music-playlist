import { Helpers } from './helpers.js'

export const Music = (storage) => {
  const exibirMusicas = () => {
    const playlistIndex = localStorage.getItem('currentPlaylistIndex')
    const playlists = storage.getItems()
    const currentPlaylist = playlists[playlistIndex]
    const musicas = currentPlaylist.musicas

    const titlePlaylistMusics = document.getElementById('title-list-musics')
    titlePlaylistMusics.innerHTML = `<h2 id="title-list-musics" class="text-center">Músicas da Playlist ${currentPlaylist.nome}</h2>`

    const container = document.getElementById('music-container')
    container.innerHTML = ''

    if (!musicas.length) {
      Helpers.callMusicEventListeners()
      return
    }

    musicas.forEach((musica, index) => {
      container.innerHTML += `
        <div>
          <h4>${musica.titulo}</h4>
          ${Helpers.getMusicPlayer(musica.link)}
          <br/>
          <button class="btn btn-warning" name="edit-music-btn">Editar</button>
          <button class="btn btn-danger" name="remove-music-btn">Remover</button>
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
