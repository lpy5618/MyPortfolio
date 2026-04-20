import { useState } from "react";
import { Col, Container, Row, Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://cienunkpi2.execute-api.ap-southeast-2.amazonaws.com/default";

const uploadImage = async (file) => {
    // 1. 获取 presigned URL
    const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            fileName: `${Date.now()}-${file.name}`,
            contentType: file.type,
        }),
    });
    if (!res.ok) throw new Error("Failed to get upload URL");
    const { presignedUrl, publicUrl } = await res.json();

    // 2. 上传文件到 S3
    const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
    });
    if (!uploadRes.ok) throw new Error("Failed to upload image");

    return publicUrl;
};

export const AddProject = () => {
    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");
    const [formDetails, setFormDetails] = useState({
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
    const [coverUploading, setCoverUploading] = useState(false);
    const [demoUploading, setDemoUploading] = useState(false);

    // 临时输入字段
    const [techCategory, setTechCategory] = useState("");
    const [techItems, setTechItems] = useState("");
    const [outcomeInput, setOutcomeInput] = useState("");

    const handleCoverUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setCoverUploading(true);
        try {
            const url = await uploadImage(file);
            setFormDetails({ ...formDetails, imgUrl: url });
        } catch (err) {
            setStatus({ success: false, message: `Cover upload failed: ${err.message}` });
        } finally {
            setCoverUploading(false);
        }
    };

    const handleDemoImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setDemoUploading(true);
        try {
            const url = await uploadImage(file);
            setFormDetails(prev => ({
                ...prev,
                demoImages: [...prev.demoImages, url]
            }));
        } catch (err) {
            setStatus({ success: false, message: `Demo image upload failed: ${err.message}` });
        } finally {
            setDemoUploading(false);
            e.target.value = "";
        }
    };

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
            const projectData = { ...formDetails };

            const response = await fetch(`${API_BASE}/projects`, {
                method: "POST",
                headers: { "Content-Type": "application/json;charset=utf-8" },
                body: JSON.stringify(projectData),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ success: true, message: "Project added successfully!" });
                setTimeout(() => navigate('/'), 2000);
            } else {
                setStatus({ success: false, message: data.error || "Failed to add project" });
            }
        } catch (error) {
            setStatus({ success: false, message: "Something went wrong, please try again later." });
        } finally {
            setButtonText("Add Project");
        }
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/auth`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();
            if (data.authenticated) {
                setAuthenticated(true);
                setAuthError("");
            } else {
                setAuthError("Incorrect password");
            }
        } catch {
            setAuthError("Verification failed, please try again");
        }
    };

    if (!authenticated) {
        return (
            <section className="contact add-project">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={5}>
                            <h2>Admin Access</h2>
                            <Form onSubmit={handleAuth}>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter admin password"
                                    autoFocus
                                />
                                <div className="button-group">
                                    <button type="submit"><span>Verify</span></button>
                                    <button type="button" className="btn-cancel" onClick={() => navigate('/')}>
                                        <span>Back</span>
                                    </button>
                                </div>
                                {authError && <p className="danger">{authError}</p>}
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </section>
        );
    }

    return (
        <section className="contact add-project">
            <Container>
                <Row className="justify-content-center">
                    <Col md={10}>
                        <h2>Add New Project</h2>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col sm={12} className="px-1">
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

                                {/* Cover Image Upload */}
                                <Col sm={12} className="px-1 mt-3">
                                    <h5>Cover Image</h5>
                                    <div className="upload-area">
                                        <label className="upload-label" htmlFor="cover-upload">
                                            {coverUploading ? (
                                                <><Spinner animation="border" size="sm" /> Uploading...</>
                                            ) : formDetails.imgUrl ? (
                                                <img src={formDetails.imgUrl} alt="Cover preview" className="upload-preview" />
                                            ) : (
                                                <span>Click to select cover image</span>
                                            )}
                                        </label>
                                        <input
                                            id="cover-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCoverUpload}
                                            hidden
                                        />
                                        {formDetails.imgUrl && (
                                            <Button
                                                className="btn-remove mt-2"
                                                onClick={() => setFormDetails({ ...formDetails, imgUrl: "" })}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>
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
                                                <Button className="btn-remove" onClick={() => handleRemoveTechStack(category)}>Remove</Button>
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
                                                <Button className="btn-remove" onClick={() => handleRemoveOutcome(index)}>Remove</Button>
                                            </li>
                                        ))}
                                    </ul>
                                </Col>

                                {/* Demo Images Upload */}
                                <Col sm={12} className="px-1 mt-3">
                                    <h5>Demo Images</h5>
                                    <div className="upload-area">
                                        <label className="upload-label" htmlFor="demo-upload">
                                            {demoUploading ? (
                                                <><Spinner animation="border" size="sm" /> Uploading...</>
                                            ) : (
                                                <span>Click to add a demo image</span>
                                            )}
                                        </label>
                                        <input
                                            id="demo-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleDemoImageUpload}
                                            hidden
                                        />
                                    </div>
                                    <div className="demo-images-grid mt-2">
                                        {formDetails.demoImages.map((img, index) => (
                                            <div key={index} className="demo-image-item">
                                                <img src={img} alt={`Demo ${index + 1}`} />
                                                <Button className="btn-remove" onClick={() => handleRemoveDemoImage(index)}>Remove</Button>
                                            </div>
                                        ))}
                                    </div>
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
                                        <button type="button" className="btn-cancel" onClick={() => navigate('/')}>
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
