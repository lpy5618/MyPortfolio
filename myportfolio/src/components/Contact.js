import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import contactImg from "../assets/img/contact-img.svg";

export const Contact = () => {
    const formInitialDetails = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
    };
    const [formDetails, setFormDetails] = useState(formInitialDetails);
    const [buttonText, setButtonText] = useState("Send Message");
    const [status, setStatus] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonText("Sending...");
        try {
            const response = await fetch(
                "https://6wstddjxjl.execute-api.ap-southeast-2.amazonaws.com/default/portfolioSendEmail",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                    },
                    body: JSON.stringify(formDetails),
                }
            );
            const data = await response.json();
            setStatus(data);
            setFormDetails(formInitialDetails);
            setButtonText("Send Message");
        } catch (error) {
            setStatus({
                success: false,
                message: "Something went wrong, please try again later.",
            });
            setButtonText("Send Message");
        }
    };

    return (
        <section id="connect" className="contact">
            <Container>
                <Row className="align-items-center">
                    <Col md={6}>
                        <img src={contactImg} alt="Contact Us" />
                    </Col>
                    <Col md={6}>
                        <h2>Get In Touch</h2>
                        <form onSubmit={handleSubmit}>
                            <Row>
                                <Col sm={6} className="px-1">
                                    <input
                                        type="text"
                                        value={formDetails.firstName}
                                        onChange={(e) =>
                                            setFormDetails({
                                                ...formDetails,
                                                firstName: e.target.value,
                                            })
                                        }
                                        placeholder="First Name"
                                    />
                                </Col>
                                <Col sm={6} className="px-1">
                                    <input
                                        type="text"
                                        value={formDetails.lastName}
                                        onChange={(e) =>
                                            setFormDetails({
                                                ...formDetails,
                                                lastName: e.target.value,
                                            })
                                        }
                                        placeholder="Last Name"
                                    />
                                </Col>
                                <Col sm={6} className="px-1">
                                    <input
                                        type="email"
                                        value={formDetails.email}
                                        onChange={(e) =>
                                            setFormDetails({
                                                ...formDetails,
                                                email: e.target.value,
                                            })
                                        }
                                        placeholder="Email"
                                    />
                                </Col>
                                <Col sm={6} className="px-1">
                                    <input
                                        type="tel"
                                        value={formDetails.phone}
                                        onChange={(e) =>
                                            setFormDetails({
                                                ...formDetails,
                                                phone: e.target.value,
                                            })
                                        }
                                        placeholder="Phone Number"
                                    />
                                </Col>
                                <Col>
                                    <textarea row="6"
                                        value={formDetails.message}
                                        onChange={(e) =>
                                            setFormDetails({
                                                ...formDetails,
                                                message: e.target.value,
                                            })
                                        }
                                        placeholder="Message"
                                    ></textarea>
                                    <button type="submit"><span>{buttonText}</span></button>
                                </Col>
                                {status.message && (
                                    <p className={status.success===false?"danger":"success"}>
                                        {status.message}
                                    </p>
                                )}
                            </Row>
                        </form>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};
