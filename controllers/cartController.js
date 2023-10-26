const Cart = require('../models/Cart');
const responseHandler = require('../utils/responseHandler');
const Package = require('../models/Package'); 

async function addToCart(req, res) {
  try {
    const { packageId, quantity } = req.body;
    const userId = req.user.id;

    const packageExists = await Package.findOne({ where: { id: packageId } });
    if (!packageExists) {
      return responseHandler.notFound(res, 'Package not found');
    }

    // Create the cart item and capture the created object
    const cartItem = await Cart.create({
      packageId,
      quantity,
      userId,
    });

    // Send the created cart item in the response
    responseHandler.created(res, 'Item added to cart successfully', cartItem);
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}
async function updateCartItem(req, res) {
  try {
    const { cartItemId } = req.query;
    const { quantity } = req.body;
    // const userId = req.user.id; // Assuming you have implemented user authentication

    const cartItem = await Cart.findOne({
      where: { id: cartItemId },
    //   where: { id: cartItemId, userId },
    });

    if (!cartItem) {
      return responseHandler.notFound(res, 'Cart item not found');
    }

    // Update the cart item's quantity
    cartItem.quantity = quantity;
    await cartItem.save();

    responseHandler.success(res, 'Cart item updated successfully', { cartItem });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}
async function viewCart(req, res) {
    try {
      const userId = req.user.id; 
  
      const cartItems = await Cart.findAll({
        where: { userId },
        include: [Package], 
      });
  
      // Calculate total added price
      const totalAddedPrice = cartItems.reduce((total, cartItem) => {
        return total + cartItem.quantity * cartItem.Package.amount;
      }, 0);
  
      responseHandler.success(res, 'Cart items retrieved successfully', { cartItems, totalAddedPrice });
    } catch (error) {
      console.error(error);
      responseHandler.internalServerError(res, 'An error occurred');
    }
}
async function removeFromCart(req, res) {
try {
    const { cartItemId } = req.params;
    const userId = req.user.id;

    const cartItem = await Cart.findOne({
    where: { id: cartItemId, userId },
    });

    if (!cartItem) {
    return responseHandler.notFound(res, 'Cart item not found');
    }

    await cartItem.destroy();

    responseHandler.success(res, 'Item removed from cart successfully');
} catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
}
}

module.exports = {
  addToCart,
  updateCartItem,
  viewCart,
  removeFromCart,
};











