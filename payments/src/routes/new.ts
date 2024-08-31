import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from '@abra10tickets/common';
import { payu } from '../payu';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/payments/payment-success', async (req: Request, res: Response) => {
  const { status } = req.query;

  if (status === 'success') {
    // Logic to update order status and other relevant details
    res.send('<h1>Payment Successful</h1><p>Your payment was successful!</p>');
  } else {
    res.send('<h1>Payment Failed</h1><p>There was an issue with your payment.</p>');
  }
});

router.get('/api/payments/payment-failure', async (req: Request, res: Response) => {
  res.send('<h1>Payment Failed</h1><p>Your payment failed. Please try again.</p>');
});

router.post(
  '/api/payments/initiate',
  requireAuth,
  [
    body('orderId').isMongoId().withMessage('Invalid orderId'),
    body('amount').isNumeric().withMessage('Invalid amount'),
    body('firstname').notEmpty().withMessage('Firstname is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('phone').notEmpty().withMessage('Phone is required'), // Phone validation removed
    body('productinfo').notEmpty().withMessage('Product info is required'),
    body('txnid').notEmpty().withMessage('Transaction ID is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId, amount, firstname, email, productinfo, txnid } = req.body;

    console.log('Request Body:', req.body);

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for a cancelled order');
    }

    const paymentData = {
        key: process.env.PAYU_MERCHANT_KEY!,
        txnid: txnid, // Ensure this is unique and passed
        amount: order.price.toString(), // Ensure this is a string
        firstname: req.currentUser!.name || 'Unknown', // Ensure firstname is passed
        email: req.body.email,
        phone: req.body.phone || '123456789', // Ensure phone is passed
        productinfo: req.body.productinfo,
        surl: 'https://ticketing.dev/api/payments/payment-success',
        furl: 'https://ticketing.dev/api/payments/payment-failure',
        hash: ''
    };



    const hash = payu.generateHash(paymentData);

    paymentData.hash = hash;
    console.log('Payment Data is', paymentData);

    // Send payment data to PayU
    const paymentUrl = `${payu.baseUrl}/_payment`;
    res.send({ paymentUrl, paymentData });
    // Alternatively, if you are redirecting directly from the server:


  }
);

export { router as createChargeRouter };
