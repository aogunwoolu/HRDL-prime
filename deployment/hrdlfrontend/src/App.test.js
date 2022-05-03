import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
//setupTests.js
import 'jest-canvas-mock';
import { StartPage, HRDL, Register} from "./pages";

import { Provider } from 'react-redux';
import store, { persistor } from './redux/store';
import { PersistGate } from "redux-persist/integration/react";
import { Route, Routes , BrowserRouter as Router} from "react-router-dom";

// https://testing-library.com/docs/react-testing-library/example-intro/

test('renders login page', () => {
  render(
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <Router>
          <Routes>
            <Route exact path="/" element={<StartPage/>}/>
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
  const element = screen.getAllByText(/Login/i);
  expect(element[0]).toBeInTheDocument();
});

test('renders register page', () => {
  render(
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <Router>
          <Routes>
            <Route exact path="/" element={<Register/>}/>
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
  const element = screen.getAllByText(/Enter your personal information so HRDL can know you a little bit better/i);
  expect(element[0]).toBeInTheDocument();
});
