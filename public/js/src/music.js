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
          ${getMusicPlayer(musica.link)}
          <br/>
          <button class="btn btn-warning" name="edit-music-btn">Editar</button>
          <button class="btn btn-danger" name="remove-music-btn">Remover</button>
        </div>
        <hr/>
      `
    })

    Helpers.callMusicEventListeners()
  }

  // Função para gerar o player de música (YouTube, Spotify ou SoundCloud)
  const getMusicPlayer = (link) => {
    let player = ''

    if (link.includes('youtube.com') || link.includes('youtu.be')) {
      player = `
        <iframe width="100%" src="https://www.youtube.com/embed/${Helpers.extractYouTubeID(
          link
        )}"
        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    } else if (link.includes('spotify.com')) {
      player = `<iframe src="https://open.spotify.com/embed/track/${Helpers.extractSpotifyID(
        link
      )}" width="100%" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`
    } else if (link.includes('soundcloud.com')) {
      player = `<iframe width="100%" scrolling="no" frameborder="no" allow="autoplay"
        src="https://w.soundcloud.com/player/?url=${link}&color=%23ff5500&auto_play=false"></iframe>`
    }

    return player
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
