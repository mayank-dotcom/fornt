import React from 'react';
import MAINAttendance from './components/MAINAttendance.jsx'
import Signin from './components/Signin.jsx'
import Admintable from './components/Admintable.jsx';
import ProtectedRoute from './components/ProtetctedRoute.jsx';
import Insert from './components/Insert.jsx';
import { BrowserRouter, Routes , Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/log" element={<Signin />} />
        <Route path="/MAINAttendance" element={<MAINAttendance />} />
        <Route
          path="/Admin"
          element={
            <ProtectedRoute>
              <Admintable />

            </ProtectedRoute>
          }
        />
                      <Route path="/Insert" element={<Insert/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
