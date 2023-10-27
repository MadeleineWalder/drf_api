import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import Clip from "./Clip";
import Asset from "../../components/Asset";

import appStyles from "../../App.module.css";
import styles from "../../styles/ClipsPage.module.css";
import { useLocation } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";

import { useCurrentUser } from "../../contexts/CurrentUserContext";

function ClipsPage({ message, filter = "" }) {
  const [clips, setClips] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const currentUser = useCurrentUser();

  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchClips = async () => {
      try {
        const { data } = await axiosReq.get(`/clips/?${filter}search=${query}`);
        setClips(data);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchClips();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, currentUser]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        <i className={`fas fa-search ${styles.SearchIcon}`} />
        <Form
        className={styles.SearchBar}
        onSubmit={(event) => event.preventDefault()}
        >
          <Form.Control
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            className="mr-sm-2"
            placeholder="Search clips"
          />
        </Form>

        {hasLoaded ? (
          <>
            {clips.results.length ? (
              <InfiniteScroll
                children={
                    clips.results.map((clip) => (
                    <Clip key={clip.id} {...clip} setClips={setClips} />
                  ))
                }
                dataLength={clips.results.length}
                loader={<Asset spinner />}
                hasMore={!!clips.next}
                next={() => fetchMoreData(clips, setClips)}
              />

            ) : (
              <Container className={appStyles.Content}>
                <Asset src={NoResults} message={message} />
              </Container>
            )}
          </>
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
      </Col>
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default ClipsPage;