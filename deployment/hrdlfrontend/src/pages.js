import {Button, Form, Col, Row, Image, Container, Table, Nav, NavDropdown, FormControl} from 'react-bootstrap';
import { Link, Switch, Route, BrowserRouter as Router, useHistory , Redirect } from 'react-router-dom';
import React, { useState } from "react";

import './index.css';

//imports all other pages to easily pass to index.js
import {default as Login} from "./pages/Auth/Login/Login";
import {default as Register} from "./pages/Auth/Signup/Register";
import {default as HRDL} from "./pages/App/App";

function StartPage() {
  //this is where we display login (on a higher level)
    return (
      <Login/>
    );
  };

  //exports to index.js/ any other js that imports pages.js
  export {StartPage, HRDL, Register};
