import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Measure from 'react-measure';
import { Grid, Row, Col, Image } from 'react-bootstrap';
import './ImageGallery.css'

import uniq from 'lodash/uniq';

const getNumberArray = (starting, amount) => {
  let arr = [starting]
  for(let i = 0; i<(amount-1); i++){
    arr.push(arr[i]+20)
  }
  return arr
}

const getRecordAmount = (windowWidth) => {
  let amount = 0;
  if(window.innerWidth < 400) { amount = 16 }
  else if (window.innerWidth >= 400 && window.innerWidth < 768) { amount = 8 }
  else if (window.innerWidth >= 768 && window.innerWidth < 992) { amount = 18 }
  else if (window.innerWidth >= 992 && window.innerWidth < 1200) { amount = 24 }
  else if (window.innerWidth >= 1200 ) { amount = 21 };
  return amount;
}

class ImageGallery extends Component {

  state={
    currentVisibleStart: 1500348260,
    currentVisibleEnd: 1500348260,
    currentDisplayStart: 1500348260,
    currentDisplayEnd: 1500348260,
    windowWidth: 0,
    windowHeight: 0,
    loading: false,
    photosArr: [1500348260],
    totalPhotos: (1503031520-1500348260)/5 // start hundreds - end hundreds / photos per hundred
  }

  componentWillMount(){
    let amount = getRecordAmount(window.innerWidth);
    let photosArr = getNumberArray(1500348260, 50);
    let rowsPerPage = Math.floor((window.innerHeight - 2) / 220); //default size
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      amount: amount,
      photosArr: photosArr,
      currentVisibleStart: 1500348260,
      currentVisibleEnd: rowsPerPage,
      currentDisplayStart: 1500348260,
      currentDisplayEnd: rowsPerPage * 2,
      rowsPerPage: rowsPerPage,
      photosPerPage: rowsPerPage * 3,
      photoArrEnd: photosArr[photosArr.length-1]
    })
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
    let amount = getRecordAmount(window.innerWidth);
    this.setState({ 
      windowWidth: window.innerWidth, 
      windowHeight: window.innerHeight,
      amount: amount
    });
  }

  addToPhotosArr = (endOfArr, amount) => {
    let newNumbers = getNumberArray(endOfArr, amount)
    this.setState({
      photosArr: uniq(this.state.photosArr.concat(newNumbers)),
    })
  }
  
  handleScroll = (e) => {
    let scrollTop = document.documentElement.scrollTop || window.pageYOffset;
    let rowsPerPage = Math.floor((this.state.windowHeight - 2) / this.state.photoHeight);
    let photosPerPage = rowsPerPage * 3 // rowsPerPage * amount;
    let visibleStart = Math.floor(scrollTop / this.state.photoHeight);
    let visibleEnd = Math.min(visibleStart + rowsPerPage, 500000 - 1);
    let displayStart = Math.max(0, Math.floor(scrollTop / this.state.photoHeight) - rowsPerPage * 1.5);
    let displayEnd = Math.min(displayStart + 4 * rowsPerPage, 500000 - 1);
    var photosArr = this.state.photosArr;
    if(Math.floor(this.state.photosArr.length * .4) < this.state.currentDisplayEnd){
      let newNumbers = getNumberArray(this.state.photosArr[this.state.photosArr.length-1], this.state.photosPerPage * 4)
      photosArr = uniq(this.state.photosArr.concat(newNumbers)),
      // this.addToPhotosArr(this.state.photosArr[this.state.photosArr.length-1], this.state.photosPerPage * 4)
    }
    this.setState({
      rowsPerPage: rowsPerPage,
      photosPerPage: photosPerPage,
      currentVisibleStart: visibleStart,
      currentVisibleEnd: visibleEnd,
      currentDisplayStart: displayStart,
      currentDisplayEnd: displayEnd,
      photosArr: photosArr
    })
    // console.log(rowsPerPage, visibleStart, visibleEnd, displayStart, displayEnd) //window.pageYOffset || 

  }

  getPhotoHeight = (height) => {
    this.setState({
      photoHeight: height
    })
  }

  render() {
    // 
    let photos = this.state.photosArr.map((number, i) => {
      return <Photo url={number} key={number+`${i}`} getPhotoHeight={this.getPhotoHeight}/>
    })

    return (
      <React.Fragment >
        <Grid>
          <Row ref="scrollThing">
            {photos}
          </Row>
        </Grid>
      </React.Fragment>
    );
  }
}

export default ImageGallery;



class Photo extends Component {

  render (){
    return(
      <Measure
        bounds
        onResize={(contentRect) => {
          this.props.getPhotoHeight(contentRect.bounds.height)
        }}>
        {({ measureRef }) =>
            <Col xs={4} sm={4} md={4} lg={4} > 
              <div ref={measureRef}>
                <Image src={`https://hiring.verkada.com/thumbs/${this.props.url}.jpg`} responsive className='photo-box'/>
              </div>
            </Col>     
        }
      </Measure>    )
  }
}


// const Photo = (props) => {
//   return (
//     <Col xs={12} sm={6} md={4} lg={4} > 
//       <Image src={`https://hiring.verkada.com/thumbs/${props.url}.jpg`} responsive className='photo-box'/>
//     </Col>     
//   )
// }


