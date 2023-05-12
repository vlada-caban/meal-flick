$(function () {
  const apiKeyMovie = "de64b49a91aea6e33566a226b9f72713";
  const movieURL = "https://api.themoviedb.org/3/discover/movie?";

  const movieMealDiv = $("<div>").addClass("card-group");
  const movieCardDiv = $("<div>").addClass("card");
  const mealCardDiv = $("<div>").addClass("card");

  let mealName;
  let movieTitle;
  let localStorageData = JSON.parse(localStorage.getItem("movieMealData"));

  const saveBtn = $("<button>")
    .addClass("btn btn-success m-2").attr("id", "saveBtn").text("Save")
    .attr("type", "button")
    .attr("data-bs-toggle", "modal")
    .attr("data-bs-target", "#saveConfirmation");

  const regenerateBtn = $("<button>")
    .addClass("btn btn-secondary m-2")
    .text("Re-Generate");

  const today = dayjs().format("MMMM D, YYYY");

  //function to render data from local storage to the page
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

      const clearStorage = $("<button>")
      .addClass("btn btn-secondary")
      .text("Clear History")
      .attr("id", "clearHistory");

      tableTr.append(tableTh1, tableTh2, tableTh3);
      tableHeader.append(tableTr);
      historyTable.append(tableHeader);

      for (let i = 0; i < localStorageData.length; i++) {
        movieTitleToRender = localStorageData[i].movie;
        mealToRender = localStorageData[i].meal;
        dateToRender = localStorageData[i].date;

        let entryTr = $("<tr>");
        let entryTd1 = $("<td>").text(dateToRender);
        let entryTd2 = $("<td>").text(movieTitleToRender);
        let entryTd3 = $("<td>").text(mealToRender);
        entryTr.append(entryTd1, entryTd2, entryTd3);
        tableBody.append(entryTr);
      }
      historyTable.append(tableBody);
      $("#historySection").append(historyHeader, historyTable, clearStorage);
    }
  }

  renderFromStorage();

  $("#clearHistory").on("click", function (e) {
    e.preventDefault(e);
    localStorage.clear();
    location.reload();
  });

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

        const posterImage = $("<img>")
          .addClass("card-img-ready")
          .attr("src", posterURL).attr("id", "movieImg");
        const movieCardBodyDiv = $("<div>").addClass("card-body py-3");
        const movieTitleEl = $("<h4>").addClass("card-title").text(movieTitle);
        const movieOverviewEl = $("<p>")
          .addClass("card-text py-2")
          .text(movieOverview);

        movieCardBodyDiv.append(movieTitleEl, movieOverviewEl);
        movieCardDiv.append(posterImage, movieCardBodyDiv);

      })
      .catch((error) => console.error(error));
  }

  function pickMeal() {
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
      .then((response) => response.json())
      .then((data) => {
        const meal = data.meals[0];
        mealName = meal.strMeal;
        const mealPicture = meal.strMealThumb;
        const mealSource = meal.strSource;

        const mealImage = $("<img>")
          .addClass("card-img-ready")
          .attr("src", mealPicture)
          .attr("id", "mealImg");
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

  $("#selectionsSection").on("click", ".btn", function (e) {
    e.preventDefault();
    const categoryClicked = e.target.innerHTML;

    switchToGeneratedPage();
    pickMovie(categoryClicked);
    pickMeal();

    movieMealDiv.append(movieCardDiv, mealCardDiv);
    $("#generatedPage").append(movieMealDiv, saveBtn);

    saveBtn.on("click", function () {
      $("#confirmSave").on("click", function () {
        setLocalStorage();
        $("#saveConfirmation").modal("toggle");
      });
    });
  });
});
