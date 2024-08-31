import axios from 'axios';
import crypto from 'crypto';

export class PayU {
  public key: string;
  public salt: string;
  public baseUrl: string;

  constructor(key: string, salt: string, baseUrl: string = 'https://test.payu.in') {
    this.key = key;
    this.salt = salt;
    this.baseUrl = baseUrl;
  }

  // Method to generate hash
  public generateHash(paymentData: any): string {
    const hashString = `${this.key}|${paymentData.txnid}|${paymentData.amount}|${paymentData.productinfo}|${paymentData.firstname}|${paymentData.email}|||||||||||${this.salt}`;
    return crypto.createHash('sha512').update(hashString).digest('hex');
  }

  // Method to initiate a payment
  public async initiatePayment(paymentData: {
    key: string;
    txnid: string;
    amount: string;
    productinfo: string;
    firstname: string;
    email: string;
    phone: string;  // Make phone mandatory
    surl: string;
    furl: string;
    hash: string;
  }) {
    // Ensure all required fields are present
    const formData = new URLSearchParams({
      key: paymentData.key,
      txnid: paymentData.txnid,
      amount: paymentData.amount,
      productinfo: paymentData.productinfo,
      firstname: paymentData.firstname,
      email: paymentData.email,
      phone: paymentData.phone,
      surl: paymentData.surl,
      furl: paymentData.furl,
      hash: paymentData.hash,
      service_provider: 'payu_paisa',
    });
    const paymentUrl = `${payu.baseUrl}/_payment`;
    try {
      // Sending the payment request to PayU
      const response = await axios.post(paymentUrl, formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // Return the response for further processing
      return response.data;
    } catch (error) {
      console.error('Error initiating PayU payment:', error);
      throw new Error('Error initiating PayU payment');
    }
  }
}

// Export an instance of PayU
export const payu = new PayU(
  process.env.PAYU_MERCHANT_KEY!,
  process.env.PAYU_MERCHANT_SALT!,
  process.env.PAYU_BASE_URL || 'https://test.payu.in'  // Use 'https://secure.payu.in' for production
);