$(document).ready(function(){
    // Turns nav bar into hamburger menu on mobile
    $('.sidenav').sidenav();

    // Initializes pop-up modal
    $(".modal").modal();

    // Click on the CLEAR ARTICLES button
    $("#clear-btn").on("click", function() {
        $.ajax({
            type: "DELETE",
            url: "/clear"
        });

        window.location.href = ("/");
    });

    // Click on the SAVE ARTICLE button
    $(".save-btn").on("click", function() {
        var id = $(".save-btn").attr("data-id");

        $.ajax({
            type: "POST",
            url: "/save/" + id
        });

        window.location.href = ("/");
    });

    // Click on the UNSAVE ARTICLE button
    $(".unsave-btn").on("click", function() {
        var id = $(".unsave-btn").attr("data-id");

        $.ajax({
            type: "POST",
            url: "/unsave/" + id
        });

        window.location.href = ("/saved");
    });

    //Click on the COMMENT button
    $(".comment-btn").on("click", function() {
        var id = $(this).attr("data-id");

        $.ajax({
            method: "GET",
            url: "/articles/" + id
        });
    });

    // Click on the ADD COMMENT button
    $(document).on("click", ".add-comment-btn", function() {
        var id = $(this).attr("data-id");
        var body = $("#comment-input" + id).val().toString();

        $.ajax({
            method: "POST",
            url: "/add-comment/" + id,
            data: {
                comments: body
            }
        });

        $("#comment-input" + id).val("");

        location.reload();
    });

    // Click on the DELETE COMMENT button
    $(document).on("click", ".delete-comment-btn", function() {
        var id = $(this).attr("data-id");

        $.ajax({
            method: "DELETE",
            url: "/delete-comment/" + id
        });

        location.reload();
    });

});