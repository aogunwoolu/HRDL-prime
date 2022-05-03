import React, { useState, useEffect } from 'react';

import './App.css';

import axios from 'axios';
import {fetcher, putter, poster, deleter} from "../../utils/axios";
import { connect, useSelector } from "react-redux"
import {useNavigate , useLocation} from "react-router";
import authSlice from "../../redux/auth/auth.reducer";
import useSWR, { mutate } from 'swr';

import { CoinInfo, Social, Start } from "../../components/components"
import {RootState} from "../../redux/store"

import Lottie from 'react-lottie';
import * as animationData from '../loading.json';

const BACKEND_ROOT = `http://${window.location.hostname}:8000/`;

// root functional component (before HRDL component was functional itself)
const RootHRDL =(props)=>{
  const history = useNavigate() 
  const userId = props.user?.id;
  
  return <HRDL {...props} navigation={history} SWR = {useSWR}/> 
  
}

// main HRDL component
const HRDL =(props)=> {

  console.log(props.user);

  // states including SWR - stale-while-revalidate (for fetching data)
  const userId = props.user?.id;
  const user = useSWR(`user/${userId}/`, fetcher)
  var account = useSelector((state) => state.auth.account);
  const [loading, setLoading] = useState(true);

  const [coin, setCoin] = useState(0);

  const [botArray, setBotArray] = useState(account.tradingPairs);

  const [bot, setTradingBot] = useState(botArray[coin].botid);

  useSWR([`bot/${bot}/`, botArray[coin].active], putter, {revalidateOnFocus: false, shouldRetryOnError: true})

  // functions for updating states
  function handleClick() {
    console.log("handle trading "+botArray[coin].active);
    mutate([`bot/${bot}/`]).then(
      setBotArray(prevState => (Object.values({
          ...prevState,
          [coin]: {
            ...prevState[coin],
            active: !prevState[coin].active
          }
      })))
    )
  }

  var messagesEnd = null;

  // logout function
  const handleLogout = () => {
    props.logout();
    props.navigation("/");
  };

  // scroll to bottom functionality
  const scrollToBottom = () => {
    messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  // set loading state
  useEffect(() => {
    setLoading(false)
    scrollToBottom();
  }, [])
  
  // set lottie animation settings
  const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
  };

  // main return
  return (
    <div className="App">
      <div className="App-header">
        {
          // while not loading
          (!loading)? (
            <>
              {/* social section (for social media i.e. twitter) */}
              <Social 
                {...props}
                BotActive = {botArray[coin].active}
                Loading = {loading}
                coin = {coin}
                setCoin = {setCoin}
                handleLogout={handleLogout}
                setBot={handleClick}
                setBotId={setTradingBot}
                mutableBotArr={botArray}
              />
              {/* coin info section */}
              <CoinInfo 
                {...props}
                BotActive = {botArray[coin].active}
                Loading = {loading}
                coin = {coin}
                setCoin = {setCoin}
                handleLogout={handleLogout}
                setBot={handleClick}
                setBotId={setTradingBot}
                mutableBotArr={botArray}
              />
              {/* trading bot section */}
              <Start 
                {...props}
                BotActive = {botArray[coin].active}
                Loading = {loading}
                coin = {coin}
                setCoin = {setCoin}
                handleLogout={handleLogout}
                setBot={handleClick}
                setBotId={setTradingBot}
                mutableBotArr={botArray}
                setBotArr={setBotArray}
              />
            </>
          ) : (
            <>
              {/* lottie animated loading screen */}
              <Lottie className="loading" options={defaultOptions}
                height={400}
                width={400}
              />
            </>
          )
        }
        <div style={{ float:"left", clear: "both" }} ref={(el) => { messagesEnd = el; }}></div>
      </div>
    </div>
  );
}

// redux connect values to props
const mapStateToProps = state => {
  return {
    user: state.auth.account,
    rtoken: state.auth.refreshToken,
    token: state.auth.token,
  }
}

// redux connect actions to props
const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(authSlice.actions.logout()),
  }
}

// export connected HRDL component
export default connect(mapStateToProps,mapDispatchToProps)(RootHRDL)