import React, { Component } from 'react';
import { Grid, Row, Col, Image } from 'react-bootstrap';
import './ImageGallery.css'

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
    windowHeight: 0
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
    window.removeEventListener('scroll', this.handleScroll);
  }

  updateWindowDimensions = (e) =>  {
    this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
    // console.log('window resize');
    // console.log(e);

  }

  handleScroll = (e) => {
    // console.log('scroll event');
    // console.log(e);
  }

  render() {
    console.log(this.state.windowWidth)
    let amount = 18
    if(this.state.windowWidth < 400) { amount = 16 }
    else if (this.state.windowWidth >= 400 && this.state.windowWidth < 768) { amount = 8 }
    else if (this.state.windowWidth >= 768 && this.state.windowWidth < 992) { amount = 18 }
    else if (this.state.windowWidth >= 992 && this.state.windowWidth < 1200) { amount = 24 }
    else if (this.state.windowWidth >= 1200 ) { amount = 21 }
    console.log(amount)
    let arr = getNumberArray(1500348260, amount)
    // 18 24 16 16  
    let photos = arr.map((number, i) => {
      return <Photo url={number} key={number+`${i}`}/>
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


const Photo = (props) => {
  return (
    <Col xs={12} sm={6} md={4} lg={4} > 
      <Image src={`https://hiring.verkada.com/thumbs/${props.url}.jpg`} responsive className='photo-box'/>
    </Col>     
  )
}
