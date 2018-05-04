import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Measure from 'react-measure';
import { Grid, Row, Col, Image } from 'react-bootstrap';
import './ImageGallery.css'

import uniq from 'lodash/uniq';
import range from 'lodash/range';

const getNumberArray = (starting, amount) => {
  let arr = [starting]
  for(let i = 0; i<(amount-1); i++){
    arr.push(arr[i]+20)
  }
  return arr
}

// const getRecordAmount = (windowWidth) => {
//   let amount = 0;
//   if(window.innerWidth < 400) { amount = 16 }
//   else if (window.innerWidth >= 400 && window.innerWidth < 768) { amount = 8 }
//   else if (window.innerWidth >= 768 && window.innerWidth < 992) { amount = 18 }
//   else if (window.innerWidth >= 992 && window.innerWidth < 1200) { amount = 24 }
//   else if (window.innerWidth >= 1200 ) { amount = 21 };
//   return amount;
// }
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
  return Math.max(1, Math.floor(winHeight/photoHeight))
}

const getScrollRow = (scrollTop, photoHeight) => {
  return Math.floor(scrollTop/photoHeight)
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
    totalPhotos: (1503031520-1500348260)/5, // start hundreds - end hundreds / photos per hundred
    photosPerPage: 15,
    photoHeight: (window.innerHeight/getAmount(window.innerWidth).row),
    elapsedScrollHeight: 0,
    remainingScrollHeight: (1503031520-150034826)/(window.innerHeight/getAmount(window.innerWidth).row),
    photosNumbers: getNumberArray(1500348260, 15)  || 0,
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
    let photo = Math.ceil(this.state.photoHeight)
    let scroll = document.documentElement.scrollTop || window.pageYOffset;
    console.log(document.documentElement.scrollTop, window.pageYOffset, photo)
    console.log(Math.floor(document.documentElement.scrollTop/photo), Math.floor(window.pageYOffset/photo))

    // let arr = this.getPhotoArr();
    let newArr = this.state.photosNumbers.concat([])
    // let adjust = scroll < this.state.scroll ? -60 : 60;
    // let rowAdjust = scroll < this.state.scroll ? -1 : 1;
    let row = this.state.row + 0;
    if (row < 0){row = 0}
    let first = newArr[0]+0;
    if(first < 1500348260){first = 1500348260}
    let last = newArr[14]+0;
    if(last < 1500348500) {last = 1500348500}
    let remadeArr = getPhotoNumbersArr(1500348260, 1500349500)
    let totalScrollHeight =((1503031520-1500348260))/this.state.photoHeight;
    let elapsedScrollHeight = this.state.photoHeight * row;
    let remainingScrollHeight = totalScrollHeight - (elapsedScrollHeight + (this.state.photoHeight * 4))
    this.setState({
      photosNumbers: remadeArr,
      scroll: scroll,
      row: row,
      elapsedScrollHeight: elapsedScrollHeight,
      remainingScrollHeight: remainingScrollHeight
    })
    // console.log(Math.floor(scroll/this.state.photoHeight))
  }

  getPhotoDimensions = (height, width) => {
    this.setState({
      photoHeight: height,
      photoWidth: width
    })
  }


  render() {

    // let photos = this.state.photosNumbers.map((number, i) => {
    //   return <Photo url={number} key={number+`${i}`} 
    //                 getPhotoDimensions={this.getPhotoDimensions}
    //                 photoHeight={this.props.photoHeight}/>
    // })


    return (
      <React.Fragment >  
        <Grid>
          <PhotoRows  photosNumbers={this.state.photosNumbers} 
                      elapsedScrollHeight={this.state.elapsedScrollHeight}
                                          getPhotoDimensions={this.getPhotoDimensions}

                      remainingScrollHeight={this.state.remainingScrollHeight}/>
        </Grid>
      </React.Fragment>
    );
  }
}

export default ImageGallery;


  // <Row style={{height: this.state.elapsedScrollHeight}}></Row>
  // <Row>
  //   {photos}
  // </Row>
  // <Row style={{height: (this.state.remainingScrollHeight)}}></Row>

    //       <PhotoRows  getPhotoDimensions={this.getPhotoDimensions} 
    //         firstVisiblePhoto={this.state.firstVisiblePhoto}
    //         lastVisiblePhoto={this.state.lastVisiblePhoto}
    //         firstDisplayPhoto={this.state.firstDisplayPhoto}
    //         lastDisplayPhoto={this.state.lastDisplayPhoto}
    //         photoHeight={this.state.photoHeight}
    //         visibleStartRow={this.state.visibleStartRow}
    //         visibleEndRow={this.state.visibleEndRow}
    //         displayStartRow={this.state.displayStartRow}
    //         displayEndRow={this.state.displayEndRow}
    //         total={this.state.totalPhotos}
    //         photosNumbers={this.state.photosNumbers}
    //         />


class PhotoRows extends Component {

  state={
    shouldUpdate: true,
    total: 0,
    displayStart: 0,
    displayEnd: 0
  }

  componentWillReceiveProps(nextProps){
    let shouldUpdate = false;
    if(this.props.photosNumbers !== nextProps.photosNumbers){
      shouldUpdate = true
    }
    this.setState({shouldUpdate: shouldUpdate})
  }

  shouldComponentUpdate(){
    return this.state.shouldUpdate;
  }


  render(){
    // console.log(this.props)
    let photos = this.props.photosNumbers.map((number, i) => {
      return <Photo url={number} key={number+`${i}`} 
                    getPhotoDimensions={this.props.getPhotoDimensions}
                    photoHeight={this.props.photoHeight}/>
    })


    return(
      <React.Fragment>
        <Row style={{height: this.props.elapsedScrollHeight}}></Row>
          <Row>
            {photos}
          </Row>
        <Row style={{height: this.props.remainingScrollHeight}}></Row>
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


// const Photo = (props) => {
//   var style = {
//     height: `${props.photoHeight}px`, 
//     marginTop: '1rem', 
//     marginBottom: '1rem',
//     position: 'relative',
//     textAlign: 'center'
//   }
//   return (
//     <Col xs={12} sm={6} md={4} lg={4} > 
//       <div style={style} >
//         <Image src={`https://hiring.verkada.com/thumbs/${props.url}.jpg`} className='photo-box' />
//         <div className='centered'>{props.url}</div>
//       </div>
//     </Col>     
//   )
// }


// getPhotoCalc = () => {  
//   // let rowsPerPage = Math.ceil((this.state.windowHeight - 2) / this.state.photoHeight);
//   // let columnsPerPage = Math.floor(this.state.windowWidth / this.state.photoWidth);
//   let rowsPerPage = 4;
//   let columnsPerPage = 3;

//   // let scrollTop = document.documentElement.scrollTop || window.pageYOffset;
//   let scrollTop = window.pageYOffset;
//   // let photosPerPage = (rowsPerPage + 1) * columnsPerPage;
//   let photosPerPage = 12;
//   // let displayPhotosPerPage = (rowsPerPage * columnsPerPage) * 2;
//   let displayPhotosPerPage = 24;
//   // let firstPhoto =  (1500348260 + (Math.floor(scrollTop / (this.state.photoHeight + 20)) * columnsPerPage) * 20)
//   let firstPhoto =  (1500348260 + (Math.floor(scrollTop / (this.state.photoHeight + 20)) * columnsPerPage) * 20)
//   let lastPhoto = (firstPhoto - 20) + (photosPerPage * 20)

//   let visibleStartRow = Math.floor(scrollTop / this.state.photoHeight);
//   let visibleEndRow = Math.min(visibleStartRow + rowsPerPage, 500000 - 1);
//   // let displayStartRow = Math.max(0, Math.floor((scrollTop / this.state.photoHeight) - rowsPerPage * 1.5));
//   // let displayEndRow = Math.min(displayStartRow + (3 * rowsPerPage), 500000 - 1);
//   let displayStartRow = Math.max(0, visibleStartRow - 4);
//   let displayEndRow = (rowsPerPage + visibleStartRow) + 4;
  
//   let firstVisiblePhoto = 1500348260 + ((visibleStartRow * columnsPerPage)*20);
//   let lastVisiblePhoto = (firstVisiblePhoto - 20) + (photosPerPage * 20);
//   let firstDisplayPhoto = 1500348260 + ((visibleStartRow * columnsPerPage) * 20);
//   let lastDisplayPhoto = Math.max(3, firstDisplayPhoto + (displayEndRow * 20))
//   // let lastDisplayPhoto = (firstVisiblePhoto - 20) + ((displayEndRow *3)*20);

//   console.log(scrollTop, this.state.photoHeight, Math.floor(scrollTop / this.state.photoHeight))
//   console.log(rowsPerPage, columnsPerPage, photosPerPage, displayPhotosPerPage)
//   console.log(firstPhoto, lastPhoto)
//   // console.log((displayStartRow * columnsPerPage) * 20)
//   // console.log((Math.max(0, Math.floor((scrollTop / this.state.photoHeight) - rowsPerPage * 2))))
//   // console.log(rowsPerPage, columnsPerPage, scrollTop, photosPerPage, visibleStartRow, visibleEndRow, displayStartRow, displayEndRow, firstVisiblePhoto, lastVisiblePhoto, firstDisplayPhoto, lastDisplayPhoto)
//   // console.log(Math.floor((scrollTop / this.state.photoHeight) - rowsPerPage * 1.5))
//   let photosNumbers = getPhotoNumbersArr(firstPhoto, lastPhoto)
//   // let photosNumbers = getNumberArray(firstDisplayPhoto, 16)
//   this.setState({
//     // amount: getNumberArray(firstDisplayPhoto, 21),
//     rowsPerPage: rowsPerPage,
//     columnsPerPage: columnsPerPage,
//     photosPerPage: photosPerPage,
//     visibleStartRow: visibleStartRow,
//     visibleEndRow: visibleEndRow,
//     displayStartRow: displayStartRow,
//     displayEndRow: displayEndRow,
//     firstVisiblePhoto: firstVisiblePhoto,
//     lastVisiblePhoto: lastVisiblePhoto,
//     firstDisplayPhoto: firstDisplayPhoto,
//     lastDisplayPhoto: lastDisplayPhoto,
//     photosNumbers: photosNumbers
//   })
  
//   console.log(photosNumbers)
//   console.log(this.state)
// }
