import React, { createContext, useContext, useState } from 'react';

const BarcodeContext = createContext();

export const BarcodeProvider = ({ children }) => {
  const [barcode, setBarcode] = useState('');

  return (
    //componente hijo de barcode
    <BarcodeContext.Provider value={{ barcode, setBarcode }}>
      
      {children}
    </BarcodeContext.Provider>
  );
};

export const useBarcode = () => useContext(BarcodeContext);
