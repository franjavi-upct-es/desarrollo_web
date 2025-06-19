import {
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import ManageUsers from './pages/Admin/ManageUsers';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import MyTasks from './pages/User/MyTasks';
import UserDashboard from './pages/User/UserDashboard';
import ViewTaksDetails from './pages/User/ViewTaksDetails';
import PrivateRoute from './routes/PrivateRoute';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/singUp' element={<SignUp />} />

          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path='/admin/dashboard' element={<Dashboard />} />
            <Route path='/admin/tasks' element={<ManageTasks />} />
            <Route path='/admin/create-task' element={<CreateTask />} />
            <Route path='/admin/users' element={<ManageUsers />} />
          </Route>

          {/* User Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path='/user/dashboard' element={<UserDashboard />} />
            <Route path='/user/my-tasks' element={<MyTasks />} />
            <Route path='/user/tasks-details/:id' element={<ViewTaksDetails />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
