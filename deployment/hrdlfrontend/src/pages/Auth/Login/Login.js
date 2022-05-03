import {Button, Form, Col, Row, Image, Container, Table, Nav, NavDropdown,Navbar, FormControl} from 'react-bootstrap';
import axios from 'axios';
import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import { withStyles } from "@material-ui/core/styles";
import InputAdornment from '@mui/material/InputAdornment';
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import './Login.css';

import { connect } from "react-redux";
import authSlice from "../../../redux/auth/auth.reducer";

//import Lottie from 'react-lottie';

import {
  increaseCounter,
  decreaseCounter,
} from "../../../redux/auth/auth.actions"

import { AiOutlineUser } from 'react-icons/ai';
import { HiOutlineKey } from 'react-icons/hi';

const API_PATH = `http://${window.location.hostname}:8000/api/`;

// login component
const Login =(props)=> {

    // state definitions
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [shouldShake, setShake] = useState(false);
    const [loading, setLoading] = useState(false);
    const myRef = React.createRef();

    // dispatch and history
    let history = useNavigate();
    const dispatch = useDispatch();

    // validate form
    function validateForm() {
        return email.length > 0 && password.length > 0;
    }

    //handle submit
    function handleSubmit(event) {
        event.preventDefault();
        setShake(false);
    }

  // login handler
  const handleLogin = () => {
    setLoading(true);
    axios
      .post(`${API_PATH}auth/login/`, { email, password })
      .then((res) => {
        // dispatch to redux
        dispatch(
          authSlice.actions.setAuthTokens({
            token: res.data.access,
            refreshToken: res.data.refresh,
          })
        );
        // dispatch user account to redux
        dispatch(authSlice.actions.setAccount(res.data.user));
        setLoading(false);
        history("/mainPage");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // the visuals
  return (
      <div id = "loginBox">
        <div class="outer">
          <div class="middle">
            <div class="inner">
                <h1 className='title text-center'>Login</h1>
                <br/>
                <div>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label id = "label">Username: </Form.Label>
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <AiOutlineUser className="img" />
                      </div>
                      <input value={email} onChange={(e) => setEmail(e.target.value)} id="loginInput" type="text" className="form-control" placeholder="Username" />
                    </div>
                  </Form.Group>

                  <br/>

                  <Form.Group controlId="formBasicEmail">
                      <Form.Label id = "label">Password: </Form.Label>
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <HiOutlineKey className="img" />
                        </div>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} id="loginInput" type="password" className="form-control" placeholder="Password" />
                      </div>
                  </Form.Group>
                  <a className="right-item">forgot password?</a>

                  <br/>
                  <br/>
                  <br/>

                  <div id="centerOuter">
                    <Button id="HRDLButton" ref={myRef} onClick={handleLogin} disabled={!validateForm()} variant="primary" type="submit">
                      Login
                    </Button>
                  </div>

                  <br/>

                  <div id="centerOuter">
                    <p className="center-text">Or Sign Up Using</p>
                    <a href="/Register" className="center-item"><strong>Sign Up</strong></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    )
}

//exporting this function to be used in pages.js
export default Login