import { addEventListenerToElement } from './get-element.js'
import { music, playlist } from '../script.js'

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
