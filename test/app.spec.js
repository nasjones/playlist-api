const app = require("../src/app");
const fixtures = require("./playlist-fixture");
const knex = require("knex");

describe("App", () => {
	let db;

	before("make knex instance", () => {
		db = knex({
			client: "pg",
			connection: process.env.TEST_DATABASE_URL,
		});
		app.set("db", db);
	});

	after("disconnect from db", () => db.destroy());

	before("cleanup", () => db("playlists").truncate());

	afterEach("cleanup", () => db("playlists").truncate());

	describe(`Unauthorized requests`, () => {
		const testPlaylists = fixtures.makePlaylists();

		beforeEach("insert playlist", () => {
			return db.into("playlists").insert(testPlaylists);
		});

		it(`responds with 401 Unauthorized for GET /api/playlists`, () => {
			return supertest(app)
				.get("/api/playlists")
				.expect(401, { error: "Unauthorized request" });
		});

		it(`responds with 401 Unauthorized for POST /api/playlists`, () => {
			return supertest(app)
				.post("/api/playlists")
				.send({
					title: "test-title",
					url: "http://some.thing.com",
					rating: 1,
				})
				.expect(401, { error: "Unauthorized request" });
		});

		it(`responds with 401 Unauthorized for GET /api/playlists/:id`, () => {
			const secondPlaylist = testPlaylists[1];
			return supertest(app)
				.get(`/api/playlists/${secondPlaylist.id}`)
				.expect(401, { error: "Unauthorized request" });
		});

		it(`responds with 401 Unauthorized for DELETE /api/playlists/:id`, () => {
			const aPlaylist = testPlaylists[1];
			return supertest(app)
				.delete(`/api/playlists/${aPlaylist.id}`)
				.expect(401, { error: "Unauthorized request" });
		});

		it(`responds with 401 Unauthorized for PATCH /api/playlists/:id`, () => {
			const aPlaylist = testPlaylists[1];
			return supertest(app)
				.patch(`/api/playlists/${aPlaylist.id}`)
				.send({ title: "updated-title" })
				.expect(401, { error: "Unauthorized request" });
		});
	});

	describe("GET /api/playlists", () => {
		context(`Given no playlists`, () => {
			it(`responds with 200 and an empty list`, () => {
				return supertest(app)
					.get("/api/playlists")
					.set("Authorization", `Bearer ${process.env.SPOTIFY_KEY}`)
					.expect(200, []);
			});
		});

		context("Given there are playlists in the database", () => {
			const testPlaylists = fixtures.makePlaylists();

			beforeEach("insert playlists", () => {
				return db.into("playlists").insert(testPlaylists);
			});

			it("gets the playlists from the store", () => {
				return supertest(app)
					.get("/api/playlists")
					.set("Authorization", `Bearer ${process.env.SPOTIFY_KEY}`)
					.expect(200, testPlaylists);
			});
		});

		context(`Given an XSS attack playlist`, () => {
			const { maliciousPlaylist, expectedPlaylist } =
				fixtures.makeMaliciousPlaylist();

			beforeEach("insert malicious playlist", () => {
				return db.into("playlists").insert([maliciousPlaylist]);
			});

			it("removes XSS attack content", () => {
				return supertest(app)
					.get(`/api/playlists`)
					.set("Authorization", `Bearer ${process.env.SPOTIFY_KEY}`)
					.expect(200)
					.expect((res) => {
						expect(res.body[0].title).to.eql(
							expectedPlaylist.title
						);
						expect(res.body[0].description).to.eql(
							expectedPlaylist.description
						);
					});
			});
		});
	});

	describe("POST /api/playlists", () => {
		["title", "genre_id", "length"].forEach((field) => {
			const newPlaylist = {
				title: "test-title",
				genre_id: 3,
				length: "1232132",
			};

			it(`responds with 400 missing '${field}' if not supplied`, () => {
				delete newPlaylist[field];

				return supertest(app)
					.post(`/api/playlists`)
					.send(newPlaylist)
					.set("Authorization", `Bearer ${process.env.SPOTIFY_KEY}`)
					.expect(400, {
						error: { message: `'${field}' is required` },
					});
			});
		});

		it("adds a new playlist to the store", () => {
			const newPlaylist = {
				title: "test-title",
				genre_id: 3,
				length: "1232132",
			};
			return supertest(app)
				.post(`/api/playlists`)
				.send(newPlaylist)
				.set("Authorization", `Bearer ${process.env.SPOTIFY_KEY}`)
				.expect(201)
				.expect((res) => {
					expect(res.body.title).to.eql(newPlaylist.title);
					expect(res.body.url).to.eql(newPlaylist.url);
					expect(res.body.description).to.eql(
						newPlaylist.description
					);
					expect(res.body.rating).to.eql(newPlaylist.rating);
					expect(res.body).to.have.property("id");
					expect(res.headers.location).to.eql(
						`/api/playlists/${res.body.id}`
					);
				})
				.then((res) =>
					supertest(app)
						.get(`/api/playlists/${res.body.id}`)
						.set(
							"Authorization",
							`Bearer ${process.env.SPOTIFY_KEY}`
						)
						.expect(res.body)
				);
		});

		it("removes XSS attack content from response", () => {
			const { maliciousPlaylist, expectedPlaylist } =
				fixtures.makeMaliciousPlaylist();
			return supertest(app)
				.post(`/api/playlists`)
				.send(maliciousPlaylist)
				.set("Authorization", `Bearer ${process.env.SPOTIFY_KEY}`)
				.expect(201)
				.expect((res) => {
					expect(res.body.title).to.eql(expectedPlaylist.title);
					expect(res.body.description).to.eql(
						expectedPlaylist.description
					);
				});
		});
	});
});
