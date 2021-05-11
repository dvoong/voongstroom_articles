import {
    BrowserRouter as Router,
    Route,
    Switch
} from "react-router-dom";

import Articles from "./articles/Articles";
import Contact from "./Contact";
import Home from "./Home";
import Navbar from "./Navbar";

import './App.css';

function App() {
    return (
        <Router>
          <Navbar/>
          <Switch>
            <Route path="/contact">
              <Contact/>
            </Route>
            <Route path="/articles">
              <Articles/>
            </Route>
            <Route path="/">
              <Home/>
            </Route>
          </Switch>
        </Router>
  );
}

export default App;
