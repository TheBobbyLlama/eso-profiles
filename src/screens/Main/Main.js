import { Outlet } from 'react-router-dom';

import AuthHeader from '../../components/AuthHeader/AuthHeader';

function Main() {
  return (
    <>
      <AuthHeader />
      <Outlet />
    </>
  );
}

export default Main;
