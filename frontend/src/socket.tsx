import { io } from 'socket.io-client';

// URL of your backend server
const URL = 'https://stone-paper-game-ten.vercel.app';



// Initialize the socket connection with the URL and options
export const socket = io(URL);
