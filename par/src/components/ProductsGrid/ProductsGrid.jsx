"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import style from "./ProductsGrid.module.css";
import ProductsCard from "./ProductsCard";
import { useInView } from "react-intersection-observer";
import { CardContext } from "@/context/CardContext";

function ProductsGrid(props) {
  const { sortValue } = useContext(CardContext);
  const [prod, setProd] = useState([]);
  const [offset, setOffset] = useState(10);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    fetch(`/api/products?tab=${props.activeLink}&offset=0&sort=${sortValue}`)
      .then((res) => res.json())
      .then((res) => setProd([...res.data.rows]))
      .finally(setProd([]), setOffset(10));
  }, [props.activeLink, sortValue]);

  useEffect(() => {
    if (props.activePath != undefined) {
      fetch(`/api/products?path=${props.activePath}&offset=0&sort=${sortValue}`)
        .then((res) => res.json())
        .then((res) => setProd([...res.data.rows]))
        .finally(setProd([]), setOffset(10));
    }
  }, [props.activePath, sortValue]);

  useEffect(() => {
    if (inView === true) {
      if (props.activePath != undefined) {
        fetch(
          `/api/products?path=${props.activePath}&offset=${offset}&sort=${sortValue}`
        )
          .then((res) => res.json())
          .then((res) => setProd([...prod, ...res.data.rows]))
          .finally(setOffset((offset) => offset + 10));
      } else
        fetch(
          `/api/products?tab=${props.activeLink}&offset=${offset}&sort=${sortValue}`
        )
          .then((res) => res.json())
          .then((res) => setProd([...prod, ...res.data.rows]))
          .finally(setOffset((offset) => offset + 10));
    }
  }, [inView]);

  return prod != "" ? (
    <div className={style.ProductsGrid}>
      {prod.map((products, index) => (
        <ProductsCard
          priority={
            index === prod.length - 10 ||
            index === prod.length - 9 ||
            index === prod.length - 8 ||
            index === prod.length - 7
              ? true
              : false
          }
          refs={index === prod.length - 4 ? ref : null}
          id={products.id}
          key={products.id}
          name={products.name}
          price={products.salePrices && products.salePrices[0].value / 100}
          img={
            products.images?.meta.size == 1 &&
            `/images/photos/${products.pathName}/${products.id}.png`
          }
          stock={products.stock}
          stockDays={products.createTime && products.createTime}
          miniature={
            products.images?.meta.size == 1
              ? products.images.rows[0].miniature?.downloadHref
              : "#"
          }
        />
      ))}
    </div>
  ) : (
    <div style={{ textAlign: "center" }}>
      <div className={style.Loader}></div>
    </div>
  );
}

export default ProductsGrid;
