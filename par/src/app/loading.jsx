'use client'
import styles from "./loading.module.css";
import Image from "next/image";
import Cat from "./Loader/cat.svg";
import Logo from "./Loader/font_logo.svg";

const Loader = ({ ...props }) => {
  return (
    <div className={styles.Loader} {...props}>
      <Image
        priority
        className={styles.Loader_logo}
        src={Cat}
        height={Cat.height}
        width={Cat.width}
        alt="logo"
      />
      <Image
        priority
        className={styles.Loader_label}
        src={Logo}
        height={Logo.height}
        width={Logo.width}
        alt="logo"
      />
    </div>
  );
};

export default Loader;
