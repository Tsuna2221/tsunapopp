import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? "https://tsunapop-0add06afd0c3.herokuapp.com/" : "http://localhost:5000"

export const socket = io(URL as string, {
  autoConnect: false
});