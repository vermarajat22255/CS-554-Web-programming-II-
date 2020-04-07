import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";
import { Navbar } from "react-bootstrap";
import Page404 from "./Page404";

const Machines = props => {
  const [machineData, setMachineData] = useState(undefined);
  const [pageData, setPageData] = useState({
    page: parseInt(props.match.params.page),
    next: 1,
    previous: 0,
    offset: parseInt(props.match.params.page) * 20
  });

  useEffect(() => {
    let res = {}, isCancelled = false;
    async function fetchData() {
      if (!isCancelled && pageData.page >= 0 && pageData.page < 73) {
        res = await fetch(
          "https://pokeapi.co/api/v2/machine/?offset=" + pageData.page * 20
        );
        res
          .json()
          .then(res => setMachineData(res))
          .catch(err => console.log(err));
      } else {
        setMachineData(null);
      }
    }

    fetchData();
    return ()=>{
        isCancelled = true;
    }
  }, [props.match.params.page, pageData]);

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
    if (pageData.page < 73) {
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
    if (!isNaN(number) && number < 73) {
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
  for (let number = 0; number < 73; number++) {
    let uri = "/machines/page/" + number;

    items.push(
      <Pagination.Item
      className="nav"
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
        <Link className="btn btn-dark" to={"/machines/page/" + pageData.previous} onClick={pageValueDec}>
          Previous
        </Link>

        <Link className="btn btn-dark" to={"/machines/page/" + pageData.next} onClick={pageValueInc}>
          Next
        </Link>
      </Navbar>
    );
  } else if (pageData.page <= 0) {
    links = (
      <Navbar className="justify-content-around">
        <Link className="btn btn-dark" to={"/machines/page/" + pageData.next} onClick={pageValueInc}>
          Next
        </Link>
      </Navbar>
    );
  } else if (pageData.page >= 72) {
    links = (
      <Navbar className="justify-content-around">
        <Link className="btn btn-dark" to={"/machines/page/" + pageData.previous} onClick={pageValueDec}>
          Previous
        </Link>
      </Navbar>
    );
  }

  // Rendering
  if (!machineData ) return <Page404></Page404>;
  return (
    <div>
      <p className="list">List of Machines Page: {pageData.page}</p>

      {links}

      {(machineData &&
        machineData.results.map((pokemon, index) => {
          let idx = pokemon.url.match("/[0-9]+")[0].substring(1);
          let link = "/machine/" + idx;
          return (
            <ul key={index}>
              <li>
                <Link to={link}>Machine {index + 1}</Link>
              </li>
            </ul>
          );
        })) ||
        "No Data"}
      <nav>
        <ul className="pagination">{paginationBasic}</ul>
      </nav>
    </div>
  );
};
export default Machines;
