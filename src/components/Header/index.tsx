import React from "react";
import styles from "./styles.module.scss";
import Link from "../../../node_modules/next/link";
import SigInButton from "../SignInButton/index";
import Image from "next/image";
import logo from '../../../public/images/logo.svg'
const Header = () => {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/">
          <a>
          <Image src={logo} alt="Logo meu board" />
          </a>
        </Link>
        <nav>
          <Link href="/">
            <a>Home</a>
          </Link>
          <Link href="/board">
            <a>Meu board</a>
          </Link>
        </nav>
        <SigInButton/>
      </div>
    </header>
  );
};

export default Header;
