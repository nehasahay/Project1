let arrayOfEvents = [];

// // let today = whatever today's date is

// function wikipedia(date) {
//     // Get a random event that happened on date
//     let wikipediaArticle = eventThatHappenedOn(date);
//     let title = title(wikipediaArticle);
//     // let place = place???(wikipediaArticle);
// };
$(document).ready(function () {
    $('.datepicker').datepicker();
});


var instance = M.Carousel.init({
    fullWidth: true,
    indicators: true
});


$('.carousel.carousel-slider').carousel({
    fullWidth: true,
    indicators: true
});


//make a function to create array for database or somehting
//initialize a variable fwith an empty array of object?
//var myArray = [];
// for (var i = 0; i < 3; i++) {
//     var myObj = {};
//     for (var x = 0; x < 1; x++) {
//         myObj["URL" + x] = "val" + x;
//     }
//     myArray.push(myObj);
// }
// console.log(myArray)


$(document).ready(function () {
    $('.modal').modal();
});


function Wikipedia(date = "December_3") {
    // let queryURL = "https://en.wikipedia.org/w/api.php?format=json&action=parse&page=Wikipedia:Selected_anniversaries/" + date;
    // let queryURL = "https://en.wikipedia.org/w/api.php?format=json&action=parse&text={{Wikipedia:Selected_anniversaries/" + date + "}}&contentmodel=wikitext"

    $.ajax({
        url: "https://en.wikipedia.org/w/api.php",
        data: {
            action: "parse",
            format: "json",
            text: "{{Wikipedia:Selected_anniversaries/" + date + "}}",
            contentmodel: "wikitext",
            origin: "*"
        },
        method: "GET"
    }).then(function (response) {
        let wikipediaArticle = response.parse.text["*"];

        let listOfEvents = wikipediaArticle.substring(wikipediaArticle.indexOf("<li>"), wikipediaArticle.indexOf("</ul>"));
        arrayOfEvents = [];
        let linkIndex = listOfEvents.indexOf("href=\"/");

        while (linkIndex !== -1) {
            listOfEvents = listOfEvents.slice(0, linkIndex + "href=\"".length) + "https://en.wikipedia.org" + listOfEvents.slice(linkIndex + "href=\"".length);
            linkIndex = listOfEvents.indexOf("href=\"/");
        }

        // document.write(listOfEvents);

        while (listOfEvents) {
            let start = listOfEvents.indexOf("<li>") + "<li>".length;
            let end = listOfEvents.indexOf("</li>");
            let event = listOfEvents.substring(start, end);

            arrayOfEvents.push({
                "event": event
            });
            listOfEvents = listOfEvents.substring(end + "</li>".length);
        }
        console.log(arrayOfEvents);
    });
}


function wikiImage(wikipediaPage) {
    $.ajax({
        url: "https://en.wikipedia.org/w/api.php",
        data: {
            action: "parse",
            format: "json",
            page: wikipediaPage,
            prop: "images",
            origin: "*"
        },
        method: "GET"
    }).then(function (response) {

    });
};


function getImagesForEachThing(array) {
    array.forEach(event => {
        let dashIndex = event.indexOf(" – ");
        let pageIndex = event.indexOf("wiki/", dashIndex);
        let pageIndexEnd = event.indexOf("\"", pageIndex + "wiki/".length);
        let imagePage = event.substring(pageIndex + "wiki/".length, pageIndexEnd);
        console.log(imagePage);
        // won't work because of asynchronous calls, use .done() or something
        let image = "https://commons.wikimedia.org/wiki/File:" + wikiImage(imagePage);
        console.log(image);

        wikiImage()
    });
};


Wikipedia();


// function newYorkTimes(date) {
//     // Get a news article that happened today
// };

// $(document).on("click", "#submit-button", function () {
//     let date = $("#input-box-ID").val().trim();
//     // wikipedia(date)
//     // newYorkTimes(date)
// });

// $(document).on("click", ".favorite", function() {
//     // push the wiki link to an array that goes to firebase
// });


// wikipedia(today);
// newYorkTimes(today);

// // user validation: don't let them pick a date from the future, or give them 2017

// document.write("stuff you get from parse.text")