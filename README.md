# Showtunes API
 ## Summary:
 This is api is used for my Showtunes app it has the following endpoints for use by users: auth, data, genres, and playlists. There is also a users endpoint but this was placed in case of further update to the code. 
 The program utilizes Javascript, React, Node, Express, and PostgreSQL.

 At this moment in time the endpoints are supported in the following
  - auth - GET (This endpoint is used to authorize the usage of the spotify api since a new api code is needed every hour there is a timer in the app so that when the call is made to this endpoint if the hour is up it will re authorize by communicating with the spotify api and receiving a new key)
  - data - POST (This endpoint is used to get the song information from the spotify api the post request contains the genre information)
  - genres - GET (This endpoint is used to get the available genres on the server or one specific genre using the id parameter)
  - playlists - GET / POST (This endpoint is used to get the existing playlists from the endpoint either all of them or only one using the id parameter as well as post the new playlists to the endpoint)

  - the get requests for all of the endpoints look like the following : 
    method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.REACT_APP_API_KEY}`
      }
    - the post request for the data endpoint is as follows:
     let newPlaylist = {
            title: this.state.title.trim(),
            length: time,
            genre_id: this.state.selectedId,
            author: 1
        }

        fetch(`${config.ENDPOINT}/playlists`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${config.REACT_APP_API_KEY}`
            },
            body: JSON.stringify(newPlaylist),
        })
        this would return your new playlist as
        {genre_id: "selected genre id"
        id: "newplaylistid"
        length: "runtime"
        title: "playlist name"}
    - the post request for the data endpoint is:

     let queryString = 'genre:%20' + genre.name + '&type=track&limit=50&offset=' + rand

        let fetData = { qString: queryString,}
                       
        fetch(`${config.ENDPOINT}/data`, {
             method: 'POST',
             headers: {
                 'content-type': 'application/json',
                 'Authorization': `Bearer ${config.REACT_APP_API_KEY}`  },
                 body: JSON.stringify(fetData),
                        })
        this would return an object from the spotify api full of 10000 songs the 
