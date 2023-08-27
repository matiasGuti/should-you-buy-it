import '@/styles/global.css';

import Nav from '@/components/Nav';

export const metadata = {
  title: 'Should you buy it?',
  description: 'Check sold prices for your favorite items!',
};

const RootLayout = ({ children }) => {
  return (
    <html lang='en' className='w-full h-full bg-gray-100'>
      <body>
        <main className='flex-center flex-col mx-auto px-6'>
          <Nav />
          {children}
        </main>
      </body>
    </html>
  );
};

export default RootLayout;
