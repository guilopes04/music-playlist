import { Helpers } from './src/helpers.js'
import { Storage } from './src/back-end-requests.js'
import { Music } from './src/music.js'
import { Playlist } from './src/playlists.js'
import { UserPlaylist } from './src/user-playlist.js'

export const storage = new Storage('http://localhost:8000')

document.getElementById('loginForm')?.addEventListener('submit', function (e) {
  e.preventDefault()
  const username = document.getElementById('username').value
  localStorage.setItem('user', username)
  window.location.href = 'playlist.html'
})

export function checkAuthentication() {
  const user = localStorage.getItem('user')
  if (!user) {
    window.location.href = 'login.html'
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  //checkAuthentication()

  if (window.location.pathname.includes('user-playlist.html')) {
    const userPlaylist = UserPlaylist(storage)

    await userPlaylist.displayPlaylist()
  } else if (window.location.pathname.includes('playlist.html')) {
    const playlist = Playlist(storage)

    await playlist.exibirPlaylists()
  } else if (window.location.pathname.includes('music.html')) {
    const music = Music(storage)

    const playlistId = new URLSearchParams(window.location.search).get(
      'playlist_id'
    )

    const playlistName = new URLSearchParams(window.location.search).get(
      'playlist_name'
    )

    localStorage.setItem('currentPlaylistId', playlistId)
    localStorage.setItem('currentPlaylistName', playlistName)

    await music.exibirMusicas(playlistId, playlistName)
  } else if (window.location.pathname.includes('index.html')) {
    Helpers.callIndexEventListeners()
  } else if (window.location.pathname.includes('search-users.html')) {
    await Helpers.callSearchUsersEventListeners()
  }
})
