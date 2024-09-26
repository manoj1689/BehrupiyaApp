/* eslint-disable @next/next/no-img-element */
"use client";
import React from 'react';
import Footer from "./components/footer";
import Header from "./components/header";
import Follower from "./components/follow";
import Pricing from "./components/pricing";
import Adver from "./components/Adver";
import Feature from "./components/Feature";
import Chatbot from "./components/Chatbot/Chatbot";
import { MyProvider } from './context/CreditContex'; // Adjust the import based on your file structure

export default function HomePage() {
  return (
    <MyProvider>
      <div>
        <Header />
        <Feature />
        <Chatbot />
        <Adver />
        <Follower />
        <Pricing />
        <Footer />
      </div>
    </MyProvider>
  );
}

