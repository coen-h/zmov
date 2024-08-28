import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

ServiceCard.propTypes = {
  img: PropTypes.string.isRequired,
  style: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default function ServiceCard(props) {
    return (
        <Link to={`/service/${props.type}`} className="service-card" style={props.style}>
            <img style={{width: "100%"}} src={`${props.img}`} alt="Service Image"/>
        </Link>
    )
}