import {Button, Form, Col, Row, Image, Container, Table, Nav, NavDropdown,Navbar} from 'react-bootstrap';
import React, { useState, useEffect  } from "react";
import TextField from '@mui/material/TextField';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import axios from 'axios';

import { connect } from "react-redux"
import authSlice from "../../../redux/auth/auth.reducer";

import {
  increaseCounter,
  decreaseCounter,
} from "../../../redux/auth/auth.actions"

import { AiOutlineUser } from 'react-icons/ai';
import { HiOutlineKey } from 'react-icons/hi';

const BACKEND_ROOT = `http://${window.location.hostname}:8000/`;

// styles
const useStyles = makeStyles({
    root: {
      backgroundColor: 'black',
      border: 0,
      borderBottom: 'medium solid white',
      color: '#6c757d',
      width: '489px',
    },
  });

// main component
const Page2 =(props)=> {

    // define states
    const [exchanges, setExchanges] = useState([]);

    const classes = useStyles();

    // get exchanges from backend /get-exchanges
    const getExchanges = async() => {
		axios({
            method: 'GET',
            url: `${BACKEND_ROOT}api/get-exchanges/`,
            headers: {'content-type':'application'},
        })
        .then(result => {
            setExchanges([
                ...result.data.exchanges
            ])
        })
        .catch(error => console.log({ error: error.message }));
	}

    useEffect(() => {
        getExchanges();
    },[]);

    //the visuals
    return (
        <div className='page2'>
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
                <Col>
                    <FormControl required variant="standard">
                        <Form.Label id = "label">Exchange: </Form.Label>
                        <div className="input-group mb-3">
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={props.exchange}
                                onChange={props.handleChange}
                                name="exchange"
                                label="Age"
                                className={classes.root}
                            >
                                <MenuItem value="None">
                                    <em>None</em>
                                </MenuItem>
                                {exchanges.map((item,index)=>{
                                    return <MenuItem value={`${item}`}>{item}</MenuItem>
                                })}
                            </Select>
                        </div>
                    </FormControl>
                </Col>
            </Row>

            <br/>

            <Row>
                <Col className="col-10">
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label id = "label">Api Key: </Form.Label>
                            <div className="input-group mb-3">
                                <input id="SignUpInput" autocomplete="none" name="e-key" value={props['e-key']} onChange={props.handleChange} type="text" className="form-control" placeholder="User Name" />
                            </div>
                    </Form.Group>
                </Col>
            </Row>

            <br/>

            <Row>
                <Col className="col-10">
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label id = "label">Api Secret: </Form.Label>
                            <div className="input-group mb-3">
                                <input id="SignUpInput" autocomplete="none" name="secret" value={props.secret} onChange={props.handleChange} type="password" className="form-control" placeholder="Password" />
                            </div>
                    </Form.Group>
                </Col>
            </Row>

            <br/>
            <br/>
            <br/>
        </div>

    )
}

export default Page2