let favArray = [];
let loggedIn = false;

$(document).ready(function () {
    $('.datepicker').datepicker();
    firebase.auth().signOut();
});


$(document).ready(function () {
    $('.modal').modal();
});

var config = {
    apiKey: "AIzaSyDOPGqntq8h2iNOJXEpfX1dhVn33fDVcHs",
    authDomain: "project1-d2b28.firebaseapp.com",
    databaseURL: "https://project1-d2b28.firebaseio.com",
    projectId: "project1-d2b28",
    storageBucket: "project1-d2b28.appspot.com",
    messagingSenderId: "842500057449"
};
firebase.initializeApp(config);

var database = firebase.database();

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
function wikiImage(wikipediaPage, event, array, index) {
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
        let wikipediaArticle = response.parse ? response.parse.text["*"] : "";
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
        } else {
            // placeholderImageURL goes here
            event["image"] = "iStock-487145924-1.jpg";
        };

        // Stores the original position since this is an asynchronous function
        event["index"] = index;
        array.push(event);
    });
};


// Gets an image for each event
function getImagesForEachThing(array) {
    let newArray = [];
    array.forEach((event, index) => {
        let eventText = event.event;

        // Gets the second link in the event text (i.e. the first link after the year)
        let dashIndex = eventText.indexOf(" – ");
        let pageIndexStart = eventText.indexOf("wiki/", dashIndex) + "wiki/".length;
        let pageIndexEnd = eventText.indexOf("\"", pageIndexStart);
        let page = eventText.substring(pageIndexStart, pageIndexEnd);
        wikiImage(page, event, newArray, index);
    });

    // Only executes the display when every event has an image
    let timer = setInterval(function () {
        if (newArray.length === array.length) displayOnPage(newArray, timer);
    }, 500);
};


// Makes a card for each event
function displayOnPage(array, timer) {
    // Sorts the array based on the index
    array.sort(function (a, b) {
        return a.index - b.index;
    });

    array.forEach(event => {
        let container = document.createElement("div");
        container.className = "col s12 m6";

        let card = document.createElement("div");
        card.className = "card large center-align";

        let cardImage = document.createElement("img");
        cardImage.className = "card-image responsive-img";
        cardImage.src = event.image;
        cardImage.alt = "";

        let cardContent = document.createElement("p");
        cardContent.className = "card-content left-align";
        cardContent.innerHTML = event.event;

        let cardFavorite = document.createElement("div");
        cardFavorite.className = "card-action";

        let favoriteButton = document.createElement("button");
        favoriteButton.className = "favorite waves-effect waves-light btn";
        favoriteButton.textContent = "favorite";
        cardFavorite.appendChild(favoriteButton);

        card.appendChild(cardImage);
        card.appendChild(cardContent);
        card.appendChild(cardFavorite);

        container.appendChild(card);
        document.getElementById("eventdump").appendChild(container);
    });
    clearInterval(timer);
};


// Grabs New York Times article
function NYTimes(dateInput) {
    let timesURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    let timesParams = {
        "api-key": "d8a8f76b018a4c2ebe800ed7adaf2607"
    };

    let startDate = moment(dateInput);
    startDate.subtract(1, 'days');

    timesParams.begin_date = startDate.format("YYYYMMDD");
    timesParams.end_date = dateInput;

    if (dateInput > moment().format("YYYYMMDD")) {
        $("#articleHeader").text("Not a valid date!");
        $("#paragraphSize").text("");
        $("#readMore").attr("href", "");
    } else {
        timesURL += '?' + $.param(timesParams);

        $.ajax({
            url: timesURL,
            method: "GET"
        }).done(function (result) {
            $("#articleHeader").text(result.response.docs[0].headline.main);
            $("#paragraphSize").text(result.response.docs[0].snippet);
            $("#readMore").attr("href", result.response.docs[0].web_url)
        });
    };
};


// Gets new events for the inputted date
document.getElementById("datepicker").addEventListener("click", event => {
    // Prevents the submit action from refreshing the page
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

    // Grabs New York Times article for the date the user input
    NYTimes(moment(input).format("YYYYMMDD"));
});


// Stores an event in Firebase
$(document).on("click", ".favorite", function () {
    console.log(loggedIn);
    if (loggedIn) {
        let wikiText = this.parentElement.previousElementSibling.innerHTML;

        let isItAlreadyAFavorite = favArray.filter(event => {
            return wikiText === event;
        });

        if (!isItAlreadyAFavorite.length) {
            // Stores the event in an array for favorites
            favArray.push(wikiText);
        };
        console.log(favArray);

        database.ref().child('users').child(uid).set({
            email: user.email,
            favorites: favArray,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

        database.ref('users/' + uid).on("value", function (snapshot) {
            var sv = snapshot.val();
            //console.log("snapshot works: " + sv.email);
            var title = sv.favorites;
            console.log(title);
            $("#fav-list").empty();
            if (favArray.length === 0) {
                favArray = title;
                console.log(favArray);
            };
            for (var i = 0; i < title.length; i++) {
                var newBullet = $("<li>");
                newBullet.addClass("collection-item")
                newBullet.html(title[i]);
                $("#fav-list").append(newBullet)
            };

        });

        this.className = "btn disabled";
    };
});

// Wikipedia(); // Gets events for December 3rd
// Gets events for today
Wikipedia(moment().format("MMMM") + "_" + moment().format("D"));

// NYTimes(); Gets New York Times Article for today
NYTimes(moment().format("YYYYMMDD"));

//-----------------Firebase Auth----------------

// Initialize Firebase


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
    console.log("user creation works");
    promise.catch(e => console.log(e.message));
    favArray = [];
});

btnLogout.addEventListener('click', e => {
    console.log("working event listener");
    firebase.auth().signOut();
});
//------------------saving user data--------------
var user;
var firebaseUser;
var email, uid;

// database.ref().child('users').child(uid).on("child_added", function (snapshot) {
//     var sv = snapshot.val();
//     console.log("snapshot works: " + sv.email);
//     var title = sv.favorites;
//     console.log(title);
// });


firebase.auth().onAuthStateChanged(firebaseUser => {
    firebaseUser = firebaseUser;

    if (firebaseUser) {
        // if logged in:
        console.log(firebaseUser);
        loggedIn = true;
        btnLogout.classList.remove('hide');
        btnLogin1.classList.add('hide');
        user = firebase.auth().currentUser;
        console.log("WORKING!" + user.email);
        $("#welcome").text("welcome: " + user.email);
        uid = firebaseUser.uid;
        console.log(uid);

        database.ref('users/' + uid).on("value", function (snapshot) {
            var sv = snapshot.val();
            //console.log("snapshot works: " + sv.email);
            var title = sv.favorites;
            console.log(title);
            $("#fav-list").empty();
            if (favArray.length === 0) {
                favArray = title;
                console.log(favArray);
            };
            for (var i = 0; i < title.length; i++) {
                var newBullet = $("<li>");
                newBullet.addClass("collection-item")
                newBullet.html(title[i]);
                $("#fav-list").append(newBullet);
            };

        });
    } else {
        //if logged out:
        console.log('not logged in');
        loggedIn = false;
        btnLogout.classList.add('hide');
        btnLogin1.classList.remove('hide');
        //modal2.classList.remove('hide');
        //var user = "none";
        $("#welcome").text(" ");
        $("#fav-list").empty();
    };

});


//-------------------firebase storage---------------

//-----------------Getting favorites----------------




//var user = firebase.auth().currentUser;
//var emailRef = user.email;
//var ref = database.ref(emailRef);

//var data = {
// wikiFavorites: "insert-wiki-array",
// timesFavorites: "insert-times-array"
//};

//ref.push(data);
//const users = firebase.database().ref().child('users')
//users.on('value', snap => {
//console.log(snap.val());
//});