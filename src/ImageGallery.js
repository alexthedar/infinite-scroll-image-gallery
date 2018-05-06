import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import Measure from 'react-measure';
import { Grid, Row, Col, Image } from 'react-bootstrap';
import './ImageGallery.css'

// import uniq from 'lodash/uniq';
// import range from 'lodash/range';

const getNumberArray = (starting, amount) => {
  let arr = [starting]
  for(let i = 0; i<(amount-1); i++){
    arr.push(arr[i]+20)
  }
  return arr
}
const getAmount = (windowWidth) => {
  let amount = 0;
  if(window.innerWidth < 400) { amount = {col: 1, row: 5} }
  else if (window.innerWidth >= 400 && window.innerWidth < 768) { amount = {col: 1, row: 2} }
  else if (window.innerWidth >= 768 && window.innerWidth < 992) { amount = {col: 1, row: 4} }
  else if (window.innerWidth >= 992 && window.innerWidth < 1200) { amount = {col: 1, row:3 } }
  else if (window.innerWidth >= 1200 ) { amount = {col: 1, row: 4} };
  return amount
}

const getColumns = (winWidth, photoWidth) => {
  return Math.min(3, Math.floor(winWidth/photoWidth))
}

const getRows = (winHeight, photoHeight) => {
  return Math.max(1, Math.ceil(winHeight/photoHeight))
}

const getScrollRow = (scrollTop, photoHeight) => {
  return Math.floor(scrollTop/Math.ceil(photoHeight))
}

const getVisibleRows = (totalRows, firstVisibleRowNumber, totalColumns) => {
  let rowsArr = []
  for(let i = 0; i < totalRows; i++){
    rowsArr.push(getNumberArray(1500348260 + ((firstVisibleRowNumber + i) * 20), totalColumns))
  }
  return rowsArr
}


class ImageGallery extends Component {

  state={
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    totalRows: getAmount(window.innerWidth).row,
    totalPhotos: 2683260, 
    photoHeight: 290,
    photoWidth: 220 ,
    rowsPerPage: getAmount(window.innerWidth).row,
    columnsPerPage: getAmount(window.innerWidth).col,
    topDisplayRow: 0,
    topVisibleRow: 0
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions, false);
    window.addEventListener('scroll', this.handleScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions, false);
    window.removeEventListener('scroll', this.handleScroll, false);
  }

  updateWindowDimensions = (e) =>  {
    let w = window.innerWidth;
    let h = window.innerHeight;
    let rows = getRows(h, this.state.photoHeight)
    this.setState({
      rowsPerPage: rows,
      totalRows: rows,
      columnsPerPage: getColumns(w, this.state.photoWidth),
      bottomVisibleRow: this.state.topVisibleRow + rows,
      windowWidth: w,
      windowHeight: h,
    });
  }
  
  handleScroll = (e) => {
    let scroll = document.documentElement.scrollTop || window.pageYOffset;
    let topVisibleRow = getScrollRow(scroll, this.state.photoHeight);
    let bottomVisibleRow = Math.min(topVisibleRow + this.state.rowsPerPage, this.state.totalPhotos - 1);
    let columnAdjust = 20 * this.state.columnsPerPage
    let firstVisiblePhoto = 1500348260 + (topVisibleRow * columnAdjust)
    let topDisplayRow = Math.max(0, Math.floor(scroll / this.state.photoHeight) - this.state.rowsPerPage * 1.5)
    let bottomDisplayRow = Math.min(topDisplayRow + 4 * this.state.rowsPerPage, this.state.totalPhotos - 1)
    let topDisplayPhoto = topDisplayRow < 0 ? firstVisiblePhoto : 1500348260 + (topDisplayRow * columnAdjust);
    let totalRows = this.state.rowsPerPage
    this.setState({
      amount: (this.state.rowsPerPage * 20) * this.state.columnsPerPage,
      scroll: scroll,
      totalRows: totalRows,
      topDisplayRow: topDisplayRow,
      topVisibleRow: topVisibleRow,
      topDisplayPhoto: topDisplayPhoto,
      bottomDisplayRow: bottomDisplayRow, 
      bottomVisibleRow: bottomVisibleRow
    })
  }


  render() {
    console.log(this.state)
    return (
      <React.Fragment >  
        <Grid>
          <PhotoRows  topDisplayRow={this.state.topDisplayRow}
                      topVisibleRow={this.state.topVisibleRow}
                      bottomDisplayRow={this.state.bottomDisplayRow}
                      bottomVisibleRow={this.state.bottomVisibleRow}
                      topDisplayPhoto={this.state.topDisplayPhoto}
                      totalPhotos={this.state.totalPhotos}
                      totalRows={this.state.totalRows}
                      totalColumns={this.state.columnsPerPage}
                      amount={this.state.amount}/>
        </Grid>
      </React.Fragment>
    );
  }
}

export default ImageGallery;


class PhotoRows extends Component {

  state={
    firstVisiblePhoto: 1500348260 + (this.props.topVisibleRow * 20),
    urlArr: getVisibleRows(this.props.totalRows, this.props.topVisibleRow, this.props.totalColumns)
  }


  render(){

    // let rows = Array.from({length: this.props.totalRows*2}, (item, i) => 
    //   <PhotoRow urlNumbers={getNumberArray((i+this.props.topVisibleRow), this.props.totalColumns)}key={i}/>
    // );

    let rows = this.state.urlArr.map((rowArr, i) => {
      return <PhotoRow urlNumbers={rowArr} key={i}/>
    })
    return(
      <React.Fragment>
        {/* <div style={{height: (this.props.topVisibleRow/4)}}></div> */}
          {rows}
        {/* <div style={{height: (this.props.totalPhotos/4) - (this.props.topVisibleRow/4)}}></div> */}
      </React.Fragment>
    )
  }
}


class PhotoRow extends Component {

  render(){

    let photos = this.props.urlNumbers.map((number, i) => {
      return <Photo url={number} key={i}/>
    })

    return(
      <React.Fragment>
        {photos}
      </React.Fragment>

    )
  }
}


const Photo = (props) => {
  var style = {
    marginTop: '1rem', 
    marginBottom: '1rem',
    position: 'relative',
    textAlign: 'center',
    height: '220px',
    backgroundColor: 'grey'
  }

  return (
    <Col xs={12} sm={6} md={4} lg={4} > 
      <div style={style}>
      {/* <Image src={`https://hiring.verkada.com/thumbs/${this.props.url}.jpg`} className='photo-box' /> */}
      <div className='centered'>{props.url}</div>
    </div>
  </Col>     

  )    
}