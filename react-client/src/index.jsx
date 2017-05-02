import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';

import SearchBar from './components/SearchBar.jsx';
import MenuBar from './components/MenuBar.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      leftMenu: false
    }
    this.menuOpen = this.menuOpen.bind(this);
    this.search = this.search.bind(this);
  }

  componentDidMount() {
  }

  search(input) {
    console.log('SEARCH INPUT', input);
    // $.ajax({
    //   url: `http://127.0.0.1:3000/search?query=${input}`,
    //   type: 'GET',
    //   success: (data) => {
    //     this.setState({
    //       data: data
    //     })
    //   },
    //   error: (err) => {
    //     throw err;
    //   }
    // })
  }

  menuOpen() {
    console.log('OPEN', this.state.leftMenu)
    this.setState({
      leftMenu: !this.state.leftMenu,
    });
  }



  render () {
    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            // children={<MenuBar onMenuOpen={this.onMenuOpen} />}
            title="WHERE AM I?"
            onLeftIconButtonTouchTap={this.menuOpen}
          />
            <SearchBar onSearch={this.search} />
            <MenuBar
              leftMenuStatus={this.state.leftMenu}
              onMenuOpen={this.menuOpen}/>
        </div>
      </MuiThemeProvider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
