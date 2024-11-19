import { usersData } from './mock/usersData.js'
import { Helpers } from './helpers.js'

export const UserPlaylist = (storage) => {
  const getQueryParams = () => {
    const params = new URLSearchParams(window.location.search)
    const username = params.get('user')
    const playlistIndex = params.get('playlist')
    return { username, playlistIndex }
  }

  const displayPlaylist = async (userId) => {
    const { username, playlistIndex } = getQueryParams()
    console.log(playlistIndex)
    storage.setResource(`playlists.php?id=${playlistIndex}`)


    const playlist = await storage.getItems()

    console.log(playlist[0])

    storage.setResource(`musicas.php?playlist_id=${playlist[0].id}`)

    const musicas = await storage.getItems()

    console.log(musicas)


    const user = usersData.find((user) => user.username === username)

    const playlistContainer = document.getElementById('user-playlist-container')

    if (playlist && playlistContainer) {
      const userPlaylistDetailTitle = document.getElementById(
        'user-playlist-detail'
      )
      userPlaylistDetailTitle.innerHTML = `<h2 id="user-playlist-detail">Detalhes da Playlist de ${username}</h2>`

      playlistContainer.innerHTML = `
            <h3>Playlist: ${playlist[0].titulo}</h3>
            <div id="user-playlist-musics-container">
              ${musicas
                .map(
                  (musica, index) => `
                <div>
                  <h4>${musica.titulo}</h4>
                  <br/>
                  ${Helpers.getMusicPlayer(musica.link)}
                </div>
              `
                )
                .join('')}
            </div>
          `
    } else if (playlistContainer) {
      playlistContainer.innerHTML = '<p>Playlist não encontrada.</p>'
    }
  }

  return { displayPlaylist }
}
