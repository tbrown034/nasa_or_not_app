import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./UI/Header";
import Footer from "./UI/Footer";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NASA or Not",
  description:
    "An app challenging users to identify the real NASA Picture of the Day and spot the AI-generated imposter. Developed by Trevor Brown",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} p-4 flex flex-col min-h-screen bg-gradient-to-b from-black via-gray-900 to-blue-900 text-white`}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
