import NextAuth from "next-auth";

import GithubProvider from "next-auth/providers/github";
import firebase from "../../../services/firebaseConnection";
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async session({ session, user, token }) {
      try {
        const lastDonate = await firebase
          .firestore()
          .collection("users")
          .doc(token.sub)
          .get()
          .then((snapshot) => {
            if (snapshot.exists) {
              return snapshot.data().lastDonate.toDate();
            } else {
              return null;
            }
          });
        return {
          ...session,
          id: token.sub,
          vip: lastDonate ? true : false,
          lastDonate: lastDonate
        };
      } catch (error) {
        return {
          ...session,
          id: null,
          vip:false,
          lastDonate:null
        };
      }
    },
    async signIn({ user, account, profile }) {
      const { email } = user;
      try {
        return true;
      } catch (error) {
        console.log("Deu erro: ", error);
        return false;
      }
    },
  },
};
export default NextAuth(authOptions);
