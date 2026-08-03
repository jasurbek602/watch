import "./globals.css";

export const metadata = {
  title: "WatchShop | Zamonaviy soatlar do'koni",
  description:
    "Erkaklar va ayollar uchun zamonaviy, sifatli qo'l soatlari katalogi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
