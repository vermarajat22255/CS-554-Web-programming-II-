import React, { useState, useEffect } from "react";
import Page404 from "./Page404";
import axios from "axios";

const Machine = props => {
  const [showData, setShowData] = useState(undefined);

  useEffect(() => {
    let isCancelled = false;
    async function fetchData() {
      try {
        let id = parseInt(props.match.params.id);
        if (!isCancelled && !isNaN(id) && id > 0 && id < 1443) {
          const { data } = await axios.get(
            "https://pokeapi.co/api/v2/machine/" + id
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

  let itemName = "",
    id = "",
    move = "",
    version = "";
  if (showData) {
    itemName = showData.item.name;
    id = showData.id;
    move = showData.move.name;
    version = showData.version_group.name;
  }

  if (!showData || !showData.id) return <Page404></Page404>;
  return (
    <div className="cap-first-letter">
      <h1 className="list">
        <dt>Name: {itemName}</dt>
        <br />
      </h1>
      <dt>Move: {move}</dt>
      <br />
      <dt>Id:{id}</dt>
      <br />
      <dt>Version Group:{version}</dt>
    </div>
  );
};
export default Machine;
