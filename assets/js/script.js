$(function () {
  const apiKeyMovie = "de64b49a91aea6e33566a226b9f72713";
  const movieURL = "https://api.themoviedb.org/3/discover/movie?";

  const movieMealDiv = $("<div>").addClass("card-group");
  const movieCardDiv = $("<div>").addClass("card");
  const mealCardDiv = $("<div>").addClass("card");
  let movieID;

  let mealName;
  let mealSource;

  let movieTitle;
  let detailsURL;

  let localStorageData = JSON.parse(localStorage.getItem("movieMealData"));

  const regenerateMealBtn = $("<button>")
    .addClass("btn btn-secondary mx-auto")
    .attr("id", "changeMeal")
    .text("Change Meal");

  const regenerateMovieBtn = $("<button>")
    .addClass("btn btn-secondary mx-auto")
    .attr("id", "changeMovie")
    .text("Change Movie");

  const saveBtn = $("<button>")
    .addClass("btn btn-success m-2")
    .attr("id", "saveBtn")
    .text("Save")
    .attr("type", "button")
    .attr("data-bs-toggle", "modal")
    .attr("data-bs-target", "#saveConfirmation");

  const goBackBtn = $("<button>")
    .addClass("btn btn-secondary")
    .text("Go Back")
    .attr("id", "goBack");

  const clearStorage = $("<button>")
    .addClass("btn btn-secondary")
    .text("Clear History")
    .attr("id", "clearHistory");

  const today = dayjs().format("MMMM D, YYYY");

  //event listener for clear history button to clear local storage
  clearStorage.on("click", function (e) {
    e.preventDefault(e);
    localStorage.clear();
    location.reload();
  });

  //function to render data from local storage to the homepage
  function renderFromStorage() {
    if (localStorageData !== null) {
      let movieTitleToRender;
      let mealToRender;
      const historyHeader = $("<h3>").text("Saved History:").addClass("my-3");
      const historyTable = $("<table>").addClass("table table-striped");
      const tableHeader = $("<thead>");
      const tableTr = $("<tr>");
      const tableTh1 = $("<th>").attr("scope", "col").text("Date");
      const tableTh2 = $("<th>").attr("scope", "col").text("Movie");
      const tableTh3 = $("<th>").attr("scope", "col").text("Meal");
      const tableBody = $("<tbody>");

      tableTr.append(tableTh1, tableTh2, tableTh3);
      tableHeader.append(tableTr);
      historyTable.append(tableHeader);

      for (let i = 0; i < localStorageData.length; i++) {
        movieTitleToRender = localStorageData[i].movie;
        movieLinkToRender = localStorageData[i].movieLink;
        mealToRender = localStorageData[i].meal;
        mealLinkToRender = localStorageData[i].mealLink;
        dateToRender = localStorageData[i].date;

        let entryTr = $("<tr>");
        let entryTd1 = $("<td>").text(dateToRender);

        //movie to render
        let entryTd2 = $("<td>");
        if (movieLinkToRender === "") {
          entryTd2.text(movieTitleToRender);
        } else {
          let entryMovieLinkEl = $("<a>")
            .attr("href", movieLinkToRender)
            .attr("target", "blank")
            .text(movieTitleToRender);
          entryTd2.append(entryMovieLinkEl);
        }

        //meal to render
        let entryTd3 = $("<td>");
        if (mealLinkToRender === "") {
          entryTd3.text(mealToRender);
        } else {
          let entryMealLinkEl = $("<a>")
            .attr("href", mealLinkToRender)
            .attr("target", "blank")
            .text(mealToRender);
          entryTd3.append(entryMealLinkEl);
        }

        entryTr.append(entryTd1, entryTd2, entryTd3);
        tableBody.append(entryTr);
      }
      historyTable.append(tableBody);
      $("#historySection").append(historyHeader, historyTable, clearStorage);
    }
  }

  //calling the function to render history to the homepage page on load
  renderFromStorage();

  //function to clear everything from homepage and generate header of generated movie/meal page
  function switchToGeneratedPage(category) {
    $("#welcomeTitle").addClass("hide-content");
    $("#selectionsSection").addClass("hide-content");
    $("#historySection").addClass("hide-content");

    const headerDiv = $("<div>").addClass("container");

    const generatedTitle = $("<h2>").text(
      "You selected: " +
        category +
        ". Here are your Movie and Meal pick. Enjoy!"
    );
    const todayEl = $("<p>").text("Today: " + today);

    headerDiv.append(generatedTitle, todayEl);
    $("#generatedPage").append(headerDiv);
  }

  // function to fetch a movie based on category input from the user
  function pickMovie(categoryInput) {
    let selectedCategoryID = 0;
    movieCardDiv.text("");
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

        const posterImage = $("<img>")
          .addClass("card-img-ready")
          .attr("src", posterURL)
          .attr("id", "movieImg");
        const movieCardBodyDiv = $("<div>").addClass(
          "card-body py-3 d-flex justify-content-between flex-column"
        );
        const movieTitleEl = $("<h4>").addClass("card-title").text(movieTitle);
        const movieOverviewEl = $("<p>")
          .addClass("card-text py-2")
          .text(movieOverview);

        //getting movie ID to see details for the movie
        movieID = dataMovie.results[randomMovieIndex].id;
        console.log(movieID);
        detailsURL = "https://www.themoviedb.org/movie/" + movieID;
        console.log(detailsURL);
        const sourcePEl = $("<p>");
        const movieSourceEl = $("<a>")
          .attr("href", detailsURL)
          .attr("target", "blank")
          .text("See movie details");
        sourcePEl.append(movieSourceEl);
        movieCardBodyDiv.append(
          movieTitleEl,
          movieOverviewEl,
          sourcePEl,
          regenerateMovieBtn
        );
        movieCardDiv.append(posterImage, movieCardBodyDiv);

        regenerateMovieBtn.on("click", function () {
          pickMovie(categoryInput);
        });
      })
      .catch((error) => console.error(error));
  }

  //function to fetch a random meal
  function pickMeal() {
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
      .then((response) => response.json())
      .then((data) => {
        mealCardDiv.text("");
        const meal = data.meals[0];
        mealName = meal.strMeal;
        const mealPicture = meal.strMealThumb;
        const mealCategory = meal.strCategory;
        const mealArea = meal.strArea;
        mealSource = meal.strSource;

        //checking if meal source is blank to regenerate meal that has source
        if (mealSource === "" || mealSource === null) {
          pickMeal();
        }

        const mealImage = $("<img>")
          .addClass("card-img-ready")
          .attr("src", mealPicture)
          .attr("id", "mealImg");
        const mealCardBodyDiv = $("<div>").addClass(
          "card-body py-3 d-flex justify-content-between flex-column"
        );
        const mealTitleEl = $("<h4>").addClass("card-title").text(mealName);

        const mealCategoryEl = $("<p>").text("Category: " + mealCategory);

        const mealAreaEl = $("<p>").text("Area: " + mealArea);

        const sourceMoviePEl = $("<p>");
        const mealSourceEl = $("<a>")
          .attr("href", mealSource)
          .attr("target", "blank")
          .text("See full recipe");
        sourceMoviePEl.append(mealSourceEl);

        mealCardBodyDiv.append(
          mealTitleEl,
          mealCategoryEl,
          mealAreaEl,
          sourceMoviePEl,
          regenerateMealBtn
        );

        mealCardDiv.append(mealImage, mealCardBodyDiv);

        regenerateMealBtn.on("click", function () {
          pickMeal();
        });
      })
      .catch((error) => console.error(error));
  }

  //function to save movie, meal and date to the storage
  function setLocalStorage() {
    const mealFlickData = {
      movie: movieTitle,
      movieLink: detailsURL,
      meal: mealName,
      mealLink: mealSource,
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

  //event listener for homepage when user selects category
  $("#selectionsSection").on("click", ".btn", function (e) {
    e.preventDefault();
    const categoryClicked = e.target.innerHTML;
    switchToGeneratedPage(categoryClicked);
    pickMovie(categoryClicked);
    pickMeal();

    movieMealDiv.append(movieCardDiv, mealCardDiv);
    $("#generatedPage").append(movieMealDiv, goBackBtn, saveBtn);

    goBackBtn.on("click", function () {
      location.reload();
    });

    saveBtn.on("click", function () {
      setLocalStorage();

      $("#confirmSave").on("click", function () {
        $("#saveConfirmation").modal("toggle");
      });
    });
  });
});
