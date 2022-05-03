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
const Page3 =(props)=> {

    const classes = useStyles();

    // define states
    const [tradingPairs, setTradingPairs] = useState([]);
    const [selectedPairs, setSelectedPairs] = useState([]);

    // get exchanges from backend /get-exchanges
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

    // set selected pairs
    const pairInit = () => {
        setSelectedPairs([...props.currencies])
    }

    useEffect(() => {
        getExchanges();
        pairInit();
    },[]);

    // add pair to selected pairs
    const addPair = pair => {
        const { id, fullNamePair } = pair;
        if (!selectedPairs.some(pair => pair.id === id)){
            setSelectedPairs([...selectedPairs, {id, fullNamePair}]);
            props.handleChange({'target':{'name': 'currencies', 'value': [...props.currencies, {id, fullNamePair}]}});
        }
        else{
            // remove pair from selected pairs
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

            <div className="scrollmenu">
                {selectedPairs.map((item,index)=>{
                    return (
                        <div>
                            {item.fullNamePair}
                        </div>
                    )
                })}
            </div>
            
            <div className="scroll">
                <div className="sleeve">
                    {tradingPairs.map((item,index)=>{
                        return (
                            <div onClick={() => addPair(item)}>
                                <p><strong>{item.fullNamePair}</strong></p>
                            </div>
                        )
                    })}
                </div>
            </div>

            <br/>
        </div>

    )
}

export default Page3