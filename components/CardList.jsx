import Card from './Card';

const CardList = ({ products, handleRemove }) => {
  return (
    <div className='w-full flex justify-center flex-wrap gap-10 mt-10'>
      {products &&
        products.map((prod) => <Card product={prod} key={prod.url} handleRemove={handleRemove} />)}
    </div>
  );
};

export default CardList;
