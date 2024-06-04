import { Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const ProjectCard = ({ id, title, description, imgUrl }) => {
    return (
        <Link to={`/project/${id}`}>
            <Col sm={6} md={4}>
                <div className="proj-imgbx">
                    <img src={imgUrl} alt={title} />
                    <div className="proj-txtx">
                        <h4>{title}</h4>
                        <span>{description}</span>
                    </div>
                </div>
            </Col>
        </Link>
    );
};
