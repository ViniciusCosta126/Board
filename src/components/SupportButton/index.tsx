import React from "react";
import Link from "../../../node_modules/next/link";
import styles from "./style.module.scss";
const SupportButton = () => {
  return (
    <div className={styles.donateContainer}>
      <Link href="/donate">
        <button>Apoiar</button>
      </Link>
    </div>
  );
};

export default SupportButton;
