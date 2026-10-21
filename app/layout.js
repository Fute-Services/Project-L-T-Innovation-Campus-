import './globals.css';
import Shell from '../lib/Shell';

export const metadata = {
  title: {template: '%s · L&T Innovation Campus, Powai', default: 'L&T Innovation Campus, Powai'},
  icons: {icon: '/assets/img/logo-lt-realty.webp'}
};
export const viewport = {width: 'device-width', initialScale: 1, viewportFit: 'cover'};

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600&family=DM+Mono:wght@400&display=swap" />
      </head>
      <body><Shell>{children}</Shell></body>
    </html>
  );
}
