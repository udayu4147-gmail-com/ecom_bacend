const Cart = require('../models/cart');

exports.addItemToCart = (req, res) => {
  Cart.findOne({ user: req.user._id })
    .exec()
    .then((cart) => {
      if (cart) {
        // cart already exists, update cart by quantity
        const product = req.body.cartItems.product;
        const isItemAdded = cart.cartItems.find((c) => c.product === product);

        if (isItemAdded) {
          Cart.findOneAndUpdate(
            { "user": req.user._id, "cartItems.product": product },
            {
              "$set": {
                "cartItems.$.quantity": isItemAdded.quantity + req.body.cartItems.quantity
              },
            }
          )
            .then(() => {
              res.status(200).json({ message: 'Cart updated' });
            })
            .catch((error) => {
              res.status(500).json({ error: 'Failed to update cart' });
            });
        } else {
          Cart.findOneAndUpdate(
            { user: req.user._id },
            {
              $push: {
                cartItems: req.body.cartItems,
              },
            }
          )
            .then(() => {
              res.status(200).json({ message: 'Cart updated' });
            })
            .catch((error) => {
              res.status(500).json({ error: 'Failed to update cart' });
            });
        }
      } else {
        /* if cart does not exist, create a new cart */
        const cart = new Cart({
          user: req.user._id,
          cartItems: req.body.cartItems,
        });
        cart.save()
          .then((cart) => {
            res.json({ message: 'Item added to cart', cart: cart });
          })
          .catch((error) => {
            res.status(500).json({ error: 'Failed to add item to cart' });
          });
      }
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};
