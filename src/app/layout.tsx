import type { Metadata } from "next";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import { Nunito } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import { Bounce, ToastContainer } from "react-toastify";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ['200', '400', '700'],
  display: "swap",
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "vitalFlow",
  description: "Inventory Management System powered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={nunito.className}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"
        />
      </head>
      <body>
        <Theme accentColor="green" grayColor="sage" radius="medium" scaling="95%" appearance="dark" >
          {children}
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
      </body>
    </html>
  );
}
