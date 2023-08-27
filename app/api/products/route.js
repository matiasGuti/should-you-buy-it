import puppeteer from 'puppeteer';
//import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import stopwords from 'stopwords-es';

//import { getArrayWithInputpageData, createURL, getSoldListingHistory } from '@/libs/scrapperFunctions';

//puppeteer.use(StealthPlugin());

export const POST = async (request) => {
  const { url } = await request.json();

  if (!url) return new Response('Please provide a valid url', { status: 500 });

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
    });

    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    await page.goto(url);

    const pageData = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('body'));
      let data = items.map((item) => ({
        title: item.querySelector('.x-item-title__mainTitle').innerText.trim(),
        price: parseFloat(
          item
            .querySelector('.x-price-primary')
            .innerText.trim()
            .split(' ')[1]
            .substring(1)
        ),
        priceCurrency: item
          .querySelector('.x-price-primary')
          .innerText.trim()
          .split(' ')[0],
        shipping: item
          .querySelector('.ux-labels-values__values-content span')
          .innerText.trim(),
        img: item
          .querySelector('.ux-image-magnify__image--original')
          .getAttribute('src')
      }));

      //formateando el texto del precio de envio antes de pasarlo a numero
      if (typeof data[0].shipping === 'string') {
        const shippingPrice = data[0].shipping.split(' ')[1];
        if (shippingPrice.charAt(0) === '$') {
          data[0].shipping = parseFloat(shippingPrice.substring(1));
        } else if (/\d/.test(shippingPrice)) {
          data[0].shipping = parseFloat(shippingPrice);
        } else {
          data[0].shipping = 0;
        }
      }
      return data[0];
    });

    await browser.close();

    const charactersToEliminate = ['(', ')', '-', '/', '!', '¡'];

    let wordsArray = pageData.title.split(' ').map((word) => {
      let updatedWord = word;
      charactersToEliminate.forEach((w) => {
        updatedWord = updatedWord.split(w).join('');
      });
      return updatedWord;
    });

    //Se eliminan los acentos
    wordsArray = wordsArray.map((str) =>
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    );

    //Se dejan todas las palabras en minusculas
    wordsArray = wordsArray.map((str) => str.toLowerCase());

    //Se eliminan las palabras duplicadas
    wordsArray = [...new Set(wordsArray)];

    //Se eliminan las stop words (palabras neutras que no agregan ni quitan valor a la busqueda)
    wordsArray = wordsArray.filter((val) => !stopwords.includes(val));

    const historyURL = `https://www.ebay.com/sch/i.html?_nkw=${wordsArray.join(
      '+'
    )}&_sacat=0&LH_Complete=1&LH_Sold=1`;

    const browser2 = await puppeteer.launch({ headless: 'new' });
    const page2 = await browser2.newPage();

    await page2.goto(historyURL);

    const historyData = await page2.evaluate(() => {
      const convertPrice = (str) => {
        let price = str.split(' ')[1];

        if (price !== undefined) {
          price = parseFloat(price.substring(1).replace(/\s/g, ''));
        }

        return price;
      };

      const getCurrency = (fullPrice) => {
        return fullPrice.split(' ')[0].trim();
      };

      const items = Array.from(document.querySelectorAll('.s-item'));

      const data = items.map((item) => ({
        title: item.querySelector('.s-item__link span').innerText.trim(),
        price: convertPrice(
          item.querySelector('.s-item__price').innerText.trim()
        ),
        priceCurrency: getCurrency(
          item.querySelector('.s-item__price').innerText.trim()
        ),
        url: item.querySelector('.s-item__image a').getAttribute('href').trim(),
        soldDate: item
          .querySelector('span')
          .innerText.trim()
          .split(' ')
          .slice(-3)
          .join(' '),
        img: item
          .querySelector('.s-item__image-wrapper img')
          .getAttribute('src')
          .trim(),
      }));

      // Remove "Shop on eBay" at the first position
      data.shift();

      return data;
    });

    await browser2.close();

    const responseData = {
      currentProduct: pageData,
      history: historyData,
      wordsArray
    };

    return new Response(JSON.stringify(responseData), { status: 201 });
    //return new Response(JSON.stringify(productpageData), { status: 200 });
  } catch (error) {
    return new Response('Failed to fetch all products', { status: 500 });
  }
};
