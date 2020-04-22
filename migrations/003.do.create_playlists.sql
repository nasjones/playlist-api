
CREATE TABLE Playlists(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    title TEXT NOT NULL,
    length TIMESTAMPTZ NOT NULL,
    author INTEGER 
        REFERENCES Users(id) ON DELETE CASCADE NOT NULL,
    genres INTEGER 
        REFERENCES genres(id) ON DELETE CASCADE NOT NULL
);
