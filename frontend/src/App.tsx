import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TasksPage from './pages/TasksPage';
import PrivateRoute from './components/PrivateRoute';
import Login from './Auth/pages/Login';
import Register from './Auth/pages/Register';
import './index.css';
import { useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import Root from './layouts/Root';

function App() {
  const { authState: {accessToken} } = useAuth();
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <Routes>
        <Route path="/" element = {accessToken
          ? <Navigate to = "/tasks" replace />
          : <Navigate to = "/login" replace /> }
        />
        <Route path = "/login" element = { <Login /> } />
        <Route path = "/register" element = { <Register /> } />
        <Route path = "/" element = { <Root/> }>
          <Route path = "/tasks" element  ={ <PrivateRoute><TasksPage /></PrivateRoute> }/>
        </Route>

        
        {/* You can add more protected routes the same way */}
      </Routes>
    </Router>
  );
}

export default App;
