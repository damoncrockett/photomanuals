import React, { Component } from 'react';
import App from './App';
import Page from './Page';

class Site extends Component {

  constructor(props) {

    super(props);

    this.state = {
      AppSwitch: false,
      PageSwitch: true,
     };

     this.handleMenu = this.handleMenu.bind(this);

  }

  componentDidMount() {

  }

  handleMenu() {
    this.setState(state => ({
      AppSwitch: !this.state.AppSwitch,
      PageSwitch: !this.state.PageSwitch
    }));
  }



  render() {

    return (
      <div className='site'>
        <div className='banner'>
          <span className='title'>TIPPs</span>
          <span className='subtitle'>TIPPED-IN PHOTOGRAPHIC PRINTS FROM EARLY PHOTOGRAPHY MANUALS</span>
          <button className="material-icons md-light large" onClick={this.handleMenu}>menu</button>
        </div>
        <div>
          <App
            AppSwitch={this.state.AppSwitch}
          />
        </div>
        <div>
          <Page
            PageSwitch={this.state.PageSwitch}
          />
        </div>
      </div>
    )

  }
}

export default Site;
