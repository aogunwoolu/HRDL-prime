import {Button, Form, Col, Row, Image, Container, Table, Nav, NavDropdown,Navbar, FormControl} from 'react-bootstrap';
import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import { withStyles } from "@material-ui/core/styles";
import InputAdornment from '@mui/material/InputAdornment';
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import { connect } from "react-redux"
import authSlice from "../../../redux/auth/auth.reducer";

import {
  increaseCounter,
  decreaseCounter,
} from "../../../redux/auth/auth.actions"

import { AiOutlineUser } from 'react-icons/ai';
import { HiOutlineKey } from 'react-icons/hi';

const API_PATH = `http://${window.location.hostname}:8000/api`;

const Page1 =(props)=> {

    //the visuals
    return (
        <div className='page1'>
            <Row>
                <h3 className='title s-text-center'>{props.step.title}</h3>
            </Row>
            <Row>
                <p className='info s-text-center'>{props.step.info}</p>
            </Row>
            <Row>
                <p className='sub-info'>{props.step['sub-info']}</p>
            </Row>
            <br/>
            <Row>
                <div>
                <Col className='components'>
                    <Row>
                    <Col>
                        <Form.Group controlId="formBasicEmail">
                        <Form.Label id = "label">First Name: </Form.Label>
                        <div className="input-group mb-3">
                            <input id="loginInput" autocomplete="none" name="first-name" value={props['first-name']} onChange={props.handleChange} type="text" className="form-control" placeholder="First Name" />
                        </div>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formBasicEmail">
                        <Form.Label id = "label">Last Name: </Form.Label>
                        <div className="input-group mb-3">
                            <input id="loginInput" autocomplete="none" name="last-name" value={props['last-name']} onChange={props.handleChange} type="text" className="form-control" placeholder="Last Name" />
                        </div>
                        </Form.Group>
                    </Col>
                    </Row>

                    <br/>

                    <Row>
                    <Col>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label id = "label">User Name: </Form.Label>
                                <div className="input-group mb-3">
                                    <input id="loginInput" autocomplete="none" name="userName" value={props.userName} onChange={props.handleChange} type="text" className="form-control" placeholder="User Name" />
                                </div>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label id = "label">Email: </Form.Label>
                                <div className="input-group mb-3">
                                    <input id="loginInput" autocomplete="none" name="email" value={props.email} onChange={props.handleChange}type="text" className="form-control" placeholder="Password" />
                                </div>
                        </Form.Group>
                    </Col>
                    </Row>

                    <br/>

                    <Row>
                    <Col>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label id = "label">Password: </Form.Label>
                                <div className="input-group mb-3">
                                    <input id="loginInput" autocomplete="none" name="password" value={props.password} onChange={props.handleChange} type="password" className="form-control" placeholder="Password" />
                                </div>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label id = "label">Confirm Password: </Form.Label>
                                <div className="input-group mb-3">
                                    <input id="loginInput" autocomplete="none" name="repassword" value={props.repassword} onChange={props.handleChange} type="password" className="form-control" placeholder="Password" />
                                </div>
                        </Form.Group>
                    </Col>
                    </Row>

                    <br/>
                    <br/>
                    <br/>
                </Col>
                </div>
            </Row>
        </div>
    )
}

export default Page1