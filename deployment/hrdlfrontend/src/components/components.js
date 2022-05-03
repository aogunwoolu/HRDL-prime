import {Button, Form, Col, Row, Image, Container, Table, Nav, NavDropdown, FormControl} from 'react-bootstrap';
import { Link, Switch, Route, BrowserRouter as Router, useHistory , Redirect } from 'react-router-dom';
import React, { useState } from "react";

//imports all other pages to easily pass to index.js
import { CoinInfo } from "./coinInfo/coinInfo";
import { Social } from "./social/social";
import { Start } from "./start/start";
import { Page1, Page2, Page3, Page4 } from "./Auth/Signup";

//exports to indez.js/ any other js that imports pages.js
export {CoinInfo, Social, Start, Page1, Page2, Page3, Page4};
