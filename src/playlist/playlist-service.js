const PlaylistsService = {
    getAllPlaylists(knex) {
        return knex.select('*').from('playlists')
    },
    getById(knex, id) {
        return knex.from('playlists').select('*').where('id', id).first()
    },
    insertPlaylist(knex, newPlaylist) {
        return knex
            .insert(newPlaylist)
            .into('playlists')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deletePlaylist(knex, id) {
        return knex('playlists')
            .where({ id })
            .delete()
    },
    updatePlaylist(knex, id, newPlaylistFields) {
        return knex('playlists')
            .where({ id })
            .update(newPlaylistFields)
    },
}

module.exports = PlaylistsService