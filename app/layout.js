import { Outfit, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { RegistrationProvider } from "@/context/RegistrationContext";
import { StoreProvider } from "@/context/StoreProvider";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "CodeChef ABESEC | College Club Event Management",
    template: "%s | CodeChef ABESEC",
  },
  description:
    "Official event portal for CodeChef ABESEC Chapter at ABES Engineering College. Discover upcoming hackathons, competitive programming contests, AI workshops, and open-source bootcamps. Register in seconds.",
  keywords: [
    "CodeChef",
    "ABESEC",
    "college events",
    "hackathon",
    "competitive programming",
    "tech club",
    "ABES Engineering College",
    "student chapter",
  ],
  authors: [{ name: "CodeChef ABESEC Chapter" }],
  creator: "CodeChef ABESEC",
  metadataBase: new URL("https://codechef-abesec.vercel.app"),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://codechef-abesec.vercel.app",
    title: "CodeChef ABESEC | College Club Event Management",
    description:
      "Discover and register for upcoming technical events, hackathons, and workshops hosted by CodeChef ABESEC student chapter.",
    siteName: "CodeChef ABESEC Events",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CodeChef ABESEC Event Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeChef ABESEC | College Club Event Management",
    description:
      "Discover and register for upcoming technical events, hackathons, and workshops hosted by CodeChef ABESEC student chapter.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0f172a",
              color: "#f8fafc",
              border: "1px solid #334155",
            },
          }}
        />
        <StoreProvider>
          <RegistrationProvider>
            <Navbar />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </RegistrationProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
