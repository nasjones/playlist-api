const GenresService = {
    getAllGenres(knex) {
        return knex.select('*').from('genres')
    },
    getById(knex, id) {
        return knex.from('genres').select('*').where('id', id).first()
    },
    insertGenre(knex, newGenre) {
        return knex
            .insert(newGenre)
            .into('genres')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteGenre(knex, id) {
        return knex('genres')
            .where({ id })
            .delete()
    },
    updateGenre(knex, id, newGenreFields) {
        return knex('genres')
            .where({ id })
            .update(newGenreFields)
    },
}

module.exports = GenresService