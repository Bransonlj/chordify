import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import Root from './routes/root';
import ErrorPage from './error-page';
import SongDetails, { songDetailsLoader } from './pages/songs/song-details';
import SongList, { songListLoader } from './pages/songs/SongList';
import SongError from './pages/songs/song-error';
import SongRoute from './routes/song-route';
import About from './pages/about/about';
import SongForm, { SongFormAction } from './pages/songs/SongForm';

const router = createBrowserRouter(
  createRoutesFromElements(
  <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
    <Route path="songs" element={<SongRoute />} errorElement={<SongError />}>
      <Route path="list" element={<SongList />} loader={ songListLoader }></Route>
      <Route path="create" element={<SongForm />} action={ SongFormAction }></Route> 
      <Route path=":id" element={<SongDetails />} loader={ songDetailsLoader } ></Route>
      <Route path="edit/:id" element={ <SongForm /> } loader={ songDetailsLoader }  action={ SongFormAction }></Route>
    </Route>

    <Route path="about" element={<About />}></Route>

  </Route>
  )
)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
