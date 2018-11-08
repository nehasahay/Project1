$(document).ready(() => {
    $('.datepicker').datepicker();
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


$(document).ready(() => {
    $('.modal').modal();
});


// Gets the events that happened on the date from Wikipedia
function Wikipedia(date = "December_3") {
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
    }).then(response => {
        let wikipediaArticle = response.parse.text["*"];
        let array = [];

        // Gets the bullet point list from the Selected Anniversaries page
        let listOfEvents = wikipediaArticle.substring(wikipediaArticle.indexOf("<li>"), wikipediaArticle.indexOf("</ul>"));

        // Changes all the links on the wiki page to be absolute links instead of relative
        let linkIndex = listOfEvents.indexOf("href=\"/");
        while (linkIndex !== -1) {
            listOfEvents = listOfEvents.slice(0, linkIndex + "href=\"".length) + "https://en.wikipedia.org" + listOfEvents.slice(linkIndex + "href=\"".length);
            linkIndex = listOfEvents.indexOf("href=\"/");
        };

        // Dumps each bullet point into the array until it runs out of bullet points
        while (listOfEvents) {
            let start = listOfEvents.indexOf("<li>") + "<li>".length;
            let end = listOfEvents.indexOf("</li>");
            let event = listOfEvents.substring(start, end);

            array.push({
                "event": event
            });

            listOfEvents = listOfEvents.substring(end + "</li>".length);
        };

        // Gets the images for every item in the array
        getImagesForEachThing(array);
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
            origin: "*"
        },
        method: "GET"
    }).then(response => {
        let wikipediaArticle = response.parse.text["*"];
        let infoIndex = wikipediaArticle.indexOf("class=\"infobox");

        // Only grabs an image from the infobox section
        if (infoIndex !== -1) {
            let imgSrcStart = wikipediaArticle.indexOf("src=\"//", infoIndex) + "src=\"//".length;
            let imgSrcEnd = wikipediaArticle.indexOf("\"", imgSrcStart);
            let imgSrc = wikipediaArticle.substring(imgSrcStart, imgSrcEnd);

            // Grabs the original image instead of its thumbnail
            let imgSrcThumb = imgSrc.indexOf("thumb/");
            let imgSrcThumbnail = imgSrc.lastIndexOf("/");
            imgSrc = "https://" + imgSrc.slice(0, imgSrcThumb) + imgSrc.slice(imgSrcThumb + "thumb/".length, imgSrcThumbnail);
            event["image"] = imgSrc;
            console.log(imgSrc);
        } else {
            // placeholderImageURL goes here
            event["image"] = "";
        };
    });
};


// Gets an image for each event
function getImagesForEachThing(array) {
    let promise1 = new Promise((resolve, reject) => {
        if (resolve) {
            array.forEach(event => {
                let eventText = event.event;

                // Gets the second link in the event text (i.e. the first link after the year)
                let dashIndex = eventText.indexOf(" – ");
                let pageIndexStart = eventText.indexOf("wiki/", dashIndex) + "wiki/".length;
                let pageIndexEnd = eventText.indexOf("\"", pageIndexStart);
                let page = eventText.substring(pageIndexStart, pageIndexEnd);
                wikiImage(page, event);
            });
        };
    });
    promise1.then(displayOnPage(array));
};


// Makes a card for each event
function displayOnPage(array) {
    let fragment = document.createDocumentFragment();
    array.forEach(event => {
        let card = document.createElement("div");
        card.className = "card";

        let cardImage = document.createElement("img");
        cardImage.className = "card-image";
        cardImage.src = event.image;
        cardImage.alt = "";

        let cardContent = document.createElement("p");
        cardContent.className = "card-content";
        cardContent.innerHTML = event.event;

        let cardFavorite = document.createElement("div");
        cardFavorite.className = "card-action";

        let favoriteButton = document.createElement("a"); // <button>
        favoriteButton.className = "waves-effect waves-light btn";
        favoriteButton.href = "#";
        favoriteButton.text = "favorite";
        cardFavorite.appendChild(favoriteButton);

        card.appendChild(cardImage);
        card.appendChild(cardContent);
        card.appendChild(cardFavorite);

        fragment.appendChild(card);
        console.log(card);
    });
    document.getElementById("eventdump").appendChild(fragment);
};


// function newYorkTimes(date) {
//     // Get a news article that happened today
// };


// Gets new events for the inputted date
document.getElementById("datepicker").addEventListener("click", event => {
    // prevents the submit action from refreshing the page
    event.preventDefault();

    // Empties the Wikipedia events display
    let container = document.getElementById("eventdump");
    while (container.lastChild) {
        container.removeChild(container.lastChild);
    };

    // Gets the date from the input field
    let input = document.getElementsByClassName("datepicker")[0].value.trim();
    let month = moment(input).format("MMMM");
    let day = moment(input).format("D");
    Wikipedia(month + "_" + day);
    // user validation: don't let them pick a date from the future, or give them 2017
    // newYorkTimes(date)
});


// $(document).on("click", ".favorite", function() {
//     // push the wiki link to an array that goes to firebase
// });


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