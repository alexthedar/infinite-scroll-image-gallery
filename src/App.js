import React , { Component }from 'react';
// import ReactDOM from 'react-dom';
import { Grid, Navbar, NavItem, Nav } from 'react-bootstrap';
import ImageGallery from './ImageGallery'
import './App.css';

class App extends Component {
  state = {
  }

  render () {
    return (
      <React.Fragment>
        <Navbar inverse fixedTop>
          <Grid>
            <Navbar.Header>
              <Navbar.Brand >
                <a href="/">Infinite Scroll Image Gallery</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav pullRight>
                  <NavItem>
                    Alexandar Castaneda:
                  </NavItem>
                  <NavItem href="https://www.linkedin.com/in/alexandarcastaneda/" target="_blank" rel="noopener noreferrer">
                    LinkedIn 
                  </NavItem>
                  <NavItem href="https://github.com/alexthedar" target="_blank" rel="noopener noreferrer">
                    Github 
                  </NavItem>
                </Nav>
            </Navbar.Collapse>
          </Grid>
        </Navbar>
        <main>
          <ImageGallery />
        </main>
      </React.Fragment>
    );
  }
};

export default App;