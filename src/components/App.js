import React, { Component } from 'react';
import Tabletop from './Tabletop';

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
      asc: 'asc'
    };

    this.getData = this.getData.bind(this);
    this.handleOrderBy = this.handleOrderBy.bind(this);
    this.handleColorBy = this.handleColorBy.bind(this);
    this.handleColor = this.handleColor.bind(this);
    this.handle30 = this.handle30.bind(this);
    this.handle15 = this.handle15.bind(this);
    this.handle5 = this.handle5.bind(this);

  }

  getData() {
    //fetch('http://localhost:8888/_data.json')
    fetch('_data.json')
      .then(response => response.json())
      .then(data => this.setState({
        data: data
      }));
    }

  componentDidMount() {
    this.getData();
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

    const bkgd = '#b5cbb7';
    const stroke = '#818479';

    const selectStyle = {
      backgroundColor: bkgd,
      color: stroke
    };

    const colorStyle = {
      backgroundColor: this.state.color ? 'white' : bkgd,
      color: this.state.color ? 'black' : stroke
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

    return (
      <div className='app'>
        <div className='field'>
          <Tabletop
            data={this.state.data}
            ncol={this.state.ncol}
            orderBy={this.state.orderBy}
            colorBy={this.state.colorBy}
            color={this.state.color}
            asc={this.state.asc}
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
             <button onClick={this.handle30} style={style30}>30</button>
             <button onClick={this.handle15} style={style15}>15</button>
             <button onClick={this.handle5} style={style5}>5</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
