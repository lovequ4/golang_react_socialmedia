import './App.css';
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Login from './components/Login';
import Signup from './components/Signup';
import Posts from './components/Posts';
import PostDetails from './components/PostDetails';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/:username/:userId" element={<Posts />} />
          <Route path="/p/:postId" element={<PostDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
