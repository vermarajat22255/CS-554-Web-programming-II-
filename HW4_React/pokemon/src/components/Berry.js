import React, { useState, useEffect } from "react";
import Page404 from "./Page404";
import axios from "axios";

const Berry = props => {
  const [showData, setShowData] = useState(undefined);

  useEffect(() => {
    let isCancelled = false;
    async function fetchData() {
      try {
        let id = parseInt(props.match.params.id);
        if (!isCancelled && !isNaN(id) && id>0 && id<65) {
          const { data } = await axios.get(
            "https://pokeapi.co/api/v2/berry/" + id
          );
          setShowData(data);
        }
        else{
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

  let size = "",
    id = "",
    name = "",
    max_harvest = "";
  let growth_time = "";
  if (showData) {
    size = showData.size;
    id = showData.id;
    name = showData.name;
    max_harvest = showData.max_harvest;
    growth_time = showData.growth_time;
  }

  if(!showData || !showData.name) return (<Page404></Page404>);
  return (
    <div className="cap-first-letter">
      <h1 className="list">
        <dt>Name: {name}</dt>
        <br />
      </h1>
      <dt>Size(cm): {size}</dt>
      <br />
      <dt>Id:{id}</dt>
      <br />
      <dt>Growth Time:{growth_time}</dt>
      <br />
      <dt>Max Harvest:{max_harvest}</dt>
      <dl>
        <dt>Flavors:</dt>
        {(showData &&
          showData.flavors.map((details, index) => {
            return (
              <dd key={index}>
                {index + 1}. {details.flavor.name}
              </dd>
            );
          })) ||
          "No Flavors"}
      </dl>
    </div>
  );
};
export default Berry;
