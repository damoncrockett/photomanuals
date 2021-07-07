import React, { Component } from 'react';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';
import { zoom, zoomIdentity, zoomTransform } from 'd3-zoom';
import { scaleLinear } from 'd3-scale';
import { gridCoords } from '../lib/plottools';
import { orderBy } from 'lodash';
import { countBy } from 'lodash';

const screenH = window.innerHeight * window.devicePixelRatio;
const screenW = window.innerWidth * window.devicePixelRatio;
console.log(screenW);
console.log(screenH);
const marginInt = Math.round( screenH / 45 );
const margin = {top: marginInt, right: marginInt, bottom: marginInt, left: marginInt};
const plotW = Math.round( screenH / 2.25 );
const svgW = plotW + margin.left + margin.right;

const blankColor = 'rgba(0,0,0,0)';
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
      clickId: null
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

    if (prevProps.data !== null && prevProps.orderBy !== this.props.orderBy) {
      this.sortTabletop();
    }

    if (prevProps.data !== null && prevProps.asc !== this.props.asc) {
      this.sortTabletop();
    }

    if (prevProps.data !== null && prevProps.ncol !== this.props.ncol) {
      this.setSize();
    }

    if (prevProps.color !== this.props.color) {
      this.drawTabletop();
    }

    if (prevProps.colorBy !== this.props.colorBy && this.props.color === true) {
      this.drawTabletop();
    }

  }

  setSize() {
    const n = this.props.data.length;
    const ncol = this.props.ncol;
    const squareSideDivisor = ncol * 2.133;
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
    const slowTransition = transition().duration(3000);
    const fastTransition = transition().duration(3000);

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
      .selectAll('rect')
      .data(this.props.data)
      .enter()
      .append('rect')
      .attr('id', d => 't' + d.KM + '_rect')
      .attr('class', 'highlight')
      .attr('fill', d => this.props.color ? clusterColors[d[this.props.colorBy]] : blankColor )
      .attr('width', squareSide )
      .attr('height', squareSide )
      .on('mouseover', this.handleMouseover)
      .on('mouseout', this.handleMouseout)
      .on('click', this.handleClick)

    const n = this.props.data.length;
    const ncol = this.props.ncol;
    const coords = gridCoords(n,ncol)
    const x = coords[0];
    const y = coords[1];

    let data = this.props.data;
    data = orderBy(data, [this.props.orderBy], [this.props.asc] );
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

    const squareSide = this.state.squareSide;
    const transitionSettings = transition().duration(3000);
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
      .selectAll('rect')
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

    select('#t' + d.KM + '_rect')
      .attr('width', squareSide * 1.125 )
      .attr('height', squareSide * 1.125 )

    if ( this.props.click === false ) {

      select(svgPanel)
        .select('g.panelCanvas')
        .append('image')
        .attr('xlink:href', d.fullspecpath)
        //.attr('xlink:href', "http://localhost:8888/" + d.fullspecpath)
        .attr('width', svgW * 0.75 )
        .attr('height', svgW * 0.75 )
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
        .attr('y', 15 )
        .text(d.author)

      select(svgInfoPanel)
        .select('g.infoBox')
        .append('text')
        .attr('x', 0 )
        .attr('y', 30 )
        .text(d.year)

      select(svgInfoPanel)
        .select('g.infoBox')
        .append('text')
        .attr('x', 0 )
        .attr('y', 45 )
        .text(d.month)

      select(svgInfoPanel)
        .select('g.infoBox')
        .append('text')
        .attr('x', 0 )
        .attr('y', 60 )
        .text(d.page)

      select(svgInfoPanel)
        .select('g.infoBox')
        .append('text')
        .attr('x', 0 )
        .attr('y', 75 )
        .text(d.specattr)

      select(svgInfoPanel)
        .select('g.infoBox')
        .append('text')
        .attr('x', 0 )
        .attr('y', 90 )
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

    select('#t' + d.KM + '_rect')
      .attr('width', squareSide )
      .attr('height', squareSide )

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
        .attr('width', svgW * 0.75 )
        .attr('height', svgW * 0.75 )
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
        .attr('y', 15 )
        .text(d.author)

      select(svgInfoPanel)
        .select('g.infoBox')
        .append('text')
        .attr('x', 0 )
        .attr('y', 30 )
        .text(d.year)

      select(svgInfoPanel)
        .select('g.infoBox')
        .append('text')
        .attr('x', 0 )
        .attr('y', 45 )
        .text(d.month)

      select(svgInfoPanel)
        .select('g.infoBox')
        .append('text')
        .attr('x', 0 )
        .attr('y', 60 )
        .text(d.page)

      select(svgInfoPanel)
        .select('g.infoBox')
        .append('text')
        .attr('x', 0 )
        .attr('y', 75 )
        .text(d.specattr)

      select(svgInfoPanel)
        .select('g.infoBox')
        .append('text')
        .attr('x', 0 )
        .attr('y', 90 )
        .text(d.sprocess)
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
          width={svgW * 0.75}
          height={svgW * 0.75}
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
