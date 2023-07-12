import { Navbar } from "./Components/Navbar/Navbar";
import { Leaderboards } from "./Components/Leaderboards/Leaderboards";
import { AddPicture } from "./Components/AddPicture/AddPicture";
import { ViewYours } from "./Components/ViewYours/ViewYours";
import { Auth } from "./Components/Auth/Auth";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { useAuthStore } from "./Components/Auth/AuthStore";
import { observer } from "mobx-react";
import { PhotoStoreContextProvider } from "./Helpers/PhotoStore";
import { Main } from "./Components/Main/Main";

export const App = observer((): JSX.Element => {
  const AuthStore = useAuthStore();

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<Main />} />
        <Route path="leaderboards" element={<Leaderboards />} />
        <Route path="addpicture" element={<AddPicture />} />
        <Route path="viewyours" element={<ViewYours />} />
        {/* <Route path="signout" element={<MainWithContext />} /> */}
      </Route>
    )
  );

  if (!AuthStore?.isAuth) {
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
});

export function Root() {
  return (
    <PhotoStoreContextProvider>
      <Navbar />
      <div>
        <Outlet />
      </div>
    </PhotoStoreContextProvider>
  );
}
