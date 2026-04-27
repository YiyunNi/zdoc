import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Costs from './pages/Costs';

export default function App(): React.ReactElement {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/costs" element={<Costs />} />
      </Route>
    </Routes>
  );
}
