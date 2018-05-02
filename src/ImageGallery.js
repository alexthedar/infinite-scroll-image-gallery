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
    let calcs = this.getPhotoCalc();
    calcs.windowWidth = window.innerWidth;
    calcs.windowHeight = window.innerHeight;
    calcs.amount = amount;
    this.setState(calcs);
  }

  // addToPhotosArr = (endOfArr, amount) => {
  //   let newNumbers = getNumberArray(endOfArr, amount)
  //   this.setState({
  //     photosArr: uniq(this.state.photosArr.concat(newNumbers)),
  //   })
  // }
  
  handleScroll = (e) => {
    let data = this.getPhotoCalc();
    this.setState(data)
  }

  getPhotoCalc = () => {  
    let rowsPerPage = Math.ceil((window.innerWidth - 2) / this.state.photoHeight);
    let columnsPerPage = Math.floor(window.innerWidth / this.state.photoWidth);

    let scrollTop = document.documentElement.scrollTop || window.pageYOffset;
    let photosPerPage = rowsPerPage * columnsPerPage;

    let visibleStartRow = Math.floor(scrollTop / this.state.photoHeight);
    let visibleEndRow = Math.min(visibleStartRow + rowsPerPage, 500000 - 1);
    let displayStartRow = Math.max(0, Math.floor(scrollTop / this.state.photoHeight) - rowsPerPage * 1.5);
    let displayEndRow = Math.min(displayStartRow + 4 * rowsPerPage, 500000 - 1);

    let firstVisiblePhoto = 1500348260 + ((visibleStartRow * columnsPerPage)*20);
    let lastVisiblePhoto = (firstVisiblePhoto - 20) + ((rowsPerPage * columnsPerPage) * 20);
    let firstDisplayPhoto = 1500348260 + ((displayStartRow * columnsPerPage) * 20);
    let lastDisplayPhoto = (firstVisiblePhoto - 20) + ((displayEndRow * columnsPerPage) *20);

    return {
      rowsPerPage: rowsPerPage,
      columnsPerPage: columnsPerPage,
      photosPerPage: photosPerPage,
      visibleStartRow: visibleStartRow,
      visibleEndRow: visibleEndRow,
      displayStartRow: displayStartRow,
      displayEndRow: displayEndRow,
      firstVisiblePhoto: firstVisiblePhoto,
      lastVisiblePhoto: lastVisiblePhoto,
      firstDisplayPhoto: firstDisplayPhoto,
      lastDisplayPhoto: lastDisplayPhoto
    }
    // this.setState({
    //   rowsPerPage: rowsPerPage,
    //   columnsPerPage: columnsPerPage,
    //   photosPerPage: photosPerPage,
    //   visibleStartRow: visibleStartRow,
    //   visibleEndRow: visibleEndRow,
    //   displayStartRow: displayStartRow,
    //   displayEndRow: displayEndRow,
    //   firstVisiblePhoto: firstVisiblePhoto,
    //   lastVisiblePhoto: lastVisiblePhoto,
    //   firstDisplayPhoto: firstDisplayPhoto,
    //   lastDisplayPhoto: lastDisplayPhoto
    // })
  }
  getPhotoDimensions = (height, width) => {
    this.setState({
      photoHeight: height,
      photoWidth: width,
      columnsPerPage: Math.floor(window.innerWidth / width),
    })
  }


  render() {
    let photos = this.state.photosArr.map((number, i) => {
      return <Photo url={number} key={number+`${i}`} getPhotoDimensions={this.getPhotoDimensions}/>
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



class Photo extends Component {

  render (){
    return(
      <Measure
        bounds
        onResize={(contentRect) => {
          this.props.getPhotoDimensions(contentRect.bounds.height, contentRect.bounds.width)
        }}>
        {({ measureRef }) =>
            <Col xs={12} sm={6} md={4} lg={4} > 
              <div ref={measureRef}>
                <Image src={`https://hiring.verkada.com/thumbs/${this.props.url}.jpg`} responsive className='photo-box'/>
                <span style={{color: 'white'}}>{this.props.url}</span>
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


