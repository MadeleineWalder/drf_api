import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import styles from "../../styles/ContactCreateForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import { useHistory } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";

import { NotificationManager } from "react-notifications";


function ContactCreateForm() {
    useRedirect("loggedOut");
  
    const [errors, setErrors] = useState({});
    const [contactData, setContactData] = useState({
      title: "",
      message: "",
    });
    const { title, message } = contactData;
  
    const history = useHistory();
  
    const handleChange = (event) => {
      setContactData({
        ...contactData,
        [event.target.name]: event.target.value,
      });
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      const formData = new FormData();
  
      formData.append("title", title);
      formData.append("message", message);
  
      try {
        await axiosReq.post("/contact/", formData);
        history.push("/");
        NotificationManager.success("Message sent! We will email you shortly.", "Complete");
      } catch (err) {
        setErrors(err.response?.data);
        NotificationManager.error("Unable to send message", "Error");
        }
      }
  
    const textFields = (
      <div className="text-center">
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            placeholder="Title your message here..."
            value={title}
            onChange={handleChange}
          />
        </Form.Group>
        {errors?.title?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
  
        <Form.Group>
          <Form.Label>Message</Form.Label>
          <Form.Control
            type="text"
            name="message"
            placeholder="Explain your problem or query..."
            value={message}
            onChange={handleChange}
          />
        </Form.Group>
        {errors?.title?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
  
        <Button
          className={`${btnStyles.Button} ${btnStyles.Blue}`}
          onClick={() => history.goBack()}
        >
          Cancel
        </Button>
        <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
          Submit
        </Button>
      </div>
    );
  
    return (
      <Form onSubmit={handleSubmit}>
        <Row className="justify-content-center">
          <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
            <Container
              className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
            >
             <Col className="text-center">
                  <h2>Contact Us</h2>
                  <p>
                      Want to report a user or simply have a question? Get in touch!
                  </p>
                  <div>{textFields}</div>
              </Col>
            </Container>
          </Col>
        </Row>
      </Form>
    );
};

export default ContactCreateForm;