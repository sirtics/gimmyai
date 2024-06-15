import { Link } from 'react-router-dom'
import './NoMatch.css'
import logo from '../public/gaspface-logo.png'; // Adjust the path if necessary
function NoMatch(){
    return(
        <div className="no-match-container">
        <a href="/" alt="GimmyAI logo"><img src={logo} alt="GimmyAI Logo" className="logo" /></a>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link to="/"><button>Home</button></Link>
        </div>
    );
}

export default NoMatch;