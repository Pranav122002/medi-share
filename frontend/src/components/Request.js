import React, { useState, useContext  , useEffect} from "react";
import "../css/Request.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import AOS from 'aos'
import 'aos/dist/aos.css'
import { API_BASE_URL } from "../config";

export default function Request() {


  const [medicine_name, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiry_date, setExpiryDate] = useState("");
  const [location, setLocation] = useState("");
  const [sug, showsug] = useState(!false);

  const handleShowsug = () => {
    showsug(false)
    console.log(sug)
  }

  useEffect(() => {
    AOS.init({ duration: 2000 });

}, [])

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const postOrderData = () => {
    fetch(
      `${API_BASE_URL}/user/${JSON.parse(localStorage.getItem("user"))._id
      }`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    ).then((res) => res.json())
      .then((result) => {
        const requester = result._id;
        fetch(`${API_BASE_URL}/request-medicines`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({

            medicine_name: medicine_name,
            expiry_date: expiry_date,
            quantity: quantity,
            location: location,
            requester: requester,
          }),
        }).then((res) => res.json())
          .then((data) => {
            if (data.error) {
              notifyA(data.error);
            } else {
              notifyB(data.msg);
            }
            console.log(data);
          });
      });
  };
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
        <div className="donate_instru">
          <h1>Some Important Instructions for Request</h1>
          <div className="donate_content">
          <img id="rcurve" src="./curve2.png" alt="" />
            <div className="points">
              <p>1.The medicine request can me made in limited quantity.</p>
              <p>2.Medicines which require doctors prescription cannot pe requested directly without it.</p>
              <p>3.There is no specific delivery time for the request medicine as soon as it is received by us it will be delivered.</p>
              <p>4.All the medicines are checked by our volunteers, we only accept and provide medicines which have the important information visible on them.</p>
            </div>
            
            <img data-aos="fade-down-left" src="./pills.png" alt="" />

          </div>
        </div>

        <div className="request">
          
            <div data-aos="zoom-in" className="requestForm">
              <div className="logo">
                <h1>Request Medicine</h1>
              </div>
              <div>
                <input
                  onClick={handleShowsug}
                  type="text"
                  name="medicine_name"
                  id="medicine_name"
                  value={medicine_name}
                  placeholder="Medicine Name"
                  onChange={(e) => {
                    setMedicineName(e.target.value);
                    fetchMedicines(e.target.value);
                  }}
                />
              </div>
              <div>
                <input
                  type="date"
                  name="expiry_date"
                  id="expiry_date"
                  placeholder="Expiry Date"
                  value={expiry_date}
                  onChange={(e) => {
                    setExpiryDate(e.target.value);
                  }}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="quantity"
                  id="quantity"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                  }}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="location"
                  id="location"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                  }}
                />
              </div>
              <button className="button-53" onClick={() => {postOrderData();}} value="Request" type="submit" role="button">Request</button>
              
            </div>
            <div className={`suggestions ${sug && 'active'}`}>

            <ul>
              <li style={{ color: "black" }}>
                <h2>Suggestions</h2>
              </li>
              {searchResult.map((item) => {
                return (

                  <li className="link">
                    <h3 style={{ color: "black" }}>

                      {item.medicine_name + ": " + "-"}
                    </h3>

                    <h3 className="p2" style={{ color: "black" }}>{item.disease}</h3>

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
