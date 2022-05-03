import { Container, Col, Row } from "react-bootstrap";

// chunked cards for carousel
const SocialList = ({ cards }) => {
    return (
      <Container>
        <Row className="card-row justify-content-center">
            <Col className="col-3">{cards[0]}</Col>
            <Col className="col-3">{cards[1]}</Col>
            <Col className="col-3">{cards[2]}</Col>
            <Col className="col-3">{cards[3]}</Col>
        </Row>
      </Container>
    );
  };
  
  export default SocialList;