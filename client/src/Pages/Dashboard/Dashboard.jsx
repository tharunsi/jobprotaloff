import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import myimage from "../../Image/avatar-jessica.jpeg";
import {faHome, faSmile, faSearch, faBars, faTimes, faBell, faCloudDownloadAlt, faTachometerAlt, faBriefcase, faChartLine, faComments, faUsers, faCog, faSignOutAlt, faXmark, faPlus, faEllipsisV,faBookmark,faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import axios from 'axios';


const Dashboard = () => {
  const [loginDates, setLoginDates] = useState([]);

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    useEffect(() => {
    const fetchLoginDates = async () => {
      try {
        
        const res = await axios.get("http://jobprotaloff.onrender.com/api/login-dates", { withCredentials: true }); 
        setLoginDates(res.data);
      } catch (err) {
        console.error("Error fetching login dates:", err);
      }
    };
    fetchLoginDates();
  }, []);
 const [image, setImage] = useState();
  useEffect(() => {
    axios.get('http://localhost:3000/getimage', { withCredentials: true })
    .then(res => {
      setImage(res.data.image); 
      console.log("Fetched data" ,res.data.image);
    })
    .catch(err => console.log(err))
   
  }, [])

 

const generateGridItems = () => {
  return loginDates.map((dayObj, index) => (
    <div
      key={index}
      className={`grid-item ${dayObj.loggedIn ? "active" : "inactive"}`}
      title={dayObj.date} // optional: hover to see date
    >{dayObj.day}</div>
  ));
};

  return (
    <div>
      <section id="sidebar">
        <a href="#" className="brand">
          {/* <FontAwesomeIcon icon={faSmile} /> */}
          <h1 className="text1">Job<span>Hunt</span></h1>
        </a>
        <ul className="side-menu top">
          <li>
            <NavLink to="/home">
              <FontAwesomeIcon icon={faHome} />
              <span className="text-side">Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/jobs">
              <FontAwesomeIcon icon={faBriefcase} />
              <span className="text-side">Jobs</span>
            </NavLink>
          </li>
          <li>
            <NavLink to ="/intern">
              <FontAwesomeIcon icon={faBriefcase} />
              <span className="text-side">Internship</span>
              </NavLink>
          </li>
          <li>
            <a href="#">
              <FontAwesomeIcon icon={faFileAlt} />
              <span className="text-side">Build Resume</span>
            </a>
          </li>
          <li>
            <a href="#">
              <FontAwesomeIcon icon={faBookmark} />
              <span className="text-side">Saved jobs</span>
            </a>
          </li>
        </ul>
        <ul className="side-menu">
          {/* <li>
            <NavLink to="/setting">
              <FontAwesomeIcon icon={faCog} />
              <span className="text">Settings</span>
            </NavLink>
          </li> */}
          <li>
            <NavLink to ="/" className="logout">
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span className="text-side">Logout</span>
            </NavLink>
          </li>
        </ul>
      </section>

      <section id="content">
        <nav>
          
          
          <form action="#">
            <div className="form-input">
              <input type="search" placeholder="Search..." />
              <button type="submit" className="search-btn">
                <FontAwesomeIcon icon={ faSearch} />
              </button>
            </div>
          </form>
          <a href="#" className="notification">
            <FontAwesomeIcon icon={faBell} />
            <span className="num">8</span>
          </a>
          <NavLink to="/profile" className="profile">
            <img src={`http://jobprotaloff.onrender.com/profileimages/${image}`}  alt="Profile" />
          </NavLink>
        </nav>

        <main>
          <div className="head-title">
            <div className="left">
              <h1>Dashboard</h1>
              <ul className="breadcrumb">
                <li>
                  <a href="#">Dashboard</a>
                </li>
                
                <li>
                  <NavLink to="/home" className="active">Home</NavLink>
                </li>
              </ul>
            </div>
            <a href="tharun_si_resume.pdf" className="btn-download" download>
              <FontAwesomeIcon icon={faCloudDownloadAlt} />
              <span className="text">Download PDF</span>
            </a>
          </div>

          <ul className="box-info">
            <li>
              <FontAwesomeIcon icon={faBriefcase} className="icon" />
              <span className="text">
                <h3>3</h3>
                <p>Selected</p>
              </span>
            </li>
            <li>
              <FontAwesomeIcon icon={faUsers} className="icon" />
              <span className="text">
                <h3>30</h3>
                <p>Applications</p>
              </span>
            </li>
            <li>
              <FontAwesomeIcon icon={faChartLine} className="icon" />
              <span className="text">
                <h3>10%</h3>
                <p>Conversion Rate</p>
              </span>
            </li>
          </ul>

          <div className="table-data">
            <div className="order">
              <div className="head-label">
                <h3>Recent Applications</h3>
                <FontAwesomeIcon icon={faSearch} />
                <FontAwesomeIcon icon={faEllipsisV} />
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Date Applied</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <img src={myimage} alt="Applicant" />
                      <p>Jessica Halle</p>
                    </td>
                    <td>01-10-2021</td>
                    <td><span className="status completed">Applied</span></td>
                  </tr>
                  <tr>
                    <td>
                      <img src={myimage} alt="Applicant" />
                      <p>Jessica Halle</p>
                    </td>
                    <td>01-10-2021</td>
                    <td><span className="status pending">Pending</span></td>
                  </tr>
                  <tr>
                    <td>
                      <img src={myimage} alt="Applicant" />
                      <p>Jessica Halle</p>
                    </td>
                    <td>01-10-2021</td>
                    <td><span className="status pending">Pending</span></td>
                  </tr>
                  <tr>
                    <td>
                      <img src={myimage} alt="Applicant" />
                      <p>Jessica Halle</p>
                    </td>
                    <td>01-10-2021</td>
                    <td><span className="status pending">Pending</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='new-grid-dash-43'>
              <span>Your Activity</span>
              <br></br>
              <p>This Month: {currentMonth}</p>
              <br></br>
              <div class="grid-container-dash-43">
              {generateGridItems()}
              </div>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
};

export default Dashboard;