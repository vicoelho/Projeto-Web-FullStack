import logo from './logo.svg';
import './App.css';
import Cadastro from './Discord/Cadastro'
import Discord from './Discord/Discord'
import Logado from './Discord/Logado'
import {Routes, Route, Link} from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Discord/>}/>
      <Route path='/cadastro' element={<Cadastro/>}/>
      <Route path='/logado' element={<Logado/>}/>
    </Routes>
  );
}

/*function App() {
  return (
    <div className="App">
      <Cadastro />
    </div>
  );
}*/

export default App;
