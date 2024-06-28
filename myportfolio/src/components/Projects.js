import React, { useEffect, useState, useMemo } from 'react';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import { Container, Row, Col } from 'react-bootstrap';
import { ProjectCard } from './ProjectCard';
import colorSharp2 from '../assets/img/color-sharp2.png';

export const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('https://cienunkpi2.execute-api.ap-southeast-2.amazonaws.com/default/projects', { method: 'GET' });
                const data = await response.json();
                setProjects(data);
            } catch (error) {
                setError('Error fetching projects');
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const projectChunks = useMemo(() => {
        const chunkSize = Math.ceil(projects.length / 3);
        return [
            projects.slice(0, chunkSize),
            projects.slice(chunkSize, 2 * chunkSize),
            projects.slice(2 * chunkSize)
        ];
    }, [projects]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <section className="project" id="project">
            <Container>
                <Row>
                    <Col>
                        <h2>Projects</h2>
                        <p>Here are some of my projects</p>
                        <Tab.Container id="projects-tabs" defaultActiveKey="tab-0">
                            <Nav variant="pills" className='nav-pills mb-5 justify-content-center align-items-center' id='pills-tab'>
                                <Nav.Item>
                                    <Nav.Link eventKey="tab-0">Tab One</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="tab-1">Tab Two</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="tab-2">Tab Three</Nav.Link>
                                </Nav.Item>
                            </Nav>
                            <Tab.Content>
                                {projectChunks.map((chunk, tabIndex) => (
                                    <Tab.Pane eventKey={`tab-${tabIndex}`} key={tabIndex}>
                                        <Row>
                                            {chunk.map((project, index) => (
                                                <Col md={4} key={index}>
                                                    <ProjectCard {...project} />
                                                </Col>
                                            ))}
                                        </Row>
                                    </Tab.Pane>
                                ))}
                            </Tab.Content>
                        </Tab.Container>
                    </Col>
                </Row>
            </Container>
            <img className='background-image-right' src={colorSharp2} alt=''></img>
        </section>
    );
};
