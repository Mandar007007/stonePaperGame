import { io } from 'socket.io-client';

const URL = `${window.location.protocol}`;

export const socket = io(URL);