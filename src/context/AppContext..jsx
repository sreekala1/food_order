import React, { createContext } from "react";

const AppContext = createContext({
  toggleTheme: () => {},
  currentTheme: "light",
  navigate: () => {},
  cart: [],
});

export default AppContext;