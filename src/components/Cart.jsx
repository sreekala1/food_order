// components/Cart.jsx
const Cart = ({ cart }) => (
  <div className="p-4 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
    <h2 className="text-xl font-bold mb-2">Cart</h2>
    {cart.length === 0 ? <p>No items in cart.</p> :
      cart.map((item, index) => (
        <div key={index} className="mb-2">
          {item.name} - ₹{item.price}
        </div>
      ))
    }
  </div>
);

export default Cart;
