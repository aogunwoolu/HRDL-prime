import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toggleBot } from './auth.actions';


const initialState: State = { token: null, refreshToken: null, account: null };

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      setAuthTokens(state: State,action: PayloadAction) {
        console.log(action.payload)

        state.refreshToken = action.payload.refreshToken;
        state.token = action.payload.token;
      },
      setAccount(state: State, action: PayloadAction) {
        action.payload.tradingPairs.forEach(function(pair, index, arr) {
          arr[index] = JSON.parse(pair.primaryinfo);
          arr[index].writable = true;
        });
        state.account = action.payload;
      },
      logout(state: State) {
        state.account = null;
        state.refreshToken = null;
        state.token = null;
      },
    },
  });

export default authSlice;