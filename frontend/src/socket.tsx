import { io } from 'socket.io-client';

const URL = `stone-paper-game-dusky.vercel.app`;

export const socket = io(URL);