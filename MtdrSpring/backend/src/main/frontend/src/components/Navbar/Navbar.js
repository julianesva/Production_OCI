import './Navbar.css';
import { User_Icon, Arrow_Down_Icon } from '../../Icons';
import O_Oracle_Icon from "../../assets/OdeOracle.png";

export default function Navbar() {
    return (
        <div className="navbar-container">
            {/* Logo Container */}
            <div className="navbar-logo-container">
                <img src={O_Oracle_Icon} alt="Logo" className="navbar-logo-icon" />
                <span className="navbar-logo-text">| Oracle Manager</span>
            </div>

            {/* User Container */}
            <button className="navbar-user-container">
                <User_Icon color='white' w='25px' h='25px' />
                <Arrow_Down_Icon color='white' w='20px' h='20px' />
            </button>
        </div>
    );
}