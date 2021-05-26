import React, { Component } from 'react';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';
import { zoom, zoomIdentity, zoomTransform } from 'd3-zoom';
import { scaleLinear } from 'd3-scale';
import { gridCoords } from '../lib/plottools';
import { orderBy } from 'lodash';

const screenH = window.innerHeight * window.devicePixelRatio;
const screenW = window.innerWidth * window.devicePixelRatio;
console.log(screenW);
console.log(screenH);
const marginInt = Math.round( screenH / 45 );
const margin = {top: marginInt, right: marginInt, bottom: marginInt, left: marginInt};
const plotH = Math.round( screenH / 2.25 );
const plotW = plotH;
const svgW = plotW + margin.left + margin.right;
const svgH = plotH + margin.top + margin.bottom;
const squareSide = Math.round( screenH / 64 );

const clusterColors = {
  0: 'rgba(255,0,0,0.5)', //red
  1: 'rgba(0,255,0,0.5)', //green
  2: 'rgba(0,0,255,0.5)', //blue
  3: 'rgba(255,255,0,0.5)', //yellow
  4: 'rgba(255,165,0,0.5)', //orange
  5: 'rgba(160,32,240,0.5)', //purple
  6: 'rgba(255,0,255,0.5)' //magenta
};

class Tabletop extends Component {
  constructor(props) {
    super(props);

    this.drawSVG = this.drawSVG.bind(this);
    this.drawTabletop = this.drawTabletop.bind(this);
    this.sortTabletop = this.sortTabletop.bind(this);
    this.handleMouseover = this.handleMouseover.bind(this);
    this.handleMouseout = this.handleMouseout.bind(this);
    this.handleZoom = this.handleZoom.bind(this);
    this.svgNode = React.createRef();
    this.svgPanel = React.createRef();
    this.svgInfoBox = React.createRef();
  }

  componentDidMount() {
    this.drawSVG();
  }

  componentDidUpdate(prevProps, prevState) {
    // conditional prevents infinite loop
    if (prevProps.data === null && prevProps.data !== this.props.data) {
      this.drawTabletop();
    }

    if (prevProps.data !== null && prevProps.orderBy !== this.props.orderBy) {
      this.sortTabletop();
    }

    if (prevProps.data !== null && prevProps.asc !== this.props.asc) {
      this.sortTabletop();
    }

    if (prevProps.data !== null && prevProps.ncol !== this.props.ncol) {
      this.sortTabletop();
    }

  }

  drawSVG() {
    const svgNode = this.svgNode.current;
    const svgPanel = this.svgPanel.current;
    const svgInfoBox = this.svgInfoBox.current;

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

    select(svgInfoBox)
      .selectAll('g.infoBox')
      .data([0]) // bc enter selection, prevents appending new 'g' on re-render
      .enter()
      .append('g')
      .attr('class', 'infoBox') // purely semantic
      .attr('transform', `translate(${margin.left},${margin.top})`);

    select(svgNode)
      .call(zoom()
        .extent([[0, 0], [plotW, plotH]])
        .scaleExtent([0.25, 5])
        .on('zoom', this.handleZoom));
    }

  handleZoom(e) {
    const svgNode = this.svgNode.current;

    // because we apply this directly as a transform, we have to incl. margin
    const zx = e.transform.x + marginInt;
    const zy = e.transform.y + marginInt;
    const zk = e.transform.k;
    const adjustedTransform = zoomIdentity.translate(zx,zy).scale(zk);

    // Not sure why g.plotCanvas is the selection, since d3.zoom
    // is called on the just the svgNode. But it only works like this
    select(svgNode)
      .select('g.plotCanvas')
      .attr('transform', adjustedTransform.toString())

  }

  drawTabletop() {
    const svgNode = this.svgNode.current;

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('image')
      .data(this.props.data)
      .enter()
      .append('image')
      .attr('id', d => 't' + d.KM + '_spec')
      .attr('xlink:href', d => "http://localhost:8888/" + d.specpath )
      //.attr('xlink:href', d => d.specpath )
      .attr('width', squareSide )
      .attr('height', squareSide )
      .on('mouseover', this.handleMouseover)
      .on('mouseout', this.handleMouseout)

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
      .attr('x', d => d.x * squareSide - marginInt / 2 )
      .attr('y', d => d.y * squareSide - marginInt / 2 )

    }

  sortTabletop() {
    const transitionSettings = transition().duration(3000);
    const svgNode = this.svgNode.current;

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
      .transition(transitionSettings)
        .attr('x', d => d.x * squareSide - marginInt / 2 )
        .attr('y', d => d.y * squareSide - marginInt / 2 )

    }

  // note: 'e' here is the mouse event itself, which we don't need
  handleMouseover(e, d) {

    const svgPanel = this.svgPanel.current;
    const svgInfoBox = this.svgInfoBox.current;

    select('#t' + d.KM + '_spec')
      .attr('width', squareSide * 1.125 )
      .attr('height', squareSide * 1.125 )

    select(svgPanel)
      .select('g.panelCanvas')
      .append('image')
      .attr('xlink:href', "http://localhost:8888/" + d.fullspecpath)
      //.attr('xlink:href', d.specpath)
      .attr('width', svgW * 0.75 )
      .attr('height', svgH * 0.75 )
      .attr('x', -marginInt )
      .attr('y', -marginInt )
      .attr('id', 't' + d.KM + '_fullspec')

    select(svgInfoBox)
      .select('g.infoBox')
      .append('text')
      .attr('x', 0 )
      .attr('y', 0 )
      .attr('id', 't' + d.KM + '_title')
      .text(d.title)

    select(svgInfoBox)
      .select('g.infoBox')
      .append('text')
      .attr('x', 0 )
      .attr('y', 15 )
      .attr('id', 't' + d.KM + '_author')
      .text(d.author)

    select(svgInfoBox)
      .select('g.infoBox')
      .append('text')
      .attr('x', 0 )
      .attr('y', 30 )
      .attr('id', 't' + d.KM + '_year')
      .text(d.year)

    select(svgInfoBox)
      .select('g.infoBox')
      .append('text')
      .attr('x', 0 )
      .attr('y', 45 )
      .attr('id', 't' + d.KM + '_month')
      .text(d.month)

    select(svgInfoBox)
      .select('g.infoBox')
      .append('text')
      .attr('x', 0 )
      .attr('y', 60 )
      .attr('id', 't' + d.KM + '_page')
      .text(d.page)

    select(svgInfoBox)
      .select('g.infoBox')
      .append('text')
      .attr('x', 0 )
      .attr('y', 75 )
      .attr('id', 't' + d.KM + '_specattr')
      .text(d.specattr)

    select(svgInfoBox)
      .select('g.infoBox')
      .append('text')
      .attr('x', 0 )
      .attr('y', 90 )
      .attr('id', 't' + d.KM + '_sprocess')
      .text(d.sprocess)

    }

  handleMouseout(e, d) {

      select('#t' + d.KM + '_spec')
        .attr('width', squareSide )
        .attr('height', squareSide )

      select('#t' + d.KM + '_fullspec').remove()
      select('#t' + d.KM + '_title').remove()
      select('#t' + d.KM + '_author').remove()
      select('#t' + d.KM + '_year').remove()
      select('#t' + d.KM + '_month').remove()
      select('#t' + d.KM + '_page').remove()
      select('#t' + d.KM + '_specattr').remove()
      select('#t' + d.KM + '_sprocess').remove()

    }

  render() {
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
          height={svgH * 0.75}
          />
        </div>
        <div className='infoBox'>
          <svg
          ref={this.svgInfoBox}
          width={svgW * 0.6}
          height={svgH * 0.2}
          />
        </div>
      </div>
    );
  }
}

export default Tabletop;
