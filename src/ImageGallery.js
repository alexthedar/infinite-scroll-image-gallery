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
    windowWidth: 0,
    windowHeight: 0,
    loading: false,
    totalPhotos: (1503031520-1500348260)/5 // start hundreds - end hundreds / photos per hundred
  }

  componentWillMount(){
    let amount = getRecordAmount(window.innerWidth);
    let photosArr = getNumberArray(1500348260, 50);
    let rowsPerPage = Math.floor((window.innerHeight - 2) / 220); //default size
    let displayEndRow = rowsPerPage * 2; //default size
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      amount: amount,

      rowsPerPage: rowsPerPage,
      columnsPerPage: 3,
      photosPerPage: rowsPerPage * 3,
      visibleStartRow: 1,
      visibleEndRow: rowsPerPage * 2,
      displayStartRow: 1,
      displayEndRow: rowsPerPage * 2,
      firstVisiblePhoto: 1500348260,
      lastVisiblePhoto: 1500348240 + ((rowsPerPage * 3) * 20),
      firstDisplayPhoto: 1500348260,
      lastDisplayPhoto: 1500348240 + ((displayEndRow * 3) *20),
      photoHeight: 500
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
    // let calcs = this.getPhotoCalc();
    let calcs = {}
    calcs.windowWidth = window.innerWidth;
    calcs.windowHeight = window.innerHeight;
    calcs.amount = amount;
    this.setState(calcs);
  }
  
  handleScroll = (e) => {
    let data = this.getPhotoCalc();
    this.setState(data)
  }

  getPhotoCalc = () => {  
    let rowsPerPage = Math.floor((window.innerWidth - 2) / this.state.photoHeight);
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
  }

  getPhotoDimensions = (height, width) => {
    this.setState({
      photoHeight: height,
      photoWidth: width,
      columnsPerPage: Math.floor(window.innerWidth / width),
    })
  }


  render() {

    // console.log(this.state)
    // var photos = []
    // for(let i = this.state.firstVisiblePhoto; i< this.state.lastDisplayPhoto; i=i+20){
    //   photos.push(<Photo url={i} key={i} getPhotoDimensions={this.getPhotoDimensions}/>)
    // }

    // let photos = this.state.photosArr.map((number, i) => {
    //   return <Photo url={number} key={number+`${i}`} getPhotoDimensions={this.getPhotoDimensions}/>
    // })
    // console.log(photos)

    return (
      <React.Fragment >
        <Grid>
          <PhotoRows  getPhotoDimensions={this.getPhotoDimensions} 
                      firstVisiblePhoto={this.state.firstVisiblePhoto}
                      lastVisiblePhoto={this.state.lastVisiblePhoto}
                      firstDisplayPhoto={this.state.firstDisplayPhoto}
                      lastDisplayPhoto={this.state.lastDisplayPhoto}
                      photoHeight={this.state.photoHeight}
                      visibleStartRow={this.state.visibleStartRow}
                      visibleEndRow={this.state.visibleEndRow}
                      displayStartRow={this.state.displayStartRow}
                      displayEndRow={this.state.displayEndRow}
                      total={this.state.totalPhotos}/>
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
    displayStart: 0,
    displayEnd: 0
  }

  componentWillReceiveProps(nextProps){
    var shouldUpdate = !(
        nextProps.visibleStartRow >= this.state.displayStartRow &&
        nextProps.visibleEndRow <= this.state.displayEndRow
    ) || (nextProps.total !== this.state.total);

    if (shouldUpdate) {
        this.setState({
            shouldUpdate: shouldUpdate,
            total: nextProps.total,
            displayStartRow: nextProps.displayStartRow,
            displayEndRow: nextProps.displayEndRow,
            photoVisibleStart: nextProps.firstVisiblePhoto,
            photoVisibleEnd: nextProps.lastVisiblePhoto,
            photoDisplayStart: nextProps.firstDisplayPhoto,
            photoDisplayEnd: nextProps.lastDisplayPhoto

        });
    } else {
        this.setState({shouldUpdate: false});
    }
  }

  shouldComponentUpdate(){
    return this.state.shouldUpdate
  }


  render(){
    console.log(this.props)
    var photos = []
    for(let i = this.props.firstVisiblePhoto; i< this.props.lastDisplayPhoto; i=i+20){
      // photos.push(<Photo url={i} key={i} getPhotoDimensions={this.props.getPhotoDimensions}/>)
      console.log(i)
      photos = photos.concat([<Photo url={i} key={i} getPhotoDimensions={this.props.getPhotoDimensions}/>])
    }


    return(
      <React.Fragment>
        <Row style={{height: this.props.displayStartRow * this.props.photoHeight}}></Row>
        <Row>
          {photos}
        </Row>
        <Row style={{height: (this.props.displayEndRow *5) * this.props.photoHeight}}></Row>
      </React.Fragment>

    )
  }
}



class Photo extends Component {

  componentWillMount(){

  }

  render (){
    return(
      <Measure
        bounds
        onResize={(contentRect) => {
          this.props.getPhotoDimensions(contentRect.bounds.height, contentRect.bounds.width)
        }}>
        {({ measureRef }) =>
            <Col xs={12} sm={6} md={4} lg={4} > 
              <div ref={measureRef} >
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


