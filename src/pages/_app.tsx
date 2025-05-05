import { AuthProvider } from "@/context/AuthContext";
import { persistor, store } from "@/store";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import type { AppProps } from "next/app";
import { Nunito } from "next/font/google";
import { Provider } from "react-redux";
import { Bounce, ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import "../styles/globals.css";

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
                position="bottom-center"
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
