import React, { Component } from 'react';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';

const screenH = window.innerHeight * window.devicePixelRatio;
const screenW = window.innerWidth * window.devicePixelRatio;

const filteredColor = 'rgba(0,27,46,0.75)'; // the background color

class Interpretation extends Component {
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
    if (this.props.InterpSwitch===true) {
      return (
        <div className='landing'>
          <div className='sectionTitle'>
            <span>Published Research</span>
            <div className='sectionLine'></div>
          </div>
          <div className='pubList'>
            <div className='publication'>
              <div className='pubTitle'>
                <span>Material Matters: The Transatlantic Trade in Photographic Materials during the Nineteenth Century</span>
              </div>
              <div className='pubAttribution'>
                <span>Katherine Mintie, Yale University</span>
              </div>
              <div className='pubBlurb'>
                <span>Examines the transatlantic circulation of photographic papers (both raw stock and coated papers) and lenses between the United States and Europe during the nineteenth century.</span>
              </div>
              <div className='pubLink'>
                <a className='pubLink' target='_blank' href='https://editions.lib.umn.edu/panorama/article/re-reading-american-photographs/material-matters/'>
                  <span>Read the Article</span>
                  <span className='material-icons medium'>description</span>
                </a>
              </div>
            </div>
            <div className='publication'>
              <div className='pubTitle'>
                <span>A Portrait on the Move: Photography Literature and Transatlantic Exchanges in the Nineteenth Century</span>
              </div>
              <div className='pubAttribution'>
                <span>Katherine Mintie, Yale University</span>
              </div>
              <div className='pubBlurb'>
                <span>Explores the international exchange of photographic prints through photography journals during the nineteenth century.</span>
              </div>
              <div className='pubLink'>
                <a className='pubLink' target='_blank' href='https://editions.lib.umn.edu/panorama/article/a-portrait-on-the-move/'>
                  <span>Read the Article</span>
                  <span className='material-icons medium'>description</span>
                </a>
              </div>
            </div>
            <div className='publication'>
              <div className='pubTitle'>
                <span>Commercially Manufactured Plain Papers in the United States, 1860-1900</span>
              </div>
              <div className='pubAttribution'>
                <span>Katherine Mintie, Yale University</span>
              </div>
              <div className='pubBlurb'>
                <span>Using evidence from nineteenth-century photography periodicals, the author shows that salted paper prints were used more widely in the United States than previously understood.</span>
              </div>
              <div className='pubLink'>
                <a className='pubLink' target='_blank' href='https://www.tandfonline.com/doi/full/10.1080/01971360.2020.1729615'>
                  <span>Read the Article</span>
                  <span className='material-icons medium'>description</span>
                </a>
              </div>
            </div>
            <div className='publication'>
              <div className='pubTitle'>
                <span>Manufacturing Photography, 1860-1900</span>
              </div>
              <div className='pubAttribution'>
                <span>Katherine Mintie, Yale University</span>
              </div>
              <div className='pubBlurb'>
                <span>A StoryMaps project to identify and map the manufacturers of various photographic materials–papers, dry plates, lenses, and other tool–used by photographers in the US and Europe during the nineteenth century.</span>
              </div>
              <div className='pubLink'>
                <a className='pubLink' target='_blank' href='https://storymaps.arcgis.com/collections/84e2a47552084d2e96b4c1d079f94786'>
                  <span>Visit the Project</span>
                  <span className='material-icons medium'>description</span>
                </a>
              </div>
            </div>
            <div className='publication'>
              <div className='pubTitle'>
                <span>The Hidden Value of Early Photographic Technology Manuals: Mapping the Genome of 19th Century Photography</span>
              </div>
              <div className='pubAttribution'>
                <span>Adrienne Lundgren, Library of Congress</span>
              </div>
              <div className='pubBlurb'>
                <span>From tintype plates to silver gelatin papers, 19th-century photographs were produced using manufactured supports and materials. Within the Library of Congress' vast holdings of photographic technology manuals, original 19th-century samples of identified photographic papers and products survive and when examined reveal hidden trends in the early development of photography.</span>
              </div>
              <div className='pubLink'>
                <a className='pubLink' target='_blank' href='https://www.loc.gov/item/webcast-8348'>
                  <span>View the Presentation</span>
                  <span className='material-icons medium'>description</span>
                </a>
              </div>
            </div>
            <div className='publication'>
              <div className='pubTitle'>
                <span>Platinum Toning of Silver Prints</span>
              </div>
              <div className='pubAttribution'>
                <span>Ronel Namde, The J. Paul Getty Museum and Joan M. Walker, National Gallery of Art</span>
              </div>
              <div className='pubBlurb'>
                <span>The use of platinum salts in the production of silver print papers imparted increased permanency as well as an aesthetic shift which allowed these relatively inexpensive papers to emulate more expensive platinum papers of the time.  This article features an “Aristo-Platino” sample from the Library of Congress dataset to illustrate this point.</span>
              </div>
              <div className='pubLink'>
                <a className='pubLink' target='_blank' href='https://www.culturalheritage.org/publications/books-periodicals/shop/platinum-and-palladium-photographs'>
                  <span>View the Anthology</span>
                  <span className='material-icons medium'>description</span>
                </a>
              </div>
            </div>
            <div className='publication'>
              <div className='pubTitle'>
                <span>Approaching Photographs as Data: An Introduction to Methods and Tools</span>
              </div>
              <div className='pubAttribution'>
                <span>Katherine Mintie, Yale University</span>
              </div>
              <div className='pubBlurb'>
                <span>A talk about the TIPPs project given at the Photography Network Symposium, October 8, 2021.</span>
              </div>
              <div className='pubLink'>
                <a className='pubLink' href={this.returnDomain()+'PhotographyNetworkOctober2021.mp4'} download>
                  <span>View the Presentation</span>
                  <span className='material-icons medium'>videocam</span>
                </a>
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

export default Interpretation;
