"use client";
import Link from "next/link";
import style from "./SearchPanel.module.css";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState } from "react";
import ProductsCard from "../ProductsGrid/ProductsCard";
export const SearchPanel = () => {
  const [prod, setProd] = useState([]);
  const [offset, setOffset] = useState(10);
  const [goSearch, setGoSearch] = useState(0);
  const find = useRef();

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (find.current.value == "") {
      setProd([]);
    }
    fetch(`/api/products?find=${find.current.value}&offset=0`)
      .then((res) => res.json())
      .then((res) => {
        if (res.data != undefined) {
          console.log(res);
          setProd([...res.data.rows]);
        }
      })
      .finally(setProd([]), setOffset(10));
  }, [goSearch]);

  useEffect(() => {
    console.log(prod);
  }, [prod]);

  useEffect(() => {
    console.log(inView);
    if (inView === true) {
      fetch(`/api/products?find=${find.current.value}&offset=${offset}`)
        .then((res) => res.json())
        .then((res) => setProd([...prod, ...res.data.rows]))
        .finally(setOffset((offset) => offset + 10));
    }
  }, [inView]);

  return (
    <>
      <div className={style.Header}>
        <Link className={style.ButtonBack} href="/">
          <i className="ic_Arrow---Left-2" />
        </Link>
        <div className={style.inputContain}>
          <i className="ic_Search" />
          <input
            onChange={() => setGoSearch((goSearch) => goSearch + 1)}
            ref={find}
            placeholder="Поиск..."
          />
          <button
            style={
              find.current != undefined
                ? find.current.value == ""
                  ? { display: "none" }
                  : { display: "block" }
                : { display: "none" }
            }
            onClick={() => {
              setProd([]), (find.current.value = "");
            }}
            className={style.inputButtonClear}
          >
            <i className="ic_Arrow-Close-Circle" />
          </button>
        </div>
      </div>

      <div className={style.ProductsGrid}>
        {prod != [""] &&
          prod.map((products, index) => (
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
              miniature={
                products.images?.meta.size == 1
                  ? products.images.rows[0].miniature?.downloadHref
                  : "#"
              }
              stockDays={products.createTime && products.createTime}
            />
          ))}
      </div>
    </>
  );
};
