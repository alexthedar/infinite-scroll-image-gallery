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
    photosArr: [1500348260]
  }

  componentWillMount(){
    let amount = getRecordAmount(window.innerWidth);
    let photoArr = getNumberArray(1500348260, 100);
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      amount: amount,
      photosArr: photoArr,
      currentVisibleStart: 1500348260,
      currentVisibleEnd: photoArr[photoArr.length-1],
      currentDisplayStart: 1500348260,
      currentDisplayEnd: photoArr[photoArr.length-1],
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

  addToPhotos = (endOfArr, amount) => {
    let newNumbers = getNumberArray(endOfArr, amount)
    this.setState({
      photosArr: uniq(this.state.photosArr.concat(newNumbers)),
      currentDisplayEnd: newNumbers[newNumbers.length-1],
      loading: false
    })
  }

  // trouble getting array to update array on screen after certain point so as not to endless add to dom
  // updateArray = (currentEndingNumber) => {
  //   var halfAmount = this.state.amount/2;
  //   let newPhotoArr = getNumberArray(currentEndingNumber, this.state.photosArr.length)
  //   this.setState({
  //     photoArr: newPhotoArr,
  //     currentDisplayEnd: newPhotoArr[newPhotoArr.length-1]
  //   })
  // }
  
  handleScroll = (e) => {
    // console.log(window.scrollY, 'body', document.body.offsetHeight, window.windowIndex)
    // console.log(e, window, document)
    // let absY = Math.abs(window.scrollY);
    // let offset = absY > 1000 ? 500 : absY;
    // let N = 2
    // N += absY > 1000 ? Math.floor(window.innerHeight/1.2) : Math.floor(absY/250)
    // console.log(absY, offset, N)
    // console.log(this.refs.scrollThing.findDOMNode())
    console.log(this.state)
    var scrollTop = document.documentElement.scrollTop || window.pageYOffset;
    var recordPerBody = Math.floor((window.innerHeight - 2) / this.state.photoHeight);
    var visibleStart = Math.floor(scrollTop / this.state.photoHeight);
    var visibleEnd = Math.min(visibleStart + recordPerBody, 500000 - 1);

    var displayStart = Math.max(0, Math.floor(scrollTop / this.state.photoHeight) - recordPerBody * 1.5);
    var displayEnd = Math.min(displayStart + 4 * recordPerBody, 500000 - 1);

    console.log(recordPerBody, visibleStart, visibleEnd, displayStart, displayEnd) //window.pageYOffset || 
    if(window.scrollY < 300 && document.body.offsetHeight > 4000){
      console.log('here')
    }
    if ( (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 250) ) {
      let endingNumber = this.state.photosArr[this.state.photosArr.length-1];
      this.setState({loading: true})
      // this.addToPhotos(endingNumber, this.state.amount)
      // if(this.state.photosArr.length > 200){
      //   this.updateArray(endingNumber)
      // } else {
      // }
    }
  }

  getPhotoHeight = (height) => {
    this.setState({
      photoHeight: height
    })
  }

  render() {
    // console.log(this.state)
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


