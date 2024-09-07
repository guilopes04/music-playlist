import { Helpers } from './src/helpers.js'
import { Storage } from './src/localStorage.js'
import { Music } from './src/music.js'
import { Playlist } from './src/playlists.js'
import { usersData } from './usersData.js'
const storage = new Storage('playlists')
export const playlist = Playlist(storage)
export const music = Music(storage)

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

document.addEventListener('DOMContentLoaded', function () {
  if (window.location.pathname.includes('playlist.html')) {
    playlist.exibirPlaylists()
  }

  if (window.location.pathname.includes('music.html')) {
    music.exibirMusicas()
  }

  if (window.location.pathname.includes('user-playlist.html')) {
    playlist.exibirPlaylists()
  }
})

document.getElementById('search-users-btn')
  ? document
      .getElementById('search-users-btn')
      .addEventListener('click', () => {
        window.location.href = 'search-users.html'
      })
  : null

document.getElementById('search-input')
  ? document.getElementById('search-input').addEventListener('input', (e) => {
      const searchValue = e.target.value.toLowerCase().trim()
      const blankSpaceRegex = /^\s*$/
      if (blankSpaceRegex.test(searchValue)) return displayUsers([])
      const filteredUsers = usersData.filter((user) =>
        user.username.toLowerCase().includes(searchValue)
      )
      displayUsers(filteredUsers)
    })
  : null

export const viewPlaylist = (username, playlistIndex) => {
  window.location.href = `user-playlist.html?user=${username}&playlist=${playlistIndex}`
}

const displayUsers = (users) => {
  const usersList = document.getElementById('users-list')
  usersList.innerHTML = ''

  if (users.length === 0) {
    usersList.innerHTML = '<p>Nenhum usuário encontrado.</p>'
    return
  }

  users.forEach((user, userIndex) => {
    const userElement = document.createElement('div')
    userElement.classList.add('user-item', 'mb-4')

    let playlistsHtml = ''
    user.playlists.forEach((playlist, index) => {
      playlistsHtml += `
          <li>
            ${playlist.nome} - ${playlist.musicas.length} músicas
            <button class="btn btn-primary btn-sm" id="view-playlist-btn-${userIndex}-${index}">Ver Playlist</button>
          </li>`
    })

    userElement.innerHTML = `
        <h4>${user.username}</h4>
        <ul>${playlistsHtml}</ul>
      `

    usersList.appendChild(userElement)

    user.playlists.forEach((playlist, index) => {
      document
        .getElementById(`view-playlist-btn-${userIndex}-${index}`)
        .addEventListener('click', () => {
          viewPlaylist(user.username, index)
        })
    })
  })
}

export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search)
  const username = params.get('user')
  const playlistIndex = params.get('playlist')
  return { username, playlistIndex }
}

export const displayPlaylist = () => {
  const { username, playlistIndex } = getQueryParams()

  const user = usersData.find((user) => user.username === username)
  const playlist = user ? user.playlists[playlistIndex] : null

  const playlistContainer = document.getElementById('user-playlist-container')

  if (playlist && playlistContainer) {
    const userPlaylistDetailTitle = document.getElementById(
      'user-playlist-detail'
    )
    userPlaylistDetailTitle.innerHTML = `<h2 id="user-playlist-detail">Detalhes da Playlist de ${username}</h2>`

    playlistContainer.innerHTML = `
      <h3>Playlist: ${playlist.nome}</h3>
      <ul>
        ${playlist.musicas
          .map(
            (musica, index) => `
          <li>
            <h4>${musica.titulo}</h4>
          </li>
          <div>
            ${getMusicPlayer(musica.link)}
            <br/>
          </div>
        `
          )
          .join('')}
      </ul>
    `
  } else if (playlistContainer) {
    playlistContainer.innerHTML = '<p>Playlist não encontrada.</p>'
  }
}

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

document.addEventListener('DOMContentLoaded', displayPlaylist)
