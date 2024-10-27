import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/src/components/nav-bar";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Cloud media share",
  description:
    "About A web app to share photos and videos with other people through links. Created with love by somu 😶‍🌫️",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${outfit.className} antialiased mx-10 min-h-screen flex flex-col `}
      >
        <NavBar />
        <main className='flex-1'>{children}</main>
      </body>
    </html>
  );
}
