const Card = ({ product, handleRemove }) => {
  return (
    <div className='max-w-[20rem] rounded-lg shadow-card-2'>
      <a href={product.url} target='_blank' rel='noopener noreferrer'>
        <img
          className='w-full bg-gray-200 rounded-t h-72 object-scale-down'
          src={product.img}
          alt='product image'
        />
      </a>
      <div className='flex flex-col gap-5 p-4'>
        <div className='flex flex-col gap-2'>
          <p className='text-sm font-bold text-green-700'>
            Sold {product.soldDate}
          </p>
          <a href={product.url} target='_blank' rel='noopener noreferrer'>
            <h5 className=' text-base font-semibold tracking-tight text-gray-900 font-sans text-justify'>
              {product.title}
            </h5>
          </a>
        </div>
        <div className='flex justify-between items-end gap-10'>
          <span className='text-lg font-bold text-green-600'>
            US ${product.price}
          </span>
          <button className='remove-btn' onClick={() => handleRemove(product.id)}>Remove from list</button>
        </div>
      </div>
    </div>
  );
};

export default Card;
