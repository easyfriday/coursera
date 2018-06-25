
const redirectURI = 'http://jamming-agony.surge.sh';
const clientID = '97ee34fd53f64ca595ed4c52d0db88ee';
const spotifyLoginURL = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientID}&redirect_uri=${redirectURI}`;
const spotifySearchURL = `https://api.spotify.com/v1/search?type=TRACK&redirect_uri=${redirectURI}&q=`;
const spotifyPlaylistURL = `https://accounts.spotify.com/authorize?response_type=token&scope=playlist-modify-public&client_id=${clientID}&redirect_uri=${redirectURI}`;
var accessToken = undefined;
var expiresIn = undefined;

const Spotify = {
    getAccessToken() {
        if (accessToken) {
          return accessToken;
        }
        accessToken = window.location.href.match(/access_token=([^&]*)/);
        expiresIn = window.location.href.match(/expires_in=([^&]*)/);
        if (accessToken && expiresIn) {
            accessToken = accessToken[0].replace("access_token=",'')
            expiresIn = expiresIn[0].replace("expires_in=",'')
          window.setTimeout(() => accessToken = '', expiresIn * 1000);
          window.history.pushState('Access Token', null, '/');
        } else {
          window.location = spotifyLoginURL;
        }
      },
    search(term) {
        return fetch(spotifySearchURL + term.replace(' ', '%20'), {
            headers: {
                Authorization: `Bearer ${accessToken}`
              }
        }).then(response => {
            return response.json();
          }).then(jsonResponse => {
              if(!jsonResponse.tracks) return[];
                return jsonResponse.tracks.items.map(track => {
                    return {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    url: track.uri
                    }
                })
          });
    },
    savePlaylist(name, trackURIs) {
        if (!name || !trackURIs || trackURIs.length === 0) return;
        const userURL = 'https://api.spotify.com/v1/me';
        const headers = {
          Authorization: `Bearer ${accessToken}`
        };
        let userID = undefined;
        let playlistID = undefined;
        fetch(userURL, {
          headers: headers 
        }).then(response => response.json())
        .then(jsonResponse => userID = jsonResponse.id)
        .then(() => {
          const createPlaylistURL = `https://api.spotify.com/v1/users/${userID}/playlists`;
          fetch(createPlaylistURL, {
              method: 'POST',
              headers: headers,
              body: JSON.stringify({
                name: name
              })
            }).then(response => response.json())
            .then(jsonResponse => playlistID = jsonResponse.id)
            .then(() => {
              const addPlaylistTracksURL = `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`;
              fetch(addPlaylistTracksURL, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                  uris: trackURIs
                })
              });
            })
        })
    }
}

export default Spotify