export const SearchUsers = (storage) => {
  const displayUsers = async (search) => {
    const usersList = document.getElementById('users-list')
    storage.setResource('usuarios.php')
    usersList.innerHTML = ''

    const users = await storage.getItems()

    if (users.length === 0) {
      usersList.innerHTML = '<p>Nenhum usuário encontrado.</p>'
      return
    }

    let userHasNoPlaylist = false
    users.usuarios.forEach(async (user, userIndex) => {
      if (user.nome.toLowerCase().includes(search)) {
        let playlists = []
        storage.setResource(`playlists.php?usuario_id=${user.id}`)

        const allPlaylists = await storage.getItems()

        allPlaylists.forEach((playlist) => {
          if (playlist.usuario_id === user.id) playlists.push(playlist)
        })

        if (allPlaylists.some((playlist) => playlist.usuario_id === user.id)) {
          userHasNoPlaylist = false
        } else {
          userHasNoPlaylist = true
        }

        if (userHasNoPlaylist)
          playlists.push({ titulo: 'Nenhuma playlist encontrada.' })

        userHasNoPlaylist = false

        const userElement = document.createElement('div')
        userElement.classList.add('user-item', 'mb-4')

        let playlistsHtml = ''
        playlists.forEach((playlist, index) => {
          if (playlist.titulo === 'Nenhuma playlist encontrada.') {
            playlistsHtml += `
            <li>
              ${playlist.titulo}
             </li>`
          } else {
            playlistsHtml += `
            <li>
              ${playlist.titulo}
              <button class="btn btn-primary btn-sm" id="view-playlist-btn-${userIndex}-${index}">Ver Playlist</button>
            </li>`
          }
        })

        userElement.innerHTML = `
          <h4>${user.nome}</h4>
          <ul>${playlistsHtml}</ul>
        `

        usersList.appendChild(userElement)

        playlists.forEach((playlist, index) => {
          document
            .getElementById(`view-playlist-btn-${userIndex}-${index}`)
            .addEventListener('click', () => {
              viewPlaylist(user.nome, playlist.id)
            })
        })
      }
    })
  }

  const viewPlaylist = (username, playlistIndex) => {
    window.location.href = `user-playlist.html?user=${username}&playlist=${playlistIndex}`
  }

  const createUser = async () => {
    storage.setResource(`usuarios.php`)

    const name = document.getElementById('new-name').value.trim()
    const email = document.getElementById('new-email').value.trim()
    const senha = document.getElementById('new-password').value.trim()

    console.log('name', name)
    console.log('email', email)
    console.log('senha', senha)

    if (!name || !email || !senha) {
      alert('Por favor, preencha todos os campos.')
      return
    }

    const newUser = {
      nome: name,
      email: email,
      senha: senha
    }

    storage.save(newUser)

    document.getElementById('new-name').value = ''
    document.getElementById('new-email').value = ''
    document.getElementById('new-password').value = ''

    $('#createUserModal').modal('hide')

    await displayUsers('')
  }

  return { displayUsers, viewPlaylist, createUser }
}
