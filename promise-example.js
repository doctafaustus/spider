//const fetch = require('node-fetch');

async function fetchCatAvatars(userID) {

  const response = await fetch(`https://catappapi.herokuapp.com/users/${userID}`);
  const user = await response.json();
  const catImageUrls = [];
  for (const catID of user.cats) {
    const response = await fetch(`https://catappapi.herokuapp.com/cats/${catID}`);
    const catData = await response.json();
    catImageUrls.push(catData.imageUrl);
  }

  console.log(catImageUrls);
}

var result = fetchCatAvatars(123);
