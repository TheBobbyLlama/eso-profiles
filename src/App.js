import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './screens/Main/Main';
import Browse from './screens/Browse/Browse';

import './App.css';

function App() {
  return (
    // TODO - basename will need to be changed for deployment???
    <BrowserRouter basename="/eso-profiles">
      <Routes>
        <Route path="/" element={<Main />}>
          <Route path="/" element={<Browse />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
