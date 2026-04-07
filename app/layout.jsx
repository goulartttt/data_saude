import { Inter, Poppins } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins"
})

export const metadata = {
  title: "Saúde Brasil - Painel de Monitoramento de Saúde Pública",
  description: "Acompanhe dados de vacinação, casos de doenças e indicadores de saúde pública do Brasil em tempo real.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={`${inter.variable} ${poppins.variable} antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  )
}
