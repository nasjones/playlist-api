const PlaylistRecordsService = {
    getAllPlaylistRecordss(knex) {
        return knex.select('*').from('playlist_records')
    },
    getById(knex, id) {
        return knex.from('playlist_records').select('*').where('playlist_id', id)
    },
    insertPlaylistRecords(knex, newPlaylistRecord) {
        return knex
            .insert(newPlaylistRecord)
            .into('playlist_records')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deletePlaylistRecords(knex, id) {
        return knex('playlist_records')
            .where({ id })
            .delete()
    },
    updatePlaylistRecords(knex, id, newPlaylistRecordsFields) {
        return knex('playlist_records')
            .where({ id })
            .update(newPlaylistRecordsFields)
    },
}

module.exports = PlaylistRecordsService