import "./globals.css";
import type { Metadata } from "next";
import { Inter, Mulish } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ToastProvider } from "@/components/toast-provider";
import { ToastContainer } from "@/components/toast-container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hindustan Olympiad",
  description: "Get ready for Hindustan Olympiad 2024! Register now and explore the syllabus, exam dates, and more.",
  keywords: [
    "Hindustan Olympiad",
    "Hindustan Olympiad 2024",
    "Hindustan Olympiad syllabus",
    "Hindustan Olympiad exam dates",
    "Hindustan Olympiad registration",
    "Hindustan Olympiad results",
    "Hindustan Olympiad online",
  ],
  authors: [{ name: "Vaibhav Khating" }],
  openGraph: {
    title: "Hindustan Olympiad – Ignite your competitive spirit!",
    description:
      "",
    url: "https://hindustanolympiad.in",
    siteName: "Hindustan Olympiad",
    images: [
      {
        url: "https://www.hindustanolympiad.in/wp-content/uploads/2024/07/cropped-Hindustan-Olympiad-logo_final-1.png",
        width: 1200,
        height: 630,
        alt: "Hindustan Olympiad – Ignite your competitive spirit!",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hindustan Olympiad – Ignite your competitive spirit!",
    description:
      "",
    images: ["https://www.hindustanolympiad.in/wp-content/uploads/2024/07/cropped-Hindustan-Olympiad-logo_final-1.png"],
    creator: "@HindustanOlympiad",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-QZ31551262"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QZ31551262');
            `,
          }}
        />
      </head>
      <body
        suppressContentEditableWarning
        suppressHydrationWarning
        className={inter.className + " pt-[80px] p-0 m-0"}
      >
        <ToastProvider>
          <Navbar />
          {children}
          <ToastContainer />
          <Analytics />
        </ToastProvider>
      </body>
    </html>
  );
}