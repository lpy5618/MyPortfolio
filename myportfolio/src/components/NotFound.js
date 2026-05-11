import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <section className="not-found">
            <Container>
                <Row className="justify-content-center text-center">
                    <Col md={8}>
                        <h1>404</h1>
                        <h2>Page Not Found</h2>
                        <p>The page you're looking for doesn't exist or has been moved.</p>
                        <button onClick={() => navigate('/')}><span>Back to Home</span></button>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};
