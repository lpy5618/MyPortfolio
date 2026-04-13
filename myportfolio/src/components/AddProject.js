import { useState } from "react";
import { Col, Container, Row, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const AddProject = () => {
    const navigate = useNavigate();
    const [formDetails, setFormDetails] = useState({
        id: "",
        title: "",
        description: "",
        imgUrl: "",
        summary: "",
        techStack: {},
        outcome: [],
        demoImages: [],
        conclusion: ""
    });
    const [buttonText, setButtonText] = useState("Add Project");
    const [status, setStatus] = useState({});
    
    // 临时输入字段
    const [techCategory, setTechCategory] = useState("");
    const [techItems, setTechItems] = useState("");
    const [outcomeInput, setOutcomeInput] = useState("");
    const [demoImageInput, setDemoImageInput] = useState("");

    const handleAddTechStack = () => {
        if (techCategory && techItems) {
            setFormDetails({
                ...formDetails,
                techStack: {
                    ...formDetails.techStack,
                    [techCategory]: techItems.split(',').map(item => item.trim())
                }
            });
            setTechCategory("");
            setTechItems("");
        }
    };

    const handleRemoveTechStack = (category) => {
        const newTechStack = { ...formDetails.techStack };
        delete newTechStack[category];
        setFormDetails({ ...formDetails, techStack: newTechStack });
    };

    const handleAddOutcome = () => {
        if (outcomeInput) {
            setFormDetails({
                ...formDetails,
                outcome: [...formDetails.outcome, outcomeInput]
            });
            setOutcomeInput("");
        }
    };

    const handleRemoveOutcome = (index) => {
        setFormDetails({
            ...formDetails,
            outcome: formDetails.outcome.filter((_, i) => i !== index)
        });
    };

    const handleAddDemoImage = () => {
        if (demoImageInput) {
            setFormDetails({
                ...formDetails,
                demoImages: [...formDetails.demoImages, demoImageInput]
            });
            setDemoImageInput("");
        }
    };

    const handleRemoveDemoImage = (index) => {
        setFormDetails({
            ...formDetails,
            demoImages: formDetails.demoImages.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonText("Adding...");
        
        try {
            const projectData = {
                ...formDetails,
                id: parseInt(formDetails.id)
            };

            const response = await fetch(
                "https://cienunkpi2.execute-api.ap-southeast-2.amazonaws.com/default/projects",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                    },
                    body: JSON.stringify(projectData),
                }
            );
            
            const data = await response.json();
            
            if (response.ok) {
                setStatus({ success: true, message: "Project added successfully!" });
                setTimeout(() => navigate('/'), 2000);
            } else {
                setStatus({ success: false, message: data.error || "Failed to add project" });
            }
        } catch (error) {
            setStatus({
                success: false,
                message: "Something went wrong, please try again later.",
            });
        } finally {
            setButtonText("Add Project");
        }
    };

    return (
        <section className="contact add-project">
            <Container>
                <Row className="justify-content-center">
                    <Col md={10}>
                        <h2>Add New Project</h2>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col sm={6} className="px-1">
                                    <Form.Control
                                        type="number"
                                        value={formDetails.id}
                                        onChange={(e) => setFormDetails({ ...formDetails, id: e.target.value })}
                                        placeholder="Project ID"
                                        required
                                    />
                                </Col>
                                <Col sm={6} className="px-1">
                                    <Form.Control
                                        type="text"
                                        value={formDetails.title}
                                        onChange={(e) => setFormDetails({ ...formDetails, title: e.target.value })}
                                        placeholder="Project Title"
                                        required
                                    />
                                </Col>
                                <Col sm={12} className="px-1">
                                    <Form.Control
                                        type="text"
                                        value={formDetails.description}
                                        onChange={(e) => setFormDetails({ ...formDetails, description: e.target.value })}
                                        placeholder="Short Description"
                                        required
                                    />
                                </Col>
                                <Col sm={12} className="px-1">
                                    <Form.Control
                                        type="url"
                                        value={formDetails.imgUrl}
                                        onChange={(e) => setFormDetails({ ...formDetails, imgUrl: e.target.value })}
                                        placeholder="Image URL"
                                        required
                                    />
                                </Col>
                                <Col sm={12} className="px-1">
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={formDetails.summary}
                                        onChange={(e) => setFormDetails({ ...formDetails, summary: e.target.value })}
                                        placeholder="Project Summary"
                                        required
                                    />
                                </Col>
                                
                                {/* Tech Stack Section */}
                                <Col sm={12} className="px-1 mt-3">
                                    <h5>Tech Stack</h5>
                                    <Row>
                                        <Col sm={4} className="px-1">
                                            <Form.Control
                                                type="text"
                                                value={techCategory}
                                                onChange={(e) => setTechCategory(e.target.value)}
                                                placeholder="Category (e.g., Frontend)"
                                            />
                                        </Col>
                                        <Col sm={6} className="px-1">
                                            <Form.Control
                                                type="text"
                                                value={techItems}
                                                onChange={(e) => setTechItems(e.target.value)}
                                                placeholder="Technologies (comma-separated)"
                                            />
                                        </Col>
                                        <Col sm={2} className="px-1">
                                            <Button onClick={handleAddTechStack} className="btn-add"><span>Add</span></Button>
                                        </Col>
                                    </Row>
                                    <div className="mt-2">
                                        {Object.entries(formDetails.techStack).map(([category, items]) => (
                                            <div key={category} className="tech-stack-item">
                                                <span><strong>{category}:</strong> {items.join(', ')}</span>
                                                <Button 
                                                    className="btn-remove"
                                                    onClick={() => handleRemoveTechStack(category)}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </Col>

                                {/* Outcomes Section */}
                                <Col sm={12} className="px-1 mt-3">
                                    <h5>Outcomes</h5>
                                    <Row>
                                        <Col sm={10} className="px-1">
                                            <Form.Control
                                                type="text"
                                                value={outcomeInput}
                                                onChange={(e) => setOutcomeInput(e.target.value)}
                                                placeholder="Add an outcome"
                                            />
                                        </Col>
                                        <Col sm={2} className="px-1">
                                            <Button onClick={handleAddOutcome} className="btn-add"><span>Add</span></Button>
                                        </Col>
                                    </Row>
                                    <ul className="mt-2">
                                        {formDetails.outcome.map((item, index) => (
                                            <li key={index}>
                                                <span>{item}</span>
                                                <Button 
                                                    className="btn-remove"
                                                    onClick={() => handleRemoveOutcome(index)}
                                                >
                                                    Remove
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                </Col>

                                {/* Demo Images Section */}
                                <Col sm={12} className="px-1 mt-3">
                                    <h5>Demo Images</h5>
                                    <Row>
                                        <Col sm={10} className="px-1">
                                            <Form.Control
                                                type="url"
                                                value={demoImageInput}
                                                onChange={(e) => setDemoImageInput(e.target.value)}
                                                placeholder="Demo Image URL"
                                            />
                                        </Col>
                                        <Col sm={2} className="px-1">
                                            <Button onClick={handleAddDemoImage} className="btn-add"><span>Add</span></Button>
                                        </Col>
                                    </Row>
                                    <ul className="mt-2">
                                        {formDetails.demoImages.map((img, index) => (
                                            <li key={index}>
                                                <span>{img}</span>
                                                <Button 
                                                    className="btn-remove"
                                                    onClick={() => handleRemoveDemoImage(index)}
                                                >
                                                    Remove
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                </Col>

                                <Col sm={12} className="px-1 mt-3">
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={formDetails.conclusion}
                                        onChange={(e) => setFormDetails({ ...formDetails, conclusion: e.target.value })}
                                        placeholder="Conclusion"
                                        required
                                    />
                                </Col>

                                <Col className="mt-3">
                                    <div className="button-group">
                                        <button type="submit"><span>{buttonText}</span></button>
                                        <button 
                                            type="button"
                                            className="btn-cancel"
                                            onClick={() => navigate('/')}
                                        >
                                            <span>Cancel</span>
                                        </button>
                                    </div>
                                </Col>
                                {status.message && (
                                    <p className={status.success === false ? "danger" : "success"}>
                                        {status.message}
                                    </p>
                                )}
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};
