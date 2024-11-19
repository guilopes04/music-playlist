import { Helpers } from './src/helpers.js'
import { Storage } from './src/back-end-requests.js'
import { Music } from './src/music.js'
import { Playlist } from './src/playlists.js'
import { SearchUsers } from './src/search-users.js'
import { UserPlaylist } from './src/user-playlist.js'
const storage = new Storage('http://localhost:8000')
export const playlist = Playlist(storage)
export const music = Music(storage)
export const searchUsers = SearchUsers()
export const userPlaylist = UserPlaylist()

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
    searchUsers.displayPlaylist()
  } else if (window.location.pathname.includes('playlist.html')) {
    await playlist.exibirPlaylists()
    Helpers.callPlaylistEventListeners()
  } else if (window.location.pathname.includes('music.html')) {
    music.exibirMusicas()
    Helpers.callMusicEventListeners()
  } else if (window.location.pathname.includes('index.html')) {
    Helpers.callIndexEventListeners()
  } else if (window.location.pathname.includes('search-users.html')) {
    Helpers.callSearchUsersEventListeners()
  }
})
