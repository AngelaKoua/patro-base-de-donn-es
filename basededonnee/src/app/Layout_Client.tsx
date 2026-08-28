'use client';
import { usePathname } from 'next/navigation';
import My_navbar from '../../elements/My_navbar';
import Chatbot from '../../elements/Chatbot';

const loginPages = ['/', '/Connexion'];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = loginPages.includes(pathname);

  return (
    <>
      {!isLoginPage && <My_navbar />}
      <div className={isLoginPage ? '' : 'pt-20'}>{children}</div>
      {!isLoginPage && <Chatbot />}
    </>
  );
}
