import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Carousel, Modal, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

export const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        console.log('Fetching project details for ID:', id);
        const response = await fetch(`https://cienunkpi2.execute-api.ap-southeast-2.amazonaws.com/default/projects/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (typeof data.techStack === 'string') {
          try {
            data.techStack = JSON.parse(data.techStack);
          } catch (e) {
            console.error('Error parsing techStack JSON:', e);
          }
        }

        if (typeof data.demoImages === 'string') {
          try {
            data.demoImages = JSON.parse(data.demoImages);
          } catch (e) {
            console.error('Error parsing demoImages JSON:', e);
          }
        }

        if (typeof data.outcome === 'string') {
          try {
            data.outcome = JSON.parse(data.outcome);
          } catch (e) {
            console.error('Error parsing outcome JSON:', e);
          }
        }

        setProject(data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching project details:', error);
      }
    };

    fetchProjectDetails();
  }, [id]);

  if (error) {
    return <p>Error fetching project details: {error}</p>;
  }

  if (!project) {
    return <p>Loading...</p>;
  }

  const handleShow = (imgUrl) => {
    setCurrentImage(imgUrl);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const renderTechStack = (techStack) => {
    if (techStack && typeof techStack === 'object' && !Array.isArray(techStack)) {
      return (
        <Row>
          {Object.entries(techStack).map(([category, technologies], index) => {
            const techList = Array.isArray(technologies) ? technologies : [technologies];
            return (
              <Col key={index} md={4} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{category}</Card.Title>
                    <Card.Text>
                      <ul>
                        {techList.map((tech, i) => (
                          <li key={i}>{tech}</li>
                        ))}
                      </ul>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      );
    } else {
      console.log('Invalid techStack format');
      return null;
    }
  };

  const renderCarousel = (images) => {
    if (!Array.isArray(images)) {
      console.log('Invalid images format');
      return null;
    }

    return (
      <Carousel>
        {images.map((imgUrl, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100 carousel-img"
              src={imgUrl}
              alt={`demo image ${index + 1}`}
              onClick={() => handleShow(imgUrl)}
              style={{ cursor: 'pointer' }}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    );
  };

  const renderOutcome = (outcome) => {
    if (!Array.isArray(outcome)) {
      console.log('Invalid outcome format');
      return null;
    }

    return (
      <Card className="mb-4">
        <Card.Body>
          <Card.Text>
            <ul>
              {outcome.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </Card.Text>
        </Card.Body>
      </Card>
    );
  };

  const renderLinks = (githubLink, demoLink) => {
    if (!githubLink && !demoLink) {
      return null;
    }

    return (
      <Row className="mt-4">
        <Col>
          <h3>Links</h3>
          <div className="d-flex justify-content-start ">
            {githubLink && (
              <Button variant="primary" href={githubLink} target="_blank" className="me-2 links-button">
                GitHub
              </Button>
            )}
            {demoLink && (
              <Button variant="secondary" href={demoLink} target="_blank" className='links-button'>
                Demo
              </Button>
            )}
          </div>
        </Col>
      </Row>
    );
  };

  return (
    <section className="project-details" id="project-details">
      <Container>
        <Row>
          <Col>
            <h1>{project.title}</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>{project.description}</p>
          </Col>
        </Row>
        <h3>Project Overview</h3>
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Card.Text>{project.summary}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <h3>Technologies</h3>
        <Row>
          <Col>
            {renderTechStack(project.techStack)}
          </Col>
        </Row>
        <h3>Outcome</h3>
        <Row>
          <Col>
            {renderOutcome(project.outcome)}
          </Col>
        </Row>
        <h3>Conclusion</h3>
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Card.Text>{project.conclusion}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <h3>Demo Images</h3>
        {project.demoImages && project.demoImages.length > 0 && (
          <Row>
            <Col>
              {renderCarousel(project.demoImages)}
            </Col>
          </Row>
        )}
        {renderLinks(project.githubLink, project.demoLink)}
      </Container>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: 'black' }}>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center align-items-center">
          <img src={currentImage} alt="Preview" className="img-fluid" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </Modal.Body>
      </Modal>
    </section>
  );
};
