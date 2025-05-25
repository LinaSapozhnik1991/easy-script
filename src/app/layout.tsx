import type { Metadata } from 'next'
import { ToastContainer } from 'react-toastify'

import '../styles/globals.scss'
import '../styles/font/font.scss'

export const metadata: Metadata = {
  title: 'Easy Script',
  description: ''
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body>
        {children}
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </body>
    </html>
  )
}
