import React, { Component } from 'react';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';

const screenH = window.innerHeight * window.devicePixelRatio;
const screenW = window.innerWidth * window.devicePixelRatio;

const filteredColor = 'rgba(0,27,46,0.75)'; // the background color

class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {}

  }

  componentDidMount() {

  }


  render() {
    if (this.props.LandingSwitch===true) {
      return (
        <div className='landingPage'>
          <div className='landingBox'>
            <span className='landingBlurb'>
              A materials-focused database that allows users to explore the photographic prints tipped into international photography journals and manuals published between 1855 and 1900.
            </span>
            <div className='expandArrow'>
              <a href='#landingScrollPoint'><span className='material-icons large'>expand_more</span></a>
            </div>
            <div id='landingScrollPoint'></div>
          </div>
          <div className='landingContent'>
            <span className='landingSectionTitle'>Introducing TIPPs</span>
            <span className='landingText'>The Tipped-in Photographic Prints (TIPPs) database and website is a collaborative project between the <a href='https://lml.yale.edu/' target='_blank' className='landingLink'>Lens Media Lab</a> at <a href='https://www.yale.edu/' target='_blank' className='landingLink'>Yale University</a> and the <a href='https://www.loc.gov/' target='_blank' className='landingLink'>Library of Congress</a> to digitize and make searchable the hundreds of photographic samples tipped into photography journals and manuals published between 1855 and 1900. These publications, which were created by photographers primarily located in the United States and Europe to transmit innovations in photographic practice, featured chemical recipes for new print processes, equipment designs, various types of commentary, and, importantly, tipped-in photographic samples. These samples include photographic and photomechanical prints as well as samples of photographic tools and accessories (e.g. tintype mounts and vignetting papers). Though often viewed as mere embellishments, these tipped-in samples functioned as dense depositories of photographic knowledge. Precisely dated and frequently identified in terms of who made them, where they were made, how they were made, and what they are made of, these samples collectively offer an unparallel resource for examining the technological, material, and aesthetic development of the medium over its formative decades. TIPPs allows researchers to easily access and query this rich but hitherto overlooked repository of data on the early history of photography.</span>
            <span className='landingSectionTitle'>Project History and Methods</span>
            <span className='landingText'>TIPPs was first conceived in 2012 by <a href='https://www.instagram.com/missions_heliographiques/?hl=en' target='_blank' className='landingLink'>Adrienne Lundgren</a>, Senior Photograph Conservator at the Library of Congress, amidst discussions of moving the Library’s collection of nineteenth-century photography manuals and journals off site due to increasingly limited shelf space. Many of these works had been digitized by <a href='https://books.google.com/' target='_blank' className='landingLink'>Google Books</a>, <a href='https://www.hathitrust.org/' target='_blank' className='landingLink'>Hathi Trust</a>, and other organizations, and it was believed that these digital versions would be satisfactory surrogates for the originals. While the digitized copies did make the text of these works easier to access, the scans of the tipped-in samples were often of poor quality and their material specificity was lost. Recognizing the research value of these samples, Lundgren petitioned to keep the manuals and journals on site with the aim of cataloguing them for use as a reference collection.</span>
            <span className='landingText'>The process of building the initial database began in the summer of 2016 when <a href='https://ipch.yale.edu/people/kappy-mintie' target='_blank' className='landingLink'>Katherine “Kappy” Mintie</a>, now Senior Researcher in Art History at the Lens Media Lab, received a fellowship from the Library of Congress to assist Lundgren in documenting the tipped-in samples from works in the library’s collection. Over the course of that summer, they gathered metadata on and took high-resolution digital images of about 1,200 examples from 300 international photography manual and journal issues.</span>
            <span className='landingText'>The metadata they chose to collect focuses on various aspects of the creation of the tipped-in samples, including proprietary materials used to make them (lenses, plates, papers, coatings, etc.) and the various creators involved in their production (operators, studio owners, and printers). This information offers insight into the working methods of photographers, the transmission of technological innovations and aesthetic trends, and the development of the international photography industry, among other topics. While primarily geared towards historians and conservators of photography, this data can be productively mined by historians of science, business, the periodical press, among others.</span>
            <span className='landingText'>The descriptive metadata that Lundgren and Mintie recorded for each of the samples was initially stored in an Excel spreadsheet. However, it soon became clear that the project required a more powerful platform for searching through the large amount of data. For expertise in this area, they turned to <a href='https://ipch.yale.edu/people/paul-messier' target='_blank' className='landingLink'>Paul Messier</a>, Pritzker Director of the Lens Media Lab. Messier built a preliminary database in Microsoft Access with excellent search capacity. While a significant improvement from Excel, the Access database was not easy to share with colleagues because of the proprietary nature of the software. To create a more accessible version of TIPPs, <a href='https://ipch.yale.edu/people/damon-crockett' target='_blank' className='landingLink'>Damon Crockett</a>, the Principal Data Scientist at the Lens Media Lab, designed the online application that you find on the site today that allows any interested user to search as well as download the raw data.</span>
            <span className='landingText'>The current iteration of TIPPs is only the beginning of what the team envisions as a much larger dataset that will incorporate prints from journal and manuals held by other collections. If you are interested in collaborating with us to expand the dataset, please contact us at <span className='landingEmail'>tippsdatabase@gmail.com.</span></span>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

export default Landing;
