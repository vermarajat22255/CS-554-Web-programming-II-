import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";
import { Navbar } from "react-bootstrap";
import Page404 from "./Page404";

const Pokemons = props => {
  const [pokeData, setPokeData] = useState(undefined);
  const [pageData, setPageData] = useState({
    page: parseInt(props.match.params.page),
    next: 1,
    previous: 0,
    offset: parseInt(props.match.params.page) * 20
  });

  useEffect(() => {
    let res = {},
      isCancelled = false;
    async function fetchData() {
      if (
        !isCancelled &&
        !isNaN(pageData.page) &&
        pageData.page >= 0 &&
        pageData.page < 49
      ) {
        res = await fetch(
          "https://pokeapi.co/api/v2/pokemon/?offset=" + pageData.page * 20
        );
        res
          .json()
          .then(res => setPokeData(res))
          .catch(err => console.log(err));
      } else {
        setPokeData(null);
      }
    }

    fetchData();
    return () => {
      isCancelled = true;
    };
  }, [pokeData, props.match.params.page, pageData]);

  //Functions

  //1.Previous
  const pageValueDec = () => {
    if (pageData.page >= 1) {
      const newData = {
        next: pageData.page,
        previous: pageData.page - 2,
        page: pageData.page - 1,
        offset: pageData.offset - 20
      };
      setPageData(newData);
    }
  };

  //2.Next
  const pageValueInc = () => {
    if (pageData.page <= 48) {
      const newData = {
        previous: pageData.page,
        next: pageData.page + 2,
        page: pageData.page + 1,
        offset: pageData.offset + 20
      };
      setPageData(newData);
    }
  };

  //3.Pagination

  const showPage = e => {
    let number = parseInt(e.target.text);
    if (!isNaN(number) && number <= 48) {
      const newData = {
        page: number,
        next: number + 1,
        previous: number - 1,
        offset: number * 20
      };
      setPageData(newData);
    }
  };

  let items = [];
  for (let number = 0; number <= 48; number++) {
    let uri = "/pokemon/page/" + number;

    items.push(
      <Pagination.Item
        key={number}
        active={number === pageData.page}
        href={uri}
      >
        Visit {number}
      </Pagination.Item>
    );
  }

  const paginationBasic = (
    <div>
      <Pagination className="nav" onClick={showPage} size="sm">
        {items}
      </Pagination>
    </div>
  );

  let links = null;
  if (pageData.page > 0 && pageData.page < 72) {
    links = (
      <Navbar className="justify-content-around">
        <Link
          className="btn btn-dark"
          to={"/pokemon/page/" + pageData.previous}
          onClick={pageValueDec}
        >
          Previous
        </Link>

        <Link
          className="btn btn-dark"
          to={"/pokemon/page/" + pageData.next}
          onClick={pageValueInc}
        >
          Next
        </Link>
      </Navbar>
    );
  } else if (pageData.page <= 0) {
    links = (
      <Navbar className="justify-content-around">
        <Link
          className="btn btn-dark"
          to={"/pokemon/page/" + pageData.next}
          onClick={pageValueInc}
        >
          Next
        </Link>
      </Navbar>
    );
  } else if (pageData.page >= 72) {
    links = (
      <Navbar className="justify-content-around">
        <Link
          className="btn btn-dark"
          to={"/pokemon/page/" + pageData.previous}
          onClick={pageValueDec}
        >
          Previous
        </Link>
      </Navbar>
    );
  }

  // Rendering
  if (!pokeData) return <Page404></Page404>;
  return (
    <div>
      <p className="list">List of pokemon Page: {pageData.page}</p>
      {links}

      {(pokeData &&
        pokeData.results.map((pokemon, index) => {
          let idx = pokemon.url.match("/[0-9]+")[0].substring(1);
          let link = "/pokemon/" + idx;
          return (
            <ul key={index}>
              <li>
                <Link to={link}>
                  {index + 1}. {pokemon.name}
                </Link>
              </li>
            </ul>
          );
        })) ||
        "No Data"}
        
      {paginationBasic}
    </div>
  );
};
export default Pokemons;