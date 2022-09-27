
import { AppProps } from "../../node_modules/next/app"
import '../styles/global.scss'
import Header from "../components/Header/index"
import { SessionProvider } from "next-auth/react"

import {PayPalScriptProvider} from '@paypal/react-paypal-js'

const initialOptions = {
  'client-id':"ATICwZZcjJEymalUjgL25K44W4yEFCxWB-b6xy4YQrjM91W9nrN_Ng3NG8QyB_y-VKOFFHI14adwAPKU",
  currency:"BRL",
  intent:"capture"
}

function MyApp({ Component, pageProps }:AppProps) {
  return (
    <>
    <SessionProvider session={pageProps.session}>
    <PayPalScriptProvider options={initialOptions}>
      <Header/>
      <Component {...pageProps} />
    </PayPalScriptProvider>
    </SessionProvider>
    </>
  )
}

export default MyApp
