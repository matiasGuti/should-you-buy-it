'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

//components
import Guide from '@/components/Guide';
import CardList from '@/components/CardList';
import ProductComparison from '@/components/ProductComparison';
import Loading from '@/components/Loading';
import Error from '@/components/Error';

//functions
import { sortByDate, changeCurrency, removeNonSimilarProducts } from '@/libs/arrayFunctions';

const Home = () => {
  const [productURL, setProductURL] = useState('');
  const [currentProduct, setCurrentProduct] = useState()
  const [soldHistory, setSoldHistory] = useState();
  const [isError, setIsError] = useState()
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    setCurrentProduct(null)
    setSoldHistory(null);
    setIsError(null)

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify({ url: productURL }),
      });
      const { currentProduct, history: data, wordsArray } = await response.json();

      //ordenar array por fecha de venta mas reciente
      const sortedArray = sortByDate(data);

      //Cambiar el precio a USD
      const updatedCurrencyArr = await changeCurrency(sortedArray);

      //Agregar id a los productos
      updatedCurrencyArr.forEach((prod) => {
        prod.id = uuidv4();
      });

      const finalArr = removeNonSimilarProducts(updatedCurrencyArr, wordsArray)
      //Hacer un analisis de palabras mas repetidas dentro de los titulos de los productos, para eliminar productos que no correspondan al de la publicacion

      
      setSoldHistory(finalArr);
      setCurrentProduct(currentProduct)
    } catch (error) {
      setIsError(error.message)
    } finally {
      setIsLoading(false);
    }
    setProductURL('');
  };

  const removeFromList = (id) => {
    const auxArray = soldHistory.filter(prod => prod.id !== id)
    setSoldHistory(auxArray)
  };

  //console.log(soldHistory);
  //console.log(wordsArray);
  return (
    <section className='w-full'>
      <div className='flex flex-center gap-3 rounded-md p-2 mx-auto w-[90%] sm:w-[60%]'>
        <input
          type='text'
          placeholder='Please enter a valid ebay product URL...'
          required
          className='search-input'
          value={productURL}
          onChange={(e) => setProductURL(e.target.value)}
        />
        <button className='search-btn' onClick={handleClick}>
          Search
        </button>
      </div>

      <div className='flex-center flex-col text-xs text-gray-400 pt-1 md:text-sm'>
        <p>
          By using this website you agree to the following{' '}
          <a
            href='https://www.termsfeed.com/live/8a98464b-4b92-4df2-9d3f-2c2188e6429d'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-400 font-semibold underline underline-offset-2'
          >
            Terms & Conditions.
          </a>
        </p>
        <p>
          This is <span className='font-semibold'>NOT</span> financial advice
        </p>
      </div> 

      {isLoading && <Loading />}
      {isError && <Error />}
      {currentProduct && <ProductComparison product={currentProduct} history={soldHistory} />}
      {soldHistory && <CardList products={soldHistory} handleRemove={removeFromList} />}
      <Guide />
    </section>
  );
};

export default Home;
