// {
//   "title": "Donkey Kong 64 Nintendo N64 auténtico carro probado solamente-",
//   "price": 19.99,
//   "priceCurrency": "USD",
//   "shipping": 29.73,
//   "img": "https://i.ebayimg.com/images/g/y4cAAOSwkcVk3-zC/s-l1600.jpg"
// }

// "use Client"

// import { changeCurrency } from '@/libs/arrayFunctions';
// import { useEffect } from 'react';

const Product = ({ product }) => {
  return (
    <div className='flex flex-col m-10'>
      <h2 className='text-xl font-medium mb-4'>Your product</h2>
      <div className='flex rounded-lg h-32 gap-4 shadow-card-3 bg-white md:max-w-xl md:flex-row'>
        <img
          className='h-full w-[40%] rounded-md object-scale-down bg-gray-200'
          src={product.img}
          alt={product.title}
        />
        <div className='flex flex-col justify-center gap-2'>
          <h5 className='text-sm font-medium text-neutral-800'>
            {product.title.length > 40
              ? product.title.substring(0, 40) + '...'
              : product.title}
          </h5>
          <p className='text-xl text-green-600 font-bold'>
            <span className='text-base text-neutral-600 font-semibold'>Price: </span>US $
            {product.price}
          </p>
          <p className='text-xl text-green-600 font-bold'>
            <span className='text-base text-neutral-600 font-semibold'>Shipping: </span>US
            ${product.shipping}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Product;
