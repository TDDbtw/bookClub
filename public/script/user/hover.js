$(document).ready(function () {
  // Select the tile with data-scale='1.6'
  $("#hover-tile")
    // tile mouse actions
    .on("mouseover", function () {
      $(this)
        .children(".photo")
        .css({ transform: "scale(" + $(this).attr("data-scale") + ")" })
    })
    .on("mouseout", function () {
      $(this).children(".photo").css({ transform: "scale(1)" })
    })
    .on("mousemove", function (e) {
      $(this)
        .children(".photo")
        .css({
          "transform-origin":
            ((e.pageX - $(this).offset().left) / $(this).width()) * 100 +
            "% " +
            ((e.pageY - $(this).offset().top) / $(this).height()) * 100 +
            "%",
        })
    })
    // set up the tile
    .each(function () {
      $(this)
        // add a photo container
        .append('<div class="photo"></div>')
        // some text just to show zoom level on the current item
        .append
        // '<div class="txt"><div class="x">' +
        //   $(this).attr("data-scale") +
        //   "x</div>ZOOM ON<br>HOVER</div>"
        ()
        // set up a background image for the tile based on data-image attribute
        .children(".photo")
        .css({ "background-image": "url(" + $(this).attr("data-image") + ")" })
    })

  // Add click event listener to the small tile images
  $(".smallTileImage").click(function (e) {
    e.preventDefault()

    let imageSrc = $(this).attr("src")
imageSrc=imageSrc.substring(2)
console.log(`from jq is ${imageSrc}`)
    $("#hover-tile").attr("data-image", imageSrc)

    $("#hover-tile .photo").css({ "background-image": "url(" + imageSrc + ")" })
  })
})
