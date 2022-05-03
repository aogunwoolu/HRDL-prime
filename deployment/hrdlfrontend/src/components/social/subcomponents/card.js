import { Card } from "react-bootstrap";

// individual social card component
const SocialCard = ({ name }) => {
    return (
      <Card className="s-card bg-dark text-white" style={{ width: '18rem' }}>
        <Card.Body>
            <Card.Title></Card.Title>
        </Card.Body>
      </Card>
    );
  };
  
  export default SocialCard;