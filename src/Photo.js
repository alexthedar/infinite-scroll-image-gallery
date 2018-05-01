import React, { Component } from 'react';
import { Col, Image } from 'react-bootstrap';

class Photo extends Component {

  // componentDidUpdate(prevProps, prevState) {
  //   if(this.props.height !== nextProps.height){
  //     this.props.getPhotoHeight(Math.ceil(ReactDOM.findDOMNode(this.divElement).clientHeight))
  //     console.log('props')
  //   }
  // }

  componentDidMount() {
    // this.props.getPhotoHeight(Math.ceil(ReactDOM.findDOMNode(this.divElement).clientHeight))
    this.props.getRef(this.divElement, this.props.i);
    // console.log('mount')
  }

  // componentWillReceiveProps(nextProps){
  //   if(this.props.height !== nextProps.height){
  //     console.log(nextProps)
  //     console.log('props')
  //   }
  // }

  render(){
    console.log(this.state, this.props)
    return(
      <Col xs={12} sm={6} md={4} lg={4} ref={ (divElement) => this.divElement = divElement}> 
        <Image src={`https://hiring.verkada.com/thumbs/${this.props.url}.jpg`} responsive className='photo-box'  />
      </Col>     
    )
  }
}
 
export default Photo;
