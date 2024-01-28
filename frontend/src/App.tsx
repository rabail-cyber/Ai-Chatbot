import { Route, Routes } from "react-router-dom"
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Chat from "./pages/chat";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/signup";
import { useAuth } from "./context/AuthContext";

function App() {

  const auth=useAuth();
  return (
    <main>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        {auth?.isLoggedIn && auth.user &&  (
        <Route path="/chat" element={<Chat/>}/>
        )}
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </main>
    
  )
}

export default App
