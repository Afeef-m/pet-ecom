const checkoutService = require("../services/checkout.service");

exports.checkout = async (req, res, next) => {
  try {
    const order = await checkoutService.checkout(
      req.user.id,
      req.body.address
    );

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    next(err);
  }
};