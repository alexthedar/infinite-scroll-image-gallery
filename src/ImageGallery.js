import React, { Component } from 'react';
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

class ImageGallery extends Component {

  state={
    currentVisibleStart: 1500348260,
    currentVisibleEnd: 1500348260,
    currentDisplayStart: 1500348260,
    currentDisplayEnd: 1500348260,
    windowWidth: 0,
    windowHeight: 0,
    loading: false,
    prevY: 0,
    photosArr: getNumberArray(1500348260, 21)
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
    let amount = 0;
    if(window.innerWidth < 400) { amount = 16 }
    else if (window.innerWidth >= 400 && window.innerWidth < 768) { amount = 8 }
    else if (window.innerWidth >= 768 && window.innerWidth < 992) { amount = 18 }
    else if (window.innerWidth >= 992 && window.innerWidth < 1200) { amount = 24 }
    else if (window.innerWidth >= 1200 ) { amount = 21 }
    
    this.setState({ 
      windowWidth: window.innerWidth, 
      windowHeight: window.innerHeight,
      amount: amount
    });
  }

  updateNumbers = (endOfArr, amount) => {
    let newNumbers = getNumberArray(endOfArr, amount)
    console.log(newNumbers, newNumbers[newNumbers.length-1])
    this.setState({
      photosArr: uniq(this.state.photosArr.concat(newNumbers)),
      endingNumber: newNumbers[newNumbers.length-1]
    })
  }
  
  handleScroll = (e) => {
    if ( (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500) ) {
      let endingNumber = this.state.photosArr[this.state.photosArr.length-1];
      this.updateNumbers(endingNumber, this.state.amount)
      // console.log('here')
    }

  }

  render() {
    console.log(this.state.photosArr)
    let photos = this.state.photosArr.map((number, i) => {
      return <Photo url={number} key={number+`${i}`}/>
    })

    return (
      <React.Fragment >
        <Grid>
          <Row >
            {photos}
          </Row>
        </Grid>
      </React.Fragment>
    );
  }
}

export default ImageGallery;


const Photo = (props) => {
  return (
    <Col xs={12} sm={6} md={4} lg={4} > 
      <Image src={`https://hiring.verkada.com/thumbs/${props.url}.jpg`} responsive className='photo-box'/>
      {props.url}
    </Col>     
  )
}
