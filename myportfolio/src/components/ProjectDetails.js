import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

export const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);

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
        <Row>
          <Col>
            <p>{project.summary}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>{project.techStack}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>{project.outcome}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>{project.conclusion}</p>
          </Col>
        </Row>
        {project.imgUrl && (
          <Row>
            <Col>
              <img src={project.imgUrl} alt={project.title} />
            </Col>
          </Row>
        )}
      </Container>
    </section>
  );
};
