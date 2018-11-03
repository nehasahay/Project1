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