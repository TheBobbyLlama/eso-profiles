import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './screens/Main/Main';
import Browse from './screens/Browse/Browse';
import ViewProfile from './screens/ViewProfile/ViewProfile';

import ModalManager from './screens/ModalManager/ModalManager';

import { getUrlBase } from './util';

import './App.css';

function App() {
  return (
    <>
      <BrowserRouter basename={getUrlBase()}>
        <Routes>
          <Route path="/" element={<Main />}>
            <Route index element={<Browse />}></Route>
            <Route path="view/:characterName" element={<ViewProfile />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <ModalManager />
    </>
  );
}

export default App;
