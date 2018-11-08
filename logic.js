let arrayOfEvents = [];


$(document).ready(function () {
    var timesURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    var timesParams = { "api-key": "d8a8f76b018a4c2ebe800ed7adaf2607" };

    timesParams.begin_date = moment().format("YYYYMMDD");
    // timesParams.end_date = moment().format("YYYYMMDD");

    timesURL += '?' + $.param(timesParams);

    $.ajax({
        url: timesURL,
        method: "GET"
    }).done(function (result) {
        $("#articleHeader").append(result.response.docs[0].headline.main);
        $("#paragraphSize").append(result.response.docs[0].snippet);
        $("#readMore").attr("href", result.response.docs[0].web_url)
    });
});

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

// Gets the events that happened on the date from Wikipedia
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

        // Gets the bullet point list from the Selected Anniversaries page
        let listOfEvents = wikipediaArticle.substring(wikipediaArticle.indexOf("<li>"), wikipediaArticle.indexOf("</ul>"));

        // Empties the array for the new date
        arrayOfEvents = [];

        // Changes all the links on the wiki page to be absolute links instead of relative
        let linkIndex = listOfEvents.indexOf("href=\"/");
        while (linkIndex !== -1) {
            listOfEvents = listOfEvents.slice(0, linkIndex + "href=\"".length) + "https://en.wikipedia.org" + listOfEvents.slice(linkIndex + "href=\"".length);
            linkIndex = listOfEvents.indexOf("href=\"/");
        }

        // Dumps each bullet point into the array until it runs out of bullet points
        while (listOfEvents) {
            let start = listOfEvents.indexOf("<li>") + "<li>".length;
            let end = listOfEvents.indexOf("</li>");
            let event = listOfEvents.substring(start, end);

            arrayOfEvents.push({
                "event": event
            });
            listOfEvents = listOfEvents.substring(end + "</li>".length);
        };

        // Gets the images for every item in the array
        getImagesForEachThing();
    });
};


// Gets the header image from a Wikipedia page
function wikiImage(wikipediaPage, event) {
    $.ajax({
        url: "https://en.wikipedia.org/w/api.php",
        data: {
            action: "parse",
            format: "json",
            page: wikipediaPage,
            // prop: "images",
            origin: "*"
        },
        method: "GET"
    }).then(function (response) {
        let wikipediaArticle = response.parse.text["*"];
        let infoIndex = wikipediaArticle.indexOf("class=\"infobox");

        // Only grabs an image from the infobox section
        if (infoIndex !== -1) {
            let imgSrcStart = wikipediaArticle.indexOf("src=\"//", infoIndex);
            let imgSrcEnd = wikipediaArticle.indexOf("\"", imgSrcStart + "src=\"//".length);
            let imgSrc = wikipediaArticle.substring(imgSrcStart + "src=\"//".length, imgSrcEnd);

            // Grabs the original image instead of its thumbnail
            let imgSrcThumb = imgSrc.indexOf("thumb/");
            let imgSrcThumbnail = imgSrc.lastIndexOf("/");
            imgSrc = "https://" + imgSrc.slice(0, imgSrcThumb) + imgSrc.slice(imgSrcThumb + "thumb/".length, imgSrcThumbnail);
            event["image"] = imgSrc;
        } else {
            // placeholderImageURL goes here
            event["image"] = "";
        };
    });
};


// Gets an image for each event
function getImagesForEachThing() {
    arrayOfEvents.forEach(event => {
        let eventText = event.event;

        // Gets the second link in the event text (i.e. the first link after the year)
        let dashIndex = eventText.indexOf(" – ");
        let pageIndexStart = eventText.indexOf("wiki/", dashIndex);
        let pageIndexEnd = eventText.indexOf("\"", pageIndexStart + "wiki/".length);
        let page = eventText.substring(pageIndexStart + "wiki/".length, pageIndexEnd);
        wikiImage(page, event);
    });
    console.log(arrayOfEvents);
};


// function newYorkTimes(date) {
//     // Get a news article that happened today
// };


// Gets new events for the inputted date
$(document).on("click", "#datepicker", function (event) {
    event.preventDefault();
    let input = $(".datepicker").val().trim();
    console.log(input);
    let month = moment(input).format("MMMM");
    let day = moment(input).format("D");
    Wikipedia(month + "_" + day);
    // user validation: don't let them pick a date from the future, or give them 2017
    // newYorkTimes(date)
});


// $(document).on("click", ".favorite", function() {
//     // push the wiki link to an array that goes to firebase
// });

Wikipedia();

// Wikipedia(); // Gets events for December 3rd
// Gets events for today
Wikipedia(moment().format("MMMM") + "_" + moment().format("D"));
// newYorkTimes(today);
//-----------------Firebase Auth----------------

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDOPGqntq8h2iNOJXEpfX1dhVn33fDVcHs",
    authDomain: "project1-d2b28.firebaseapp.com",
    databaseURL: "https://project1-d2b28.firebaseio.com",
    projectId: "project1-d2b28",
    storageBucket: "project1-d2b28.appspot.com",
    messagingSenderId: "842500057449"
};
firebase.initializeApp(config);

const txtEmail = document.getElementById('email');
const txtPassword = document.getElementById('password');
const btnLogin = document.getElementById('btnlogin');
const btnSignup = document.getElementById('btnsignup');
const btnLogout = document.getElementById('btnlogout');
const btnLogin1 = document.getElementById('login1');
const modal2 = document.getElementById('modal2');

btnLogin.addEventListener('click', e => {
    const email = txtEmail.value;
    const password = txtPassword.value;
    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch(e => console.log(e.message));
});

btnSignup.addEventListener('click', e => {
    const email = txtEmail.value;
    const password = txtPassword.value;
    const auth = firebase.auth();
    //TODO: (maybe) check for real email
    const promise = auth.createUserWithEmailAndPassword(email, password);
    promise.catch(e => console.log(e.message));
});  

btnLogout.addEventListener('click', e => {
    firebase.auth().signOut();
});

firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log(firebaseUser);
        btnLogout.classList.remove('hide');
        btnLogin1.classList.add('hide');
        modal2.classList.add('hide');

    } else {
        console.log('not logged in');
        btnLogout.classList.add('hide');
        btnLogin1.classList.remove('hide');
        modal2.classList.remove('hide');
    }
});