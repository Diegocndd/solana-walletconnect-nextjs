import { initialConfig } from "@/config";
import ContextProvider from "@/context";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

initialConfig();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ContextProvider>
      <Component {...pageProps} />
      <ToastContainer />
    </ContextProvider>
  );
}
