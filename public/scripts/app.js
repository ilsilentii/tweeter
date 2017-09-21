/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Test / driver code (temporary). Eventually will get this from the server.

$(document).ready(function() {

    function createTweetElement(tweetData) {
        var $article = $("<article>").addClass("tweet")

        var $header = $("<header>").addClass("tweet-header")
            .append($("<img>").addClass("user-avatar").attr("src", tweetData.user.avatars.small))
            .append($("<h1>").addClass("user-name").text(tweetData.user.name))
            .append($("<span>").addClass("user-handle").text(tweetData.user.handle))

        var $main = $("<main>").addClass("tweet-content")
            .append($("<p>").text(tweetData.content.text))

        var $icons = $("<div>").addClass("tweet-actions")
            .append($("<i>").addClass("fa fa-heart"))
            .append($("<i>").addClass("fa fa-flag"))
            .append($("<i>").addClass("fa fa-retweet"))

        var $footer = $("<footer>").addClass("tweet-footer")
            .append($("<div>").addClass("tweet-timestamp"))
            .append($("<span>").text(tweetData.created_at))
            .append($icons);

        var $combine = $article.append($header).append($main).append($footer);

        return $combine;
    }

    /////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////

    $("#compose").click(function() {
        $("#compose_tweet").slideToggle();
        $("#tweet-input").select();
        $('html, body').animate({
            scrollTop: '0px'
        }, 300);
    });

    //////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////

    function loadPreviousTweets() {
        $.ajax({
            url: 'http://localhost:8080/tweets',
            method: 'GET',
            success: function(TweetObject) {
                renderPreviousTweets(TweetObject)
            }
        })
    }

    loadPreviousTweets();

    function renderPreviousTweets(tweet) {
        for (let x in tweet) {
            let $tweet = createTweetElement(tweet[tweet.length - x - 1]);
            $('#tweets-container').append($tweet);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////

    var $button = $('#tweetbtn')
    $button.on('click', function() {
        var x;
        x = document.getElementById("tweet-input").value;
        if (x == "") {
            alert("Please Enter a Tweet");
            return false;
        };
    })


    $('form').submit(function(event) {

        event.preventDefault();
        var str = $('form').serialize()
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/tweets',
            data: str,
            encode: true,
            success: function() {
                document.getElementById('tweet-input').value = '';
                loadTweets();
            }
        })
    });

    function loadTweets() {
        $.ajax({
            url: 'http://localhost:8080/tweets',
            method: 'GET',
            success: function(TweetObject) {
                var tweet_array = TweetObject[TweetObject.length - 1]
                let $tweet = createTweetElement(tweet_array)
                $('#tweets-container').prepend($tweet);
                console.log("hurray")
                $('#tweets-container .tweet:first-child').hide().delay(100).slideDown(600)
            }
        })
    }
});