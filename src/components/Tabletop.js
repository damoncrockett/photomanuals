import React, { Component } from 'react';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';
import { gridCoords } from '../lib/plottools';
import { orderBy } from 'lodash';
import { zipObject } from 'lodash';

const innerW = window.innerWidth;
const innerH = window.innerHeight;
const marginInt = 0;
const margin = {top: marginInt, right: marginInt, bottom: marginInt, left: marginInt};

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

const keyBkgd = '#bd5319';
const keyText = 'hsl(0,0%,90%)';

const humanKeys = [
  'book title',
  'book author',
  'year',
  'print maker',
  'print maker location',
  'negative maker',
  'negative maker location',
  'operator',
  'process',
  'photomechanical',
  'has photo',
  'paper manufacturer',
  'paper brand',
  'paper manuf. location',
  'negative manufacturer',
  'negative brand',
  'negative manuf. location',
  'lens manufacturer',
  'lens brand',
  'lens manufacturer location',
  'mount manufacturer',
  'mount manuf. location',
  'coating manufacturer',
  'coating manuf. location',
  'accessory manufacturer',
  'accessory manuf. location',
  'photographic subject',
  'has negative manuf. info',
  'has mount manuf. info',
  'has lens manuf. info',
  'has accessory manuf. info',
  'has coating manuf. info',
  'has paper manuf. info'
];

const machineKeys = [
  'title',
  'author',
  'year',
  'specattr',
  'specattrloc',
  'specneg',
  'specnegloc',
  'specop',
  'sprocess',
  'photomech',
  'hasphoto',
  'paperman',
  'paperbran',
  'paperloc',
  'negman',
  'negbran',
  'negloc',
  'lensman',
  'lensbran',
  'lensloc',
  'mountman',
  'mountloc',
  'coatman',
  'coatloc',
  'accman',
  'accloc',
  'subj',
  'negman_k',
  'mountman_k',
  'lensman_k',
  'accman_k',
  'coatman_k',
  'paperman_k'
  ];

const keyTranslate = zipObject(machineKeys,humanKeys);

class Tabletop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      squareSide: 0,
      svgW: 0,
      svgH: 0,
      clickId: null,
      nnData: null
    }

    this.setSize = this.setSize.bind(this);
    this.drawSVG = this.drawSVG.bind(this);
    this.drawInfoKeys = this.drawInfoKeys.bind(this);
    this.drawTabletop = this.drawTabletop.bind(this);
    this.sortTabletop = this.sortTabletop.bind(this);
    this.handleMouseover = this.handleMouseover.bind(this);
    this.handleMouseout = this.handleMouseout.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.returnDomain = this.returnDomain.bind(this);
    this.svgNode = React.createRef();
  }

  // needed bc does not mount on site load like it used to
  componentDidMount() {
    this.setSize();
    this.drawInfoKeys();
  }

  componentDidUpdate(prevProps, prevState) {
    // conditional prevents infinite loop
    if (prevProps.data === null && prevProps.data !== this.props.data) {
      this.setSize();
      this.drawInfoKeys();
    }

    if (prevProps.orderBy !== this.props.orderBy) {
      this.drawInfoKeys();
      this.sortTabletop();
    }

    if (prevProps.orderBySecond !== this.props.orderBySecond) {
      this.drawInfoKeys();
      this.sortTabletop();
    }

    if (prevProps.asc !== this.props.asc) {
      this.sortTabletop();
    }

    if (prevProps.ascSecond !== this.props.ascSecond) {
      this.sortTabletop();
    }

    if (prevProps.ncolDivisor !== this.props.ncolDivisor) {
      this.setSize();
    }

    if (prevProps.ncolOut !== this.props.ncolOut) {
      this.setSize();
    }

    if (prevProps.color !== this.props.color) {
      this.drawTabletop();
    }

    if (prevProps.colorBy !== this.props.colorBy && this.props.color === true) {
      this.drawTabletop();
      this.drawInfoKeys();
    }

    if (prevProps.colorBy !== this.props.colorBy) {
      this.drawInfoKeys();
    }

    if (prevProps.filterKMs !== this.props.filterKMs) {
      this.drawTabletop();
    }

    if (prevProps.infoCollapse !== this.props.infoCollapse) {
      this.drawInfoKeys();
      this.setSize();
    }
  }

  returnDomain() {
    const production = process.env.NODE_ENV === 'production';
    return production ? '' : 'http://localhost:8888/'
  }

  setSize() {
    const n = this.props.data.length;
    const ncolOut = this.props.ncolOut;
    const ncolDivisor = this.props.ncolDivisor;
    const ncol = Math.round(ncolOut / ncolDivisor);

    let plotW = 0;

    if (this.props.filterModal===false & this.props.infoCollapse===true) {
      plotW = innerW;
    } else {
      plotW = innerW / 2;
    }

    const svgW = plotW + margin.left + margin.right;
    const squareSide = Math.round( svgW / ncol );

    const nrow = Math.ceil( n / ncol );
    const plotH = squareSide * nrow;
    const svgH = plotH + margin.top + margin.bottom;

    this.setState(
      { squareSide: squareSide, svgW: svgW, svgH: svgH },
      () => {
        this.drawSVG();
        this.drawTabletop();
      }
    );
  }

  drawSVG() {
    const svgNode = this.svgNode.current;

    select(svgNode)
      .selectAll('g.plotCanvas')
      .data([0]) // bc enter selection, prevents appending new 'g' on re-render
      .enter()
      .append('g')
      .attr('class', 'plotCanvas') // purely semantic
      .attr('transform', `translate(${margin.left},${margin.top})`);

  }

  drawInfoKeys() {

    select('#infoVals')
      .selectAll('p')
      .remove()

    select('#infoPanel')
      .selectAll('img')
      .remove()

    select('#infoKeys')
      .selectAll('p')
      .remove()

    if ( this.props.infoCollapse===true ) {

      const orderKey = this.props.orderBy;
      const orderKeySecond = this.props.orderBySecond;
      const colorKey = this.props.colorBy.split('_')[0];

      let orderKeyTranslated = '';
      let orderKeySecondTranslated = '';
      let colorKeyTranslated = '';

      if (colorKey=='decade' || colorKey=='cluster') {
        colorKeyTranslated = colorKey;
      } else {
        colorKeyTranslated = keyTranslate[colorKey]
      }

      if (orderKey=='decade' || orderKey=='cluster') {
        orderKeyTranslated = orderKey;
      } else {
        orderKeyTranslated = keyTranslate[orderKey]
      }

      if (orderKeySecond=='decade' || orderKeySecond=='cluster') {
        orderKeySecondTranslated = orderKeySecond;
      } else {
        orderKeySecondTranslated = keyTranslate[orderKeySecond]
      }

      const keys = [orderKeyTranslated,orderKeySecondTranslated,colorKeyTranslated];

      select('#infoKeys')
        .selectAll('p')
        .data(keys)
        .enter()
        .append('p')
        .text(d => d)
        .style('color', keyText)
        .style('background-color', keyBkgd)
        .style('text-align', 'right')
        .style('border-radius', '0.5vh')
        .style('width','max-content')
        .style('padding', '0.35vh')
        .style('font-size', '1.25vh')
        .style('margin', '0.25vh')
        .style('float','right')

    } else {

      select('#infoKeys')
        .selectAll('p')
        .data(humanKeys)
        .enter()
        .append('p')
        .text(d => d)
        .style('color', keyText)
        .style('background-color', keyBkgd)
        .style('text-align', 'right')
        .style('border-radius', '0.5vh')
        .style('width','max-content')
        .style('padding', '0.35vh')
        .style('font-size', '1.25vh')
        .style('margin', '0.25vh')
        .style('float','right')
    }
  }

  drawTabletop() {

    const svgNode = this.svgNode.current;
    const squareSide = this.state.squareSide;
    const slowTransition = transition().duration(1000);
    const fastTransition = transition().duration(1000);

    let sortOrder = '';
    if (this.props.asc===true) {
      sortOrder = 'asc'
    } else {
      sortOrder = 'desc'
    }

    let sortOrderSecond = '';
    if (this.props.ascSecond===true) {
      sortOrderSecond = 'asc'
    } else {
      sortOrderSecond = 'desc'
    }

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('image')
      .data(this.props.data)
      .enter()
      .append('image')
      .attr('id', d => 't' + d.KM + '_spec')
      .attr('xlink:href', d => this.returnDomain() + d.specpath )
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

    const filterKMs = this.props.filterKMs;

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
    let data = this.props.data;
    const n = data.length;

    const ncolOut = this.props.ncolOut;
    const ncolDivisor = this.props.ncolDivisor;
    const ncol = Math.round(ncolOut / ncolDivisor);

    const coords = gridCoords(n,ncol)
    const x = coords[0];
    const y = coords[1];

    if ( this.state.nnData !== null ) {
      data = this.state.nnData;
    } else {
      data = orderBy(data, [this.props.orderBy, this.props.orderBySecond], [sortOrder, sortOrderSecond] );
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

    let sortOrder = '';
    if (this.props.asc===true) {
      sortOrder = 'asc'
    } else {
      sortOrder = 'desc'
    }

    let sortOrderSecond = '';
    if (this.props.ascSecond===true) {
      sortOrderSecond = 'asc'
    } else {
      sortOrderSecond = 'desc'
    }

    // we only nullify nnDAta when we resort; otherwise we want its sort
    this.setState({nnData: null});

    const squareSide = this.state.squareSide;
    const transitionSettings = transition().duration(1000);
    const svgNode = this.svgNode.current;

    // create grid coords
    const n = this.props.data.length;

    const ncolOut = this.props.ncolOut;
    const ncolDivisor = this.props.ncolDivisor;
    const ncol = Math.round(ncolOut / ncolDivisor);

    const coords = gridCoords(n,ncol)
    const x = coords[0];
    const y = coords[1];

    // attach to 'data'
    let data = this.props.data;
    data = orderBy(data, [this.props.orderBy, this.props.orderBySecond], [sortOrder, sortOrderSecond] );
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

    select('#t' + d.KM + '_spec')
      .attr('width', squareSide * 1.25 )
      .attr('height', squareSide * 1.25 )

    select('#t' + d.KM + '_highlight')
      .attr('width', squareSide * 1.25 )
      .attr('height', squareSide * 1.25 )

    select('#t' + d.KM + '_filter')
      .attr('width', squareSide * 1.25 )
      .attr('height', squareSide * 1.25 )

    if ( this.props.click === false ) {

      if ( this.props.infoCollapse===true ) {

        const keys = [this.props.orderBy,this.props.orderBySecond,this.props.colorBy.split('_')[0]];

        select('#infoVals')
          .selectAll('p')
          .data(keys)
          .enter()
          .append('p')
          .text(datum => d[datum])
          .style('color', 'hsl(0,0%,90%)')
          .style('text-align', 'left')
          .style('width','max-content')
          .style('padding', '0.35vh')
          .style('font-size', '1.25vh')
          .style('margin', '0.25vh')
          .style('float','left')

      } else {

        select('#imgBox')
          .append('img')
          .attr('src', this.returnDomain() + d.fullspecpath)

        select('#infoVals')
          .selectAll('p')
          .data(machineKeys)
          .enter()
          .append('p')
          .text(datum => d[datum])
          .style('color', 'hsl(0,0%,90%)')
          .style('text-align', 'left')
          .style('width','max-content')
          .style('padding', '0.35vh')
          .style('font-size', '1.25vh')
          .style('margin', '0.25vh')
          .style('float','left')
      }
    }
  }

  handleMouseout(e, d) {

    const svgNode = this.svgNode.current;
    const squareSide = this.state.squareSide;

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

      select('#infoVals')
        .selectAll('p')
        .remove()

      select('#infoPanel')
        .selectAll('img')
        .remove()
    }
  }

  handleClick(e, d) {

    const squareSide = this.state.squareSide;
    const svgNode = this.svgNode.current;

    if ( this.props.click === true ) {

      this.setState({ clickId: d.KM });

      // remove stuff
      select(svgNode)
        .select('g.plotCanvas')
        .selectAll('rect.target').remove()

      select('#infoVals')
        .selectAll('p')
        .remove()

      select('#infoPanel')
        .selectAll('img')
        .remove()

      // add stuff
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

      if ( this.props.infoCollapse===true ) {

        const keys = [this.props.orderBy,this.props.colorBy.split('_')[0]];

        select('#infoVals')
          .selectAll('p')
          .data(keys)
          .enter()
          .append('p')
          .text(datum => d[datum])
          .style('color', 'hsl(0,0%,90%)')
          .style('text-align', 'left')
          .style('width','max-content')
          .style('padding', '0.35vh')
          .style('font-size', '1.25vh')
          .style('margin', '0.25vh')
          .style('float','left')

      } else {

        select('#imgBox')
          .append('img')
          .attr('src', this.returnDomain() + d.fullspecpath)

        select('#infoVals')
          .selectAll('p')
          .data(machineKeys)
          .enter()
          .append('p')
          .text(datum => d[datum])
          .style('color', 'hsl(0,0%,90%)')
          .style('text-align', 'left')
          .style('width','max-content')
          .style('padding', '0.35vh')
          .style('font-size', '1.25vh')
          .style('margin', '0.25vh')
          .style('float','left')
      }

    } else if (this.props.click === false && this.props.nnMode === true ) {

        const transitionSettings = transition().duration(1000);

        // create grid coords
        const n = this.props.data.length;

        const ncolOut = this.props.ncolOut;
        const ncolDivisor = this.props.ncolDivisor;
        const ncol = Math.round(ncolOut / ncolDivisor);

        const coords = gridCoords(n,ncol)
        const x = coords[0];
        const y = coords[1];

        // attach to 'data'
        const data = this.props.data;
        const nn = this.props.nn[d.KM];
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

        // get back to the top
        window.scrollTo(0,0);

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

    const svgW = this.state.svgW;
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
      </div>
    );
  }
}

export default Tabletop;
