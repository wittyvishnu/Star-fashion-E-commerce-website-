import React, { useEffect, useState } from 'react';
import Nav from "../../Components/Nav";
import Footter from '../../Components/Footter';
import Showcase from './HeroSection';
import Products from './Gender';
import Services from './Categories';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase.config';

function Home() {
  return (
    <div className="bg-gradient-to-b from-blue-100 to-blue-50">
      <Showcase />
      <Products />
      <Services />
      <Footter />
    </div>
  );
}

export default Home;
