export const SearchUsers = () => {
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

  const viewPlaylist = (username, playlistIndex) => {
    window.location.href = `user-playlist.html?user=${username}&playlist=${playlistIndex}`
  }

  return { displayUsers, viewPlaylist }
}
