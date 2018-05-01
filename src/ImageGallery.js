import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
    windowHeight: 0,
    loading: false,
    prevY: 0,
    photosArr: getNumberArray(1500348260, 21)
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    window.addEventListener('scroll', this.handleScroll, false);
    // let num = getNumberArray(1500348260, this.state.amount)
    // this.setState({
    //   photosArr: num
    // })
    // console.log(this.state)
    //   Options
    var options = {
      root: null, // Page as root
      rootMargin: '0px',
      threshold: 1.0
    };
    // Create an observer
    this.observer = new IntersectionObserver(
      this.handleObserver.bind(this), //callback
      options
    );
    //Observ the `loadingRef`
    this.observer.observe(this.loadingRef);
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
      photosArr: this.state.photosArr.concat(newNumbers),
      endingNumber: newNumbers[newNumbers.length-1]
    })
  }

  handleObserver(entities, observer) {
    const y = entities[0].boundingClientRect.y;
    if (this.state.prevY > y) {
      let endingNumber = this.state.photosArr[this.state.photosArr.length-1];
      this.updateNumbers(endingNumber, this.state.amount)
      // const curPage = lastUser.id;
      // this.getUsers(curPage);
      // this.setState({ page: curPage });
      console.log('here')
    }
    this.setState({ prevY: y });
  }
  
  handleScroll = (e) => {
    // console.log('scroll event');
    // console.log(window);
    if ( (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 750) ) {
      let endingNumber = this.state.photosArr[this.state.photosArr.length-1];
      this.updateNumbers(endingNumber, this.state.amount)
      // console.log('here')
    }

  }

  render() {
    // let amount = 18
    // if(this.state.windowWidth < 400) { amount = 16 }
    // else if (this.state.windowWidth >= 400 && this.state.windowWidth < 768) { amount = 8 }
    // else if (this.state.windowWidth >= 768 && this.state.windowWidth < 992) { amount = 18 }
    // else if (this.state.windowWidth >= 992 && this.state.windowWidth < 1200) { amount = 24 }
    // else if (this.state.windowWidth >= 1200 ) { amount = 21 }
    // let arr = getNumberArray(1500348260, amount)
    console.log(this.state)
    let photos = this.state.photosArr.map((number, i) => {
      return <Photo url={number} key={number+`${i}`}/>
    })

    return (
      <React.Fragment >
        <Grid>
          <Row >
            <div ref={loadingRef => (this.loadingRef = loadingRef)}>
            </div>
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
