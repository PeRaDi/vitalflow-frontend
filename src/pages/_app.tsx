import type { AppProps } from "next/app";
import { Bounce, ToastContainer } from "react-toastify";
import { Nunito } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import "../styles/globals.css";
import "@radix-ui/themes/styles.css";
import { AuthProvider } from "@/context/AuthContext";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/store";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["200", "400", "700"],
  display: "swap",
  variable: "--font-nunito",
});

export default function RootLayout({ Component, pageProps }: AppProps) {
  return (
    <main className={nunito.className}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AuthProvider>
            <Theme
              accentColor="green"
              grayColor="sage"
              radius="medium"
              scaling="95%"
              appearance="dark"
            >
              <Component {...pageProps} />
              <ToastContainer
                position="bottom-right"
                autoClose={5000}
                closeButton={false}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                theme="dark"
                transition={Bounce}
              />
            </Theme>
          </AuthProvider>
        </PersistGate>
      </Provider>
    </main>
  );
}
