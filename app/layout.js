import { Newsreader } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import LenisProvider from "./components/LenisProvider";
import Header from './components/SiteHeader';
import Footer from './components/SiteFooter';

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const aspekta = localFont({
  variable: "--font-aspekta",
  src: [
    { path: "./fonts/Aspekta-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Aspekta-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Aspekta-700.woff2", weight: "700", style: "normal" },
  ],
});

export const metadata = {
  title: "SimplePlan Media | Award-Winning Branding &amp; Design Agency",
  description: "We build brands that stands the test of time - From Branding, Web Design and Development to Marketing, we do it all!",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${aspekta.variable} ${newsreader.variable}`}
    >
      <body>
        <Header />
        <LenisProvider><main>{children}</main></LenisProvider>
        <Footer/>
      </body>
    </html>
  );
}
