
CREATE TABLE Playlists(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    title TEXT NOT NULL,
    length INTEGER NOT NULL,
    genre_id INTEGER
        REFERENCES Genres(id) ON DELETE CASCADE NOT NULL,
    author INTEGER 
        REFERENCES Users(id) ON DELETE CASCADE 

);
