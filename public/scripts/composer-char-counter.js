$(document).ready(function() {
    $("#tweet-input").attr('maxlength', '140');
    $('textarea').keyup(function() {
        var left = 140 - $(this).val().length;
        $('.counter').text(left);
    })
})