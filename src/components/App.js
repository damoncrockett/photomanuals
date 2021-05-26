import React, { Component } from 'react';
import Tabletop from './Tabletop';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { // global state
      data: null,
      ncol: 30,
      orderBy: 'KM',
      asc: 'asc'
    };

    this.getData = this.getData.bind(this);
    this.handleOrderBy = this.handleOrderBy.bind(this);

  }

  getData() {
    fetch('http://localhost:8888/_data.json')
    //fetch('_data.json')
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

  render() {

    const bkgd = '#b5cbb7';
    const stroke = '#818479';

    const selectStyle = {
      backgroundColor: bkgd,
      color: stroke
    };

    return (
      <div className='app'>
        <div className='field'>
          <Tabletop
            data={this.state.data}
            ncol={this.state.ncol}
            orderBy={this.state.orderBy}
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
              <option value='month'>month</option>
              <option value='specattr'>specattr</option>
              <option value='sprocess'>sprocess</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
