//Vlada section













//Saeeda section
const mealElement = document.getElementById('generatedMeal')
fetch('https://www.themealdb.com/api/json/v1/1/random.php')
  .then(response => response.json())
  .then(data => {
    const meal = data.meals[0];
    const mealName = meal.strMeal;
    const mealPicture = meal.strMealThumb;
    const mealSource = meal.strSource;
    // console.log(`Meal Name: ${mealName}`);
    // console.log(`Meal Picture: ${mealPicture}`);
    // console.log(`Meal Source: ${mealSource}`);
    mealElement.innerHTML = `
     <h2>${mealName}</h2>
     <img src="${mealPicture}" alt="${mealName}" width="400" height="300">
     <p>Source: <a href="${mealSource}" target="_blank">${mealSource}</a></p>
  `;
  })
  .catch(error => console.error(error));


// async function getData()
// {
//     let response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
//     let data = response.json()
//      return data;
// }
// getData()
// .then(data => console.log(data));



