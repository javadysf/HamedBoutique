import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import LayoutContent from "@/components/LayoutContent";

export const metadata: Metadata = {
  title: "Hamed Boutique",
  description: "Online Clothing Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-bnazanin bg-white text-black">
        <ReduxProvider>
          <LayoutContent>{children}</LayoutContent>
        </ReduxProvider>
      </body>
    </html>
  );
}
