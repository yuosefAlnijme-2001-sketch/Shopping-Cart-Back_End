const calcTotalCartPrice = async (cart) => {
  let totalPrice = 0;

  cart.cartItems.forEach((item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    totalPrice += price * quantity;
  });

  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscound = undefined;
  cart.coupon = undefined;
  await cart.save();
  return totalPrice;
};

module.exports = calcTotalCartPrice;
