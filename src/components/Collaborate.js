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
          <div className='collabFrame'>
            <div className='collabBlurb'>
              <span>TIPPs emerged through a long-term collaboration between the Library of Congress and the Lens Media Lab at Yale University. Building on the success of this model, we seek to expand the database through new partnerships, especially museums and libraries that hold significant collections of early photography literature. If you are interested in partnering with us, please send an email to <span className='pubEmail'>tipps@gmail.com.</span></span>
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

export default Collaborate;
