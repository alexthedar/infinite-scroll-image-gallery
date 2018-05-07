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
// const getAmount = (windowWidth) => {
//   let amount = 0;
//   if(window.innerWidth < 400) { amount = {col: 1, row: 5} }
//   else if (window.innerWidth >= 400 && window.innerWidth < 768) { amount = {col: 1, row: 2} }
//   else if (window.innerWidth >= 768 && window.innerWidth < 992) { amount = {col: 1, row: 4} }
//   else if (window.innerWidth >= 992 && window.innerWidth < 1200) { amount = {col: 1, row:3 } }
//   else if (window.innerWidth >= 1200 ) { amount = {col: 1, row: 4} };
//   return amount
// }

const getColumns = (winWidth, photoWidth) => {
  return Math.min(3, Math.floor(winWidth/photoWidth))
}

const getRows = (winHeight, photoHeight) => {
  return Math.max(1, Math.ceil(winHeight/photoHeight))
}

const getScrollRow = (scrollTop, photoHeight) => {
  return Math.floor(scrollTop/Math.ceil(photoHeight))
}

const getPhotoNumbersArr = (start, end) => {
  let arr = []
  for(let i = start; i <= end; i=i+20){
    arr.push(i)
  }
  return arr
}

class ImageGallery extends Component {

  state={
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    loading: false,
    totalPhotos: 2683260, 
    photosPerPage: 15,
    photoHeight: 290,
    elapsedScrollHeight: 50,
    remainingScrollHeight: 9202,
    photosNumbers: getNumberArray(1500348260, 30)  || 0,
    row: 0
}

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    window.addEventListener('scroll', this.handleScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
    window.removeEventListener('scroll', this.handleScroll, false);
  }

  updateWindowDimensions = (e) =>  {
    let w = window.innerWidth;
    let h = window.innerHeight
    this.setState({
      rowsPerPage: getRows(h, this.state.photoHeight),
      columnsPerPage: getColumns(w, this.state.photoWidth),
      windowWidth: w,
      windowHeight: h,
    });
  }
  
  handleScroll = (e) => {
    this.setState({ loading: true })
    // let photo = Math.ceil(this.state.photoHeight);
    let scroll = document.documentElement.scrollTop || window.pageYOffset;
    let topVisibleRow = getScrollRow(scroll, this.state.photoHeight);
    // let bottomVisibleRow = topVisibleRow + this.state.rowsPerPage;
    let firstVisiblePhoto = 1500348260 + (topVisibleRow * 60)
    // let lastVisiblePhoto = (firstVisiblePhoto -20) + (bottomVisibleRow * 60)
    let topDisplayRow = (topVisibleRow - 3) < 0 ? 0 : (topVisibleRow - 3);
    let bottomDisplayRow = topDisplayRow + (this.state.rowsPerPage * 2)
    let topDisplayPhoto = topDisplayRow < 0 ? firstVisiblePhoto : 1500348260 + (topDisplayRow * 60);
    let bottomDisplayPhoto = (firstVisiblePhoto -20) + (bottomDisplayRow * 60)

    let totalScrollHeight =9252;
    let elapsedScrollHeight = this.state.photoHeight * topVisibleRow;
    let remainingScrollHeight = totalScrollHeight - (elapsedScrollHeight + (this.state.rowsPerPage*this.state.photoHeight));

    this.setState({
      scroll: scroll,
      elapsedScrollHeight: elapsedScrollHeight,
      remainingScrollHeight: remainingScrollHeight,
      topDisplayRow: topDisplayRow,
      topVisibleRow: topVisibleRow,
      topDisplayPhoto: topDisplayPhoto,
      bottomDisplayPhoto: bottomDisplayPhoto
    })
  }

  getPhotoDimensions = (height, width) => {
    this.setState({
      photoHeight: 290,
      photoWidth: width
    })
  }


  render() {
    return (
      <React.Fragment >  
        <Grid>
          <PhotoRows  photosNumbers={this.state.photosNumbers} 
                      elapsedScrollHeight={this.state.elapsedScrollHeight}
                      getPhotoDimensions={this.getPhotoDimensions}
                      remainingScrollHeight={this.state.remainingScrollHeight}
                      topDisplayRow={this.state.topDisplayRow}
                      topVisibleRow={this.state.topVisibleRow}
                      topDisplayPhoto={this.state.topDisplayPhoto}
                      bottomDisplayPhoto={this.state.bottomDisplayPhoto}
                      total={this.state.total}
                      photoHeight={this.state.photoHeight}/>
        </Grid>
      </React.Fragment>
    );
  }
}

export default ImageGallery;


class PhotoRows extends Component {

  state={
    shouldUpdate: true,
    total: 0,
    topDisplayRow: 0,
    topVisibleRow: 0,
    photos: getNumberArray(1500348260, 50)
  }

  componentWillReceiveProps(nextProps){
    let shouldUpdate = false;
    if(this.state.topDisplayRow <= nextProps.topDisplayRow || this.state.topVisibleRow >= nextProps.topVisibleRow){
      shouldUpdate = true
      this.setState({
        shouldUpdate: shouldUpdate,
        topDisplayRow: nextProps.topDisplayRow,
        topVisibleRow: nextProps.topVisibleRow, 
        photos: getPhotoNumbersArr(nextProps.topDisplayPhoto, nextProps.bottomDisplayPhoto),
      })
    }
  }

  shouldComponentUpdate(){
    return this.state.shouldUpdate;
  }


  render(){
    let photos = this.state.photos.map((number, i) => {
      return <Photo url={number} key={number+`${i}`} 
                    getPhotoDimensions={this.props.getPhotoDimensions}
                    photoHeight={this.props.photoHeight}/>
    })


    return(
      <React.Fragment>
          <Row>
            <div style={{height: this.props.elapsedScrollHeight}}></div>
              {photos}
            <div style={{height: this.props.remainingScrollHeight}}></div>
          </Row>
      </React.Fragment>
    )
  }
}



class Photo extends Component {

  render (){
    var style = {
      height: `${this.props.photoHeight}px`, 
      marginTop: '1rem', 
      marginBottom: '1rem',
      position: 'relative',
      textAlign: 'center'
    
    }
    return(
      <Measure
        bounds
        margin
        onResize={(contentRect) => {
          this.props.getPhotoDimensions(contentRect.bounds.height+contentRect.margin.top+contentRect.margin.bottom, contentRect.bounds.width)
        }}>
        {({ measureRef }) =>
            <Col xs={12} sm={6} md={4} lg={4} > 
              <div ref={measureRef} style={style} >
                <Image src={`https://hiring.verkada.com/thumbs/${this.props.url}.jpg`} className='photo-box' />
                <div className='centered'>{this.props.url}</div>
              </div>
            </Col>     
        }
      </Measure>    )
  }
}

