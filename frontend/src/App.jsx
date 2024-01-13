import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {BrowserRouter as Router , Routes , Route}  from "react-router-dom";
import Landing from "./pages/Landing"
import Room from './pages/Room';
import {SocketProvider} from "./providers/Socket"
import { PeerProvider } from './providers/Peer';

function App() {

  return (
    <div>
      <Router>
        <PeerProvider>
          <SocketProvider>
            <Routes>
              <Route exact path="/" element={<Landing/>}/>
              <Route exact path="/room/:roomId" element={<Room/>}></Route>
            </Routes>
          </SocketProvider>
        </PeerProvider>
      </Router>
    </div>
  )
}

export default App
