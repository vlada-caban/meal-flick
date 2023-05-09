//Vlada section

const apiKeyMovie = "de64b49a91aea6e33566a226b9f72713";
const movieURL = "https://api.themoviedb.org/3/discover/movie?";

// function to fetch a movie
async function pickMovie(categoryInput) {
  let selectedCategoryID = 0;

  if (categoryInput === "Romance") {
    selectedCategoryID = 10749; //id for category Romance
  } else if (categoryInput === "Fun") {
    selectedCategoryID = 35; //id for category Comedy
  } else if (categoryInput === "Thriller") {
    selectedCategoryID = 53; //id for category Thriller
  }

   const responseMovie = await fetch(
    movieURL +
      "api_key=" +
      apiKeyMovie +
      "&language=en-US&sort_by=popularity.desc&page=1&with_genres=" +
      selectedCategoryID
  );

  const dataMovie = await responseMovie.json();

  console.log(dataMovie);

//   for (let i = 0; i < dataMovie.results.length; i++) {


  //}
}

$("#selectionSection").on("click", ".btn", function (e) {
  e.preventDefault();
  const categoryClicked = e.target.innerHTML;
  pickMovie(categoryClicked);
  //need to add function name that fetches recipes 
});

//Saeeda section
