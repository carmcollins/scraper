$(document).ready(function(){
    // Turns nav bar into hamburger menu on mobile
    $('.sidenav').sidenav();

    var API = {
        clearArticles: function() {
            return $.ajax({
                type: "DELETE",
                url: "/clear"
            });
        }
    }

    // When the user clicks on the clear button
    $("#clear-btn").on("click", function() {
        API.clearArticles();
        window.location.href = ("/");
    });
});