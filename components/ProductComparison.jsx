'use client';

import { useEffect, useState } from 'react';
import { changeCurrency2 } from '@/libs/arrayFunctions';

//Components
import Product from './Product';
import PriceAnalysis from './PriceAnalysis';

const ProductComparison = ({ product, history }) => {
  const [updatedProduct, setUpdatedProduct] = useState();

  useEffect(() => {
    const updatePrice = async () => {
      const updatedProduct = await changeCurrency2(product);
      setUpdatedProduct(updatedProduct);
    };

    updatePrice();
  }, []);

  return (
    <div className='flex flex-col justify-evenly items-center mt-10 xl:flex-row'>
      {updatedProduct && <Product product={updatedProduct} />}
      {history && (
        <PriceAnalysis
          price={product.price}
          shipping={product.shipping}
          currency={product.currency}
          history={history}
        />
      )}
    </div>
  );
};

export default ProductComparison;
