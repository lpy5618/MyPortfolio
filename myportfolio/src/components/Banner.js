import { Container, Row, Col } from 'react-bootstrap';
import { ArrowRightCircle } from 'react-bootstrap-icons';
import { useEffect, useState } from 'react';

export const Banner = () => {
    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [text, setText] = useState('');
    const [delta, setDelta] = useState(300 - Math.random() * 100);
    const [index, setIndex] = useState(1);
    const toRotate = ['AI/ML Developer', 'Web developer', 'Data Scientist', 'Software Developer'];
    const period = 2000;

    useEffect(() => {
        let ticker = setInterval(() => {
          tick();
        }, delta);
    
        return () => { clearInterval(ticker) };
      }, [delta, loopNum, isDeleting, text]) // Include delta, loopNum, isDeleting, and text
    
      const handleConnectClick = () => {
        window.open('https://www.linkedin.com/in/puyuli/', '_blank');
      };
    

    const tick = () => {
        let i = loopNum % toRotate.length;
        let fullText = toRotate[i];
        let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);
    
        setText(updatedText);
    
        if (isDeleting) {
          setDelta(prevDelta => prevDelta / 2);
        }
    
        if (!isDeleting && updatedText === fullText) {
          setIsDeleting(true);
          setIndex(prevIndex => prevIndex - 1);
          setDelta(period);
        } else if (isDeleting && updatedText === '') {
          setIsDeleting(false);
          setLoopNum(loopNum + 1);
          setIndex(1);
          setDelta(500);
        } else {
          setIndex(prevIndex => prevIndex + 1);
        }
    }

    return (
        <section className="banner" id="home">
            <Container>
                <Row className='align-items-center'>
                    <Col xs={12} md={6} xl={7}>
                        <span className='tagline'>Welcome to my Portfolio!</span>
                        <h1>{`Hi, I'm Jeff(Puyu) Li `}<span className='wrap'>{text}</span></h1>
                        <p>I am a passionate AI developer with a strong background in computer science and mathematics. I am proficient in machine learning, deep learning, and computer vision. I am also experienced in software development and data analysis. I am looking for opportunities to apply my skills to solve real-world problems.</p>
                        <button onClick={handleConnectClick}>Let's connect <ArrowRightCircle size={25} /></button>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}
