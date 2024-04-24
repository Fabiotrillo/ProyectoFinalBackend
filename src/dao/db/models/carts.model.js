import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  products: [{
          product: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "products",
          },
          quantity: {
              type: Number,
              default: 1
          }
      }
  ]
});

cartSchema.pre("find", function(next) {
  console.log("Antes de populate:", this);
  this.populate("products.product");
  console.log("Después de populate:", this);
  next();
});
const cartModel = mongoose.model('carts', cartSchema);

export default cartModel;