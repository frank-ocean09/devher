import About from "@/components/Home/About";
import { Contact } from "@/components/Home/Contact";
import { DigitalHubCTA } from "@/components/Home/DigitalHubCTA";
import { Gallery } from "@/components/Home/Gallery";
import Hero from "@/components/Home/Hero";
import { Impact } from "@/components/Home/Impact";
import { Partner } from "@/components/Home/Partner";
import Programs from "@/components/Home/Programs";
import Footer from "@/components/Utils/Footer";
import Navbar from "@/components/Utils/Navbar";
const Home = () =>{
    return(

        <>
        <Navbar/>
        <Hero/>
        <About/>
        <Programs/>
        <DigitalHubCTA/>
        <Impact/>
        <Partner/>
        <Gallery />
        <Contact/> 
        <Footer/>
        </>




    )



}

export default Home;