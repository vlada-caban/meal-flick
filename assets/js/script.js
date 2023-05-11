//Vlada section
$(function () {
  const apiKeyMovie = "de64b49a91aea6e33566a226b9f72713";
  const movieURL = "https://api.themoviedb.org/3/discover/movie?";

  let mealName = "";
  let movieTitle = "";
  let localStorageData = JSON.parse(localStorage.getItem("movieMealData"));

  const saveBtn = $("<button>").addClass("btn btn-success m-2").text("Save");
  const regenerateBtn = $("<button>")
    .addClass("btn btn-secondary m-2")
    .text("Re-Generate");

  const today = dayjs();

  //function to clear everything from homepage
  function clearHomePage() {
    $("#welcomeTitle").addClass("hide-content");
    $("#selectionsSection").addClass("hide-content");
    $("#historySection").addClass("hide-content");
  }

  // function to fetch a movie
  async function pickMovie(categoryInput) {
    let selectedCategoryID = 0;

    if (categoryInput === "Romance") {
      selectedCategoryID = 10749; //id for category Romance
    } else if (categoryInput === "Fun") {
      selectedCategoryID = 35; //id for category Comedy
    } else if (categoryInput === "Thrilling") {
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

    const randomMovieIndex = Math.floor(
      Math.random() * dataMovie.results.length
    );

    movieTitle = dataMovie.results[randomMovieIndex].title;
    const movieOverview = dataMovie.results[randomMovieIndex].overview;

    const moviePosterPath = dataMovie.results[randomMovieIndex].poster_path;
    const posterURL = "https://image.tmdb.org/t/p/original/" + moviePosterPath;

    const movieCardDiv = $("<div>")
      .attr("style", "width: 20rem;")
      .addClass("card");
    const posterImage = $("<img>")
      .addClass("card-img-top")
      .attr("src", posterURL);
    const movieCardBodyDiv = $("<div>").addClass("card-body py-3");
    const movieTitleEl = $("<h4>").addClass("card-title").text(movieTitle);
    const movieOverviewEl = $("<p>")
      .addClass("card-text py-2")
      .text(movieOverview);

    movieCardBodyDiv.append(movieTitleEl, movieOverviewEl);
    movieCardDiv.append(posterImage, movieCardBodyDiv);

    $("#generatedPage").append(movieCardDiv); //need to append to $("#generatedMovieMeal") section
  }

  $("#selectionsSection").on("click", ".btn", function (e) {
    e.preventDefault();
    const categoryClicked = e.target.innerHTML;
    clearHomePage();
    pickMovie(categoryClicked);
    pickMeal();
    //need to add function name that fetches recipes
  });

  //Saeeda section

  function pickMeal() {
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
      .then((response) => response.json())
      .then((data) => {
        const meal = data.meals[0];
        mealName = meal.strMeal;
        const mealPicture = meal.strMealThumb;
        const mealSource = meal.strSource;

        const mealCardDiv = $("<div>").attr("style", "width: 20rem;").addClass("card");
        const mealImage = $("<img>")
          .addClass("card-img-top")
          .attr("src", mealPicture);
        const mealCardBodyDiv = $("<div>").addClass("card-body py-3");
        const mealTitleEl = $("<h4>").addClass("card-title").text(mealName);
        const mealParagraphEl = $("<p>").text("Follow the link for full recipe:");
        const mealSourceEl = $("<a>")
          .attr("href", mealSource)
          .attr("target", "blank")
          .text(mealSource);

        mealCardBodyDiv.append(mealTitleEl, mealParagraphEl, mealSourceEl);
        mealCardDiv.append(mealImage, mealCardBodyDiv);
        $("#generatedPage").append(mealCardDiv);
        // console.log(`Meal Name: ${mealName}`);
        // console.log(`Meal Picture: ${mealPicture}`);
        // console.log(`Meal Source: ${mealSource}`);
        //  mealElement.innerHTML = `
        //  <h2>mealName</h2>
        //  <img src="mealPicture}" alt="mealName}" width="400" height="300">
        //  <p>Source: <a href="mealSource}" target="_blank">mealSource}</a></p>
      })
      .catch((error) => console.error(error));
  }

  function setLocalStorage(movieTitle, mealName, today) {
    const mealFlickData = { movie: movieTitle, meal: mealName, date: today };

    localStorage.setItem();
  }
});
