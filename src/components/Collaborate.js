import React, { Component } from 'react';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';

const screenH = window.innerHeight * window.devicePixelRatio;
const screenW = window.innerWidth * window.devicePixelRatio;

const filteredColor = 'rgba(0,27,46,0.75)'; // the background color

class Collaborate extends Component {
  constructor(props) {
    super(props);

    this.state = {}

  }

  componentDidMount() {

  }


  render() {
    if (this.props.CollabSwitch===true) {
      return (
        <div className='landing'>
          <div className='sectionTitle'>
            <span>Collaborate</span>
            <div className='sectionLine'></div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

export default Collaborate;
