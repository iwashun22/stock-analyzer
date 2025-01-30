import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './pages/Home';
import Analyzer from './pages/Analyzer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/analyzer' element={<Analyzer/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
