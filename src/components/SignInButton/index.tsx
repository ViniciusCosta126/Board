import React from "react";
import styles from "./styles.module.scss";
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { useSession, signIn, signOut } from "next-auth/react"
import Image from 'next/image'
const SigInButton = () => {
  const {data:session} = useSession()
  return session ? (
    <button type="button" className={styles.signInButton} onClick={() => signOut()}>
      {" "}
      <div><Image objectFit="fill" src={session.user.image} width={35} height={35} alt="foto usuario" /></div>
       Ola {session.user.name} <FiX color="#737380"  className={styles.closeItem}/>
    </button>
  ) : (
    <button type="button" className={styles.signInButton} onClick={() => signIn('github')}>
      {" "}
      <FaGithub color="#ffb800" /> Entrar com GitHub
    </button>
  );
};

export default SigInButton;
