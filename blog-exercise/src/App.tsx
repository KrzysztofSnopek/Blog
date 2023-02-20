import { Navbar } from "./Components/Navbar/Navbar";
import { Main } from "./Components/Main/Main";
import { Leaderboards } from "./Components/Leaderboards/Leaderboards";
import { AddPicture } from "./Components/AddPicture/AddPicture";
import { ViewYours } from "./Components/ViewYours/ViewYours";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Link,
  Outlet,
  RouterProvider,
} from "react-router-dom";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<Main />} />
        <Route path="leaderboards" element={<Leaderboards />} />
        <Route path="addpicture" element={<AddPicture />} />
        <Route path="viewyours" element={<ViewYours />} />
      </Route>
    )
  );

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
