import React, { Component } from 'react';
import Landing from './Landing';
import Intro from './Intro';
import App from './App';
import Interpretation from './Interpretation';
import Collaborate from './Collaborate';
import Credits from './Credits';

import { select } from 'd3-selection';
import { transition } from 'd3-transition';

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

    const bannerBottom = select("#banner").node().getBoundingClientRect().bottom;

    select("#banner")
      .append('div')
      .attr('id', 'marker')

    const markerH = select("#marker").node().getBoundingClientRect().height;

    //select("#marker")
    //  .style('top', bannerBottom - markerH + 'px')
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

    select("#marker")
      .style('background-color', 'rgba(0,0,0,0)')

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

    const buttonRect = select("#introButton").node().getBoundingClientRect();
    const buttonX = buttonRect.x;
    const buttonW = buttonRect.width;
    const buttonMid = buttonX + buttonW / 2;

    const markerW = select("#marker").node().getBoundingClientRect().width;
    const x = buttonMid - markerW / 2;

    select("#marker")
      .transition()
        .style('left', x + 'px')
        .style('background-color', 'hsl(0,0%,90%)')

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

    const buttonRect = select("#appButton").node().getBoundingClientRect();
    const buttonX = buttonRect.x;
    const buttonW = buttonRect.width;
    const buttonMid = buttonX + buttonW / 2;

    const markerW = select("#marker").node().getBoundingClientRect().width;
    const x = buttonMid - markerW / 2;

    select("#marker")
      .transition()
        .style('left', x + 'px')
        .style('background-color', 'hsl(0,0%,90%)')

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

    const buttonRect = select("#researchButton").node().getBoundingClientRect();
    const buttonX = buttonRect.x;
    const buttonW = buttonRect.width;
    const buttonMid = buttonX + buttonW / 2;

    const markerW = select("#marker").node().getBoundingClientRect().width;
    const x = buttonMid - markerW / 2;

    select("#marker")
      .transition()
        .style('left', x + 'px')
        .style('background-color', 'hsl(0,0%,90%)')

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

    const buttonRect = select("#collabButton").node().getBoundingClientRect();
    const buttonX = buttonRect.x;
    const buttonW = buttonRect.width;
    const buttonMid = buttonX + buttonW / 2;

    const markerW = select("#marker").node().getBoundingClientRect().width;
    const x = buttonMid - markerW / 2;

    select("#marker")
      .transition()
        .style('left', x + 'px')
        .style('background-color', 'hsl(0,0%,90%)')

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

    const buttonRect = select("#creditButton").node().getBoundingClientRect();
    const buttonX = buttonRect.x;
    const buttonW = buttonRect.width;
    const buttonMid = buttonX + buttonW / 2;

    const markerW = select("#marker").node().getBoundingClientRect().width;
    const x = buttonMid - markerW / 2;

    select("#marker")
      .transition()
        .style('left', x + 'px')
        .style('background-color', 'hsl(0,0%,90%)')

  }



  render() {

    return (
      <div className='site'>
        <div className="banner" id="banner">
          <button className="title" onClick={this.handleLanding}>TIPPs</button>
          <span className="subtitle">TIPPED-IN PHOTOGRAPHIC PRINTS FROM EARLY PHOTOGRAPHY MANUALS</span>
          <div className="menu">
            <button className="nav" id="introButton" onClick={this.handleIntro}>INTRO</button>
            <button className="nav" id="appButton" onClick={this.handleApp}>EXPLORE</button>
            <button className="nav" id="researchButton" onClick={this.handleInterp}>RESEARCH</button>
            <button className="nav" id="collabButton" onClick={this.handleCollab}>CONTACT</button>
            <button className="nav" id="creditButton" onClick={this.handleCredits}>CREDITS</button>
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
