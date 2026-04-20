import { Link } from 'react-router-dom';

export const ProjectCard = ({ id, title, description, imgUrl }) => {
    const content = (
        <div className="proj-imgbx">
            <img src={imgUrl} alt={title} />
            <div className="proj-txtx">
                <h4>{title}</h4>
                <span>{description}</span>
            </div>
        </div>
    );

    if (id == null) return content;

    return <Link to={`/project/${id}`}>{content}</Link>;
};
