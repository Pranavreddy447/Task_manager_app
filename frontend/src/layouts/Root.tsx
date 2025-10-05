import React from 'react';
import NavBar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

const Root: React.FC = () => {
  // component implementation
  return (
	<div className=''>
	  {/* Root layout content */}
      <div>
        <NavBar/>
        <main className="m-[20px] outlet-component overflow-auto relative z-10">
          <Outlet />
        </main>
      </div>
	</div>
  );
};
export default Root;