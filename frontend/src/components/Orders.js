import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import "../css/Orders.css"
export default function Orders() {

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const navigate = useNavigate();
  const [order_id, setOrderId] = useState("");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchOrders();
  }, []);


  function fetchOrders() {
    fetch("/allorders")
      .then((response) => response.json())
      .then((data) => {setOrders(data);
        setIsLoading(false);
      }
        );
  }

  const putDonateData = (order_id) => {
    fetch(`/order/${order_id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const execute_status = result.execute_status;
        const verify_status = result.verify_status;

        fetch(
          `/user/${JSON.parse(localStorage.getItem("user"))._id
          }`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
          }
        )
          .then((res) => res.json())
          .then((result) => {
            const donar_id = result._id;

            fetch(`/donate/${order_id}`, {
              method: "put",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                execute_status: execute_status,
                verify_status: verify_status,
                donar_id: donar_id,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.error) {
                  notifyA("Failed to donate order...");
                } else {
                  if (data === "Order Donated successfully and Volunteer will verify now...") {
                    navigate("/profile");
                    notifyB(data);
                  }
                 
                   else 
                    {
                    notifyA(data);
                  } 
                }
                console.log(data);
              });
          });
      });
  };

  const putRequestData = (order_id) => {
    fetch(`/order/${order_id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const execute_status = result.execute_status;
        const verify_status = result.verify_status;

        fetch(
          `/user/${JSON.parse(localStorage.getItem("user"))._id
          }`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
          }
        )
          .then((res) => res.json())
          .then((result) => {
            const requester_id = result._id;

            fetch(`/request/${order_id}`, {
              method: "put",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                execute_status: execute_status,
                verify_status: verify_status,
                requester_id: requester_id,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.error) {
                  notifyA("Failed to request order...");
                } else {
                  if (data === "Order is already executed...") {
                    notifyA(data);
                  }
                  else if (
                    data === "Medicine is expired..."
                  ) {
                    notifyA(data);
                  } 
                   else if (
                    data === "Order is not verfied by Volunteer yet..."
                  ) {
                    notifyA(data);
                  } else if (data === "Order Requested successfully...") {
                    navigate("/profile");
                    notifyB(data);
                  }
                }
                console.log(data);
              });
          });
      });
  };

  const renderCard = (card, index) => {

    
    return (
      <>
     
      {card.order_type == "donate-order" ? (
        <Card className="Card" style={{ width: '18rem', height: '19rem' }} key={index}>
        <Card.Body>
          <Card.Title id="title">{card.medicine_name}</Card.Title>
          <Card.Text id="details">
            <p>Expiry Date : {card.expiry_date}<br /></p>
            <p> Quantity : {card.quantity}<br /></p>
            <p> Location : {card.location}<br /></p>
             <p> Donor : {card.donar.name}<br /></p> 
            <Button id="req_button" onClick={() => putRequestData(card._id)}>Request</Button>

          </Card.Text>

        </Card.Body>
    
      </Card>
              ) : (
                <Card className="Card" style={{ width: '18rem', height: '19rem' }} key={index}>
                <Card.Body>
                  <Card.Title id="title">{card.medicine_name}</Card.Title>
                  <Card.Text id="details">
                    <p>Expiry Date : {card.expiry_date}<br /></p>
                    <p> Quantity : {card.quantity}<br /></p>
                    <p> Location : {card.location}<br /></p>
                    <p> Requester : {card.requester.name}<br /></p>
                    <Button id="req_button" onClick={() => putDonateData(card._id)}>Donate</Button>
        
                  </Card.Text>
        
                </Card.Body>
            
              </Card> )}
              </>
      
    )
  }
  return (
    <div>
      <Hnavbar />
      <div className="bodyy">
      <Navbar />
      {isLoading ? (
        <div className="loadingcont">

          <h1 className="loada">Loading...</h1>
        </div>
              ) : (
                <div className="allCards">
        <div className="Cards">
          {orders.map(renderCard)}
        </div>
      </div>
              )}
      
      {/* <ul>
        {orders.map((orders) => (
          <li key={orders.medicine_name}>
            <p>medicine_name : </p> {orders.medicine_name}
            <br /> <p>expiry_date : </p> {orders.expiry_date}
            <br /> <p>quantity : </p> {orders.quantity}
            <br /> <p>location : </p> {orders.location}
            <br /> <p>donar : </p> {orders.donar.name}
            <br />{" "}
            <button onClick={() => putRequestData(orders._id)}>Request</button>
          </li>
        ))}
      </ul> */}
    </div>
    </div>
  );
}
