import React, { Component } from 'react';
import Tabletop from './Tabletop';
import { isEqual } from 'lodash';
import { orderBy } from 'lodash';
import { intersection } from 'lodash';
import { uniq } from 'lodash';

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
      ncolDivisor: 1,
      ncolOut: 0,
      orderBy: 'year',
      orderBySecond: 'year',
      colorBy: 'decade_c',
      color: false,
      click: false,
      infoCollapse: true,
      asc: true,
      ascSecond: true,
      filter: false,
      filterModal: false,
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
      filterExpandList: [],
      filterOptionsFixed: [],
      filterIdxs: [],
      filterChangeSignal: false,
      filterKMs: [],
      nn: null,
      nnMode: false
    };

    this.getData = this.getData.bind(this);
    this.getFilter = this.getFilter.bind(this);
    this.getNN = this.getNN.bind(this);
    this.handleNNmode = this.handleNNmode.bind(this);
    this.handleOrderBy = this.handleOrderBy.bind(this);
    this.handleOrderBySecond = this.handleOrderBySecond.bind(this);
    this.handleAsc = this.handleAsc.bind(this);
    this.handleAscSecond = this.handleAscSecond.bind(this);
    this.handleColorBy = this.handleColorBy.bind(this);
    this.handleColor = this.handleColor.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleInfoCollapse = this.handleInfoCollapse.bind(this);
    this.updateFilterOptions = this.updateFilterOptions.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
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
        filterOptionsFixed: data
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

    const ncolOut = Math.round(x);

    this.setState(state => ({
      ncolOut: ncolOut
    }));
  }

  componentDidUpdate(prevProps,prevState) {
    if (prevState.data === null & prevState.data !== this.state.data) {
      this.setCol();
      this.updateFilterOptions();
    }

    if (prevState.filterModal !== this.state.filterModal) {
      this.setCol();
    }

    if (prevState.infoCollapse !== this.state.infoCollapse) {
      this.setCol();
    }

    if (prevState.filterChangeSignal !== this.state.filterChangeSignal) {
      this.updateFilterOptions();
    }
  }

  handleOrderBy(e) {
    const orderBy = e.target.value;
    this.setState({ orderBy: orderBy });
  }

  handleOrderBySecond(e) {
    const orderBySecond = e.target.value;
    this.setState({ orderBySecond: orderBySecond });
  }

  handleAsc() {
    this.setState(state => ({
      asc: !this.state.asc
    }));
  }

  handleAscSecond() {
    this.setState(state => ({
      ascSecond: !this.state.ascSecond
    }));
  }

  handleColorBy(e) {
    const colorBy = e.target.value;
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

  updateFilterOptions() {

    // we filter this.props.data for the _filter rects
    const filterLists = this.state.filterLists;
    const data = this.state.data; // we won't mutate it here, but later
    let filterKMs = [];

    // this is getting OR for each filter category (title, author, etc.)
    Object.keys(filterLists).forEach((cat, i) => {
      let catList = []; // probably not necessary to initialize as a list but whatevs
      if ( filterLists[cat].length === 0 ) {
        catList = data.map(d => d.KM);
      } else {
        catList = data.filter(d => filterLists[cat].includes(d[cat])).map(d => d.KM);
      }
      filterKMs = [ ...filterKMs, catList ];
    });

    // this gets AND across all categories
    filterKMs = intersection(...filterKMs);

    // updating filter options
    const filteredData = data.filter(d => filterKMs.includes(d.KM));
    let filterOptions = this.state.filterOptionsFixed;
    const filterCats = uniq(filterOptions.map(d => d.cat));

    filterCats.forEach((item, i) => {
      const validVals = uniq(filteredData.map(d => d[item]));
      filterOptions = filterOptions.filter(d => d.cat!==item || ( d.cat===item && validVals.includes(d.val) ) );
    });

    this.setState(state => ({
      filterKMs: filterKMs,
      filterIdxs: filterOptions.map(d => d.idx)
    }));

  }

  removeFilter() {

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
    const filterOptionsFixed = this.state.filterOptionsFixed;

    return e => {
      const label = e.target.innerText;

      if (label==='done_all') {
        filterLists[cat] = uniq(filterOptionsFixed.filter(d => d.cat===cat).map(d => d.val))
      } else {
        filterLists[cat] = [...filterLists[cat],label];
      }

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

      if (label==='remove_circle') {
        filterLists[cat] = []
      } else {
        filterLists[cat] = filterLists[cat].filter(d => d!==label)
      }

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
      ncolDivisor: 1, colOut: true, colMed: false, colIn: false
    }));
  }

  handleMed() {
    this.setState(state => ({
      ncolDivisor: 2, colOut: false, colMed: true, colIn: false
    }));
  }

  handleIn() {
    this.setState(state => ({
      ncolDivisor: 4, colOut: false, colMed: false, colIn: true
    }));
  }

  returnDomain() {
    const production = process.env.NODE_ENV === 'production';
    return production ? '' : 'http://localhost:8888/'
  }

  render() {

    const bkgd = '#001b2e';
    const stroke = 'hsl(0,0%,90%)';
    const filterOptions = orderBy(this.state.filterOptionsFixed,'val','asc');
    const filterIdxs = this.state.filterIdxs;
    const filterLists = this.state.filterLists;

    const selectStyle = {
      backgroundColor: bkgd,
      color: stroke
    };

    const ascStyle = {
      backgroundColor: this.state.asc ? stroke : bkgd,
      color: this.state.asc ? bkgd : stroke
    }

    const ascSecondStyle = {
      backgroundColor: this.state.ascSecond ? stroke : bkgd,
      color: this.state.ascSecond ? bkgd : stroke
    }

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
      backgroundColor: this.state.filter ? bkgd : bkgd,
      color: this.state.filter ? 'magenta' : stroke,
      borderColor: this.state.filter ? 'magenta' : stroke
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

    if (this.props.AppSwitch===true) {
      return (
        <div className='app'>
          <div className='field'>
            <Tabletop
              data={this.state.data}
              ncolDivisor={this.state.ncolDivisor}
              ncolOut={this.state.ncolOut}
              orderBy={this.state.orderBy}
              orderBySecond={this.state.orderBySecond}
              colorBy={this.state.colorBy}
              color={this.state.color}
              click={this.state.click}
              infoCollapse={this.state.infoCollapse}
              asc={this.state.asc}
              ascSecond={this.state.ascSecond}
              filterKMs={this.state.filterKMs}
              filterChangeSignal={this.state.filterChangeSignal}
              filterModal={this.state.filterModal}
              nn={this.state.nn}
              nnMode={this.state.nnMode}
            />
          </div>
          <div className={this.state.infoCollapse ? 'infoPanelCollapsed' : 'infoPanel'} id='infoPanel'>
            {[0].map(()=>{
              if ( this.state.infoCollapse===true ) {
                return <div className='infoButton'><button title='expand info panel' className="material-icons md-light small" onClick={this.handleInfoCollapse} style={infoCollapseStyle}>expand_less</button></div>
              } else {
                return <div className='infoButton'><button title='collapse info panel' className="material-icons md-light small" onClick={this.handleInfoCollapse} style={infoCollapseStyle}>expand_more</button></div>
              }
            })}
            <div className={this.state.infoCollapse ? 'imgBoxCollapsed' : 'imgBox'} id='imgBox'>
            </div>
            <div className={this.state.infoCollapse ? 'infoBoxCollapsed' : 'infoBox'} id='infoBox'>
              <div className='infoKeys' id='infoKeys'></div>
              <div className='infoVals' id='infoVals'></div>
            </div>
          </div>
          <div className='controlPanels'>
            <div className='controlPanelSupplemental'>
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
                <option value='sprocess'>process</option>
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
              <button title='sort ascending' className="material-icons md-light small" onClick={this.handleAsc} style={ascStyle}>swap_vert</button>
            </div>
            <div className='controlPanelMain'>
              <select style={selectStyle} value={this.state.orderBySecond} onChange={this.handleOrderBySecond} title='second sort'>
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
                <option value='sprocess'>process</option>
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
              <button title='sort ascending' className="material-icons md-light small" onClick={this.handleAscSecond} style={ascSecondStyle}>swap_vert</button>
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
                <option value='sprocess_c'>process</option>
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
              <button title='remove filter' className="material-icons md-light small" onClick={this.removeFilter} style={selectStyle}>remove_circle</button>
              <button title='zoomed out' className="material-icons md-light small" onClick={this.handleOut} style={styleOut}>menu</button>
              <button title='middle zoom' className="material-icons md-light small" onClick={this.handleMed} style={styleMed}>view_headline</button>
              <button title='zoomed in' className="material-icons md-light small" onClick={this.handleIn} style={styleIn}>format_align_justify</button>
              <button title='nearest neighbor mode' className="material-icons md-light small" onClick={this.handleNNmode} style={nnStyle}>other_houses</button>
            </div>
          </div>
          {[0].map(() => { // hack
            if (this.state.filterModal===true) {
              return <div className='filterPanel'>
                <div className='filterButtonsTop'>
                  <div className='buttonStrip'>
                     <button title='close pane' className="material-icons md-light small" onClick={this.handleFilterModal} style={filterModalStyle}>close</button>
                     <button title='remove filter' className="material-icons md-light small" onClick={this.removeFilter} style={filterModalStyle}>remove_circle</button>
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
                  {'userLabel':'PROCESS','machineLabel':'sprocess'},
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
                      <div className='topButtons'>
                        {[0].map(()=>{
                          if (filterLists[b.machineLabel].length===0) {
                            return <button style={{margin:'1vh',borderRadius:'1vh',borderWidth:'thin'}} onClick={this.handleFilterExpandList(b.machineLabel)} key={j}>{b.userLabel}</button>
                          } else {
                            return <button style={{margin:'1vh',borderRadius:'1vh',borderWidth:'thin',borderColor:'magenta'}} onClick={this.handleFilterExpandList(b.machineLabel)} key={j}>{b.userLabel}</button>
                          }
                        })}
                        {[0].map(()=>{
                          if (this.state.filterExpandList.includes(b.machineLabel)) {
                            return <div className='buttonStripClearSelect'>
                              <button title='select all' className="material-icons md-light mini" onClick={this.addToFilter(b.machineLabel)} style={selectStyle}>done_all</button>
                              <button title='clear all' className="material-icons md-light mini" onClick={this.rmFromFilter(b.machineLabel)} style={selectStyle}>remove_circle</button>
                            </div>
                          } else {
                            return null
                          }
                        })}
                      </div>
                      {[0].map(() => {
                        if (this.state.filterExpandList.includes(b.machineLabel)) {
                          return <div className='buttonStrip'>
                             {filterOptions.filter(d => d.cat===b.machineLabel).map( (d,i) => {
                               if (!filterLists[b.machineLabel].includes(d.val)) {
                                 if (filterIdxs.includes(d.idx)) {
                                   return <button style={{backgroundColor:'hsl(0,0%,'+d.pct+'%)',color:d.textcolor,fontSize:'1.25vh',borderWidth:'thin'}} onClick={this.addToFilter(b.machineLabel)} key={i}>{d.val}</button>
                                 } else {
                                   return <button style={{backgroundColor:'rgba(0,0,0,0)',color:'hsl(0,0%,'+d.pct+'%)',fontSize:'1.25vh',borderWidth:'thin',borderColor:'hsl(0,0%,'+d.pct+'%)'}} onClick={this.addToFilter(b.machineLabel)} key={i}>{d.val}</button>
                                 }
                               } else {
                                 if (filterIdxs.includes(d.idx)) {
                                   return <button style={{backgroundColor:'hsl(0,0%,'+d.pct+'%)',color:d.textcolor,fontSize:'1.25vh',borderColor:'magenta',borderWidth:'thin'}} onClick={this.rmFromFilter(b.machineLabel)} key={i}>{d.val}</button>
                                 } else {
                                   return <button style={{backgroundColor:'rgba(0,0,0,0)',color:'hsl(0,0%,'+d.pct+'%)',fontSize:'1.25vh',borderColor:'magenta',borderWidth:'thin'}} onClick={this.rmFromFilter(b.machineLabel)} key={i}>{d.val}</button>
                                 }
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
