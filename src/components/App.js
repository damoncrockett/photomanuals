import React, { Component } from 'react';
import Tabletop from './Tabletop';
import { isEqual } from 'lodash';
import { orderBy } from 'lodash';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { // global state
      data: null,
      col30: true,
      col15: false,
      col5: false,
      ncol: 30,
      orderBy: 'KM',
      colorBy: 'title_c',
      color: false,
      click: false,
      asc: 'asc',
      filter: false,
      filterModal: false,
      filterChangeSignal: false,
      filterLists: {
        'title': [],
        'author': [],
        'year': [],
        'specattr': [],
        'specneg': [],
        'sprocess': [],
        'collection': []
      },
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
    this.handleFilter = this.handleFilter.bind(this);
    this.handleFilterModal = this.handleFilterModal.bind(this);
    this.addToFilter = this.addToFilter.bind(this);
    this.rmFromFilter = this.rmFromFilter.bind(this);
    this.handle30 = this.handle30.bind(this);
    this.handle15 = this.handle15.bind(this);
    this.handle5 = this.handle5.bind(this);

  }

  getData() {
    fetch('http://localhost:8888/_data.json')
    //fetch('_data.json')
      .then(response => response.json())
      .then(data => this.setState({
        data: data
      }));
    }

  getFilter() {
    fetch('http://localhost:8888/_filter.json')
    //fetch('_filter.json')
      .then(response => response.json())
      .then(data => this.setState({
        filterOptions: data
      }));
    }

  getNN() {
    fetch('http://localhost:8888/_nn.json')
    //fetch('_nn.json')
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

  componentDidUpdate(prevProps, prevState) {

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

  handleFilter() {

    this.setState(state => ({
      filter: false,
      filterLists: {'title': [],
      'author': [],
      'year': [],
      'specattr': [],
      'specneg': [],
      'sprocess': [],
      'collection': []},
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
      if ( isEqual(filterLists,{'title': [],
      'author': [],
      'year': [],
      'specattr': [],
      'specneg': [],
      'sprocess': [],
      'collection': []}) ) {
        this.setState({filter:false})
      }

      this.setState(state => ({
        filterLists: filterLists,
        filterChangeSignal: !this.state.filterChangeSignal
      }));
    }
  }

  handle30() {
    this.setState({ ncol: 30, col30: true, col15: false, col5: false });
  }

  handle15() {
    this.setState({ ncol: 15, col30: false, col15: true, col5: false });
  }

  handle5() {
    this.setState({ ncol: 5, col30: false, col15: false, col5: true });
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

    const filterModalStyle = {
      backgroundColor: this.state.filterModal ? stroke : bkgd,
      color: this.state.filterModal ? bkgd : stroke
    };

    const filterStyle = {
      backgroundColor: this.state.filter ? stroke : bkgd,
      color: this.state.filter ? bkgd : stroke
    };

    const style30 = {
      backgroundColor: this.state.col30 ? stroke : bkgd,
      color: this.state.col30 ? bkgd : stroke
    };

    const style15 = {
      backgroundColor: this.state.col15 ? stroke : bkgd,
      color: this.state.col15 ? bkgd : stroke
    };

    const style5 = {
      backgroundColor: this.state.col5 ? stroke : bkgd,
      color: this.state.col5 ? bkgd : stroke
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
              asc={this.state.asc}
              filterLists={this.state.filterLists}
              filterChangeSignal={this.state.filterChangeSignal}
              nn={this.state.nn}
              nnMode={this.state.nnMode}
            />
          </div>
          <div className='infoPanel' id='infoPanel'>
            <div className='infoKeys' id='infoKeys'></div>
            <div className='infoVals' id='infoVals'></div>
          </div>
          <div className='selectPanel'>
            <select style={selectStyle} value={this.state.orderBy} onChange={this.handleOrderBy} title='sort'>
              <option value='KM'>KM</option>
              <option value='title'>title</option>
              <option value='author'>author</option>
              <option value='year'>year</option>
              <option value='specattr'>printmaker</option>
              <option value='specneg'>negativemaker</option>
              <option value='sprocess'>process</option>
              <option value='collection'>collection</option>
              <option value='cluster'>cluster</option>
            </select>
            <select style={selectStyle} value={this.state.colorBy} onChange={this.handleColorBy} title='highlight category'>
              <option value='title_c'>title</option>
              <option value='author_c'>author</option>
              <option value='decade_c'>decade</option>
              <option value='specattr_c'>printmaker</option>
              <option value='specneg_c'>negativemaker</option>
              <option value='collection_c'>collection</option>
              <option value='sprocess_c'>process</option>
              <option value='cluster_c'>cluster</option>
            </select>
            <button title='highlight' className="material-icons md-light small" onClick={this.handleColor} style={colorStyle}>highlight</button>
            <button title='click mode' className="material-icons md-light small" onClick={this.handleClick} style={clickStyle}>highlight_alt</button>
            <button title='filter' className="material-icons md-light small" onClick={this.handleFilterModal} style={filterStyle}>filter_alt</button>
            <button title='remove filter' className="material-icons md-light small" onClick={this.handleFilter} style={filterModalStyle}>remove_circle</button>
            <button title='zoomed out' className="material-icons md-light small" onClick={this.handle30} style={style30}>menu</button>
            <button title='middle zoom' className="material-icons md-light small" onClick={this.handle15} style={style15}>view_headline</button>
            <button title='zoomed in' className="material-icons md-light small" onClick={this.handle5} style={style5}>format_align_justify</button>
            <button title='nearest neighbor mode' className="material-icons md-light small" onClick={this.handleNNmode} style={nnStyle}>other_houses</button>
          </div>
          {[0].map(() => { // hack
            if (this.state.filterModal===true) {
              return <div className='filterPanel'>
                <div className='filterButtonsTop'>
                  <div className='buttonStrip'>
                     <button title='close pane' className="material-icons md-light small" onClick={this.handleFilterModal} style={filterModalStyle}>close</button>
                     <button title='remove filter' className="material-icons md-light small" onClick={this.handleFilter} style={filterModalStyle}>remove_circle</button>
                  </div>
                </div>
                {[{'userLabel':'BOOK TITLE','machineLabel':'title'},
                  {'userLabel':'BOOK AUTHOR','machineLabel':'author'},
                  {'userLabel':'YEAR','machineLabel':'year'},
                  {'userLabel':'PRINT MAKER','machineLabel':'specattr'},
                  {'userLabel':'NEGATIVE MAKER','machineLabel':'specneg'},
                  {'userLabel':'PHOTO PROCESS','machineLabel':'sprocess'}].map( (b,j) => {
                    return <div className='panelBox'>
                      <p>{b.userLabel}</p>
                      <div className='buttonStrip'>
                         {filterOptions.filter(d => d.cat===b.machineLabel).map( (d,i) => {
                           if (!filterLists[b.machineLabel].includes(d.val)) {
                             return <button style={{backgroundColor:'hsl(0,0%,'+d.pct+'%)',color:d.textcolor,fontSize:'1.5vh',borderWidth:'medium'}} onClick={this.addToFilter(b.machineLabel)} key={i}>{d.val}</button>
                           } else {
                             return <button style={{backgroundColor:'hsl(0,0%,'+d.pct+'%)',color:d.textcolor,fontSize:'1.5vh',borderColor:'magenta',borderWidth:'medium'}} onClick={this.rmFromFilter(b.machineLabel)} key={i}>{d.val}</button>
                           }
                         }
                       )}
                      </div>
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
