// import puppeteer from 'puppeteer-extra'
// //import StealthPlugin from "puppeteer-extra-plugin-stealth"
// import { Browser, BrowserContext, Page } from "puppeteer";
// import stopwords from 'stopwords-es'

//const puppeteer = require('puppeteer-extra');
const puppeteer = require('puppeteer');
//const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const stopwords = require('stopwords-es');

//puppeteer.use(StealthPlugin());

// Funcionalidad: Recibe la URL de un producto en eBay. Luego extrae de la pagina:
//Titulo del producto
//Precio del producto
//Tipo de moneda del precio
export const getArrayWithInputData = async (url) => {
  const browser = await puppeteer.launch({
    headless: 'new',
  });

  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();
  //const page: Page = await browser.newPage();

  await page.goto(url);

  const pageData = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('body'));

    let data = items.map((item) => ({
      title: item.querySelector('.x-item-title__mainTitle').innerText.trim(),
      price: parseFloat(
        item
          .querySelector('.x-price-primary [itemprop="price"]')
          .getAttribute('content')
      ),
      priceCurrency: item
        .querySelector('.x-price-primary [itemprop="priceCurrency"]')
        .getAttribute('content')
        .trim(),
      shipping: item
        .querySelector('.ux-labels-values__values-content span')
        .innerText.trim(),
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

    return data;
  });
  await browser.close();

  return pageData[0];
};

// Funcionalidad: Toma los datos del producto de eBay ingresado por el usuario y con esto crea una URL
// nueva que conduce a la historia de ventas del producto
export const createURL = (data) => {
  // Primero se eliminan caracteres especiales del titulo del producto
  const charactersToEliminate = ['(', ')', '-', '/'];
  let wordsArray = data.title.split(' ').map((word) => {
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

  const url = `https://www.ebay.com/sch/i.html?_nkw=${wordsArray.join(
    '+'
  )}&_sacat=0&LH_Complete=1&LH_Sold=1`;

  return url;
};

//Funcionalidad: Recibe una URL con el historial de ventas de algun producto y devuelve una lista de todos
//los productos mostrados en la pagina
export const getSoldListingHistory = async (url) => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto(url);

  const pageData = await page.evaluate(() => {
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
    }));

    // Remove "Shop on eBay" at the first position
    data.shift();

    return data;
  });

  await browser.close();

  return pageData;
};
