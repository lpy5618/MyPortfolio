import { Container, Row, Col } from 'react-bootstrap';
import { ArrowRightCircle } from 'react-bootstrap-icons';
import headerImg from '../assets/img/header-img.svg';
import { useEffect, useState } from 'react';

export const Banner = () => {
    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [text, setText] = useState('');
    const [delta, setDelta] = useState(300 - Math.random() * 100);
    const toRotate = ['AI Developer', 'Machine Learning Engineer', 'Data Scientist', 'Software Developer'];
    const period = 2000;

    useEffect(() => {
        let ticker = setInterval(() => {
            ticker();
        }, delta);
        return () => {
            clearInterval(ticker)
        };
    }, [text]);

    return (
        <section className="banner" id="home">
            <Container>
                <Row className='align-items-center'>
                    <Col xs={12} md={6} xl={7}>
                        <span className='tagline'>Welcome to my Portfolio!</span>
                        <h1>{`Hi, I'm Puyu(Jeff) Li`}<span className='wrap'>AI Developer</span></h1>
                        <p>I am a passionate AI developer with a strong background in computer science and mathematics. I am proficient in machine learning, deep learning, and computer vision. I am also experienced in software development and data analysis. I am looking for opportunities to apply my skills to solve real-world problems.</p>
                        <button onClick={() => console.log('connect')}>Let's connect <ArrowRightCircle size={25} /></button>
                    </Col>
                    <Col xs={12} md={6} xl={5}>
                        <img src={headerImg} alt="Header Img" />
                    </Col>
                </Row>
            </Container>
        </section>
    );
}