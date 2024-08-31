import React, { useState, useEffect } from 'react';
import crypto from 'crypto-js';

interface ReactPayUCheckoutProps {
  amount: number;
  email: string;
  payUKey: string;
  payUSalt: string;
  successUrl: string;
  failureUrl: string;
  orderId: string;
  firstname: string;
  phone?: string;
  lastname?: string;
  productinfo?: string;
  children?: React.ReactNode;
}

const ReactPayUCheckout: React.FC<ReactPayUCheckoutProps> = ({
  amount,
  email,
  payUKey,
  payUSalt,
  successUrl,
  failureUrl,
  orderId,
  firstname,
  phone,
  lastname = '',
  productinfo = 'Product Purchase',
  children,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePayment = () => {
    const txnid = `txnid_${Math.floor(Math.random() * 1000000000)}`;

    // Generate hash string
    const hashString = `${payUKey}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${payUSalt}`;
    const hash = crypto.SHA512(hashString).toString();

    // Create a form element
    const form = document.createElement('form');
    form.action = 'https://test.payu.in/_payment'; // Use the production URL for live payments
    form.method = 'POST';

    // Create form fields
    const fields = {
      key: payUKey,
      txnid,
      amount: amount.toString(),
      productinfo,
      email,
      firstname,
      lastname,
      phone,
      surl: successUrl,
      furl: failureUrl,
      hash,
    };

    // Append fields to form
    for (const key in fields) {
      if (fields.hasOwnProperty(key) && fields[key] !== undefined) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
      }
    }

    // Append form to body and submit it
    document.body.appendChild(form);
    form.submit();
  };

  if (!isClient) {
    return null;
  }

  return (
    <button onClick={handlePayment}>
      {children || 'Pay with PayU'}
    </button>
  );
};

export default ReactPayUCheckout;