import React from "react";
import LayoutMain from "@/components/layoutMain/LayoutMain";
import Banner from "@/components/Banner/Banner";
import RootLayout from "../layout";
import ProductsLayout from "@/components/ProductsLayout/ProductsLayout";
import Header from "@/components/header/header";
import CartCard from "@/components/CartCard/CartCard";
import Loader from "@/components/Loader/loading";
import { SideBarProvider } from "@/context/SideBarContext";
const Main = () => {
  return (
      <SideBarProvider>
        <LayoutMain>
          <Header />
          <Banner />
          <ProductsLayout />
          <CartCard />
        </LayoutMain>
      </SideBarProvider>
  );
};

export default Main;
