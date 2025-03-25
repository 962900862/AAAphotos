'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const FooterWithTranslation: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="py-6 text-center text-gray-400 text-sm bg-gray-900">
      <div className="container mx-auto">
        <div className="flex justify-center space-x-4">
          <Link href="/privacy" className="hover:text-gray-200 transition-colors">
            {t('footer.privacy')}
          </Link>
          <Link href="/terms" className="hover:text-gray-200 transition-colors">
            {t('footer.terms')}
          </Link>
          <Link href="/blog" className="hover:text-gray-200 transition-colors">
            {t('footer.blog')}
          </Link>
        </div>
        <p className="mt-2">{t('footer.copyright')}</p>
      </div>
    </footer>
  );
};

export default FooterWithTranslation; 