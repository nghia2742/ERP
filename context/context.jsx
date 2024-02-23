"use client"
import { createContext, useContext, useState } from 'react';

const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [myData, setMyData] = useState({});

  const updateData = (newData) => {
    setMyData(newData);
  };

  return (
    <MyContext.Provider value={{ myData, updateData }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  return useContext(MyContext);
};
