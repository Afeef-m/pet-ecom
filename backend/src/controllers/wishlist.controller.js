const whishlistService = require("../services/wishlist.service");

exports.getWishlist = async (req, res, next) =>{
    try{
        const wishlist = await whishlistService.getWishlist(req.user.id);
        res.json(wishlist);
    } catch(err){
        next(err);
    }
};

exports.addToWishlist = async (req, res, next) =>{
    try{
        const wishlist = await whishlistService.addToWishlist(
            req.user.id,
            req.body.productId,
            req.body.quantity
        );
        res.json(wishlist);
    } catch(err){
        next(err)
    }
}

exports.updateWishlist = async (req, res, next) => {
  try {
    const wishlist = await whishlistService.updateWishlist(
      req.user.id,
      req.body.productId,
      req.body.change
    );
    res.json(wishlist);
  } catch (err) {
    next(err);
  }
};

exports.removeItem = async (req, res, next) => {
  try {
    const wishlist = await whishlistService.removeItem(
      req.user.id,
      req.params.productId
    );
    res.json(wishlist);
  } catch (err) {
    next(err);
  }
};

exports.clearWishlist = async (req, res, next) => {
  try {
    const result = await whishlistService.clearWishlist(req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};