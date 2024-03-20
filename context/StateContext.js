import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem('cartItems');
      return localData ? JSON.parse(localData) : [];
    }
    return [];
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [qty, setQty] = useState(1);


  useEffect(() => {
      if (typeof window !== 'undefined') {
          localStorage.setItem('cartItems', JSON.stringify(cartItems));
          const newTotalPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
          const newTotalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);
          setTotalPrice(newTotalPrice);
          setTotalQty(newTotalQty);
      }
  }, [cartItems]);


  const onAdd = (product, quantity, size = '', tags) => {
    const checkProductInCart = cartItems.find((item) => item._id === product._id && item.size === size);

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) =>
        cartProduct._id === product._id && cartProduct.size === size
          ? { ...cartProduct, quantity: cartProduct.quantity + quantity }
          : cartProduct
      );
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, { ...product, quantity, size, tags }]);
    }

    toast.success(`${quantity} ${product.name} added to the cart.`);
  };

  const onRemove = (product) => {
    const newCartItems = cartItems.filter((item) => !(item._id === product._id && item.size === product.size));

    setCartItems(newCartItems);
  };

  const toggleCartItemQuantity = (id, value) => {
    const updatedCartItems = cartItems.map((item) =>
      item._id === id
        ? {
            ...item,
            quantity: value === 'inc' ? item.quantity + 1 : item.quantity > 1 ? item.quantity - 1 : 1,
          }
        : item
    );

    setCartItems(updatedCartItems);
  };

  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decQty = () => {
    setQty((prevQty) => (prevQty > 1 ? prevQty - 1 : 1));
  };

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        setCartItems,
        setTotalPrice,
        setTotalQty,
        totalPrice,
        totalQty,
        qty,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuantity,
        onRemove,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);