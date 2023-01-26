const UsersService = {
	getAllusers(knex) {
		return knex.select("*").from("playlist_user");
	},
	getById(knex, id) {
		return knex.from("playlist_user").select("*").where("id", id).first();
	},
	insertUser(knex, newUser) {
		return knex
			.insert(newUser)
			.into("playlist_user")
			.returning("*")
			.then((rows) => {
				return rows[0];
			});
	},
	deleteUser(knex, id) {
		return knex("playlist_user").where({ id }).delete();
	},
	updateUser(knex, id, newUserFields) {
		return knex("playlist_user").where({ id }).update(newUserFields);
	},
};

module.exports = UsersService;
