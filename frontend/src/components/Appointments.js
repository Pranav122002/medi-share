import React, { useState, useContext, useEffect } from "react";
import "../css/Appointments.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import { API_BASE_URL } from "../config";

export default function Appointments() {
  const navigate = useNavigate();

  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const [userid, setUserId] = useState("");

  const [doctor_id, setDoctorId] = useState("");
  const [doctor_name, setDoctorName] = useState("");
  const [appointment_date, setAppointmentDate] = useState("");
  const [appointment_time, setAppointmentTime] = useState("");

  const [isDoctor, setIsDoctor] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState([]);

  const [linkText, setLinkText] = useState("");

  const [appointments, setDoctorAppointments] = useState([]);
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [patient, setPatient] = useState("");

  const [rating, setRating] = useState("");
  const [feedback, setFeedback] = useState("");
  const [DoctorForm, setDoctorForm] = useState(false);
  const [FeedForm, setFeedForm] = useState(false);

  console.log(DoctorForm)
  useEffect(() => {
    fetchUser();
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (isDoctor) {
      if (userid) {
        fetchMyDoctorAppointments();
      }
    } else {
      if (userid) {
        fetchMyPatientAppointments();
      }
    }
  }, [userid]);

  function fetchMyDoctorAppointments() {
    const doctorId = userid;
    console.log("doctorId = ", doctorId);

    fetch(`${API_BASE_URL}/my-doctor-appointments/${doctorId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDoctorAppointments(data);
        setIsLoading(false);
        console.log("appointments = ", data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchMyPatientAppointments() {
    const patientId = userid;

    fetch(`${API_BASE_URL}/my-patient-appointments/${patientId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPatientAppointments(data);
        setIsLoading(false);
        console.log("my app = ", data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const postBookData = () => {
    if (!selectedDoctor) {
      notifyA("Please select a doctor from the list.");
      return;
    }

    fetch(`${API_BASE_URL}/book-appointment/${userid}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        doctor: selectedDoctor._id,
        patient: userid,
        appointment_date: appointment_date,
        appointment_time: appointment_time,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          notifyA(data.error);
        } else {
          notifyB(data.msg);
          navigate("/profile");
        }
        console.log(data);
      });
  };

  function confirmAppointment(appointmentId) {
    fetch(`${API_BASE_URL}/confirm-appointment/${appointmentId}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (
          data ==
          "Patient has insufficient credits. Please reject the appointment."
        ) {
          notifyA(
            "Patient has insufficient credits. Please reject the appointment."
          );
        } else {
          notifyB("Appointment confirmed successfully.");
          navigate("/profile");
        }
      })
      .catch((error) => {
        console.log(error);
        notifyA(error);
      });
  }

  function rejectAppointment(appointmentId) {
    fetch(`${API_BASE_URL}/reject-appointment/${appointmentId}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        notifyB("Appointment rejected successfully.");
        navigate("/profile");
      })
      .catch((error) => {
        console.log(error);
        notifyA(error);
      });
  }

  function fetchUser() {
    fetch(
      `${API_BASE_URL}/user/${JSON.parse(localStorage.getItem("user"))._id}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.role === "doctor") {
          setIsDoctor(true);
        } else {
          setIsDoctor(false);
          setPatient(res.name);
        }

        setUserId(res._id);
        setIsLoading(false);
      });
  }

  function fetchDoctors() {
    fetch(`${API_BASE_URL}/all-doctors`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("Doctors list = ", res);

        setDoctors(res);
      })
      .catch((error) => {
        console.log(error);
        notifyA("Error fetching doctors");
      });
  }

  function addLink(appointmentId) {
    console.log("linktext = ", linkText);
    console.log("id = ", appointmentId);

    fetch(`${API_BASE_URL}/add-appointment-link/${appointmentId}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        appointment_link: linkText,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        notifyB("Link added successfully.");
        navigate("/profile");
      })
      .catch((error) => {
        console.log(error);
        notifyA(error);
      });
  }
  function addRatingFeedback(selectedAppointment) {
    if (!selectedAppointment) {
      notifyA("Please select appointment from list.");
    }

    fetch(`${API_BASE_URL}/add-rating-feedback/${selectedAppointment}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        rating: rating,
        feedback: feedback,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        notifyB("Rating and Feedback added.");
        navigate("/profile");
      });
  }
  return (
    <div className="doctor">
      <div className={`bodyy ${DoctorForm && "active"}`}>
        <div className="doctordetail">
          <div>
            <h1>Doctor Appointments </h1>
            <div className="doctorp">
              <p>Book an appointment with our affiliated doctors today. Appointments can be booked with the credits earned on our website.</p>
            </div>
          </div>
          <img src="./doctor6.jpg" alt="" />
        </div>
        <div className="">
          <div className="">
            {isLoading ? (
              <h1>Loading...</h1>
            ) : (
              <>
                {isDoctor ? (
                  <>
                    <h2>Your Appointments</h2>
                    <div className="appointments-container">
                      {/* {appointments.length > 0 ? ( */}

                      <ul>
                        {appointments.map((appointment) => (
                          <li key={appointment._id}>
                            <p>
                              <img src="./doctor2.png" alt="" />
                            </p>
                            <p>Doctor: {appointment.doctor.name}</p>
                            <p>Patient: {appointment.patient.name}</p>
                            <p>Date: {appointment.appointment_date}</p>
                            <p>Time: {appointment.appointment_time}</p>

                            {!appointment.confirm_status &&
                              !appointment.reject_status ? (
                              <>
                                <button
                                  className="button-53"
                                  type="submit"
                                  onClick={() => {
                                    confirmAppointment(appointment._id);

                                  }}
                                >
                                  {" "}
                                  Confirm
                                </button>
                                <button
                                  className="button-53"
                                  type="submit"
                                  onClick={() => {
                                    rejectAppointment(appointment._id);
                                  }}
                                >
                                  {" "}
                                  Reject
                                </button>
                              </>
                            ) : appointment.confirm_status ? (
                              <p className="p2">Status: Confirmed</p>
                            ) : (
                              <p className="p2">Status: Rejected</p>
                            )}

                            {appointment.confirm_status ? (
                              <>
                                <p>
                                  Link:{" "}
                                  {appointment.appointment_link ? (
                                    appointment.appointment_link
                                  ) : (
                                    <>
                                      <input
                                        type="text"
                                        value={linkText}
                                        onChange={(e) =>
                                          setLinkText(e.target.value)
                                        }
                                      />
                                      <button
                                        onClick={() => addLink(appointment._id)}
                                      >
                                        Add Link
                                      </button>
                                    </>
                                  )}
                                </p>
                              </>
                            ) : (
                              <>
                                {" "}
                                <p></p>{" "}
                              </>
                            )}
                          </li>
                        ))}
                      </ul>

                      {/* ) : ( */}

                      {/* <h3 className="noaot">No appointments found.</h3> */}

                      {/* ) */}
                      {/* } */}
                    </div>
                  </>
                ) : (
                  <div className="">

                    <div className="Doctorui">
                      <h1>Available doctors</h1>
                      <div>
                        <div className={`book ${DoctorForm && "active"}`}>
                          <div className="bookForm">
                            <img src="./close.png" onClick={() => setDoctorForm(false)} alt="" srcset="" />
                            <div className="logo">
                              <h1>Book Appointment</h1>
                            </div>

                            <div>
                              <input
                                className="pointnone"
                                type="text"
                                name="doctor_id"
                                id="doctor_id"
                                value={selectedDoctor._id}
                                placeholder="Doctor's ID"
                                onChange={(e) => {
                                  setDoctorId(e.target.value);
                                }}
                              />
                            </div>

                            <div>
                              <input
                                className="pointnone"
                                type="text"
                                name="doctor_name"
                                id="doctor_name"
                                value={selectedDoctor.name}
                                placeholder="Doctor's Name"
                                onChange={(e) => {
                                  setDoctorName(e.target.value);
                                }}
                              />
                            </div>

                            <div>
                              <input
                                type="date"
                                name="appointment_date"
                                id="appointment_date"
                                placeholder="Appointment Date"
                                value={appointment_date}
                                onChange={(e) => {
                                  setAppointmentDate(e.target.value);
                                }}
                              />
                            </div>

                            <div>
                              <input
                                type="time"
                                name="appointment_time"
                                id="appointment_time"
                                placeholder="Appointment Time (24hr format)"
                                value={appointment_time}
                                onChange={(e) => {
                                  setAppointmentTime(e.target.value);
                                }}
                              />
                            </div>

                            <button
                              className="button-53"
                              value="Book "
                              type="submit"
                              onClick={() => {
                                postBookData(patient);
                                setDoctorForm(false);
                              }}
                            >
                              {selectedDoctor
                                ? `Book : ${selectedDoctor.doctor_details.fees}`
                                : "Book"}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="doctorslist">
                        <ul >
                          <li>
                            <p>Name</p>
                            <p>Qualification</p>
                            <p>Specialization</p>
                            <p>Experience</p>
                            <p>Availability</p>
                            <button style={{ background: "none", color: "rgb(0, 0, 139)" }} className="button">Select</button>
                          </li>
                          <hr />
                          {doctors.map((doctor) => (<>

                            <li
                              key={doctor._id}

                            >

                              <p>{doctor.name}</p>
                              <p>{doctor.doctor_details.qualification}</p>
                              <p>{doctor.doctor_details.specialization}</p>
                              <p>{doctor.doctor_details.experience}</p>
                              <p>{doctor.doctor_details.availability}</p>

                              <button onClick={() => { setSelectedDoctor(doctor); setDoctorForm("active") }}
                                className="button" >Select</button>
                            </li>
                            <hr />
                          </>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="feedbackss">
                      <div>
                        <h2>Give feedback</h2>
                        <p>Your feedback is important for us to improve.  </p>
                        <p>select the appointment from your
                          appintment list for which you want to give feedback
                        </p>
                      </div>
                      <img src="./feedback.png" alt="" srcset="" />
                    </div>
                    <div className="appoint">
                      <h2>Doctor appointments</h2>
                      <div className="appointmentslist">
                        <ul>
                          <li>
                         
                            <p>Name</p>
                            <p>Appointment date</p>
                            <button style={{ background: "none", color: "rgb(0, 0, 139)" }} className="button">Select</button>

                          </li>
                          <hr />
                          {patientAppointments.map((appointment) => (<>

                            <li
                              key={appointment._id}

                            >
                              
                              <p>{appointment.doctor.name}</p>
                              <p>{appointment.appointment_date}</p>
                              <button onClick={() => { setSelectedAppointment(appointment); setFeedForm("active") }}
                                className="button">Select</button>
                            </li>
                            <hr />
                          </>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className={`feedca ${FeedForm && "active"}`}>
                      <div className="feedbackvalue">
                        <img src="./close.png" onClick={() => setFeedForm(false)} alt="" srcset="" />
                        <h2>Give Feedback</h2>
                        <div className="inputs" style={{ pointerEvents: "none" }}>
                          <input
                            type="text"
                            value={selectedAppointment?.doctor?.name}
                          />
                        </div>
                        <div className="inputs" style={{ pointerEvents: "none" }}>
                          <input
                            type="text"
                            value={selectedAppointment?.appointment_date}
                          />
                        </div>

                        <div className="inputs">
                          <select
                            
                            type="text"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                        </div>

                        <div className="inputs">
                          <input
                            id="biginput"
                            placeholder="feedback details"
                            type="text"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                          />
                        </div>

                        <button className="button"
                          onClick={() => {
                            addRatingFeedback(selectedAppointment._id);
                            setFeedForm(false);
                          }
                          }
                        >
                          Give feedback
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
