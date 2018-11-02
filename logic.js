// let today = whatever today's date is

function wikipedia(date) {
    // Get a random event that happened on date
    let wikipediaArticle = eventThatHappenedOn(date);
    let title = title(wikipediaArticle);
    // let place = place???(wikipediaArticle);
};

function newYorkTimes(date) {
    // Get a news article that happened today
};

$(document).on("click", "#submit-button", function () {
    let date = $("#input-box-ID").val().trim();
    // wikipedia(date)
    // newYorkTimes(date)
});

$(document).on("click", ".favorite", function() {
    // push the wiki link to an array that goes to firebase
});


wikipedia(today);
newYorkTimes(today);

// user validation: don't let them pick a date from the future, or give them 2017