import React from "react";
import Link from "next/link";
import styles from "./page.module.css";

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ring of Fire</h1>
      <div className={styles.nav}>
        <Link href={"/standings/2025"}>Standings</Link>
      </div>
    </div>
  );
};

export default Home;
