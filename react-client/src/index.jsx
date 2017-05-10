import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import axios from 'axios';

import annyang from 'annyang';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Speaker from 'material-ui/svg-icons/hardware/keyboard-voice';
import FlatButton from 'material-ui/FlatButton';

import List from './components/List';
import SearchBar from './components/SearchBar';
import MenuBar from './components/MenuBar';
import MainDisplay from './components/MainDisplay';
import LoadingScreen from './components/LoadingScreen';
import FavoriteView from './components/FavoriteView';

injectTapEventPlugin();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
      favData: undefined,
      favView: false,
      mainView: true,
      leftMenu: false,
      isLoading: true,
      coords: false,
    };
    this.menuOpen = this.menuOpen.bind(this);
    this.search = this.search.bind(this);
    this.startSpeech = this.startSpeech.bind(this);
    this.clickFav = this.clickFav.bind(this);
    this.saveToFavorite = this.saveToFavorite.bind(this);
  }

 componentWillMount() {
    const getCoords = () => new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve({ lat: position.coords.latitude, long: position.coords.longitude });
      });
    });

   getCoords().then((response) => {
      this.setState({
        coords: true,
      });
      axios.post('/location', response);
    });
  }

  componentDidMount() {
    this.search('');
    // need axios request for favData on load;
  }

  saveToFavorite(fav) {
  // axios.post('/saveToFav', this.props.data);
  console.log('in saveToFavorite in MainDisplay.jsx');
  console.log('this.props.data in saveToFavorite in index.jsx', fav); 

  axios.post('/saveToFav', fav)
    .then(response => {
      console.log('response for axios post', response); 
    })

    .catch(error => {
      console.log('SOMETHING WRONG IN MAIN DISPLAY.JSX', error); 
    }); 
  }

 startSpeech() {
    if (annyang) {
      const commands = {
        'show me *input': (input) => {
          this.search(input);
        },
      };
      annyang.addCommands(commands);
      annyang.debug();
      annyang.start();
    }
  }

  clickFav() {
    console.log('FAV CLICKY')
    this.setState({
      favView: !this.state.favView,
      mainView: !this.state.mainView,
    });
  }

  search(input) {
    this.setState({
      isLoading: true,
    })
    console.log('CLICKY', input);
    axios.get(`/search?query=${input}`)
    .then((response) => {
      this.setState({
        data: response.data,
        isLoading: false,
      });
    })
    .catch((error) => {
      console.warn(error);
    });
  }

 menuOpen() {
    console.log('OPEN', this.state.leftMenu);
    this.setState({
      leftMenu: !this.state.leftMenu,
    });
  }

  render() {
    const isDataEmpty = this.state.data;
    const isLoading = this.state.isLoading;
    const isMainView = this.state.mainView;
    const isFavVIew = this.state.favView;
    // const isCorrds = this.state.coords;
    return (
      <MuiThemeProvider>
        {(isLoading && isMainView) ? (
          <LoadingScreen />
        ) : (
          <div>
            <AppBar
              title='WHERE AM I?'
              style={{ backgroundColor: '#FFA726 ' }}
              onLeftIconButtonTouchTap={this.menuOpen}
            />
            <SearchBar onSearch={this.search} />
            <FlatButton
              icon={<Speaker alt="Speaker" />}
              onTouchTap={this.startSpeech}
            />

            <List data={this.state.data} />

            <MenuBar
              leftMenuStatus={this.state.leftMenu}
              onMenuOpen={this.menuOpen}
              onClickFav={this.clickFav}
            />
            <div>
              <MainDisplay
                style={{ 'margin-top': '20px' }}
                data={this.state.data}
                onSave={this.saveToFavorite}
              />
            </div>
            {/* <FavoriteView data={this.state.data} /> */}
          </div>
        )}
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
