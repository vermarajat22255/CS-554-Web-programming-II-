import React from "react";
import { BrowserRouter as Router, Route,Switch, Link } from "react-router-dom";
import logo from "./poke.svg";
//import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import Berries from "./components/Berries";
import Berry from "./components/Berry";
import Machines from "./components/Machines";
import Pokemons from "./components/Pokemons";
import Pokemon from "./components/Pokemon";
import Home from "./components/Home";
import Machine from "./components/Machine";
import { Navbar } from "react-bootstrap";
import Page404 from "./components/Page404";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Welcome to Pokemon Mania ! I am Pikachu, lets explore ...</p>
      </header>

      <div className="App-body">
        {/* <Navbar > */}

        <Router>
          <Navbar className="bg-dark justify-content-around">
            <Link to="/"> Home </Link>
            <Link to="/machines/page/0"> Machine Listing </Link>
            <Link to="/berries/page/0"> Berry Listing </Link>
            <Link to="/pokemon/page/0"> Pokemon Listing </Link>
          </Navbar>

          <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/berries/page/:page" component={Berries} />
          <Route exact path="/berries/:id" component={Berry} />

          <Route exact path="/pokemon/page/:page" component={Pokemons} />
          <Route exact path="/pokemon/:id" component={Pokemon} />
          
          <Route exact path="/machines/page/:page" component={Machines} />
          <Route exact path="/machine/:id" component={Machine} />
          <Route component={Page404}/>
          </Switch>

        </Router>
      </div>
    </div>
  );
}

export default App;
