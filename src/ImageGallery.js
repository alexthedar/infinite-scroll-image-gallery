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

  state={}

  render() {
    let arr = getNumberArray(1500348260, 40)
    
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
