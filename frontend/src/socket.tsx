import { io } from 'socket.io-client';

// URL of your backend server
// const URL = 'https://stone-paper-game-ten.vercel.app';
const URL = "https://stonepapergameback.onrender.com"

// Configuration object for the socket connection
const options = {
  transports: ['websocket', 'polling'], // Specify the transport methods
  withCredentials: true, // If you need to send cookies or auth headers
};

// Initialize the socket connection with the URL and options
export const socket = io(URL, options);
