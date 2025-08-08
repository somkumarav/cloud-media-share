import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

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
        className={`${outfit.className} antialiased min-h-screen flex flex-col `}
      >
        <main className='flex-1 mx-5 md:mx-10'>{children}</main>
      </body>
    </html>
  );
}
