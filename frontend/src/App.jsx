import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicSite from "./pages/PublicSite.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicSite />} />
        {/*  Endpoint dédié à l'administration — aucun lien n'y mène depuis le site public.
             Pour le rendre encore plus discret, renomme simplement "admin" ci-dessous
             (ex. "/gestion-x9k2") — c'est la seule ligne à changer.  */}
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
