import React, { Component } from 'react';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';
import { gridCoords } from '../lib/plottools';
import { orderBy } from 'lodash';
import { intersection } from 'lodash';

const screenH = window.innerHeight * window.devicePixelRatio;
const screenW = window.innerWidth * window.devicePixelRatio;
console.log(screenW);
console.log(screenH);
const marginInt = Math.round( screenH / 45 );
const margin = {top: marginInt, right: marginInt, bottom: marginInt, left: marginInt};
const plotW = Math.round( screenH / 2.4 );
const svgW = plotW + margin.left + margin.right;
const incr = 0.02 * svgW;
const panelSide = svgW * 0.7;
console.log(svgW);

const blankColor = 'rgba(0,0,0,0)';
const filteredColor = 'rgba(0,27,46,0.75)'; // the background color
const clusterColors = {
  0: 'rgba(255,0,0,0.5)', //red
  1: 'rgba(0,255,0,0.5)', //green
  2: 'rgba(0,0,255,0.5)', //blue
  3: 'rgba(255,255,0,0.5)', //yellow
  4: 'rgba(255,165,0,0.5)', //orange
  5: 'rgba(160,32,240,0.5)', //purple
  6: 'rgba(255,0,255,0.5)', //magenta
  7: 'rgba(0,0,0,0.5)' // grey
};

class Tabletop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      squareSide: 0,
      svgH: 0,
      clickId: null,
      nnData: null
    }

    this.setSize = this.setSize.bind(this);
    this.drawSVG = this.drawSVG.bind(this);
    this.drawTabletop = this.drawTabletop.bind(this);
    this.sortTabletop = this.sortTabletop.bind(this);
    this.handleMouseover = this.handleMouseover.bind(this);
    this.handleMouseout = this.handleMouseout.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.svgNode = React.createRef();
    this.svgPanel = React.createRef();
    this.svgInfoPanel = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    // conditional prevents infinite loop
    if (prevProps.data === null && prevProps.data !== this.props.data) {
      this.setSize();
    }

    if (prevProps.orderBy !== this.props.orderBy) {
      this.sortTabletop();
    }

    if (prevProps.asc !== this.props.asc) {
      this.sortTabletop();
    }

    if (prevProps.ncol !== this.props.ncol) {
      this.setSize();
    }

    if (prevProps.color !== this.props.color) {
      this.drawTabletop();
    }

    if (prevProps.colorBy !== this.props.colorBy && this.props.color === true) {
      this.drawTabletop();
    }

    if (prevProps.filterChangeSignal !== this.props.filterChangeSignal) {
      this.drawTabletop();
    }
  }

  setSize() {
    const n = this.props.data.length;
    const ncol = this.props.ncol;
    const squareSideDivisor = ncol * 2.275;
    const squareSide = Math.round( screenH / squareSideDivisor );

    const nrow = Math.ceil( n / ncol );
    const plotH = squareSide * nrow;
    const svgH = plotH + margin.top + margin.bottom;

    this.setState(
      { squareSide: squareSide, svgH: svgH },
      () => {
        this.drawSVG();
        this.drawTabletop();
      }
    );
  }

  drawSVG() {
    const svgNode = this.svgNode.current;
    const svgPanel = this.svgPanel.current;
    const svgInfoPanel = this.svgInfoPanel.current;

    select(svgNode)
      .selectAll('g.plotCanvas')
      .data([0]) // bc enter selection, prevents appending new 'g' on re-render
      .enter()
      .append('g')
      .attr('class', 'plotCanvas') // purely semantic
      .attr('transform', `translate(${margin.left},${margin.top})`);

    select(svgPanel)
      .selectAll('g.panelCanvas')
      .data([0]) // bc enter selection, prevents appending new 'g' on re-render
      .enter()
      .append('g')
      .attr('class', 'panelCanvas') // purely semantic
      .attr('transform', `translate(${margin.left},${margin.top})`);

    select(svgInfoPanel)
      .selectAll('g.infoBox')
      .data([0]) // bc enter selection, prevents appending new 'g' on re-render
      .enter()
      .append('g')
      .attr('class', 'infoBox') // purely semantic
      .attr('transform', `translate(${margin.left/2},${margin.top/1.25})`);

    }

  drawTabletop() {

    const svgNode = this.svgNode.current;
    const squareSide = this.state.squareSide;
    const slowTransition = transition().duration(1000);
    const fastTransition = transition().duration(1000);

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('image')
      .data(this.props.data)
      .enter()
      .append('image')
      .attr('id', d => 't' + d.KM + '_spec')
      //.attr('xlink:href', d => "http://localhost:8888/" + d.specpath )
      .attr('xlink:href', d => d.specpath )
      .attr('width', squareSide )
      .attr('height', squareSide )
      .on('mouseover', this.handleMouseover)
      .on('mouseout', this.handleMouseout)

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect.highlight')
      .data(this.props.data)
      .enter()
      .append('rect')
      .attr('id', d => 't' + d.KM + '_highlight')
      .attr('class', 'highlight')
      .attr('fill', d => this.props.color ? clusterColors[d[this.props.colorBy]] : blankColor )
      .attr('width', squareSide )
      .attr('height', squareSide )
      .on('mouseover', this.handleMouseover)
      .on('mouseout', this.handleMouseout)
      .on('click', this.handleClick)

    // we filter this.props.data for the _filter rects
    const filterLists = this.props.filterLists;
    let data = this.props.data; // we won't mutate it here, but later
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

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect.filter')
      .data(this.props.data)
      .enter()
      .append('rect')
      .attr('id', d => 't' + d.KM + '_filter')
      .attr('class', 'filter')
      .attr('fill', d => filterKMs.includes(d.KM) ? blankColor : filteredColor )
      .attr('width', squareSide )
      .attr('height', squareSide )
      .on('mouseover', this.handleMouseover)
      .on('mouseout', this.handleMouseout)
      .on('click', this.handleClick)

    // now the xy coords
    const n = data.length;
    const ncol = this.props.ncol;
    const coords = gridCoords(n,ncol)
    const x = coords[0];
    const y = coords[1];

    if ( this.state.nnData !== null ) {
      data = this.state.nnData;
    } else {
      data = orderBy(data, [this.props.orderBy], [this.props.asc] );
    }

    data.forEach((item, i) => {
      item.x = x[i];
      item.y = y[i];
    });

    data = orderBy( data, ['KM'], ['asc'] );

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('image')
      .data(data)
      .transition(slowTransition)
        .attr('x', d => d.x * squareSide - marginInt / 2 )
        .attr('y', d => d.y * squareSide - marginInt / 2 )
        .attr('width', squareSide )
        .attr('height', squareSide )

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect.highlight')
      .data(data)
      .attr('fill', d => this.props.color ? clusterColors[d[this.props.colorBy]] : blankColor )
      .transition(slowTransition)
        .attr('x', d => d.x * squareSide - marginInt / 2 )
        .attr('y', d => d.y * squareSide - marginInt / 2 )
        .attr('width', squareSide )
        .attr('height', squareSide )

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect.filter')
      .data(data)
      .attr('fill', d => filterKMs.includes(d.KM) ? blankColor : filteredColor )
      .transition(slowTransition)
        .attr('x', d => d.x * squareSide - marginInt / 2 )
        .attr('y', d => d.y * squareSide - marginInt / 2 )
        .attr('width', squareSide )
        .attr('height', squareSide )

    // if we have a click target, we have to move it, too
    if (this.state.clickId !== null) {

      const targetCoords = data.filter(d => d.KM === this.state.clickId);
      const targetX = targetCoords.map(d => d.x);
      const targetY = targetCoords.map(d => d.y);

      select('#target')
        .transition(slowTransition)
          .attr('x', targetX[0] * squareSide - marginInt / 2  )
          .attr('y', targetY[0] * squareSide - marginInt / 2  )
          .attr('width', squareSide )
          .attr('height', squareSide )
    }
  }

  sortTabletop() {

    // we only nullify nnDAta when we resort; otherwise we want its sort
    this.setState({nnData: null});

    const squareSide = this.state.squareSide;
    const transitionSettings = transition().duration(1000);
    const svgNode = this.svgNode.current;

    // create grid coords
    const n = this.props.data.length;
    const ncol = this.props.ncol;
    const coords = gridCoords(n,ncol)
    const x = coords[0];
    const y = coords[1];

    // attach to 'data'
    let data = this.props.data;
    data = orderBy(data, [this.props.orderBy], [this.props.asc] );
    data.forEach((item, i) => {
      item.x = x[i];
      item.y = y[i];
    });

    // back to original sort, after coordinates attached
    data = orderBy( data, ['KM'], ['asc'] );

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('image')
      .data(data)
      .transition(transitionSettings)
        .attr('x', d => d.x * squareSide - marginInt / 2 )
        .attr('y', d => d.y * squareSide - marginInt / 2 )

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect.highlight')
      .data(data)
      .transition(transitionSettings)
        .attr('x', d => d.x * squareSide - marginInt / 2 )
        .attr('y', d => d.y * squareSide - marginInt / 2 )

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect.filter')
      .data(data)
      .transition(transitionSettings)
        .attr('x', d => d.x * squareSide - marginInt / 2 )
        .attr('y', d => d.y * squareSide - marginInt / 2 )

    if ( this.state.clickId !== null ) {

      const targetCoords = data.filter(d => d.KM === this.state.clickId);
      const targetX = targetCoords.map(d => d.x);
      const targetY = targetCoords.map(d => d.y);

      select('#target')
        .transition(transitionSettings)
          .attr('x', targetX[0] * squareSide - marginInt / 2  )
          .attr('y', targetY[0] * squareSide - marginInt / 2  )
    }
  }

  // note: 'e' here is the mouse event itself, which we don't need
  handleMouseover(e, d) {

    const squareSide = this.state.squareSide;
    const svgH = this.state.svgH;

    const svgPanel = this.svgPanel.current;
    const svgInfoPanel = this.svgInfoPanel.current;

    select('#t' + d.KM + '_spec')
      .attr('width', squareSide * 1.125 )
      .attr('height', squareSide * 1.125 )

    select('#t' + d.KM + '_highlight')
      .attr('width', squareSide * 1.125 )
      .attr('height', squareSide * 1.125 )

    select('#t' + d.KM + '_filter')
      .attr('width', squareSide * 1.125 )
      .attr('height', squareSide * 1.125 )

    if ( this.props.click === false ) {

      select(svgPanel)
        .select('g.panelCanvas')
        .append('image')
        .attr('xlink:href', d.fullspecpath)
        //.attr('xlink:href', "http://localhost:8888/" + d.fullspecpath)
        .attr('width', panelSide )
        .attr('height', panelSide )
        .attr('x', -marginInt )
        .attr('y', -marginInt )

      select(svgInfoPanel)
        .select('g.infoBox')
        .append('text')
        .attr('x', 0 )
        .attr('y', 0 )
        .text(d.title)

      select(svgInfoPanel)
        .select('g.infoBox')
        .append('text')
        .attr('x', 0 )
        .attr('y', incr )
        .text(d.author)

      select(svgInfoPanel)
        .select('g.infoBox')
        .append('text')
        .attr('x', 0 )
        .attr('y', incr * 2 )
        .text(d.year)

      select(svgInfoPanel)
        .select('g.infoBox')
        .append('text')
        .attr('x', 0 )
        .attr('y', incr * 3 )
        .text(d.month)

      select(svgInfoPanel)
        .select('g.infoBox')
        .append('text')
        .attr('x', 0 )
        .attr('y', incr * 4 )
        .text(d.page)

      select(svgInfoPanel)
        .select('g.infoBox')
        .append('text')
        .attr('x', 0 )
        .attr('y', incr * 5 )
        .text(d.specattr)

      select(svgInfoPanel)
        .select('g.infoBox')
        .append('text')
        .attr('x', 0 )
        .attr('y', incr * 6 )
        .text(d.sprocess)
    }
  }

  handleMouseout(e, d) {

    const squareSide = this.state.squareSide;
    const svgNode = this.svgNode.current;
    const svgPanel = this.svgPanel.current;
    const svgInfoPanel = this.svgInfoPanel.current;

    select('#t' + d.KM + '_spec')
      .attr('width', squareSide )
      .attr('height', squareSide )

    select('#t' + d.KM + '_highlight')
      .attr('width', squareSide )
      .attr('height', squareSide )

    select('#t' + d.KM + '_filter')
      .attr('width', squareSide * 1.125 )
      .attr('height', squareSide * 1.125 )

    if ( this.props.click === false ) {

      select(svgNode)
        .select('g.plotCanvas')
        .selectAll('rect.target').remove()

      select(svgPanel)
        .select('g.panelCanvas')
        .selectAll('image').remove()

      select(svgInfoPanel)
        .select('g.infoBox')
        .selectAll('text').remove()

    }
  }

  handleClick(e, d) {

    if ( this.props.click === true ) {

      this.setState({ clickId: d.KM });

      const svgPanel = this.svgPanel.current;
      const svgInfoPanel = this.svgInfoPanel.current;
      const svgNode = this.svgNode.current;
      const squareSide = this.state.squareSide;

      select(svgNode)
        .select('g.plotCanvas')
        .selectAll('rect.target').remove()

      select(svgPanel)
        .select('g.panelCanvas')
        .selectAll('image').remove()

      select(svgInfoPanel)
        .select('g.infoBox')
        .selectAll('text').remove()

      select(svgNode)
        .select('g.plotCanvas')
        .selectAll('rect.target')
        .data([0])
        .enter()
        .append('rect')
        .attr('class', 'target')
        .attr('id', 'target')
        .attr('width', squareSide )
        .attr('height', squareSide )
        .attr('x', select('#t' + d.KM + '_spec').attr('x'))
        .attr('y', select('#t' + d.KM + '_spec').attr('y'))
        .attr('stroke', 'magenta')
        .attr('stroke-width', 4)
        .attr('fill', 'none')

      select(svgPanel)
        .select('g.panelCanvas')
        .append('image')
        .attr('xlink:href', d.fullspecpath)
        //.attr('xlink:href', "http://localhost:8888/" + d.fullspecpath)
        .attr('width', panelSide )
        .attr('height', panelSide )
        .attr('x', -marginInt )
        .attr('y', -marginInt )
        //.on('click', () => window.open("http://localhost:8888/" + d.tabspecpath, '_blank') )
        .on('click', () => window.open(d.tabspecpath, '_blank') )

      select(svgInfoPanel)
        .select('g.infoBox')
        .append('text')
        .attr('x', 0 )
        .attr('y', 0 )
        .text(d.title)

      select(svgInfoPanel)
        .select('g.infoBox')
        .append('text')
        .attr('x', 0 )
        .attr('y', incr )
        .text(d.author)

      select(svgInfoPanel)
        .select('g.infoBox')
        .append('text')
        .attr('x', 0 )
        .attr('y', incr * 2 )
        .text(d.year)

      select(svgInfoPanel)
        .select('g.infoBox')
        .append('text')
        .attr('x', 0 )
        .attr('y', incr * 3 )
        .text(d.month)

      select(svgInfoPanel)
        .select('g.infoBox')
        .append('text')
        .attr('x', 0 )
        .attr('y', incr * 4 )
        .text(d.page)

      select(svgInfoPanel)
        .select('g.infoBox')
        .append('text')
        .attr('x', 0 )
        .attr('y', incr * 5 )
        .text(d.specattr)

      select(svgInfoPanel)
        .select('g.infoBox')
        .append('text')
        .attr('x', 0 )
        .attr('y', incr * 6 )
        .text(d.sprocess)

      } else if (this.props.click === false && this.props.nnMode === true ) {

        const squareSide = this.state.squareSide;
        const transitionSettings = transition().duration(1000);
        const svgNode = this.svgNode.current;

        // create grid coords
        const n = this.props.data.length;
        const ncol = this.props.ncol;
        const coords = gridCoords(n,ncol)
        const x = coords[0];
        const y = coords[1];

        // attach to 'data'
        const data = this.props.data;
        const nn = this.props.nn[d.KM];
        console.log(nn);
        let nnData = [];

        // build new array by nn sort order
        nn.forEach((item, i) => {
          nnData.push(data.filter(k => k.KM === item)[0]);
        });

        nnData.forEach((item, i) => {
          item.x = x[i];
          item.y = y[i];
        });

        // before we reorder by KM
        this.setState({ nnData: nnData });

        // back to original sort, after coordinates attached
        nnData = orderBy( nnData, ['KM'], ['asc'] );

        select(svgNode)
          .select('g.plotCanvas')
          .selectAll('image')
          .data(nnData)
          .transition(transitionSettings)
            .attr('x', d => d.x * squareSide - marginInt / 2 )
            .attr('y', d => d.y * squareSide - marginInt / 2 )

        select(svgNode)
          .select('g.plotCanvas')
          .selectAll('rect.highlight')
          .data(nnData)
          .transition(transitionSettings)
            .attr('x', d => d.x * squareSide - marginInt / 2 )
            .attr('y', d => d.y * squareSide - marginInt / 2 )

        select(svgNode)
          .select('g.plotCanvas')
          .selectAll('rect.filter')
          .data(nnData)
          .transition(transitionSettings)
            .attr('x', d => d.x * squareSide - marginInt / 2 )
            .attr('y', d => d.y * squareSide - marginInt / 2 )

        if ( this.state.clickId !== null ) {

          const targetCoords = data.filter(d => d.KM === this.state.clickId);
          const targetX = targetCoords.map(d => d.x);
          const targetY = targetCoords.map(d => d.y);

          select('#target')
            .transition(transitionSettings)
              .attr('x', targetX[0] * squareSide - marginInt / 2  )
              .attr('y', targetY[0] * squareSide - marginInt / 2  )
        }
      }
    }

  render() {

    const svgH = this.state.svgH;

    return (
      <div>
        <div className='fieldPlot'>
          <svg
          ref={this.svgNode}
          width={svgW}
          height={svgH}
          />
        </div>
        <div className='fieldPanel'>
          <svg
          ref={this.svgPanel}
          width={panelSide}
          height={panelSide}
          />
        </div>
        <div className='infoPanel'>
          <svg
          ref={this.svgInfoPanel}
          width={svgW * 0.55}
          height={svgW * 0.2}
          />
        </div>
      </div>
    );
  }
}

export default Tabletop;
