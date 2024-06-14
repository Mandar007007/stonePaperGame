import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import Home from './components/Home'
import LoadScreen from './components/LoadScreen';
import GameScreen from './components/GameScreen';
import { socket } from './socket';

function App() {

  socket.on('connect', () => {
    console.log(`Connected: ${socket.id}`);
  });
  
  socket.on('disconnect', (reason) => {
    console.log(`Disconnected: ${reason}`);
  });
  
  socket.on('connect_error', (error) => {
    console.error(`Connect error: ${error}`);
  });
  
  socket.on('error', (error) => {
    console.error(`Socket error: ${error}`);
  });
  

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/loading' element={<LoadScreen />} />
        <Route path='/game' element={<GameScreen />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
