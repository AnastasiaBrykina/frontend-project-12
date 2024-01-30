import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes';

export const addMessage = createAsyncThunk(
  'addMessage',
  async ({ newMessage, headers }) => {
    const res = await axios.post(routes.addMessage(), newMessage, {
      headers,
    });

    return res.data;
  }
);

export const loadMessages = createAsyncThunk(
  'loadMessages',
  async (headers) => {
    const res = await axios.get(routes.messages(), {
      headers,
    });

    return res.data;
  }
);

const initialState = {
  messages: [],
  status: 'initial',
  error: null,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    loadNewMessage: (state, { payload }) => {
      state.messages.push(payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addMessage.pending, (state) => {
        state.status = 'sending';
        state.error = null;
      })
      .addCase(addMessage.fulfilled, (state) => {
        state.status = 'finished';
        state.error = null;
      })
      .addCase(addMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      })
      .addCase(loadMessages.fulfilled, (state, { payload }) => {
        state.messages = payload;
        state.status = 'finished';
        state.error = null;
      })
      .addCase(loadMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      });
  },
});

export const { loadNewMessage } = messagesSlice.actions;

// export const createMySockedMiddleware = (store) => (next) => (action) => {
//   console.log('action');

//   // socket.on('newMessage', (payload) => {
//   //   console.log(payload);
//   //   store.dispatch(messagesSlice.actions.loadNewMessage(payload));
//   //   // => { body: "new message", channelId: 7, id: 8, username: "admin" }
//   // });

//   return next(action);
// };

export default messagesSlice.reducer;
