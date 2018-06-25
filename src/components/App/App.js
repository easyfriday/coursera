import React  from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

Spotify.getAccessToken();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [
      ],
      playlistTracks: [],
      playlistName: '',
      searchTerm: ''
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.searchSpotify = this.searchSpotify.bind(this);
  }
  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
      this.setState({
        playlistTracks: this.state.playlistTracks.concat(track)
      }); 
  }
  removeTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      const index = this.state.playlistTracks.map(track => track.id).indexOf(track.id);
      this.state.playlistTracks.splice(index, 1);
      this.setState({
          playlistTracks: this.state.playlistTracks
        });
      return ;
    }
  }
  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    });
  }
  savePlaylist() {
    var trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({
      searchResults: []
    });
    this.updatePlaylistName('My playlist');
    //alert(trackURIs);
  }
  searchSpotify(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults});
    });
    this.setState({
      searchTerm: term
    }); 
    
  }
// This is for the future to do the loader read more here: https://auth0.com/blog/reactjs-authentication-tutorial/
  componentDidMount() {
    //alert('I have loaded')
  }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          {/* <!-- SearchBar component --> */}
          <SearchBar onSearch={this.searchSpotify} />

          <div className="App-playlist">
           {/* {/* <!-- Add a SearchResults component --> */}
          <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
          
          {/* <!-- Add a Playlist component --> */} 
          < Playlist playlistTracks={this.state.playlistTracks} playlistName={this.state.playlistName} onAdd={this.addTrack} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
