import stopwords from 'stopwords-es';

//Formatear fecha que trae desde ebay, con el fin de poder ordenar y mostrar productos vendidos mas recientemente
export const sortByDate = (objectArray) => {
  function obtenerNombreMesIngles(mes) {
    const meses = {
      ene: 1,
      feb: 2,
      mar: 3,
      abr: 4,
      may: 5,
      jun: 6,
      jul: 7,
      ago: 8,
      sep: 9,
      oct: 10,
      nov: 11,
      dic: 12,
    };
    return meses[mes];
  }

  objectArray.forEach((prod) => {
    const splitFecha = prod.soldDate.split(' ');
    const dia = Number(splitFecha[0]);
    const año = Number(splitFecha[2]);

    // Obtener el nombre del mes en ingles
    const mesIngles = obtenerNombreMesIngles(splitFecha[1].toLocaleLowerCase());

    prod.soldDateAsDate = new Date(`${mesIngles} ${dia} ${año}`);
  });

  objectArray.sort((a, b) => b.soldDateAsDate - a.soldDateAsDate);

  return objectArray;
};

//Formatea el precio para dejarlo siempre en USD
export const changeCurrency = async (objectArray) => {
  const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
  const data = await res.json();
  const rates = data.rates;

  objectArray.forEach((item) => {
    item.price = (item.price / rates[item.priceCurrency]).toFixed(2);
  });

  return objectArray;
};

export const changeCurrency2 = async (object) => {
  const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
  const data = await res.json();
  const rates = data.rates;

  if (object.priceCurrency === 'US') {
    object.priceCurrency = 'USD';
  } else if (object.priceCurrency === 'C') {
    object.priceCurrency = 'CAD';
  }

  object.price = Number((object.price / rates[object.priceCurrency]).toFixed(2));
  //console.log(object);
  return object;
};

export const removeNonSimilarProducts = (objectArray, words) => {
  const aux = objectArray.map((obj) => {
    return obj.title
  })

  const auxJoin = aux.join(' ')
  const auxWord = auxJoin.split(' ')

  return objectArray
}


// const objectArray = [
//   {
//     title:
//       'Fire Emblem Premium Edition Game Card Nintendo Video Game Boy Advance GBA 2003',
//     price: 48027.44,
//     priceCurrency: 'CLP',
//     url: 'https://www.ebay.com/itm/266330608992?hash=item3e028a9560:g:ReUAAOSwTIZkmfQw&amdata=enc%3AAQAIAAABABk1%2BSfYFhNgbW0hu%2Bl6cAZD2l1kFW6bZSoMbaLJX%2BufDRYFnvlqYm8kiSeH2IJNm%2BPCuorAS4fbgDvrJGFDcbFuhp3ErAVVyiBsmN1ru01XEeUW2hkeWhCE%2Bknjxx8YGJYbkxv2mdZDd9fIIP6qeRUWVKNCvCOlk6VFkW6dOK7RSFlWdD8CG%2BKI5gkQpsUuOC39H5%2Ft0Q0ZV0KgmXRL0q%2FUghCur8%2BBBgN0E5TgUIuLgMErK9m52S1GJwDGpqVo%2FGX55EMkeZ0opKYeT82EdyQBGwYXGuJUuwoOBMn%2BxHRXmJtVMKnAAItzyu2WePtj%2BK8R70B5dn6dI7IbtfsVcAA%3D%7Ctkp%3ABk9SR5rTrrW_Yg',
//     soldDate: '17 jul 2023',
//     img: 'https://i.ebayimg.com/thumbs/images/g/ReUAAOSwTIZkmfQw/s-l225.webp',
//   },
//   {
//     title:
//       'Fire Emblem Premium Edition Game Card Nintendo Video Game Boy Advance GBA 2003',
//     price: 42881.65,
//     priceCurrency: 'CLP',
//     url: 'https://www.ebay.com/itm/175834511455?hash=item28f08db85f:g:OAEAAOSwc-Nkm05z&amdata=enc%3AAQAIAAABABW5EUHml6xcE6x5VSHOBWRjAC3B46WRGEEFpsw9AEv1bsSLwNmTqx9J5aCp53dLZ8SkmVtrpPprGy1A7qWljeNzGQgxEwSKaSu8%2FdwobGKuW6k%2F4z2UN5VGWm6f1G8dRcQic70cziGfgvdPBeHeUC7vuTdAmCeVumsds6ZjhF1ID61i9MZcHJUwkbBeKgO2%2BZkgzEybWFFtEh8P96gcqARIiXrAipaY7xBEfInPFA64cDY9WJ04Wyeyhz0Jr4igz4S3rgslnmcYAwTyKQOT8BT079qTYxPWl4NnGyObbdRbEvTmqrMDF%2B08D2P7j4zABdlMKDpBSqUIytEIXuRh6gY%3D%7Ctkp%3ABk9SR5rTrrW_Yg',
//     soldDate: '1 ago 2023',
//     img: 'https://i.ebayimg.com/thumbs/images/g/OAEAAOSwc-Nkm05z/s-l225.webp',
//   },
//   {
//     title: 'Fire Emblem 2003',
//     price: 73500.65,
//     priceCurrency: 'CLP',
//     url: 'https://www.ebay.com/itm/175834511455?hash=item28f08db85f:g:OAEAAOSwc-Nkm05z&amdata=enc%3AAQAIAAABABW5EUHml6xcE6x5VSHOBWRjAC3B46WRGEEFpsw9AEv1bsSLwNmTqx9J5aCp53dLZ8SkmVtrpPprGy1A7qWljeNzGQgxEwSKaSu8%2FdwobGKuW6k%2F4z2UN5VGWm6f1G8dRcQic70cziGfgvdPBeHeUC7vuTdAmCeVumsds6ZjhF1ID61i9MZcHJUwkbBeKgO2%2BZkgzEybWFFtEh8P96gcqARIiXrAipaY7xBEfInPFA64cDY9WJ04Wyeyhz0Jr4igz4S3rgslnmcYAwTyKQOT8BT079qTYxPWl4NnGyObbdRbEvTmqrMDF%2B08D2P7j4zABdlMKDpBSqUIytEIXuRh6gY%3D%7Ctkp%3ABk9SR5rTrrW_Yg',
//     soldDate: '1 dic 2023',
//     img: 'https://i.ebayimg.com/thumbs/images/g/OAEAAOSwc-Nkm05z/s-l225.webp',
//   },
// ];
