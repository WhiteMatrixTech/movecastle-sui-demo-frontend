import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CastleDetailPage, CreateCastlePage, ProfilePage } from "@/pages";
import { AppLayout } from "@/components";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create-castle" element={<CreateCastlePage />} />
          <Route path="/castles/:id" element={<CastleDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
