import React, { useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import Asset from "../../components/Asset";

import Upload from "../../assets/upload.png";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import { useHistory } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";

function ClipsCreateForm() {
  useRedirect("loggedOut");
  const [errors, setErrors] = useState({});

  const [clipsData, setClipsData] = useState({
    title: "",
    content: "",
    video: "",
  });
  const { title, content, video } = clipsData;

  const videoInput = useRef(null);

  const history = useHistory();

  const handleChange = (event) => {
    setClipsData({
      ...clipsData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeVideo = (event) => {
    if (event.target.files.length) {
      setClipsData({
        ...clipsData,
        video: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const handleSubmit = async (event) => {
    console.log("Clips form handle submit triggered")
    // event.preventDefault();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);
    formData.append("video", videoInput.current.files[0]);
    console.log(title, content, video)

    try {
      const { data } = await axiosReq.clips("/clips/", formData);
      history.push(`/clips/${data.id}`);
    } catch (err) {
      console.error("Form submission error:", err); // Log the error here
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  const textFields = (
    <div className="text-center">
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          placeholder="e.g name of the game"
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
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          name="content"
          placeholder="Add a caption, ask a question or give game advice"
          value={content}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.content?.map((message, idx) => (
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
        Create
      </Button>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >
            <Form.Group className="text-center">
              {video ? (
                // Display the video preview if available
                <video
                  className={appStyles.Video}
                  controls
                >
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Form.Label
                  className="d-flex justify-content-center"
                  htmlFor="video-upload"
                >
                  <Asset
                    src={Upload}
                    message="Click or tap to upload a video"
                  />
                </Form.Label>
              )}

              <Form.File
                id="video-upload"
                accept="video/*"
                onChange={handleChangeVideo}
                ref={videoInput}
              />
            </Form.Group>
            {errors?.video?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
}

export default ClipsCreateForm;
