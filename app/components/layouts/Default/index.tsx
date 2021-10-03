import React, { useState, useEffect } from 'react';
import Header from '@module/header';
import StickyCart from '@module/stickyCart';
import PdpModal from '@module/pdpModal/pdpModal';
import { useSelector } from 'react-redux';
import Footer from '@module/footer';
import { useRouter } from 'next/router';

type Props = {
  children: React.ReactNode;
};

const Default = ({ children }: Props) => {
  const router = useRouter();
  const pdpItem = useSelector(state => state.pdpItem);
  const [currentRoute, setCurrentRoute] = useState('');

  useEffect(() => {
    const currentRouteSTring = ('pagepath' in router.query) ? router.query.pagepath[0] : '';
    setCurrentRoute(currentRouteSTring);
  }, [router])

  return (
    <div className="default clearfix">
      <Header />
      <StickyCart />
      {pdpItem && <PdpModal />}
      <div className="content clearfix">{children}</div>
      {(!currentRoute || currentRoute == 'home' || currentRoute == 'orderconfirmation') && <Footer />}
    </div>
  )
};

export default Default;
