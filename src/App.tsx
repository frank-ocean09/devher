import About from "./components/Home/About"
import { Contact } from "./components/Home/Contact"
import { DigitalHubCTA } from "./components/Home/DigitalHubCTA"
import { Gallery } from "./components/Home/Gallery"
import { Impact } from "./components/Home/Impact"
import { Partner } from "./components/Home/Partner"
import Programs from "./components/Home/Programs"
import Coding from "./Pages/DigitalHub/Coding"
import Design from "./Pages/DigitalHub/Design"
import Digitalhub from "./Pages/DigitalHub/Digitalhub"
import Electronics from "./Pages/DigitalHub/Electronics"
import Pitch from "./Pages/DigitalHub/Pitch"
import Home from "./Pages/Home/Home"
import { Route, Routes } from "react-router-dom"
function App() {

  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/about" element={<About/>}/>
       <Route path="/Programs" element={<Programs/>}/>
       <Route path="/DigitalHubCTA" element={<DigitalHubCTA/>}/>
       <Route path="/Impact" element={<Impact/>}/>
       <Route path="/Partner" element={<Partner/>}/>
       <Route path="/Gallery" element={<Gallery/>}/>
       <Route path="/Contact" element={<Contact/>}/>
       <Route path="/digitalhub" element={<Digitalhub/>}/>
       <Route path="/digital-hub/electronics" element={<Electronics/>}/>
       <Route path="/digital-hub/coding" element={<Coding/>}/>
       <Route path="/digital-hub/Design" element={<Design/>}/>
       <Route path="/digital-hub/Pitch" element={<Pitch/>}/>
        </Routes>
  )
}

export default App
