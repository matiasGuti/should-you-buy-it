import Image from 'next/image';

const Guide = () => {
  return (
    <section className='flex flex-col flex-center gap-12'>
      <h1 className='flex flex-center mt-12 text-[35px] font-bold font-serif'>
        How to use this page
      </h1>
      <ol className='list-decimal flex flex-col gap-6 font-medium'>
        <li>
          <p>Copy the URL from the ebay product you want to check.</p>
          {/* <Image src='/yt_instruction_1.svg' alt='aaa' width={200} height={200} /> */}
        </li>
        <li>Paste that URL into the input box above.</li>
        <li>Click search and the page will do the rest!</li>
      </ol>
    </section>
  );
};

export default Guide;
