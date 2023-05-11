//Vlada section
$(function () {
  const apiKeyMovie = "de64b49a91aea6e33566a226b9f72713";
  const movieURL = "https://api.themoviedb.org/3/discover/movie?";

  let mealName;
  let movieTitle;
  let localStorageData = JSON.parse(localStorage.getItem("movieMealData"));

  const saveBtn = $("<button>").addClass("btn btn-success m-2").text("Save");
  const regenerateBtn = $("<button>")
    .addClass("btn btn-secondary m-2")
    .text("Re-Generate");

  const today = dayjs().format("MMMM D, YYYY");

  //function to clear everything from homepage and generate header of generated movie/meal page
  function switchToGeneratedPage() {
    $("#welcomeTitle").addClass("hide-content");
    $("#selectionsSection").addClass("hide-content");
    $("#historySection").addClass("hide-content");

    const headerDiv = $("<div>").addClass("container");
    const goBackBtn = $("<button>")
      .addClass("btn btn-secondary")
      .text("Go Back")
      .attr("id", "goBack");
    const generatedTitle = $("<h2>").text(
      "Here are your Movie and Meal pick. Enjoy!"
    );
    const todayEl = $("<p>").text("Today: " + today);

    headerDiv.append(goBackBtn, generatedTitle, todayEl);
    $("#generatedPage").append(headerDiv);

    goBackBtn.on("click", function () {
      location.reload();
    });
  }

  // function to fetch a movie
  function pickMovie(categoryInput) {
    let selectedCategoryID = 0;

    if (categoryInput === "Romance") {
      selectedCategoryID = 10749; //id for category Romance
    } else if (categoryInput === "Fun") {
      selectedCategoryID = 35; //id for category Comedy
    } else if (categoryInput === "Thrilling") {
      selectedCategoryID = 53; //id for category Thriller
    }

    fetch(
      movieURL +
        "api_key=" +
        apiKeyMovie +
        "&language=en-US&sort_by=popularity.desc&page=1&with_genres=" +
        selectedCategoryID
    )
      .then((responseMovie) => responseMovie.json())
      .then((dataMovie) => {
        console.log(dataMovie);

        const randomMovieIndex = Math.floor(
          Math.random() * dataMovie.results.length
        );

        movieTitle = dataMovie.results[randomMovieIndex].title;
        const movieOverview = dataMovie.results[randomMovieIndex].overview;

        const moviePosterPath = dataMovie.results[randomMovieIndex].poster_path;
        const posterURL =
          "https://image.tmdb.org/t/p/original/" + moviePosterPath;

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

        $("#generatedPage").append(movieCardDiv);
      })
      .catch((error) => console.error(error));
  }

  $("#selectionsSection").on("click", ".btn", function (e) {
    e.preventDefault();
    const categoryClicked = e.target.innerHTML;
    //clearHomePage();
    //renderGeneratedPage();
    switchToGeneratedPage();
    pickMovie(categoryClicked);
    pickMeal();
    $("#generatedPage").append(saveBtn);
    saveBtn.on("click", function () {
      setLocalStorage();
    });
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

        const mealCardDiv = $("<div>")
          .attr("style", "width: 20rem;")
          .addClass("card");
        const mealImage = $("<img>")
          .addClass("card-img-top")
          .attr("src", mealPicture);
        const mealCardBodyDiv = $("<div>").addClass("card-body py-3");
        const mealTitleEl = $("<h4>").addClass("card-title").text(mealName);
        const mealParagraphEl = $("<p>").text(
          "Follow the link for full recipe:"
        );
        const mealSourceEl = $("<a>")
          .attr("href", mealSource)
          .attr("target", "blank")
          .text(mealSource);

        mealCardBodyDiv.append(mealTitleEl, mealParagraphEl, mealSourceEl);
        mealCardDiv.append(mealImage, mealCardBodyDiv);
        $("#generatedPage").append(mealCardDiv);
      })
      .catch((error) => console.error(error));
  }

  function setLocalStorage() {
    const mealFlickData = {
      movie: movieTitle,
      meal: mealName,
      date: today,
    };

    if (localStorageData === null) {
      localStorageData = [];
      localStorageData.push(mealFlickData);
    } else {
      localStorageData.push(mealFlickData);
    }
    localStorage.setItem("movieMealData", JSON.stringify(localStorageData));
  }
});
