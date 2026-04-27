import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const API_BASE = "https://cienunkpi2.execute-api.ap-southeast-2.amazonaws.com/default";

export const AdminPanel = () => {
    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({});
    const [reorderMode, setReorderMode] = useState(false);
    const [saving, setSaving] = useState(false);

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

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/projects`);
            const data = await res.json();
            setProjects(data.sort((a, b) => {
                const orderA = a.order != null ? a.order : a.id;
                const orderB = b.order != null ? b.order : b.id;
                return orderA - orderB;
            }));
        } catch {
            setStatus({ success: false, message: "Failed to load projects" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authenticated) fetchProjects();
    }, [authenticated]);

    const handleDelete = async (projectId) => {
        if (!window.confirm(`Delete project #${projectId}?`)) return;
        try {
            const res = await fetch(`${API_BASE}/projects/${projectId}`, { method: "DELETE" });
            const data = await res.json();
            if (res.ok) {
                setProjects(prev => prev.filter(p => p.id !== projectId));
                setStatus({ success: true, message: "Project deleted" });
            } else {
                setStatus({ success: false, message: data.error });
            }
        } catch {
            setStatus({ success: false, message: "Failed to delete project" });
        }
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(projects);
        const [moved] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, moved);
        setProjects(items);
    };

    const handleSaveOrder = async () => {
        setSaving(true);
        try {
            const orderData = projects.map((p, index) => ({ id: p.id, order: index }));
            const res = await fetch(`${API_BASE}/reorder`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order: orderData }),
            });
            if (res.ok) {
                setStatus({ success: true, message: "Order saved!" });
                setReorderMode(false);
            } else {
                setStatus({ success: false, message: "Failed to save order" });
            }
        } catch {
            setStatus({ success: false, message: "Failed to save order" });
        } finally {
            setSaving(false);
        }
    };

    const handleCancelReorder = () => {
        setReorderMode(false);
        fetchProjects();
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

    const renderCards = () => (
        <Row>
            {projects.map((project) => (
                <Col md={4} key={project.id} className="mb-4">
                    <div className="admin-card">
                        <div className="admin-card-img">
                            {project.imgUrl ? (
                                <img src={project.imgUrl} alt={project.title} />
                            ) : (
                                <div className="admin-card-placeholder">No Image</div>
                            )}
                        </div>
                        <div className="admin-card-body">
                            <span className="admin-card-id">#{project.id}</span>
                            <h4>{project.title}</h4>
                            <p>{project.description}</p>
                            <div className="admin-card-actions">
                                <Button className="btn-edit"
                                    onClick={() => navigate(`/edit-project/${project.id}`)}>Edit</Button>
                                <Button className="btn-remove"
                                    onClick={() => handleDelete(project.id)}>Delete</Button>
                            </div>
                        </div>
                    </div>
                </Col>
            ))}
        </Row>
    );

    const renderReorderList = () => (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="projects">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="admin-list">
                        {projects.map((project, index) => (
                            <Draggable key={project.id} draggableId={String(project.id)} index={index}>
                                {(provided, snapshot) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                        className={`admin-list-item ${snapshot.isDragging ? 'dragging' : ''}`}>
                                        <div className="admin-list-drag">⠿</div>
                                        <span className="admin-list-order">{index + 1}</span>
                                        <div className="admin-list-thumb">
                                            {project.imgUrl ? (
                                                <img src={project.imgUrl} alt={project.title} />
                                            ) : (
                                                <div className="admin-card-placeholder">No Image</div>
                                            )}
                                        </div>
                                        <div className="admin-list-info">
                                            <h4>{project.title}</h4>
                                            <p>{project.description}</p>
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );

    return (
        <section className="contact add-project admin-panel">
            <Container>
                <Row className="justify-content-center">
                    <Col md={11}>
                        <h2>Project Management</h2>
                        <div className="button-group mb-4" style={{ paddingLeft: '12px' }}>
                            {reorderMode ? (
                                <>
                                    <button type="button" className="btn-primary-action" onClick={handleSaveOrder} disabled={saving}>
                                        <span>{saving ? "Saving..." : "Save Order"}</span>
                                    </button>
                                    <button type="button" className="btn-cancel" onClick={handleCancelReorder}>
                                        <span>Cancel</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button type="button" className="btn-primary-action" onClick={() => navigate('/add-project')}>
                                        <span>Add New Project</span>
                                    </button>
                                    <button type="button" className="btn-primary-action" onClick={() => setReorderMode(true)}>
                                        <span>Reorder</span>
                                    </button>
                                    <button type="button" className="btn-cancel" onClick={() => navigate('/')}>
                                        <span>Back to Home</span>
                                    </button>
                                </>
                            )}
                        </div>

                        {status.message && (
                            <p className={status.success === false ? "danger" : "success"}>
                                {status.message}
                            </p>
                        )}

                        {loading ? (
                            <div className="text-center"><Spinner animation="border" /></div>
                        ) : reorderMode ? renderReorderList() : renderCards()}
                    </Col>
                </Row>
            </Container>
        </section>
    );
};
