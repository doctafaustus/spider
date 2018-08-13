const cheerio = require('cheerio');
const request = require('request');

const baseURL = `https://www.allrecipes.com/search/results/?wt=chicken&page=`;
const recipes = [];
let counter = 1;

function scrape() {

  if (counter > 10) return console.log('done!'); 
  console.log(`URL: ${baseURL}${counter}`);

  request(`${baseURL}${counter}`, (err, res, html) => {
    const $ = cheerio.load(html);
    
    const $cards = $('#fixedGridSection .fixed-recipe-card');
    $cards.each(function() {
      const recipeTitle = $(this).find('.fixed-recipe-card__title-link').first().text().trim();
      recipes.push(recipeTitle);
    });

    console.log(recipes);
    return scrape(++counter);
  });
  
}


scrape();
