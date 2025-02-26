import React from 'react';
import { createRoot } from 'react-dom/client';
import { Meteor } from 'meteor/meteor';
import { App } from '/imports/ui/App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

Meteor.startup(() => {
  const container = document.getElementById('react-target');
  const root = createRoot(container!);
  root.render(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/todo-list' element={<App />} />
        <Route path='/task' element={<App />} />
        <Route path='/profile' element={<App />} />
        <Route path='*' element={<App />} />
      </Routes>
    </BrowserRouter>
  );
});
