import { useState, useEffect } from "react";
import { Col, Container, Row, Button, Form, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = "https://cienunkpi2.execute-api.ap-southeast-2.amazonaws.com/default";

const uploadImage = async (file) => {
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

    const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
    });
    if (!uploadRes.ok) throw new Error("Failed to upload image");

    return publicUrl;
};

export const ProjectForm = ({ mode = "add" }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = mode === "edit";

    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");
    const [loading, setLoading] = useState(isEdit);
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
    const [buttonText, setButtonText] = useState(isEdit ? "Update Project" : "Add Project");
    const [status, setStatus] = useState({});
    const [coverUploading, setCoverUploading] = useState(false);
    const [demoUploading, setDemoUploading] = useState(false);
    const [techCategory, setTechCategory] = useState("");
    const [techItems, setTechItems] = useState("");
    const [outcomeInput, setOutcomeInput] = useState("");

    useEffect(() => {
        if (isEdit && id) {
            const fetchProject = async () => {
                try {
                    const res = await fetch(`${API_BASE}/projects/${id}`);
                    if (!res.ok) throw new Error("Project not found");
                    const data = await res.json();
                    setFormDetails({
                        title: data.title || "",
                        description: data.description || "",
                        imgUrl: data.imgUrl || "",
                        summary: data.summary || "",
                        techStack: (typeof data.techStack === 'object' && data.techStack) ? data.techStack : {},
                        outcome: Array.isArray(data.outcome) ? data.outcome : [],
                        demoImages: Array.isArray(data.demoImages) ? data.demoImages : [],
                        conclusion: data.conclusion || ""
                    });
                } catch (err) {
                    setStatus({ success: false, message: err.message });
                } finally {
                    setLoading(false);
                }
            };
            fetchProject();
        }
    }, [isEdit, id]);

    const handleCoverUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setCoverUploading(true);
        try {
            const url = await uploadImage(file);
            setFormDetails(prev => ({ ...prev, imgUrl: url }));
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
            setFormDetails(prev => ({ ...prev, demoImages: [...prev.demoImages, url] }));
        } catch (err) {
            setStatus({ success: false, message: `Demo image upload failed: ${err.message}` });
        } finally {
            setDemoUploading(false);
            e.target.value = "";
        }
    };

    const handleAddTechStack = () => {
        if (techCategory && techItems) {
            setFormDetails(prev => ({
                ...prev,
                techStack: { ...prev.techStack, [techCategory]: techItems.split(',').map(s => s.trim()) }
            }));
            setTechCategory("");
            setTechItems("");
        }
    };

    const handleRemoveTechStack = (category) => {
        const updated = { ...formDetails.techStack };
        delete updated[category];
        setFormDetails(prev => ({ ...prev, techStack: updated }));
    };

    const handleAddOutcome = () => {
        if (outcomeInput) {
            setFormDetails(prev => ({ ...prev, outcome: [...prev.outcome, outcomeInput] }));
            setOutcomeInput("");
        }
    };

    const handleRemoveOutcome = (index) => {
        setFormDetails(prev => ({ ...prev, outcome: prev.outcome.filter((_, i) => i !== index) }));
    };

    const handleRemoveDemoImage = (index) => {
        setFormDetails(prev => ({ ...prev, demoImages: prev.demoImages.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonText(isEdit ? "Updating..." : "Adding...");

        try {
            const url = isEdit ? `${API_BASE}/projects/${id}` : `${API_BASE}/projects`;
            const method = isEdit ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json;charset=utf-8" },
                body: JSON.stringify(formDetails),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ success: true, message: isEdit ? "Project updated!" : "Project added!" });
                setTimeout(() => navigate(isEdit ? '/admin' : '/'), 2000);
            } else {
                setStatus({ success: false, message: data.error || "Operation failed" });
            }
        } catch (error) {
            setStatus({ success: false, message: "Something went wrong, please try again later." });
        } finally {
            setButtonText(isEdit ? "Update Project" : "Add Project");
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

    if (loading) {
        return (
            <section className="contact add-project">
                <Container className="text-center">
                    <Spinner animation="border" /> Loading project...
                </Container>
            </section>
        );
    }

    return (
        <section className="contact add-project">
            <Container>
                <Row className="justify-content-center">
                    <Col md={10}>
                        <h2>{isEdit ? "Edit Project" : "Add New Project"}</h2>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col sm={12} className="px-1">
                                    <Form.Control type="text" value={formDetails.title}
                                        onChange={(e) => setFormDetails({ ...formDetails, title: e.target.value })}
                                        placeholder="Project Title" required />
                                </Col>
                                <Col sm={12} className="px-1">
                                    <Form.Control type="text" value={formDetails.description}
                                        onChange={(e) => setFormDetails({ ...formDetails, description: e.target.value })}
                                        placeholder="Short Description" required />
                                </Col>

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
                                        <input id="cover-upload" type="file" accept="image/*" onChange={handleCoverUpload} hidden />
                                        {formDetails.imgUrl && (
                                            <Button className="btn-remove mt-2"
                                                onClick={() => setFormDetails({ ...formDetails, imgUrl: "" })}>Remove</Button>
                                        )}
                                    </div>
                                </Col>

                                <Col sm={12} className="px-1">
                                    <Form.Control as="textarea" rows={3} value={formDetails.summary}
                                        onChange={(e) => setFormDetails({ ...formDetails, summary: e.target.value })}
                                        placeholder="Project Summary" required />
                                </Col>

                                <Col sm={12} className="px-1 mt-3">
                                    <h5>Tech Stack</h5>
                                    <Row>
                                        <Col sm={4} className="px-1">
                                            <Form.Control type="text" value={techCategory}
                                                onChange={(e) => setTechCategory(e.target.value)}
                                                placeholder="Category (e.g., Frontend)" />
                                        </Col>
                                        <Col sm={6} className="px-1">
                                            <Form.Control type="text" value={techItems}
                                                onChange={(e) => setTechItems(e.target.value)}
                                                placeholder="Technologies (comma-separated)" />
                                        </Col>
                                        <Col sm={2} className="px-1">
                                            <Button onClick={handleAddTechStack} className="btn-add"><span>Add</span></Button>
                                        </Col>
                                    </Row>
                                    <div className="mt-2">
                                        {Object.entries(formDetails.techStack).map(([cat, items]) => (
                                            <div key={cat} className="tech-stack-item">
                                                <span><strong>{cat}:</strong> {Array.isArray(items) ? items.join(', ') : items}</span>
                                                <Button className="btn-remove" onClick={() => handleRemoveTechStack(cat)}>Remove</Button>
                                            </div>
                                        ))}
                                    </div>
                                </Col>

                                <Col sm={12} className="px-1 mt-3">
                                    <h5>Outcomes</h5>
                                    <Row>
                                        <Col sm={10} className="px-1">
                                            <Form.Control type="text" value={outcomeInput}
                                                onChange={(e) => setOutcomeInput(e.target.value)}
                                                placeholder="Add an outcome" />
                                        </Col>
                                        <Col sm={2} className="px-1">
                                            <Button onClick={handleAddOutcome} className="btn-add"><span>Add</span></Button>
                                        </Col>
                                    </Row>
                                    <ul className="mt-2">
                                        {formDetails.outcome.map((item, i) => (
                                            <li key={i}>
                                                <span>{item}</span>
                                                <Button className="btn-remove" onClick={() => handleRemoveOutcome(i)}>Remove</Button>
                                            </li>
                                        ))}
                                    </ul>
                                </Col>

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
                                        <input id="demo-upload" type="file" accept="image/*" onChange={handleDemoImageUpload} hidden />
                                    </div>
                                    <div className="demo-images-grid mt-2">
                                        {formDetails.demoImages.map((img, i) => (
                                            <div key={i} className="demo-image-item">
                                                <img src={img} alt={`Demo ${i + 1}`} />
                                                <Button className="btn-remove" onClick={() => handleRemoveDemoImage(i)}>Remove</Button>
                                            </div>
                                        ))}
                                    </div>
                                </Col>

                                <Col sm={12} className="px-1 mt-3">
                                    <Form.Control as="textarea" rows={3} value={formDetails.conclusion}
                                        onChange={(e) => setFormDetails({ ...formDetails, conclusion: e.target.value })}
                                        placeholder="Conclusion" required />
                                </Col>

                                <Col className="mt-3">
                                    <div className="button-group">
                                        <button type="submit"><span>{buttonText}</span></button>
                                        <button type="button" className="btn-cancel"
                                            onClick={() => navigate(isEdit ? '/admin' : '/')}>
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
