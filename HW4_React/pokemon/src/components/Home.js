import React from "react";
import "../App.css";

function Home() {
  return (
    <div className="App-body">
      <h1 className="list">Home Page</h1>
      <p>
        This website provides a RESTful API interface to highly detailed objects
        built from thousands of lines of data related to Pokémon. We
        specifically cover the video game franchise. Using this website, you can
        consume information on Pokémon, their moves, abilities, types, egg
        groups and much, much more.
      </p>
      <p>
        We currently have tens of thousands of individual items in our database,
        including:
      </p>
      <ul>
        <li>Moves</li>
        <li>Abilities</li>
        <li>Pokémon (including various forms)</li>
        <li>Types</li>
        <li>Egg Groups</li>
        <li>Game Versions</li>
        <li>Items</li>
        <li>Pokédexes</li>
        <li>Pokémon Evolution Chains</li>
      </ul>
      <p>And that's just scratching the surface!</p>
    </div>
  );
}
export default Home;
