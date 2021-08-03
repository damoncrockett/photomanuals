import React, { Component } from 'react';
import Landing from './Landing';
import Intro from './Intro';
import App from './App';
import Interpretation from './Interpretation';
import Collaborate from './Collaborate';
import Credits from './Credits';

class Site extends Component {

  constructor(props) {

    super(props);

    this.state = {
      LandingSwitch: true,
      IntroSwitch: false,
      AppSwitch: false,
      InterpSwitch: false,
      CollabSwitch: false,
      CreditSwitch: false
     };

     this.handleLanding = this.handleLanding.bind(this);
     this.handleIntro = this.handleIntro.bind(this);
     this.handleApp = this.handleApp.bind(this);
     this.handleInterp = this.handleInterp.bind(this);
     this.handleCollab = this.handleCollab.bind(this);
     this.handleCredits = this.handleCredits.bind(this);

  }

  componentDidMount() {

  }

  handleLanding() {
    this.setState(state => ({
      LandingSwitch: true,
      IntroSwitch: false,
      AppSwitch: false,
      InterpSwitch: false,
      CollabSwitch: false,
      CreditSwitch: false
    }));
  }

  handleIntro() {
    this.setState(state => ({
      LandingSwitch: false,
      IntroSwitch: true,
      AppSwitch: false,
      InterpSwitch: false,
      CollabSwitch: false,
      CreditSwitch: false
    }));
  }

  handleApp() {
    this.setState(state => ({
      LandingSwitch: false,
      IntroSwitch: false,
      AppSwitch: true,
      InterpSwitch: false,
      CollabSwitch: false,
      CreditSwitch: false
    }));
  }

  handleInterp() {
    this.setState(state => ({
      LandingSwitch: false,
      IntroSwitch: false,
      AppSwitch: false,
      InterpSwitch: true,
      CollabSwitch: false,
      CreditSwitch: false
    }));
  }

  handleCollab() {
    this.setState(state => ({
      LandingSwitch: false,
      IntroSwitch: false,
      AppSwitch: false,
      InterpSwitch: false,
      CollabSwitch: true,
      CreditSwitch: false
    }));
  }

  handleCredits() {
    this.setState(state => ({
      LandingSwitch: false,
      IntroSwitch: false,
      AppSwitch: false,
      InterpSwitch: false,
      CollabSwitch: false,
      CreditSwitch: true
    }));
  }



  render() {

    return (
      <div className='site'>
        <div className='banner'>
          <span className='title'>TIPPs</span>
          <span className='subtitle'>TIPPED-IN PHOTOGRAPHIC PRINTS FROM EARLY PHOTOGRAPHY MANUALS</span>
          <div className='menu'>
            <button className="nav" onClick={this.handleLanding}>LANDING</button>
            <button className="nav" onClick={this.handleIntro}>INTRO</button>
            <button className="nav" onClick={this.handleApp}>APP</button>
            <button className="nav" onClick={this.handleInterp}>INTERPRETATION</button>
            <button className="nav" onClick={this.handleCollab}>COLLABORATION</button>
            <button className="nav" onClick={this.handleCredits}>CREDITS</button>
          </div>
        </div>
        <div>
          <Landing
            LandingSwitch={this.state.LandingSwitch}
          />
        </div>
        <div>
          <Intro
            IntroSwitch={this.state.IntroSwitch}
          />
        </div>
        <div>
          <App
            AppSwitch={this.state.AppSwitch}
          />
        </div>
        <div>
          <Interpretation
            InterpSwitch={this.state.InterpSwitch}
          />
        </div>
        <div>
          <Collaborate
            CollabSwitch={this.state.CollabSwitch}
          />
        </div>
        <div>
          <Credits
            CreditSwitch={this.state.CreditSwitch}
          />
        </div>
      </div>
    )

  }
}

export default Site;
