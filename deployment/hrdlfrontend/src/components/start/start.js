import {Button} from 'react-bootstrap';
import React, { useState } from "react";
import { Row, Col, DropdownButton, Dropdown } from "react-bootstrap";

import { MdOutlineKeyboardArrowUp } from 'react-icons/md';
import { Profit } from './subcomponents/profit'
import { GiHamburgerMenu } from 'react-icons/gi'

const API_PATH = `http://${window.location.hostname}:8000/`;

// start main component
const Start =(props)=> {
    // the visuals
    return (
        <div className="mainscreen-component start">
            <Row className="justify-content-center">
                <MdOutlineKeyboardArrowUp className="up-arrow"/>
            </Row>
            <Row>
                <Col className='col-1 top-bar'>
                    <img src="HRDL_logo.png" alt="HRDL" width="100vw" height="70vh"></img>
                </Col>
                <Col className='top-bar'></Col>
                <Col className='col-1 top-bar'>
                    <GiHamburgerMenu className="hmbgr" onClick={props.handleLogout}/>
                </Col>
            </Row>
            <Row>  
                <Col className='col-9'>
                    <Row>
                        <Col>
                            <p class="text-left pad-text-l pronounced">Total Net Profit</p>
                            <p class="text-left pad-text-l pronounced gold-highlight">£-Net Profit-</p>
                        </Col>
                        <Col>
                            <p class="text-right pad-text-r">Bot Status</p>
                            <p class="text-right pad-text-r ultra-pronounced gold-highlight">{(props.mutableBotArr[props.coin].active)? 'ACTIVE':'INACTIVE'}</p>
                            <DropdownButton className="float-right coin-select" id="dropdown-basic-button" title={`${props.mutableBotArr[props.coin].name}/USDT`}>
                                {
                                    props.mutableBotArr.map((TP, i) => {
                                        return <Dropdown.Item onClick={() => {
                                            props.setCoin(i);
                                            props.setBotId(props.mutableBotArr[i].botid);
                                        }}>{TP.name}</Dropdown.Item>
                                    })
                                }
                            </DropdownButton>
                        </Col>
                    </Row>
                    <Row>
                        <Profit
                            height={document.documentElement.clientHeight}
                            width={document.documentElement.clientWidth}
                        />
                    </Row>
                    <Row>
                        <div id="centerOuter">
                            <Button id="HRDLTrading" variant="primary" onClick={()=>{props.setBot()}}>
                                {(props.BotActive)? 'STOP':"START"} TRADING
                            </Button>
                        </div>
                    </Row>
                    <br/>
                    <Row>
                        <Col>
                            <p>coin PNL: -PNL-</p>
                        </Col>
                        <Col>
                            <p>coin price: £-Price-</p>
                        </Col>
                        <Col>
                            <p>status: -Status-</p>
                        </Col>
                    </Row>
                </Col>
                <Col className='col-3'>
                    <div className="control-panel">
                        <h1>Hi {props.user.username}</h1>
                        <br/>
                        <p>Here's what you missed when you were gone</p>
                    </div>
                    <br/>
                    <div className="control-panel side-profit">
                        <Profit
                            profitHistory={JSON.parse(props.mutableBotArr[props.coin].history)}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    )
}

//exporting this function to be used in pages.js
export {Start}