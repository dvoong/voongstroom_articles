import { Link } from 'react-router-dom';


function Navbar() {
    return (
        <div className="navbar">

          <div className="navbar-logo">
            <Link className="navbar-link" to="/">
              David Voong
            </Link>
          </div>
          
          <div className="navbar-items-container">
            <ul className="navbar-items">
              <li className="navbar-item">
                <Link className="navbar-link" to="/articles">Articles</Link>
              </li>
              <li className="navbar-item">
                <Link className="navbar-link" to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          
        </div>
        
    );
}

export default Navbar;
