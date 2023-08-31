import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
     <h3>Wanna Know me??</h3>
     <br />
     <a href="https://inspiring-macaron-a45982.netlify.app" target="_blank"><button className="btn">AYUSH</button></a>
      </div>

      <div className="midFooter">
        <div className="image">
           <h1 className="head">A.ORION</h1>
        </div>
        <h2 className="name">
            SHOP AS MUCH AS U WANT
        </h2>
       
      </div>

      <div className="rightFooter">
        <h4>Contact Us</h4>
        <a href="https://github.com/ayushkumar146" target="_blank">Git Hub</a>
        <a href="https://www.linkedin.com/in/ayush-das-17772322a/" target="blank">Linked In</a>
       
      </div>
    </footer>
  );
};

export default Footer;
