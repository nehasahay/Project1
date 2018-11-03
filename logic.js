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

        document.write(listOfEvents);

        while (listOfEvents) {
            let start = listOfEvents.indexOf("<li>") + "<li>".length;
            let end = listOfEvents.indexOf("</li>");
            let event = listOfEvents.substring(start, end);

            let dashIndex = event.indexOf("-");
            console.log(dashIndex);
            let pageIndex = event.indexOf("wiki/", dashIndex);
            console.log(pageIndex);
            let pageIndexEnd = event.indexOf("\"", pageIndex + "wiki/".length);
            console.log(pageIndexEnd);
            let imagePage = event.substring(pageIndex + "wiki/".length, pageIndexEnd);
            console.log(imagePage);
            let image = wikiImage(imagePage);
            
            // "https://commons.wikimedia.org/wiki/File:" + 

            arrayOfEvents.push(event);
            listOfEvents = listOfEvents.substring(end + "</li>".length);
        }
        console.log(arrayOfEvents);
    });
}

function wikiImage(wikipediaPage) {
    let queryURL = "https://en.wikipedia.org/w/api.php?format=json&action=parse&page="
    + wikipediaPage + "&prop=images&origin=*";
    $.ajax({
        // url: "https://en.wikipedia.org/w/api.php",
        // data: {
        //     action: "parse",
        //     format: "json",
        //     page: wikipediaPage,
        //     prop: "images",
        //     origin: "*"
        // },
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        console.log(response.parse.images[0]);
    });
}

Wikipedia();
