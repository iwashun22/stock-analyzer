import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { IoMdOpen } from 'react-icons/io';
import './CustomNavbar.scss';

function CustomNavbar() {
  return (
    <Navbar fixed="top" expand="lg" className="navbar">
      <Container>
        <Nav className="w-100 flex-row justify-content-end">
          <Nav.Item className="nav-item">
            <Nav.Link href="#" className="fs-5 text-uppercase text-light fw-semibold">About</Nav.Link>
          </Nav.Item>
          <Nav.Item className="nav-item">
            <Nav.Link 
              href="https://github.com/iwashun22/stock-analyzer"
              className="fs-5 text-light fw-semibold"
              target="_blank"
              >
              <span>GitHub</span>
              <IoMdOpen style={{ marginLeft: '10px' }}/>
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>
    </Navbar>
  )
}

export default CustomNavbar