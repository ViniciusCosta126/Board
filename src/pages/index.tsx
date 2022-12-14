import React, { useState } from "react";
import Head from "next/head";
import styles from "../styles/style.module.scss";
import firebase from "../services/firebaseConnection";
import { GetStaticProps } from "next";
import Image from 'next/image'
import boardUser from '../../public/images/board-user.svg'

type Data = {
  id: string;
  donate: boolean;
  lastDonate: Date;
  image: string;
};
interface HomeProps {
  data: string;
}
export default function Home({ data }: HomeProps) {
  const [donaters, setDonaters] = useState<Data[]>(JSON.parse(data));
  console.log(process.env.NEXTAUTH_URL)
  return (
    <>
      <Head>
        <title>Board - Organizando tarefas</title>
      </Head>
      <main className={styles.contentContainer}>
        <Image src={boardUser} alt=" ferramenta board" />
        <section className={styles.callToAction}>
          <h1>
            Uma ferramenta para seu dia a dia Escreva, planeje e organize-se..
          </h1>
          <p>
            <span>100% gratuita</span> e online.
          </p>
        </section>
        {donaters.length !== 0 && <h3>Apoiadores:</h3>}
        <div className={styles.donaters}>
          {donaters.map((donater) => (
          
              <Image width={65} height={65} src={donater.image} key={donater.image} alt="Doador" />
            
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const donaters = await firebase.firestore().collection("users").get();

  const data = JSON.stringify(
    donaters.docs.map((item) => {
      return {
        id: item.id,
        ...item.data(),
      };
    })
  );
  return {
    props: {
      data,
    },
    revalidate: 60 * 60,
  };
};
