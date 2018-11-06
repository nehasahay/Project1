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
        let arrayOfEvents = [];
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

            let dashIndex = event.indexOf(" – ");
            let pageIndex = event.indexOf("wiki/", dashIndex);
            let pageIndexEnd = event.indexOf("\"", pageIndex + "wiki/".length);
            let imagePage = event.substring(pageIndex + "wiki/".length, pageIndexEnd);
            console.log(imagePage);
            let image = "https://commons.wikimedia.org/wiki/File:" + wikiImage(imagePage);
            console.log(image);

            arrayOfEvents.push(event);
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
        console.log(response);
        console.log(response.parse.images[0]);
    });
}

Wikipedia();

//-----------------Firebase Auth----------------

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        document.getElementById("user_div").style.display = "block";
        document.getElementById("login_div").style.display = "none";
        var user = firebase.auth().currentUser;
        if (user != null) {
            var email_id = user.email;
            document.getElementById("user_para").innerHTML = "Welcome User : " + email_id;
        }
    } else {
        // No user is signed in.
        document.getElementById("user_div").style.display = "none";
        document.getElementById("login_div").style.display = "block";
    }
});
function login() {
    var userEmail = document.getElementById("email_field").value;
    var userPass = document.getElementById("password_field").value;
    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert("Error : " + errorMessage);
    });
}
function logout() {
    firebase.auth().signOut();
}