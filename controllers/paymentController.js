const PaymentOption = require('../models/Payment');
const responseHandler = require('../utils/responseHandler');
const Package = require('../models/Package');
const { Op } = require('sequelize');
const paypal = require('paypal-rest-sdk');
const Transaction = require('../models/Transaction');
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = require('../config/config'); // Import your PayPal credentials
paypal.configure({
  mode: 'sandbox', // Set this to 'live' for production
  client_id: PAYPAL_CLIENT_ID,
  client_secret: PAYPAL_CLIENT_SECRET,
});

async function addPaymentOption(req, res) {
  try {
    const {
      name,
      userName,
      password,
      signature,
      sandboxMode,
      published,
    } = req.body;
    const newPaymentOption = await PaymentOption.create({
      name,
      userName,
      password,   
      signature,
      sandboxMode,
      published,
    });

    responseHandler.created(res, 'Payment option added successfully', newPaymentOption);
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function getPaymentOptions(req, res) {
    try {
      const paymentOptions = await PaymentOption.findAll({
        attributes: ['id', 'name', 'userName', 'sandboxMode', 'published'],
      });
  
      responseHandler.success(res, 'Payment options retrieved successfully', { paymentOptions });
    } catch (error) {
      console.error(error);
      responseHandler.internalServerError(res, 'An error occurred');
    }
}

async function getPayments(req,res){
  try{
    const getPayments = await Transaction.findAll({
      attributes:['id','paymentId','payerId','amount','currency','userName','userEmail','userPhone','transactionId','paymentGatewayId','cartAmount','transactionAmount','transactionDate','transactionStatus','paymentMode','status','packageId','packageName'],
    });
    responseHandler.success(res,'get payments are retrived',{getPayments});
  } catch(error){
    console.error(error);
    responseHandler.internalServerError(res,'An error occurred');
  }
}

async function proceedToPayments(req, res) {
  try {
    const { cartItems, totalAmount } = req.body;
    const user = req.user; 

    // Create a PayPal payment
    const createPaymentJson = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: 'https://physicaltherapyboards.com/Checkouts',
        cancel_url: 'http://localhost:3000/cancel',
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((cartItem) => ({
              name: cartItem.Package.name,
              sku: cartItem.packageId.toString(),
              price: cartItem.Package.amount.toFixed(2),
              currency: 'USD',
              quantity: cartItem.quantity,
            })),
          },
          amount: {
            currency: 'USD',
            total: totalAmount.toFixed(2),
          },
          description: 'Cart payment',
        },
      ],
    };

    paypal.payment.create(createPaymentJson, async (error, payment) => {
      if (error) {
        console.error(error);
        responseHandler.internalServerError(res, 'An error occurred while creating the PayPal payment');
      } else {
        console.log('PayPal Response:', payment); // Log the PayPal response
        try {
          const packageId = cartItems[0].packageId; // Assuming there is only one package in cartItems
          const packageDetails = await Package.findOne({ where: { id: packageId } });

          if (!packageDetails) {
            responseHandler.notFound(res, 'Package not available');
            return;
          }

          const transaction = await Transaction.create({
            paymentId: payment.id,
            payerId: payment.id,
            amount: payment.transactions[0].amount.total,
            currency: payment.transactions[0].amount.currency,
            userName: 'afzal', 
            userEmail: 'afzal@example.com', 
            userPhone: '1234567890', 
            transactionId: payment.id,
            paymentGatewayId: payment.id,
            cartAmount: totalAmount,
            transactionAmount: totalAmount,
            transactionDate: new Date(),
            transactionStatus: 'pending',
            paymentMode: 'PAYPAL',
            status: 'success', 
            packageId: packageId,
            packageName: packageDetails.name,
          });

          const redirectUrl = payment.links.find((link) => link.rel === 'approval_url').href;
          responseHandler.success(res, 'Proceed to PayPal payment', { redirectUrl });
        } catch (error) {
          console.error(error);
          responseHandler.internalServerError(res, 'An error occurred while storing transaction details');
        }
      }
    });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function searchByDate(req, res) {
  try {
    const { startDate, endDate } = req.query;

    const payments = await Transaction.findAll({
      where: {
        transactionDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      
      attributes: ['id', 'paymentId', 'payerId', 'amount', 'currency', 'userName', 'userEmail', 'userPhone', 'transactionId', 'paymentGatewayId', 'cartAmount', 'transactionAmount', 'transactionDate', 'transactionStatus', 'paymentMode', 'status', 'packageId', 'packageName'],
    });
    console.log(payments);return

    responseHandler.success(res, 'Payments retrieved based on date range', { payments });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function searchByName(req, res) {
  try {
    const { name } = req.query;
    const payments = await Transaction.findAll({
      where: {
        userName: name

      },
      attributes: ['id', 'paymentId', 'payerId', 'amount', 'currency', 'userName', 'userEmail', 'userPhone', 'transactionId', 'paymentGatewayId', 'cartAmount', 'transactionAmount', 'transactionDate', 'transactionStatus', 'paymentMode', 'status', 'packageId', 'packageName'],
    });
    responseHandler.success(res, 'Payments retrieved based on name', { payments });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

module.exports = {
  addPaymentOption,
  getPaymentOptions,
  proceedToPayments,
  getPayments,
  searchByDate,
  searchByName
};




