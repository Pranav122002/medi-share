import React, { useEffect, useState, useContext } from "react";
import "../css/Search.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import { API_BASE_URL } from "../config";

export default function Search() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const fetchMedicines = (query) => {
    setSearch(query);
    fetch(`${API_BASE_URL}/search-medicines`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
       

        setSearchResult(results.medicine);
      });
  };

  return (
    <div>
      <Hnavbar />
      <div className="bodyy">
        <Navbar />

        <div className="searchcolumn">
          <div className="searchbox">
            <input
              className="searchinput"
              type="text"
              placeholder="Search medicines"
              value={search}
              onChange={(e) => fetchMedicines(e.target.value)}
            />

            <ul>
              <li>
                <h3>Medicine</h3>
                <h3 className="p1">Description</h3>
                <h3 className="p2">Disease</h3>
              </li>
              {searchResult.map((item) => {
                return (

                  <li className="link">
                    <h3 style={{ color: "black" }}>

                      {item.medicine_name}
                    </h3>
                    <p className="p1">{item.description}</p>
                    <p className="p2" style={{ color: "black" }}>{item.disease}</p>

                  </li>
                );
              })}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
