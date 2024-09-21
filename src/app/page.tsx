/* eslint-disable @next/next/no-img-element */
"use client";

import Footer from "./components/footer";
import Header from "./components/header";
import Follower from "./components/follow";
import Pricing from "./components/pricing";
import Adver from "./components/Adver";
import Feature from "./components/Feature";

export default function HomePage() {
  return (
    <>
      <div>
        <Header />

        <Feature />

        <Adver />

        <Follower />

        <Pricing />

        <Footer />
      </div>
    </>
  );
}
