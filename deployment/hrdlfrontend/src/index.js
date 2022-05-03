import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux';
import store, { persistor } from './redux/store';
import { PersistGate } from "redux-persist/integration/react";

import { useNavigate } from "react-router-dom";
import { Route, Routes , BrowserRouter as Router} from "react-router-dom";
import { StartPage, HRDL, Register} from "./pages";

// global page
// allows access to Redux store

// initial route is login (alias: startPage)
// other pages are not on main page
ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <Router>
        <Routes>
          <Route exact path="/" element={<StartPage/>}/>
          <Route exact path="/mainPage" element={<HRDL/>}/>
          <Route exact path="/Register" element={<Register/>}/>
        </Routes>
      </Router>
    </PersistGate>
  </Provider>,

  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
