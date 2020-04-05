import React, { useState, useEffect } from "react";
import Page404 from "./Page404";
import axios from "axios";

const Pokemon = props => {
  const [showData, setShowData] = useState(undefined);

  useEffect(() => {
    let isCancelled = false;
    async function fetchData() {
      try {
        let id = parseInt(props.match.params.id);
        if (!isCancelled && !isNaN(id) && id > 0 && id < 10158) {
          const { data } = await axios.get(
            "https://pokeapi.co/api/v2/pokemon/" + id
          );
          setShowData(data);
        } else {
          setShowData(null);
        }
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [props.match.params.id]);

  let height = "",
    id = "",
    name = "",
    base_experience = "";
  if (showData) {
    height = showData.height;
    id = showData.id;
    name = showData.name;
    base_experience = showData.base_experience;
  }

  if(!showData || !showData.name) return (<Page404></Page404>);
  return (
    <div className="cap-first-letter">
      <h1 className="list">
        <dt>Name: {name}</dt>
        <br />
      </h1>
      <dt>Height(cm): {height}</dt>
      <br />
      <dt>Id:{id}</dt>
      <br />
      <dt>Base Experience:{base_experience}</dt>
      <dl>
        <dt>Moves:</dt>
        {(showData &&
          showData.moves.map((details, index) => {
            return (
              <dd key={index}>
                {index + 1}. {details.move.name}
              </dd>
            );
          })) ||
          "No Moves"}
      </dl>
    </div>
  );
};
export default Pokemon;
