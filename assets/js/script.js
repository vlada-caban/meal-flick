//Vlada section
$(function () {
  const apiKeyMovie = "de64b49a91aea6e33566a226b9f72713";
  const movieURL = "https://api.themoviedb.org/3/discover/movie?";

  const saveBtn = $("<button>").addClass("btn btn-success m-2").text("Save");
  const regenerateBtn = $("<button>")
    .addClass("btn btn-secondary m-2")
    .text("Re-Generate");

  const today = dayjs();

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

    const randomMovieIndex = Math.floor(
      Math.random() * dataMovie.results.length
    );

    const movieTitle = dataMovie.results[randomMovieIndex].title;
    const movieOverview = dataMovie.results[randomMovieIndex].overview;

    const moviePosterPath = dataMovie.results[randomMovieIndex].poster_path;
    const posterURL = "https://image.tmdb.org/t/p/original/" + moviePosterPath;

    const movieCardDiv = $("<div>").attr("style", "width: 20rem;");
    const posterImage = $("<img>")
      .addClass("card-img-top")
      .attr("src", posterURL);
    const movieCardBodyDiv = $("<div>").addClass("card-body py-3");
    const movieTitleEl = $("<h4>").addClass("card-title").text(movieTitle);
    const movieOverviewEl = $("<p>")
      .addClass("card-text py-2")
      .text(movieOverview);

    movieCardBodyDiv.append(movieTitleEl, movieOverviewEl);
    movieCardDiv.append(posterImage, movieCardBodyDiv, saveBtn, regenerateBtn);

    $("body").append(movieCardDiv); //need to append to $("#generatedMovieMeal") section
  }

  pickMovie("Thriller"); //to test

  $("#selectionsSection").on("click", ".btn", function (e) {
    e.preventDefault();
    const categoryClicked = e.target.innerHTML;

    pickMovie(categoryClicked);
    //need to add function name that fetches recipes
  });
});

//Saeeda section
