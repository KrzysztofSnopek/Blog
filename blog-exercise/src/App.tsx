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
import { useContext } from "react";
import { AuthStoreContext } from "./Components/Auth/AuthStore";
import { observer } from "mobx-react";

function App(): JSX.Element {
  const AuthStore = useContext(AuthStoreContext);
  const cookies = AuthStore.cookie;

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

  if (!AuthStore.isAuth) {
    return (
      <div>
        <Auth />
      </div>
    );
  }

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default observer(App);

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
