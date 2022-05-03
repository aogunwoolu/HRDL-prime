import {Button, Form, Col, Row, Image, Container, Table, Nav, NavDropdown,Navbar} from 'react-bootstrap';
import React, { useState, useEffect  } from "react";
import TextField from '@mui/material/TextField';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputAdornment from '@mui/material/InputAdornment';
import Slider from '@mui/material/Slider';
import FormControl from '@mui/material/FormControl';
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

import { default as Page4Slider } from './page4slider'

const BACKEND_ROOT = `http://${window.location.hostname}:8000/`

// slider styling
const CustomSlider = withStyles({
    root: {
        color: "#fff",
        height: 5,
        padding: "13px 0px",
        width: '100%',
    },
    track: {
        height: 5,
        borderRadius: 2,
        width: '100%',
        backgroundColor: "#fff",
    },
    thumb: {
        height: 10,
        width: 10,
        backgroundColor: "#fff",
        border: "1px solid currentColor",
        boxShadow: "#ebebeb 0 2px 2px",
        "&:focus, &:hover, &$active": {
            boxShadow: "#ccc 0 2px 3px 1px",
        },
        color: "#fff",
    },
})(Slider);

// main component
const Page4 =(props)=> {

    const [tradingPairs, setTradingPairs] = useState([]);
    const [selectedPairs, setSelectedPairs] = useState([]);

    const getExchanges = async() => {
		axios({
            method: 'GET',
            url: `${BACKEND_ROOT}api/currencies/`,
            headers: {'content-type':'application'},
        })
        .then(result => {
            setTradingPairs([
                ...result.data
            ])
        })
        .catch(error => console.log({ error: error.message }));
	}

    const pairInit = () => {
        setSelectedPairs([...props.currencies])
    }

    useEffect(() => {
        getExchanges();
        pairInit();
    },[]);

    const addPair = pair => {
        const { id, fullNamePair } = pair;
        if (!selectedPairs.some(pair => pair.id === id)){
            setSelectedPairs([...selectedPairs, {id, fullNamePair}]);
            props.handleChange({'target':{'name': 'currencies', 'value': [...props.currencies, {id, fullNamePair}]}});
        }
        else{
            setSelectedPairs(selectedPairs.filter(
                (pair) => {
                    return pair.id !== id 
                }
            ));
            props.handleChange({'target':{'name': 'currencies', 'value': selectedPairs.filter(
                (pair) => {
                    return pair.id !== id 
                }
            )}});
        }
    };

    //the visuals
    return (
        <div className='page3'>
            <Row>
                <h3 className='title s-text-center'>{props.step.title}</h3>
            </Row>
            <Row>
                <p className='info s-text-center'>{props.step.info}</p>
            </Row>
            <Row>
                <p className='sub-info'>{props.step['sub-info']}</p>
            </Row>

            <Row>
                <Col>
                    <Form.Label id = "label">Stop Loss: </Form.Label>
                    <CustomSlider name="stop-loss" aria-label="Volume" value={props['stop-loss']} onChange={props.handleChange} />
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Label id = "label">Take profit: </Form.Label>
                    <CustomSlider name="take-profit" aria-label="Volume" value={props['take-profit']} onChange={props.handleChange} />
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Label id = "label">available amount to invest: </Form.Label>
                    <CustomSlider name="amount-to-invest" aria-label="Volume" value={props['amount-to-invest']} onChange={props.handleChange} />
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Label id = "label">available amount to invest: </Form.Label>
                    <Page4Slider
                        currencies={props.currencies}
                        widths={props.widths}
                        available={props['amount-to-invest']}
                        setWidths={props.setWidths}
                    />
                </Col>
            </Row>
            <br/>
        </div>

    )
}

export default Page4