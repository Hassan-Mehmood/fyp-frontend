import Layout from '../components/Layout';
import './globals.css';
import {
  ClerkProvider,
  // SignInButton,
  // SignUpButton,
  // SignedIn,
  // SignedOut,
  // UserButton,
} from '@clerk/nextjs'

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Layout>{children}</Layout>
        </body>
      </html>
      </ClerkProvider>
  );
}