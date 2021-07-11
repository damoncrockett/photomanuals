import React, { Component } from 'react';
import Tabletop from './Tabletop';
import { isEqual } from 'lodash';

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
        'sprocess': []
      },
      filterOptions: []
    };

    this.getData = this.getData.bind(this);
    this.getFilter = this.getFilter.bind(this);
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

  componentDidMount() {
    this.getData();
    this.getFilter();
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
    this.setState(state => ({
      click: !this.state.click
    }));
  }

  handleFilter(e) {

    this.setState({
      filter: false,
      filterLists: {'title':[],'author':[],'year':[],'specattr':[],'sprocess':[]},
      filterChangeSignal: !this.state.filterChangeSignal
    })

  }

  handleFilterModal(e) {

    const label = e.target.innerText.split(":")[0];

    if ( label === 'FILTER' ) {
      this.setState(state => ({
        filterModal: true
      }));
    } else if ( label === 'CLOSE' ) {
      this.setState(state => ({
        filterModal: false
      }));
    }
  }

  addToFilter(cat) {

    let filterLists = this.state.filterLists;

    return e => {
      const label = e.target.innerText.split(":")[0];

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
      const label = e.target.innerText.split(":")[0];

      filterLists[cat] = filterLists[cat].filter(d => d!==label)

      // if the filterLists are all empty
      if ( isEqual(filterLists,{'title':[],'author':[],'year':[],'specattr':[],'sprocess':[]}) ) {
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
    const filterOptions = this.state.filterOptions;

    const selectStyle = {
      backgroundColor: bkgd,
      color: stroke
    };

    const colorStyle = {
      backgroundColor: this.state.color ? 'white' : bkgd,
      color: this.state.color ? 'black' : stroke
    };

    const clickStyle = {
      backgroundColor: this.state.click ? 'white' : bkgd,
      color: this.state.click ? 'black' : stroke
    };

    const filterModalStyle = {
      backgroundColor: this.state.filterModal ? 'white' : bkgd,
      color: this.state.filterModal ? 'black' : stroke
    };

    const filterStyle = {
      backgroundColor: this.state.filter ? 'white' : bkgd,
      color: this.state.filter ? 'black' : stroke
    };

    const style30 = {
      backgroundColor: this.state.col30 ? 'white' : bkgd,
      color: this.state.col30 ? 'black' : stroke
    };

    const style15 = {
      backgroundColor: this.state.col15 ? 'white' : bkgd,
      color: this.state.col15 ? 'black' : stroke
    };

    const style5 = {
      backgroundColor: this.state.col5 ? 'white' : bkgd,
      color: this.state.col5 ? 'black' : stroke
    };

    const filterLists = this.state.filterLists;

    if ( this.state.filterModal === true ) {
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
            />
          </div>
          <div className='selectPanel'>
            <div className='buttonStrip'>
              <select style={selectStyle} value={this.state.orderBy} onChange={this.handleOrderBy}>
                <option value='KM'>KM</option>
                <option value='title'>title</option>
                <option value='author'>author</option>
                <option value='year'>year</option>
                <option value='specattr'>specattr</option>
                <option value='sprocess'>sprocess</option>
                <option value='hue'>hue</option>
                <option value='saturation'>saturation</option>
                <option value='brightness'>brightness</option>
                <option value='cluster'>cluster</option>
              </select>
            </div>
            <div className='buttonStrip'>
              <select style={selectStyle} value={this.state.colorBy} onChange={this.handleColorBy}>
                <option value='title_c'>title</option>
                <option value='author_c'>author</option>
                <option value='year_c'>year</option>
                <option value='specattr_c'>specattr</option>
                <option value='sprocess_c'>sprocess</option>
                <option value='cluster_c'>cluster</option>
              </select>
            </div>
            <div className='buttonStrip'>
               <button onClick={this.handleColor} style={colorStyle}>COLOR</button>
            </div>
            <div className='buttonStrip'>
               <button onClick={this.handleClick} style={clickStyle}>CLICK</button>
            </div>
            <div className='buttonStrip'>
               <button onClick={this.handleFilterModal} style={filterStyle}>FILTER</button>
            </div>
            <div className='buttonStrip'>
               <button onClick={this.handle30} style={style30}>30</button>
               <button onClick={this.handle15} style={style15}>15</button>
               <button onClick={this.handle5} style={style5}>5</button>
            </div>
          </div>
          <div className='mask'>
            <div className='buttonStrip'>
               <button onClick={this.handleFilterModal} style={filterModalStyle}>CLOSE</button>
            </div>
            <div className='buttonStrip'>
               <button onClick={this.handleFilter} style={filterModalStyle}>REMOVE FILTER</button>
            </div>
            <div className='filterPanel'>
              <div className='panelBox'>
                <p>BOOK TITLE</p>
                <div className='buttonStrip'>
                   {filterOptions.filter(d => d.cat==='title').map( (d,i) => {
                     if (!filterLists['title'].includes(d.val)) {
                       return <button style={{backgroundColor:'white',color:'black',fontSize:10}} onClick={this.addToFilter('title')} key={i}>{d.val + ': '+d.ct}</button>
                     } else {
                       return <button style={{backgroundColor:bkgd,color:stroke,fontSize:10}} onClick={this.rmFromFilter('title')} key={i}>{d.val + ': '+d.ct}</button>
                     }
                   }
                 )}
                </div>
              </div>
              <div className='panelBox'>
                <p>BOOK AUTHOR</p>
                <div className='buttonStrip'>
                   {filterOptions.filter(d => d.cat==='author').map( (d,i) => {
                     if (!filterLists['author'].includes(d.val)) {
                       return <button style={{backgroundColor:'white',color:'black',fontSize:10}} onClick={this.addToFilter('author')} key={i}>{d.val + ': '+d.ct}</button>
                     } else {
                       return <button style={{backgroundColor:bkgd,color:stroke,fontSize:10}} onClick={this.rmFromFilter('author')} key={i}>{d.val + ': '+d.ct}</button>
                     }
                   }
                 )}
                </div>
              </div>
              <div className='panelBox'>
                <p>YEAR</p>
                <div className='buttonStrip'>
                   {filterOptions.filter(d => d.cat==='year').map( (d,i) => {
                     if (!filterLists['year'].includes(d.val)) {
                       return <button style={{backgroundColor:'white',color:'black',fontSize:10}} onClick={this.addToFilter('year')} key={i}>{d.val + ': '+d.ct}</button>
                     } else {
                       return <button style={{backgroundColor:bkgd,color:stroke,fontSize:10}} onClick={this.rmFromFilter('year')} key={i}>{d.val + ': '+d.ct}</button>
                     }
                   }
                 )}
                </div>
              </div>
              <div className='panelBox'>
                <p>SPECIMEN ATTRIBUTION</p>
                <div className='buttonStrip'>
                   {filterOptions.filter(d => d.cat==='specattr').map( (d,i) => {
                     if (!filterLists['specattr'].includes(d.val)) {
                       return <button style={{backgroundColor:'white',color:'black',fontSize:10}} onClick={this.addToFilter('specattr')} key={i}>{d.val + ': '+d.ct}</button>
                     } else {
                       return <button style={{backgroundColor:bkgd,color:stroke,fontSize:10}} onClick={this.rmFromFilter('specattr')} key={i}>{d.val + ': '+d.ct}</button>
                     }
                   }
                 )}
                </div>
              </div>
              <div className='panelBox'>
                <p>PHOTO PROCESS</p>
                <div className='buttonStrip'>
                   {filterOptions.filter(d => d.cat==='sprocess').map( (d,i) => {
                     if (!filterLists['sprocess'].includes(d.val)) {
                       return <button style={{backgroundColor:'white',color:'black',fontSize:10}} onClick={this.addToFilter('sprocess')} key={i}>{d.val + ': '+d.ct}</button>
                     } else {
                       return <button style={{backgroundColor:bkgd,color:stroke,fontSize:10}} onClick={this.rmFromFilter('sprocess')} key={i}>{d.val + ': '+d.ct}</button>
                     }
                   }
                 )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
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
            />
          </div>
          <div className='selectPanel'>
            <div className='buttonStrip'>
              <select style={selectStyle} value={this.state.orderBy} onChange={this.handleOrderBy}>
                <option value='KM'>KM</option>
                <option value='title'>title</option>
                <option value='author'>author</option>
                <option value='year'>year</option>
                <option value='specattr'>specattr</option>
                <option value='sprocess'>sprocess</option>
                <option value='hue'>hue</option>
                <option value='saturation'>saturation</option>
                <option value='brightness'>brightness</option>
                <option value='cluster'>cluster</option>
              </select>
            </div>
            <div className='buttonStrip'>
              <select style={selectStyle} value={this.state.colorBy} onChange={this.handleColorBy}>
                <option value='title_c'>title</option>
                <option value='author_c'>author</option>
                <option value='year_c'>year</option>
                <option value='specattr_c'>specattr</option>
                <option value='sprocess_c'>sprocess</option>
                <option value='cluster_c'>cluster</option>
              </select>
            </div>
            <div className='buttonStrip'>
               <button onClick={this.handleColor} style={colorStyle}>COLOR</button>
            </div>
            <div className='buttonStrip'>
               <button onClick={this.handleClick} style={clickStyle}>CLICK</button>
            </div>
            <div className='buttonStrip'>
               <button onClick={this.handleFilterModal} style={filterStyle}>FILTER</button>
            </div>
            <div className='buttonStrip'>
               <button onClick={this.handle30} style={style30}>30</button>
               <button onClick={this.handle15} style={style15}>15</button>
               <button onClick={this.handle5} style={style5}>5</button>
            </div>
          </div>
        </div>
      );
    }

  }
}

export default App;
