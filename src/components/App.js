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

  render() {

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
      </div>
    );
  }
}

export default App;
