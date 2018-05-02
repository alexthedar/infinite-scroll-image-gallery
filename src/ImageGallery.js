import React, { Component } from 'react';
import ReactDOM from 'react-dom';
<<<<<<< HEAD
import Measure from 'react-measure'
=======
import Measure from 'react-measure';
>>>>>>> 695d9a8917b079832a516f37234aed9532f0170a
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
<<<<<<< HEAD
    let photoArr = getNumberArray(1500348260, 24);
=======
    let photosArr = getNumberArray(1500348260, 50);
    let rowsPerPage = Math.floor((window.innerHeight - 2) / 220); //default size
>>>>>>> 695d9a8917b079832a516f37234aed9532f0170a
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
<<<<<<< HEAD

  // trouble getting array to update array on screen after certain point so as not to endless add to dom
  // updateArray = (currentEndingNumber) => {
  //   var halfAmount = this.state.amount/2;
  //   let newPhotoArr = getNumberArray(currentEndingNumber, this.state.photosArr.length)
  //   this.setState({
  //     photoArr: newPhotoArr,
  //     currentDisplayEnd: newPhotoArr[newPhotoArr.length-1]
  //   })
  // }

  updateArray = () => {
    // create a large array of numbers
    // if only and always 3 to a row then grab window height and divide by photoheight  = Math.floor(this.state.windowHeight/this.state.photoHeight)
    //
    
  }
  
  handleScroll = (e) => {
    console.log() 
    if(window.scrollY < 300 && this.state.bottom === true){
    // if(window.scrollY < 300 && this.state.bottom === true){
      this.setState({bottom: false, top: true})

      console.log('here')
    }
    if ( (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - (this.state.photoHeight*2)) ) {
      let endingNumber = this.state.photosArr[this.state.photosArr.length-1];
      this.setState({bottom: true, top: false})
      console.log('now')

      // this.addToPhotos(endingNumber, this.state.amount)
=======
  
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
>>>>>>> 695d9a8917b079832a516f37234aed9532f0170a
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

  getPhotoHeight = (height) => {
    this.setState({
      photoHeight: height    
    })
  }

  render() {
<<<<<<< HEAD
    let photos = this.state.photosArr.map((number, i) => {
      return <Photo url={number} getPhotoHeight={this.getPhotoHeight} key={number+`${i}`}/>
=======
    // 
    let photos = this.state.photosArr.map((number, i) => {
      return <Photo url={number} key={number+`${i}`} getPhotoHeight={this.getPhotoHeight}/>
>>>>>>> 695d9a8917b079832a516f37234aed9532f0170a
    })

    return (
      <React.Fragment >
        <Grid>
          <Row>
            {photos}
          </Row>
        </Grid>
      </React.Fragment>
    );
  }
}

export default ImageGallery;


<<<<<<< HEAD
// const Photo = (props) => {
//   return (
//     <Col xs={12} sm={6} md={4} lg={4} > 
//       <Image src={`https://hiring.verkada.com/thumbs/${props.url}.jpg`} responsive className='photo-box'/>
//     </Col>     
//   )
// }


class Photo extends Component {

  render(){
=======

class Photo extends Component {

  render (){
>>>>>>> 695d9a8917b079832a516f37234aed9532f0170a
    return(
      <Measure
        bounds
        onResize={(contentRect) => {
          this.props.getPhotoHeight(contentRect.bounds.height)
        }}>
        {({ measureRef }) =>
<<<<<<< HEAD
              <Col xs={4} sm={4} md={4} lg={4} > 
                <div ref={measureRef}>
                  <Image src={`https://hiring.verkada.com/thumbs/${this.props.url}.jpg`} responsive className='photo-box'  />
                </div>
              </Col>     
        }
      </Measure>
    )
  }
}

      // <Col xs={12} sm={6} md={4} lg={4} ref={ (divElement) => this.divElement = divElement}> 
      //   <Image src={`https://hiring.verkada.com/thumbs/${this.props.url}.jpg`} responsive className='photo-box'  />
      // </Col>     


      // var recordsPerBody = Math.floor((window.innerHeight - 2) / this.state.photoHeight);
      // var visibleStart = Math.floor(document.documentElement.scrollTop / this.state.photoHeight);
      // var visibleEnd = Math.min(visibleStart + recordsPerBody, this.state.photosArr.length - 1);
  
      // var displayStart = Math.max(0, Math.floor(document.documentElement.scrollTop / this.state.photoHeight) - recordsPerBody * 1.5);
      // var displayEnd = Math.min(displayStart + 4 * recordsPerBody, this.state.photosArr.length - 1);
  
=======
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


>>>>>>> 695d9a8917b079832a516f37234aed9532f0170a
