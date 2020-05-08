function makePlaylists() {
    return [{
        id: 1,
        title: "Acoustic Test One",
        genre_id: 1,
        length: '1860000'

    },
    {
        id: 2,
        title: "Acoustic Test Two",
        genre_id: 1,
        length: '1560230'

    }]
}

function makeMaliciousPlaylist() {
    const maliciousPlaylist = {
        id: 911,
        title: 'Naughty naughty very naughty <script>alert("xss");</script>',
        genre_id: 1,
        length: '1720230',
    }
    const expectedPlaylist = {
        ...maliciousPlaylist,
        title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    }
    return {
        maliciousPlaylist,
        expectedPlaylist,
    }
}

module.exports = {
    makePlaylists,
    makeMaliciousPlaylist
}