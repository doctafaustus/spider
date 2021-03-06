const cheerio = require('cheerio');
const request = require('request');
const cloudinary = require('cloudinary');
const fs = require('fs');

// Config
const cloudinarySecret = process.env.PORT ? process.env.CLOUDINARY_SECRET : fs.readFileSync('./private/cloudinary_secret.txt').toString();
cloudinary.config({ 
  cloud_name: 'dormh2fvt', 
  api_key: '778489856867779', 
  api_secret: cloudinarySecret, 
});
const cloudinaryOptions = { gravity: 'center', height: 285, width: 285, crop: 'fill', };
const baseURL = `https://www.allrecipes.com/search/results/?wt=chicken&page=`;
const recipes = [];
let pageCounter = 1;
const runData = {
  host: 'allrecipes.com',
  category: ['chicken', 'lunch-dinner'],
};

function scrape() {

  // When counter is full, upload images to Cloudinary
  if (pageCounter > 1) {
    let recipesProcessed = 0;
    recipes.forEach(async function(recipe) {
      console.log('uploading...');
      const cloudinaryImage = await upload(recipe.image);
      recipe.cloudinaryImage = cloudinaryImage;
      recipesProcessed++;

      console.log('image uploaded!');
      if (recipesProcessed === recipes.length) {
        return fs.writeFile ('scraped-recipes.json', JSON.stringify(recipes), err => {
          if (err) throw err;
          console.log('complete!');
        });
      }
    });

    return;
  }

  // Scrape page for recipe info
  console.log(`URL: ${baseURL}${pageCounter}`);
  request(`${baseURL}${pageCounter}`, (err, res, html) => {
    const $ = cheerio.load(html);    
    const $cards = $('#fixedGridSection .fixed-recipe-card');

    $cards.each(function () {
      const title = $(this).find('span.fixed-recipe-card__title-link').first().text().trim();
      const url = $(this).find('a.fixed-recipe-card__title-link').first().attr('href').replace(/\?.+/, '');
      const image = $(this).find('.fixed-recipe-card__img').first().attr('data-original-src');
      const recipe = { url, title, image, host: runData.host, category: runData.category, favorites: (Math.floor(Math.random() * 100) + 1) };
      console.log(recipe);
      recipes.push(recipe);
    });

    pageCounter++;
    return scrape();
  });
  
}



function upload(image) {
  return new Promise(function(res, rej) {
    cloudinary.v2.uploader.upload(image,
      { tags: ['spider'] },
      function(err, result) {
        console.log('result', result.secure_url);
        res(result.secure_url);
      },
    cloudinaryOptions);
  });
}


scrape(upload);






