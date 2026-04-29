import React, { useEffect, useState, useMemo } from 'react';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { ProjectCard } from './ProjectCard';
import colorSharp2 from '../assets/img/color-sharp2.png';

export const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProjects = async () => {
        try {
            const response = await fetch('https://cienunkpi2.execute-api.ap-southeast-2.amazonaws.com/default/projects', { method: 'GET' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const sortedProjects = data.sort((a, b) => {
                const orderA = a.order != null ? a.order : a.id;
                const orderB = b.order != null ? b.order : b.id;
                return orderA - orderB;
            });
            setProjects(sortedProjects);
        } catch (error) {
            setError(`Error fetching projects: ${error.message}`);
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const projectChunks = useMemo(() => {
        const itemsPerPage = 6;
        const totalPages = 3;
        const totalProjects = projects.length;
        
        // 计算每页应该显示的项目数，尽量平均分配
        const baseItemsPerPage = Math.floor(totalProjects / totalPages);
        const remainder = totalProjects % totalPages;
        
        const chunks = [];
        let currentIndex = 0;
        
        for (let i = 0; i < totalPages; i++) {
            // 前 remainder 页多分配一个项目
            const pageSize = Math.min(baseItemsPerPage + (i < remainder ? 1 : 0), itemsPerPage);
            const pageProjects = projects.slice(currentIndex, currentIndex + pageSize);
            
            if (pageProjects.length > 0) {
                chunks.push(pageProjects);
            }
            
            currentIndex += pageSize;
        }
        
        return chunks;
    }, [projects]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div>
                <p>{error}</p>
                <Button onClick={fetchProjects}>Retry</Button>
            </div>
        );
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
                                {projectChunks.map((_, tabIndex) => (
                                    <Nav.Item key={tabIndex}>
                                        <Nav.Link eventKey={`tab-${tabIndex}`}>Tab {tabIndex + 1}</Nav.Link>
                                    </Nav.Item>
                                ))}
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
