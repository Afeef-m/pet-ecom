const cartService = require("../services/cart.service");

exports.getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const cart = await cartService.addToCart(
      req.user.id,
      req.body.productId,
      req.body.quantity
    );
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

exports.updateCart = async (req, res, next) => {
  try {
    const cart = await cartService.updateCart(
      req.user.id,
      req.body.productId,
      req.body.change
    );
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

exports.removeItem = async (req, res, next) => {
  try {
    const cart = await cartService.removeItem(
      req.user.id,
      req.params.productId
    );
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const result = await cartService.clearCart(req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};