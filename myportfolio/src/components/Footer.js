import { Container, Row, Col } from 'react-bootstrap';
import logo from '../assets/img/logo.png';
import navIcon1 from '../assets/img/nav-icon1.svg';
import navIcon2 from '../assets/img/nav-icon2.svg';

export const Footer = () => {
    return (
        <footer className="footer">
            <Container>
                <Row className="align-item-center">
                    <Col sm={6}>
                        <img src={logo} alt="Logo" />
                    </Col>
                    <Col sm={6} className='text-center text-sm-end'>
                        <div className='social-icon'>
                            <a href="https://www.linkedin.com/in/puyuli/"><img src={navIcon1} alt="" /></a>
                            <a href="https://github.com/lpy5618"><img src={navIcon2} alt="" /></a>
                        </div>
                        <p>© 2024 My Portfolio. All Rights Reserved</p>
                        <p>This website is still in developing, some of the functions may not working properly currently, if you noticed some bugs, feel free to contact me and I will fix it later. Thanks~</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}