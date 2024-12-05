import ContextProvider from "@/context";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }: AppProps) {
  // Cookies podem ser lidos no cliente usando document.cookie
  const cookies = typeof window !== "undefined" ? document.cookie : "";

  return (
    <ContextProvider cookies={cookies}>
      <Component {...pageProps} />
      <ToastContainer />
    </ContextProvider>
  );
}
