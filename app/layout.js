import localFont from "next/font/local";
import "./globals.css";
import "./custom.css";
import "./responsive.css";
import LenisProvider from "./components/LenisProvider";
import Header from './components/SiteHeader';
import Footer from './components/SiteFooter';

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
      className={`${aspekta.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <Header />
        <LenisProvider><main>{children}</main></LenisProvider>  
        <Footer/>
      </body>
    </html>
  );
}
