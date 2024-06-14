import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import Home from './components/Home'
import LoadScreen from './components/LoadScreen';
import GameScreen from './components/GameScreen';

function App() {

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
