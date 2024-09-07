import { addEventListenerToElement } from './get-element.js'
import { music, playlist, searchUsers } from '../script.js'
import { usersData } from './mock/usersData.js'

export class Helpers {
  static extractYouTubeID(url) {
    const regex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  static extractSpotifyID(url) {
    const regex =
      /(?:spotify\.com\/(?:intl-[a-z]{2}\/)?track\/)([a-zA-Z0-9]{22})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  static getMusicPlayer = (link) => {
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

  static generateUUID() {
    if (crypto.randomUUID) {
      return crypto.randomUUID()
    } else {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
          const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 0x0f) >> 0
          const v = c === 'x' ? r : (r & 0x3) | 0x8
          return v.toString(16)
        }
      )
    }
  }

  static callIndexEventListeners() {
    addEventListenerToElement('search-users-btn', () => {
      window.location.href = 'search-users.html'
    })
  }

  static callSearchUsersEventListeners() {
    document.getElementById('search-input').addEventListener('input', (e) => {
      const searchValue = e.target.value.toLowerCase().trim()
      const blankSpaceRegex = /^\s*$/
      if (blankSpaceRegex.test(searchValue)) return displayUsers([])
      const filteredUsers = usersData.filter((user) =>
        user.username.toLowerCase().includes(searchValue)
      )
      searchUsers.displayUsers(filteredUsers)
    })
  }

  static callPlaylistEventListeners() {
    addEventListenerToElement('add-playlist-btn', playlist.adicionarPlaylist)
    addEventListenerToElement(
      'edit-playlist-btn',
      playlist.editarPlaylist,
      true
    )
    addEventListenerToElement(
      'remove-playlist-btn',
      playlist.removerPlaylist,
      true
    )
    addEventListenerToElement(
      'get-music-of-playlist-btn',
      playlist.acessarPlaylist,
      true
    )
  }

  static callMusicEventListeners() {
    addEventListenerToElement('add-music-btn', music.adicionarMusica)
    addEventListenerToElement('edit-music-btn', music.editarMusica, true)
    addEventListenerToElement('remove-music-btn', music.removerMusica, true)
  }
}
