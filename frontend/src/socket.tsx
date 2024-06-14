import { io } from 'socket.io-client';

const URL = `https://stone-paper-game-ten.vercel.app`;

export const socket = io(URL);