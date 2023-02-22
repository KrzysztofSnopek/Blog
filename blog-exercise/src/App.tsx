import { Navbar } from "./Components/Navbar/Navbar";
import { Main } from "./Components/Main/Main";
import { Leaderboards } from "./Components/Leaderboards/Leaderboards";
import { AddPicture } from "./Components/AddPicture/AddPicture";
import { ViewYours } from "./Components/ViewYours/ViewYours";
import { Authentication } from "./Components/Auth/Authentication";
import { Auth } from "./Components/Auth/Auth";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { useState } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export interface CookiesData {
  name: string;
  options?: object;
}

export function App(): JSX.Element {
  const [isAuth, setIsAuth] = useState<boolean>(!!cookies.get("auth-token"));

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<Main />} />
        <Route path="leaderboards" element={<Leaderboards />} />
        <Route path="addpicture" element={<AddPicture />} />
        <Route path="viewyours" element={<ViewYours />} />
        <Route path="signin" element={<Authentication />} />
      </Route>
    )
  );

  if (!isAuth) {
    return (
      <div>
        <Auth setIsAuth={setIsAuth} />
        {/* extract Auth as Context */}
      </div>
    );
  }

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export function Root() {
  return (
    <>
      <Navbar />
      <div>
        <Outlet />
      </div>
    </>
  );
}
