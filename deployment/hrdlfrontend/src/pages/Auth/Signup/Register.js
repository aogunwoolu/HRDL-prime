import {Button, Form, Col, Row, Image, Container, Table, Nav, NavDropdown,Navbar, FormControl} from 'react-bootstrap';
import axios from 'axios';
import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import { withStyles } from "@material-ui/core/styles";
import InputAdornment from '@mui/material/InputAdornment';
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import './Register.css';

import { connect } from "react-redux"
import authSlice from "../../../redux/auth/auth.reducer";

import { Page1, Page2, Page3, Page4 } from "../../../components/components"

import {
  increaseCounter,
  decreaseCounter,
} from "../../../redux/auth/auth.actions"

import { AiOutlineUser } from 'react-icons/ai';
import { HiOutlineKey } from 'react-icons/hi';

const API_PATH = `http://${window.location.hostname}:8000/api/`;

// step description
// move to serverside in next iteration of HRDL
const registerSteps = {
  1: {
    'step': 'One',
    'title': 'Your Personal Information',
    'info': 'Enter your personal information so HRDL can know you a little bit better',
    'sub-info': 'note: we do not share this information'
  },
  2: {
    'step': 'Two',
    'title': 'Your Exchange Details',
    'info': 'To set up your trading bot, details about the exchange to be used is necessary! ',
    'sub-info': ''
  },
  3: {
    'step': 'Three',
    'title': 'Your Currencies',
    'info': 'Now it is necessary to select the currencies which you want to trade with',
    'sub-info': ''
  },
  4: {
    'step': 'Four',
    'title': 'Extra Details',
    'info': 'A little bit more information needed to complete the sign up process. Don’t worry, almost there!',
    'sub-info': ''
  }
}

// regisster step component
// using state to switch between pages
const RegisterStep =(props)=> {
  const regStep = props.registerStep;
  switch(regStep) {
    case 1:
      return <Page1
        {...props.registerInfo}
        widths={props.widths}
        setWidths={props.setWidths}
        step={registerSteps[props.registerStep]}
        handleChange={props.handleChange}
      />;
    case 2:
      return <Page2
        {...props.registerInfo}
        widths={props.widths}
        setWidths={props.setWidths}
        step={registerSteps[props.registerStep]}
        handleChange={props.handleChange}
      />;
    case 3:
      return <Page3
        {...props.registerInfo}
        widths={props.widths}
        setWidths={props.setWidths}
        step={registerSteps[props.registerStep]}
        handleChange={props.handleChange}
      />;
    case 4:
      return <Page4
        {...props.registerInfo}
        widths={props.widths}
        setWidths={props.setWidths}
        step={registerSteps[props.registerStep]}
        handleChange={props.handleChange}
      />;
    default:
      return <div/>;
  }
}

// main component
const Register =(props)=> {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [shouldShake, setShake] = useState(false);
    const [loading, setLoading] = useState(false);
    const [registerStep, setRegisterStep] = useState(1);
    const [registerInfo, setInfo] = useState({
      'userName': "",
      'first-name': "",
      'last-name': "",
      'password': "",
      'repassword': "",
      'email': "",

      'exchange': "None",
      'e-key': "",
      'secret': "",

      'currencies': [],
      'stop-loss': 30,
      'take-profit': 30,
      'amount-to-invest': 100,
    })

    // coin widths states
    const [widths, setWidths] = useState(
      [new Array(registerInfo.currencies.length + 1)].fill(Math.round(registerInfo['amount-to-invest'] / (registerInfo.currencies.length + 1)))//.push(100 - registerInfo['amount-to-invest'])
    );

    const myRef = React.createRef();

    // handle change to update state with new value
    const handleChange = e => {
        const { name, value } = e.target;
        //update individual state
        setInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
        //update currencies or amount to invest
        if (name == 'currencies' || name == 'amount-to-invest'){
          setWidths(
            new Array(registerInfo.currencies.length + 1).fill(Math.round(registerInfo['amount-to-invest'] / (registerInfo.currencies.length + 1)))//.push(100 - registerInfo['amount-to-invest'])
          )
        }
    };

    let history = useNavigate();
    const dispatch = useDispatch();

    // form validation
    function validateForm() {
        return email.length > 0 && password.length > 0;
    }

    // handle submit
    function handleSubmit(event) {
        event.preventDefault();
        setShake(false);
    }

  // handle next registrastion step
  const handleNext = (forward) => {
    var direction = (forward)? 1:-1

    if (1 <= registerStep + direction  && registerStep + direction <= 4){
      setRegisterStep(registerStep + direction);
    }
  };

  // handle signup
  const handleSignup = () => {
    const fullwidths = widths.map((w, i) => {return {
      currency: registerInfo.currencies[i].id,
      width: w
    }})

    // axios post with auth tokens setting
    axios
      .post(`${API_PATH}auth/register/`, {...registerInfo, 
        fullwidths
      })
      .then((res) => {
        console.log(res.data)
        dispatch(
          authSlice.actions.setAuthTokens({
            token: res.data.access,
            refreshToken: res.data.refresh,
          })
        );
        dispatch(authSlice.actions.setAccount(res.data.user));
        setLoading(false);
        history("/mainPage");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //the visuals
  return (
    <div id = "signupBox">
      <div class="s-outer">
        <div class="s-middle">
          <div class="s-inner">
            <Row>
              <Col className='col-3 step-icons'>
                <Row>
                  <img src="HRDL_logo.png" alt="HRDL" width="110vw" height="70vh"></img>
                </Row>
                <Row>
                  <h1 className='white-text s-text-center'>Step {registerSteps[registerStep].step}</h1>
                  <p className='info s-text-center'>{registerSteps[registerStep].info}</p>
                  <p className='sub-info'>{registerSteps[registerStep]['sub-info']}</p>
                </Row>
                {
                  (registerStep == 1)? (
                    <Row>
                      <img src="signup/step 1 bold.svg" alt="stepone"></img>
                    </Row>
                  ) :
                  (
                    <Row>
                      <img src="signup/step 1.svg" alt="stepone"></img>
                    </Row>
                  )
                }
                {
                  (registerStep == 2)? (
                    <Row>
                      <img src="signup/step 2 bold.svg" alt="steptwo"></img>
                    </Row>
                  ) : (
                    <Row>
                      <img src="signup/step 2.svg" alt="steptwo"></img>
                    </Row>
                  )
                }
                {
                  (registerStep == 3)? (
                    <Row>
                      <img src="signup/step 3 bold.svg" alt="stepthree"></img>
                    </Row>
                  ) : (
                    <Row>
                      <img src="signup/step 3.svg" alt="stepthree"></img>
                    </Row>
                  )
                }
                {
                  (registerStep == 4)? (
                    <Row>
                      <img src="signup/step 4 bold.svg" alt="stepfour"></img>
                    </Row>
                  ) : (
                    <Row>
                      <img src="signup/step 4.svg" alt="stepfour"></img>
                    </Row>
                  )
                }
              </Col>
              <Col/>
              <Col className='col-7 register-step'>
                <Row>
                <RegisterStep 
                  registerInfo={registerInfo}
                  widths={widths}
                  setWidths={setWidths}
                  step={registerSteps[registerStep]}
                  handleChange={handleChange}
                  registerStep={registerStep}
                />
                </Row>
                <Row>
                  {
                    (registerStep != 1)? (
                      <Col className='col-3'>
                        <Button className='back' ref={myRef} onClick={() => handleNext(false)} variant="primary">
                          Back
                        </Button>
                      </Col>
                    ) : (
                      <div/>
                    )
                  }
                  {
                    (registerStep != 4)? (
                      <Col className='col-2'>
                        <Button id="HRDLButton" ref={myRef} onClick={() => handleNext(true)} variant="primary">
                          Next
                        </Button>
                      </Col>
                    ) : (
                      <Col className='col-2'>
                        <Button id="HRDLButton" ref={myRef} onClick={() => handleSignup()} variant="primary">
                          Finish
                        </Button>
                      </Col>
                    )
                  }
                </Row>

                  <br/>
                  
                <Row>
                  <p className="login-link">Or Login Using</p>
                </Row>
                <Row>
                  <a href="/" className="login-link"><strong>Login</strong></a>
                </Row>
              </Col>
            </Row>
            </div>
          </div>
        </div>
    </div>
    )
}

//exporting this function to be used in pages.js
export default Register