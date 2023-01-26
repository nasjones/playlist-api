const GenresService = {
	getAllGenres(knex) {
		return knex.select("*").from("playlist_genre");
	},
	getById(knex, id) {
		return knex.from("playlist_genre").select("*").where("id", id).first();
	},
	insertGenre(knex, newGenre) {
		return knex
			.insert(newGenre)
			.into("playlist_genre")
			.returning("*")
			.then((rows) => {
				return rows[0];
			});
	},
	deleteGenre(knex, id) {
		return knex("playlist_genre").where({ id }).delete();
	},
	updateGenre(knex, id, newGenreFields) {
		return knex("playlist_genre").where({ id }).update(newGenreFields);
	},
};

module.exports = GenresService;
