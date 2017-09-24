$(document).ready(function() {
    //Sets the count to 1 to alernate between background colors(even or odd)
    var count = 1;

    //This Function creates the Tweet
    //Has a onClick function to toggle the heart to red
    //Changes the background of the tweet between grey and light grey

    function createTweetElement(tweetData) {

        count = count + 1;

        var $icons = $("<div>").addClass("tweet-actions")
            .append($("<i>").addClass("fa fa-heart clicked"))
            .append($("<i>").addClass("fa fa-flag"))
            .append($("<i>").addClass("fa fa-retweet"));


        var $article = $("<article>").addClass("tweet");

        var $header = $("<header>").addClass("tweet-header")
            .append($("<img>").addClass("user-avatar").attr("src", tweetData.user.avatars.small))
            .append($("<img>").addClass("arrow").attr("src", "../images/arrow.png"))
            .append($("<main>").addClass("tweet-content")
                .append($("<h1>").addClass("user-name").text(tweetData.user.name))
                .append($("<span>").addClass("user-handle").text(tweetData.user.handle))
                .append($("<p>").text(tweetData.content.text))
                .append($("<footer>").addClass("tweet-footer")
                    .append($("<div>").addClass("tweet-timestamp"))
                    .append($("<span>").addClass('tweet-time').text(moment(tweetData.created_at).fromNow()))
                    .append($icons)));

        var $combine = $article.append($header);

        $combine.find(".clicked").click(function() {
            $(this).toggleClass("red");
        })

        function changecolor(color) {

            if (count % 2 == 0) {
                color.css("background-color", "#f2f2f2");
            } else {
                color.css("background-color", "#d6d6d6");
            }
        }

        changecolor($combine.find(".tweet-header"));

        return $combine;
    }

    //This function opens and closes the Tweet Creation. It scolls to the top once clicked.

    $(".compose_btn").click(function() {
        $("#compose_tweet").slideToggle();
        $("#tweet-input").select();
        $('html, body').animate({
            scrollTop: '0px'
        }, 300);
    });

    //This function grabs all the tweets in the database

    function loadPreviousTweets() {
        $.ajax({
            url: 'http://localhost:8080/tweets',
            method: 'GET',
            success: function(TweetObject) {
                renderPreviousTweets(TweetObject);
            }
        })
    }

    loadPreviousTweets();

    //This function takes the tweets that have been grabbed from the database and renders them to the page through the CreateTweetElement function

    function renderPreviousTweets(tweet) {
        for (let x in tweet) {
            let $tweet = createTweetElement(tweet[tweet.length - x - 1]);
            $('#tweets-container').append($tweet);
        }


    }

    //This is the form submission where someone enters their tweet in the textbox.
    //This function takes that text and writes it to the database and uses the loadTweets function to render it to the page
    //This function will stop users from going over 140 characters and will give an error when submitting a blank tweet


    $('form').submit(function(event) {
        var x;
        x = document.getElementById("tweet-input").value;
        if (x == "") {
            alert("Please Enter a Tweet");
            return false;
        };
        event.preventDefault();
        var str = $('form').serialize();
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/tweets',
            data: str,
            encode: true,
            success: function() {
                $('#counter').text("140")
                document.getElementById('tweet-input').value = '';
                loadTweets();
            }
        })
    });

    // This function grabs tweets from the database and renders only the last tweet that was created

    function loadTweets() {
        $.ajax({
            url: 'http://localhost:8080/tweets',
            method: 'GET',
            success: function(TweetObject) {
                var tweet_array = TweetObject[TweetObject.length - 1];
                let $tweet = createTweetElement(tweet_array);
                $('#tweets-container').prepend($tweet);
                $('#tweets-container .tweet:first-child').hide().delay(100).slideDown(600);
            }
        })
    }

    //This function runs every 30 seconds and updates the time the tweet was sent

    setInterval(function() {
        $.ajax({
            url: 'http://localhost:8080/tweets',
            method: 'GET',
            success: function(tweetData) {
                for (let i = tweetData.length - 1; i >= 0; i--) {
                    $('.tweet-time').eq(tweetData.length - 1 - i).text(moment(tweetData[i].created_at).fromNow())
                }
            }
        })
    }, 30000);
});