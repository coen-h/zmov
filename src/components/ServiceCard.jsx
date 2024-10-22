import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

ServiceCard.propTypes = {
  img: PropTypes.string.isRequired,
  style: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default function ServiceCard(props) {
    return (
        <Link to={`/service/${props.type}`} className="service-card flex justify-center items-center bg-gray-400 bg-opacity-85 py-[1.2vw] px-[2.4vw] rounded-xl shadow-xl w-full transition-all duration-200 ease-in-out overflow-hidden" style={props.style}>
            <img className="w-full" src={`${props.img}`} alt="Service Image"/>
        </Link>
    )
}