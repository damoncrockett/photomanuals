import React, { Component } from 'react';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';

const screenH = window.innerHeight * window.devicePixelRatio;
const screenW = window.innerWidth * window.devicePixelRatio;

const filteredColor = 'rgba(0,27,46,0.75)'; // the background color

class Credits extends Component {
  constructor(props) {
    super(props);

    this.state = {}

    this.returnDomain = this.returnDomain.bind(this);

  }

  componentDidMount() {

  }

  returnDomain() {
    const production = process.env.NODE_ENV === 'production';
    return production ? '' : 'http://localhost:8888/'
  }

  render() {
    if (this.props.CreditSwitch===true) {
      return (
        <div className='landing'>
          <div className='sectionTitle'>
            <span>Credits</span>
            <div className='sectionLine'></div>
          </div>
          <div className='creditFrame'>
            <div className='credit'>
              <div className='imageMat'>
                <img className='creditImage' src={this.returnDomain()+'lundgren.jpg'} />
              </div>
              <div className='creditName'>ADRIENNE LUNDGREN</div>
              <div className='creditRole'>concept, data collection and analysis</div>
              <div className='creditTitle'>Senior Photographs Conservator, <span className='creditTitleAffiliation'>Library of Congress</span></div>
              <div className='creditLink'></div>
            </div>
            <div className='credit'>
              <div className='imageMat'>
                <img className='creditImage' src={this.returnDomain()+'mintie.jpg'} />
              </div>
              <div className='creditName'>KATHERINE 'KAPPY' MINTIE</div>
              <div className='creditRole'>data collection and analysis</div>
              <div className='creditTitle'>Senior Researcher, <span className='creditTitleAffiliation'>Lens Media Lab, Yale University</span></div>
              <div className='creditLink'></div>
            </div>
            <div className='credit'>
              <div className='imageMat'>
                <img className='creditImage' src={this.returnDomain()+'messier.jpg'} />
              </div>
              <div className='creditName'>PAUL MESSIER</div>
              <div className='creditRole'>database design</div>
              <div className='creditTitle'>Pritzker Director, <span className='creditTitleAffiliation'>Lens Media Lab, Yale University</span></div>
              <div className='creditLink'></div>
            </div>
            <div className='credit'>
              <div className='imageMat'>
                <img className='creditImage' src={this.returnDomain()+'crockett.jpg'} />
              </div>
              <div className='creditName'>DAMON CROCKETT</div>
              <div className='creditRole'>application and website design</div>
              <div className='creditTitle'>Principal Data Scientist, <span className='creditTitleAffiliation'>Lens Media Lab, Yale University</span></div>
              <div className='creditLink'></div>
            </div>
            <div className='creditBlurbFrame'>
              <div className='creditBlurb'>
                <span>If you use our database or application in your work, please cite the TIPPs project as follows:</span>
              </div>
              <div className='creditBlurb'>
                <span className='creditCite'>Lundgren, A., Mintie, K., Messier, P., and D. Crockett. TIPPS: Tipped-in photographic prints from early photography manuals, https://tipps.yalepages.org, accessed on [date]</span>
              </div>
            </div>
            <div className='creditBlurbFrame'>
              <div className='creditBlurb'>
                <span>If you'd like more information about our research groups, visit the <a className='landingLink' href='https://lml.yale.edu/' target='_blank'>Lens Media Lab</a> and the <a className='landingLink' href='https://www.loc.gov/preservation/conservators/' target='_blank'>Library of Congress Conservation Division.</a></span>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

export default Credits;
