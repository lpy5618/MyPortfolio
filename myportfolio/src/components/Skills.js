import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Container, Row, Col } from 'react-bootstrap';
import colorSharp from '../assets/img/color-sharp.png';

export const Skills = () => {
    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    const skillsData = [
        {
            title: 'Programming Languages',
            skills: ['Python', 'Java', 'JavaScript', 'HTML', 'CSS', 'C']
        },
        {
            title: 'AI Development',
            skills: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'Image Processing','Semantic Segmentation']
        },
        {
            title: 'Frameworks & Libraries',
            skills: ['React', 'Vue','TensorFlow', 'OpenCV', 'Scikit-Learn', 'Pandas', 'Numpy', 'Matplotlib']
        },
        {
            title: 'Cloud Platforms',
            skills: ['Amazon Web Services', 'Microsoft Power Platform']
        },
        {
            title: 'Databases',
            skills: ['MySQL', 'MS SQL Server', 'MongoDB','GraphQL']
        },
        {
            title: 'Tools',
            skills: ['Git / GitHub', 'BitBucket', 'Jira / Trello','Confluence', 'Postman', 'Anaconda', 'Jupyter Notebook', 'Visual Studio Code','Tableau','ArcGIS']
        }
    ]

    return (
        <section className="skills" id="skills">
            <Container>
                <Row>
                    <Col>
                        <div className='skill-bx'>
                            <h2>Skills</h2>
                            <p>Here are some of the skills I have acquired over the years.</p>
                            <Carousel responsive={responsive} infinite={true} className='skill-slider'>
                                {
                                    skillsData.map((data, index) => (
                                        <div className='skill-card' key={index}>
                                            <h5>{data.title}</h5>
                                            <ul>
                                                {
                                                    data.skills.map((skill, index) => (
                                                        <li key={index}>{skill}</li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    ))
                                }
                            </Carousel>

                        </div>

                    </Col>
                </Row>
            </Container>
            <img src={colorSharp} alt="Color Sharp" className='background-image-left' />
        </section>
    )
}