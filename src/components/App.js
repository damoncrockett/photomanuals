import React, { Component } from 'react';
import Tabletop from './Tabletop';
import { isEqual } from 'lodash';
import { orderBy } from 'lodash';

const innerW = window.innerWidth;
const innerH = window.innerHeight;
const aspectRatio = innerW / ( innerH * 0.9 ); // bc nav bar

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { // global state
      data: null,
      colOut: true,
      colMed: false,
      colIn: false,
      ncol: 0,
      ncolOut: 0,
      orderBy: 'year',
      colorBy: 'decade_c',
      color: false,
      click: false,
      infoCollapse: true,
      asc: 'asc',
      filter: false,
      filterModal: false,
      filterChangeSignal: false,
      filterLists: {
        'title': [],
        'author': [],
        'year': [],
        'specattr': [],
        'specattrloc': [],
        'specneg': [],
        'specnegloc': [],
        'specop': [],
        'sprocess': [],
        'photomech': [],
        'hasphoto': [],
        'paperman': [],
        'paperbran': [],
        'paperloc': [],
        'negman': [],
        'negbran': [],
        'negloc': [],
        'lensman': [],
        'lensbran': [],
        'lensloc': [],
        'mountman': [],
        'mountloc': [],
        'coatman': [],
        'coatloc': [],
        'accman': [],
        'accloc': [],
        'subj': [],
        'negman_k': [],
        'mountman_k': [],
        'lensman_k': [],
        'accman_k': [],
        'coatman_k': [],
        'paperman_k': []
      },
      filterExpandList: [
        'hasphoto',
        'photomech',
        'negman_k',
        'mountman_k',
        'lensman_k',
        'accman_k',
        'coatman_k',
        'paperman_k'
      ],
      filterOptions: [],
      nn: null,
      nnMode: false
    };

    this.getData = this.getData.bind(this);
    this.getFilter = this.getFilter.bind(this);
    this.getNN = this.getNN.bind(this);
    this.handleNNmode = this.handleNNmode.bind(this);
    this.handleOrderBy = this.handleOrderBy.bind(this);
    this.handleColorBy = this.handleColorBy.bind(this);
    this.handleColor = this.handleColor.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleInfoCollapse = this.handleInfoCollapse.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleFilterModal = this.handleFilterModal.bind(this);
    this.addToFilter = this.addToFilter.bind(this);
    this.handleFilterExpandList = this.handleFilterExpandList.bind(this);
    this.handleExpand = this.handleExpand.bind(this);
    this.handleCollapse = this.handleCollapse.bind(this);
    this.rmFromFilter = this.rmFromFilter.bind(this);
    this.handleOut = this.handleOut.bind(this);
    this.handleMed = this.handleMed.bind(this);
    this.handleIn = this.handleIn.bind(this);
    this.setCol = this.setCol.bind(this);
    this.returnDomain = this.returnDomain.bind(this);

  }

  getData() {
    fetch(this.returnDomain()+'_data.json')
      .then(response => response.json())
      .then(data => this.setState({
        data: data
      }));
    }

  getFilter() {
    fetch(this.returnDomain()+'_filter.json')
      .then(response => response.json())
      .then(data => this.setState({
        filterOptions: data
      }));
    }

  getNN() {
    fetch(this.returnDomain()+'_nn.json')
      .then(response => response.json())
      .then(data => this.setState({
        nn: data
      }));
    }

  handleNNmode() {
    if ( this.state.nnMode === false ) {
      this.setState({ nnMode: true, click: false });
    } else if ( this.state.nnMode === true ) {
      this.setState({ nnMode: false });
    }
  }

  componentDidMount() {
    this.getData();
    this.getFilter();
    this.getNN();
  }

  setCol() {
    const n = this.state.data.length;
    let x = 0;

    if (this.state.filterModal===false & this.state.infoCollapse===true) {
      x = Math.sqrt( n * aspectRatio );
    } else {
      x = Math.sqrt( n );
    }

    const ncol = Math.round(x);

    this.setState(state => ({
      ncol: ncol,
      ncolOut: ncol
    }));
  }

  componentDidUpdate(prevProps,prevState) {
    if (prevState.data === null & prevState.data !== this.state.data) {
      this.setCol();
    }

    if (prevState.filterModal !== this.state.filterModal) {
      this.setCol();
    }

    if (prevState.infoCollapse !== this.state.infoCollapse) {
      this.setCol();
    }
  }

  handleOrderBy(e) {
    const orderBy = e.target.value
    this.setState({ orderBy: orderBy });
  }

  handleColorBy(e) {
    const colorBy = e.target.value
    this.setState({ colorBy: colorBy });
  }

  handleColor() {
    this.setState(state => ({
      color: !this.state.color
    }));
  }

  handleClick() {
    if ( this.state.click === false ) {
      this.setState({ click: true, nnMode: false });
    } else if ( this.state.click === true ) {
      this.setState({ click: false });
    }
  }

  handleInfoCollapse(e) {

    const label = e.target.innerText;

    if ( label === 'expand_more' ) {
      this.setState(state => ({
        infoCollapse: true
      }));
    } else if ( label === 'expand_less' ) {
      this.setState(state => ({
        infoCollapse: false
      }));
    }
  }

  handleFilter() {

    this.setState(state => ({
      filter: false,
      filterLists: {
        'title': [],
        'author': [],
        'year': [],
        'specattr': [],
        'specattrloc': [],
        'specneg': [],
        'specnegloc': [],
        'specop': [],
        'sprocess': [],
        'photomech': [],
        'hasphoto': [],
        'paperman': [],
        'paperbran': [],
        'paperloc': [],
        'negman': [],
        'negbran': [],
        'negloc': [],
        'lensman': [],
        'lensbran': [],
        'lensloc': [],
        'mountman': [],
        'mountloc': [],
        'coatman': [],
        'coatloc': [],
        'accman': [],
        'accloc': [],
        'subj': [],
        'negman_k': [],
        'mountman_k': [],
        'lensman_k': [],
        'accman_k': [],
        'coatman_k': [],
        'paperman_k': []
      },
      filterChangeSignal: !this.state.filterChangeSignal
    }));
  }

  handleFilterModal(e) {

    const label = e.target.innerText;

    if ( label === 'filter_alt' ) {
      this.setState(state => ({
        filterModal: true
      }));
    } else if ( label === 'close' ) {
      this.setState(state => ({
        filterModal: false
      }));
    }
  }

  handleFilterExpandList(cat) {

    let filterExpandList = this.state.filterExpandList;

    return e => {

      if (filterExpandList.includes(cat)) {
        filterExpandList = filterExpandList.filter(d => d!==cat);
      } else {
        filterExpandList = [...filterExpandList,cat];
      }

      this.setState(state => ({
        filterExpandList: filterExpandList
      }));
    }
  }

  handleExpand() {
    this.setState(state => ({
      filterExpandList: Object.keys(this.state.filterLists)
    }));
  }

  handleCollapse() {
    this.setState(state => ({
      filterExpandList: []
    }));
  }

  addToFilter(cat) {

    let filterLists = this.state.filterLists;

    return e => {
      const label = e.target.innerText;

      filterLists[cat] = [...filterLists[cat],label];

      this.setState(state => ({
        filterLists: filterLists,
        filter: true,
        filterChangeSignal: !this.state.filterChangeSignal
      }));
    }
  }

  rmFromFilter(cat) {

    let filterLists = this.state.filterLists;

    return e => {
      const label = e.target.innerText;

      filterLists[cat] = filterLists[cat].filter(d => d!==label)

      // if the filterLists are all empty
      if ( isEqual(filterLists,{
        'title': [],
        'author': [],
        'year': [],
        'specattr': [],
        'specattrloc': [],
        'specneg': [],
        'specnegloc': [],
        'specop': [],
        'sprocess': [],
        'photomech': [],
        'hasphoto': [],
        'paperman': [],
        'paperbran': [],
        'paperloc': [],
        'negman': [],
        'negbran': [],
        'negloc': [],
        'lensman': [],
        'lensbran': [],
        'lensloc': [],
        'mountman': [],
        'mountloc': [],
        'coatman': [],
        'coatloc': [],
        'accman': [],
        'accloc': [],
        'subj': [],
        'negman_k': [],
        'mountman_k': [],
        'lensman_k': [],
        'accman_k': [],
        'coatman_k': [],
        'paperman_k': []
      }) ) {
        this.setState({filter:false})
      }

      this.setState(state => ({
        filterLists: filterLists,
        filterChangeSignal: !this.state.filterChangeSignal
      }));
    }
  }

  handleOut() {
    this.setState(state => ({
      ncol: this.state.ncolOut, colOut: true, colMed: false, colIn: false
    }));
  }

  handleMed() {
    this.setState(state => ({
      ncol: Math.round(this.state.ncolOut / 2 ), colOut: false, colMed: true, colIn: false
    }));
  }

  handleIn() {
    this.setState(state => ({
      ncol: Math.round(this.state.ncolOut / 4 ), colOut: false, colMed: false, colIn: true
    }));
  }

  returnDomain() {
    const production = process.env.NODE_ENV === 'production';
    return production ? '' : 'http://localhost:8888/'
  }

  render() {

    const bkgd = '#001b2e';
    const stroke = 'hsl(0,0%,90%)';
    const filterOptions = orderBy(this.state.filterOptions,'val','asc');

    const selectStyle = {
      backgroundColor: bkgd,
      color: stroke
    };

    const colorStyle = {
      backgroundColor: this.state.color ? stroke : bkgd,
      color: this.state.color ? bkgd : stroke
    };

    const clickStyle = {
      backgroundColor: this.state.click ? stroke : bkgd,
      color: this.state.click ? bkgd : stroke
    };

    const infoCollapseStyle = {
      backgroundColor: '#bd5319',
      color: stroke
    };

    const filterModalStyle = {
      backgroundColor: this.state.filterModal ? stroke : bkgd,
      color: this.state.filterModal ? bkgd : stroke
    };

    const filterStyle = {
      backgroundColor: this.state.filter ? stroke : bkgd,
      color: this.state.filter ? bkgd : stroke
    };

    const styleOut = {
      backgroundColor: this.state.colOut ? stroke : bkgd,
      color: this.state.colOut ? bkgd : stroke
    };

    const styleMed = {
      backgroundColor: this.state.colMed ? stroke : bkgd,
      color: this.state.colMed ? bkgd : stroke
    };

    const styleIn = {
      backgroundColor: this.state.colIn ? stroke : bkgd,
      color: this.state.colIn ? bkgd : stroke
    };

    const nnStyle = {
      backgroundColor: this.state.nnMode ? stroke : bkgd,
      color: this.state.nnMode ? bkgd : stroke
    };

    const filterLists = this.state.filterLists;

    if (this.props.AppSwitch===true) {
      return (
        <div className='app'>
          <div className='field'>
            <Tabletop
              data={this.state.data}
              ncol={this.state.ncol}
              orderBy={this.state.orderBy}
              colorBy={this.state.colorBy}
              color={this.state.color}
              click={this.state.click}
              infoCollapse={this.state.infoCollapse}
              asc={this.state.asc}
              filterLists={this.state.filterLists}
              filterChangeSignal={this.state.filterChangeSignal}
              filterModal={this.state.filterModal}
              nn={this.state.nn}
              nnMode={this.state.nnMode}
            />
          </div>
          <div className={this.state.infoCollapse? 'infoPanelCollapsed' : 'infoPanel'} id='infoPanel'>
            {[0].map(()=>{
              if ( this.state.infoCollapse===true ) {
                return <div className='infoButton'><button title='expand info panel' className="material-icons md-light small" onClick={this.handleInfoCollapse} style={infoCollapseStyle}>expand_less</button></div>
              } else {
                return <div className='infoButton'><button title='collapse info panel' className="material-icons md-light small" onClick={this.handleInfoCollapse} style={infoCollapseStyle}>expand_more</button></div>
              }
            })}
            <div className={this.state.infoCollapse? 'imgBoxCollapsed' : 'imgBox'} id='imgBox'>
            </div>
            <div className={this.state.infoCollapse? 'infoBoxCollapsed' : 'infoBox'} id='infoBox'>
              <div className='infoKeys' id='infoKeys'></div>
              <div className='infoVals' id='infoVals'></div>
            </div>
          </div>
          <div className='selectPanel'>
            <select style={selectStyle} value={this.state.orderBy} onChange={this.handleOrderBy} title='sort'>
              <option value='year'>year</option>
              <option value='hasphoto'>has photo</option>
              <option value='photomech'>photomechanical</option>
              <option value='negman_k'>has negative manuf. info</option>
              <option value='mountman_k'>has mount manuf. info</option>
              <option value='lensman_k'>has lens manuf. info</option>
              <option value='accman_k'>has accessory manuf. info</option>
              <option value='coatman_k'>has coating manuf. info</option>
              <option value='paperman_k'>has paper manuf. info</option>
              <option value='title'>title</option>
              <option value='author'>author</option>
              <option value='specattr'>printmaker</option>
              <option value='specattrloc'>printmaker location</option>
              <option value='specneg'>negativemaker</option>
              <option value='specnegloc'>negativemaker location</option>
              <option value='specop'>operator</option>
              <option value='sprocess'>photo process</option>
              <option value='paperman'>paper manufacturer</option>
              <option value='paperbran'>paper brand</option>
              <option value='paperloc'>paper manuf. location</option>
              <option value='negman'>negative manufacturer</option>
              <option value='negbran'>negative brand</option>
              <option value='negloc'>negative manuf. location</option>
              <option value='lensman'>lens manufacturer</option>
              <option value='lensbran'>lens brand</option>
              <option value='lensloc'>lens manuf. location</option>
              <option value='mountman'>mount manufacturer</option>
              <option value='mountloc'>mount manuf. location</option>
              <option value='coatman'>coating manufacturer</option>
              <option value='coatloc'>coating manuf. location</option>
              <option value='accman'>accessory manufacturer</option>
              <option value='accloc'>accessory manuf. location</option>
              <option value='subj'>photo subject</option>
              <option value='cluster'>cluster</option>
            </select>
            <select style={selectStyle} value={this.state.colorBy} onChange={this.handleColorBy} title='highlight category'>
              <option value='decade_c'>decade</option>
              <option value='hasphoto_c'>has photo</option>
              <option value='photomech_c'>photomechanical</option>
              <option value='negman_k_c'>has negative manuf. info</option>
              <option value='mountman_k_c'>has mount manuf. info</option>
              <option value='lensman_k_c'>has lens manuf. info</option>
              <option value='accman_k_c'>has accessory manuf. info</option>
              <option value='coatman_k_c'>has coating manuf. info</option>
              <option value='paperman_k_c'>has paper manuf. info</option>
              <option value='title_c'>title</option>
              <option value='author_c'>author</option>
              <option value='specattr_c'>printmaker</option>
              <option value='specattrloc_c'>printmaker location</option>
              <option value='specneg_c'>negativemaker</option>
              <option value='specnegloc_c'>negativemaker location</option>
              <option value='specop_c'>operator</option>
              <option value='sprocess_c'>photo process</option>
              <option value='paperman_c'>paper manufacturer</option>
              <option value='paperbran_c'>paper brand</option>
              <option value='paperloc_c'>paper manuf. location</option>
              <option value='negman_c'>negative manufacturer</option>
              <option value='negbran_c'>negative brand</option>
              <option value='negloc_c'>negative manuf. location</option>
              <option value='lensman_c'>lens manufacturer</option>
              <option value='lensbran_c'>lens brand</option>
              <option value='lensloc_c'>lens manuf. location</option>
              <option value='mountman_c'>mount manufacturer</option>
              <option value='mountloc_c'>mount manuf. location</option>
              <option value='coatman_c'>coating manufacturer</option>
              <option value='coatloc_c'>coating manuf. location</option>
              <option value='accman_c'>accessory manufacturer</option>
              <option value='accloc_c'>accessory manuf. location</option>
              <option value='subj_c'>photo subject</option>
              <option value='cluster_c'>visual cluster</option>
            </select>
            <button title='highlight' className="material-icons md-light small" onClick={this.handleColor} style={colorStyle}>highlight</button>
            <button title='click mode' className="material-icons md-light small" onClick={this.handleClick} style={clickStyle}>highlight_alt</button>
            <button title='filter' className="material-icons md-light small" onClick={this.handleFilterModal} style={filterStyle}>filter_alt</button>
            <button title='remove filter' className="material-icons md-light small" onClick={this.handleFilter} style={filterModalStyle}>remove_circle</button>
            <button title='zoomed out' className="material-icons md-light small" onClick={this.handleOut} style={styleOut}>menu</button>
            <button title='middle zoom' className="material-icons md-light small" onClick={this.handleMed} style={styleMed}>view_headline</button>
            <button title='zoomed in' className="material-icons md-light small" onClick={this.handleIn} style={styleIn}>format_align_justify</button>
            <button title='nearest neighbor mode' className="material-icons md-light small" onClick={this.handleNNmode} style={nnStyle}>other_houses</button>
          </div>
          {[0].map(() => { // hack
            if (this.state.filterModal===true) {
              return <div className='filterPanel'>
                <div className='filterButtonsTop'>
                  <div className='buttonStrip'>
                     <button title='close pane' className="material-icons md-light small" onClick={this.handleFilterModal} style={filterModalStyle}>close</button>
                     <button title='remove filter' className="material-icons md-light small" onClick={this.handleFilter} style={filterModalStyle}>remove_circle</button>
                     <button title='expand all' className="material-icons md-light small" onClick={this.handleExpand} style={filterModalStyle}>expand</button>
                     <button title='collapse all' className="material-icons md-light small" onClick={this.handleCollapse} style={filterModalStyle}>unfold_less</button>
                  </div>
                </div>
                {[
                  {'userLabel':'HAS PHOTO','machineLabel':'hasphoto'},
                  {'userLabel':'PHOTOMECHANICAL','machineLabel':'photomech'},
                  {'userLabel':'HAS NEGATIVE MANUF. INFO','machineLabel':'negman_k'},
                  {'userLabel':'HAS MOUNT MANUF. INFO','machineLabel':'mountman_k'},
                  {'userLabel':'HAS LENS MANUF. INFO','machineLabel':'lensman_k'},
                  {'userLabel':'HAS ACCESSORY MANUF. INFO','machineLabel':'accman_k'},
                  {'userLabel':'HAS COATING MANUF. INFO','machineLabel':'coatman_k'},
                  {'userLabel':'HAS PAPER MANUF. INFO','machineLabel':'paperman_k'},
                  {'userLabel':'BOOK TITLE','machineLabel':'title'},
                  {'userLabel':'BOOK AUTHOR','machineLabel':'author'},
                  {'userLabel':'YEAR','machineLabel':'year'},
                  {'userLabel':'PRINT MAKER','machineLabel':'specattr'},
                  {'userLabel':'PRINT MAKER LOCATION','machineLabel':'specattrloc'},
                  {'userLabel':'NEGATIVE MAKER','machineLabel':'specneg'},
                  {'userLabel':'NEGATIVE MAKER LOCATION','machineLabel':'specnegloc'},
                  {'userLabel':'OPERATOR','machineLabel':'specop'},
                  {'userLabel':'PHOTO PROCESS','machineLabel':'sprocess'},
                  {'userLabel':'PAPER MANUFACTURER','machineLabel':'paperman'},
                  {'userLabel':'PAPER BRAND','machineLabel':'paperbran'},
                  {'userLabel':'PAPER MANUF. LOCATION','machineLabel':'paperloc'},
                  {'userLabel':'NEGATIVE MANUFACTURER','machineLabel':'negman'},
                  {'userLabel':'NEGATIVE BRAND','machineLabel':'negbran'},
                  {'userLabel':'NEGATIVE MANUF. LOCATION','machineLabel':'negloc'},
                  {'userLabel':'LENS MANUFACTURER','machineLabel':'lensman'},
                  {'userLabel':'LENS BRAND','machineLabel':'lensbran'},
                  {'userLabel':'LENS MANUF. LOCATION','machineLabel':'lensloc'},
                  {'userLabel':'MOUNT MANUFACTURER','machineLabel':'mountman'},
                  {'userLabel':'MOUNT MANUF. LOCATION','machineLabel':'mountloc'},
                  {'userLabel':'COATING MANUFACTURER','machineLabel':'coatman'},
                  {'userLabel':'COATING MANUF. LOCATION','machineLabel':'coatloc'},
                  {'userLabel':'ACCESSORY MANUFACTURER','machineLabel':'accman'},
                  {'userLabel':'ACCESSORY MANUF. LOCATION','machineLabel':'accloc'},
                  {'userLabel':'PHOTO SUBJECT','machineLabel':'subj'},
                ].map( (b,j) => {
                    return <div className='panelBox'>
                      {[0].map(()=>{
                        if (filterLists[b.machineLabel].length===0) {
                          return <button style={{margin:'1vw',borderRadius:'1vh',borderWidth:'medium'}} onClick={this.handleFilterExpandList(b.machineLabel)} >{b.userLabel}</button>
                        } else {
                          return <button style={{margin:'1vw',borderRadius:'1vh',borderWidth:'medium',borderColor:'magenta'}} onClick={this.handleFilterExpandList(b.machineLabel)} >{b.userLabel}</button>
                        }
                      })}
                      {[0].map(() => {
                        if (this.state.filterExpandList.includes(b.machineLabel)) {
                          return <div className='buttonStrip'>
                             {filterOptions.filter(d => d.cat===b.machineLabel).map( (d,i) => {
                               if (!filterLists[b.machineLabel].includes(d.val)) {
                                 return <button style={{backgroundColor:'hsl(0,0%,'+d.pct+'%)',color:d.textcolor,fontSize:'1.5vh',borderWidth:'medium'}} onClick={this.addToFilter(b.machineLabel)} key={i}>{d.val}</button>
                               } else {
                                 return <button style={{backgroundColor:'hsl(0,0%,'+d.pct+'%)',color:d.textcolor,fontSize:'1.5vh',borderColor:'magenta',borderWidth:'medium'}} onClick={this.rmFromFilter(b.machineLabel)} key={i}>{d.val}</button>
                               }
                             }
                           )}
                          </div>
                        } else {
                          return null
                        }
                      })}
                    </div>
                  }
                  )}
              </div>
            } else {
              return null
            }
          })}
        </div>
      );
    } else {
      return null
    }
  }
}

export default App;
