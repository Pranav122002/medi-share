import React, { useEffect, useState, useContext } from "react";
import "../css/Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Navbar({ login }) {
  const navigate = useNavigate();

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);


  const [showVNavbar, setShowVNavbar] = useState(!false)

  const handleShowVNavbar = () => {
    setShowVNavbar(!showVNavbar)
    console.log(showVNavbar)
  }


 
  const loginStatus = () => {
    return [
      <>
        <Link className="borderrad" to="/donate-medicines">
          <li style={{color: "black"}} className="navli">Donate</li>
          <img className="navimg" src="./donatemed.png" alt="" />
        </Link>
        <Link className="borderrad" to="/request-medicines">
          <li style={{color: "black"}} className="navli">Request</li>
          <img className="navimg" src="./requestmed.png" alt="" />
        </Link>
        <Link className="borderrad" to="/orders">
          <li style={{color: "black"}} className="navli">Orders</li>
          <img className="navimg" src="./orders.png" alt="" />
        </Link>
        <Link className="borderrad" to="/volunteer">
          <li style={{color: "black"}} className="navli">Volunteer</li>
          <img className="navimg" src="./verified.png " alt="" />
        </Link>
         <Link className="borderrad" to="/tasks">
          <li style={{color: "black"}} className="navli">Tasks</li>
          <img className="navimg" src="./tasks.png" alt="" />
        </Link>
        {/* <Link className="borderrad" to="/medicines">
          <li style={{color: "black"}} className="navli">Medicines</li>
        </Link> */}
        <Link className="borderrad" to="/search-medicines">
          <li style={{color: "black"}} className="navli">Search Medicines</li>
          <img className="navimg" src="./search-medicine.png" alt="" />
        </Link>
        
        <Link className="borderrad" to="/annoucements">
          <li style={{color: "black"}} className="navli">Annoucements</li>
          <img className="navimg" id="mega" src="./annoucement.png" alt="" />
        </Link>
        <Link className="borderrad" to="/doctors">
          <li style={{color: "black"}} className="navli">Doctors</li>
          <img className="navimg" id="mega" src="./appointment.png" alt="" />
        </Link>
       
        <Link className="borderrad" to="/profile">
          <li style={{color: "black"}} className="navli">Profile</li>
          <img className="navimg" src="./profile-pic.png" alt="" />
        </Link>
        <Link className="borderrad" to="/chats">
          <li style={{color: "black"}} className="navli">Chats</li>
          <img className="navimg" src="./chats.png" alt="" />
        </Link>
        <Link className="borderrad" to="/disease-predictions">
          <li style={{color: "black"}} className="navli">Disease Predictions</li>
          <img className="navimg" src="./diseases.png" alt="" />
        </Link>
        <Link className="borderrad" to="/nearby-hospitals">
          <li style={{color: "black"}} className="navli">Nearby Hospitals</li>
          <img className="navimg" src="./hospitals.png" alt="" />
        </Link>
        <Link className="borderrad" to="/signin"
          onClick={() => {
            localStorage.clear();
            notifyB("Logout successfull...");
          }}
        >
          <li style={{ color: "red" }} className="navli">Log-Out</li>
          <img className="navimg" src="./log-out.png" alt="" />
        </Link>
      </>,
    ];
  };

  return [
    <>
     
      <div  onClick={handleShowVNavbar}  className={`navbar ${showVNavbar && 'active'}`}>
        <div className="one">

          <img src="./pills.png" alt="" />
          <h1>SERVICES</h1>
          <img id="arrow" src="./expand.png" alt="" />
        </div>
        <div className="two"  >
          <ul className="nav-menu">{loginStatus()}</ul>
        </div>
      </div>
    </>,
  ];
}
