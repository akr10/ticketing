import { useEffect, useState } from 'react';
import ReactPayUCheckout from '../../components/ReactPayUCheckout';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  const handlePaymentSuccess = (paymentData) => {
    console.log('Payment Successful:', paymentData);
  };

  const handlePaymentFailure = (error) => {
    console.error('Payment Failed:', error);
  };

  const firstname = currentUser.name || 'Unknown';
  const phone = currentUser.phone || '123456789'; // Ensure phone is fetched correctly

  return (
    <div>
      <h1>Time left to pay: {timeLeft} seconds</h1>
      <ReactPayUCheckout
        amount={order.ticket.price.toString()} // Ensure amount is a string
        email={currentUser.email}
        successUrl={`https://ticketing.dev/api/payments/payment-success`}
        failureUrl={`https://ticketing.dev/api/payments/payment-failure`}
        payUKey="oZsy7L"
        payUSalt="xMF5bLg21sWLFEyEnkOLnszoZp7gXjYa"
        orderId={order.id}
        firstname={firstname} // Pass firstname
        phone={phone} // Pass phone correctly
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
      >
        Pay Now
      </ReactPayUCheckout>
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
