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
              <span>TIPPs emerged through a long-term collaboration between the Library of Congress and the Lens Media Lab at Yale University. Building on the success of this model, we seek to expand the database through new partnerships, especially museums and libraries that hold significant collections of early photography literature. If you are interested in partnering with us, please review the below information and then email us at <span className='pubEmail'>tippsdatabase@gmail.com.</span></span>
            </div>
            <div className='collabBlurb'>
              <span>Before reaching out to us, we request that you review the holdings of nineteenth-century manuals and periodicals with tipped-in photographic prints in your home collection. To jumpstart the search process, we have created a <a className='landingLink' href='http://google.com'>list</a> of titles featured in the current dataset. We recommend making an initial list of the titles of interest at your institution and appending that list to your email to us. We also encourage you to consult with your internal team members about your interest in partnering on the TIPPs in advance of corresponding with us.</span>
            </div>
            <div className='collabBlurb'>
              <span>Thank you for your interest in the TIPPs and please be in touch with any questions.</span>
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
