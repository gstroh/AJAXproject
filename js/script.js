
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $wikiHeaderElem = $('#wikipedia-header');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('So, you want to live at ' + address + '?');
    // YOUR CODE GOES HERE!
    var imgCSS = '<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' +
        address + '">';
    //console.log(imgCSS);
    $body.append(imgCSS);

    var nytURL = 'http://api.nytimes.com/svc/search/v2/articlesearch.json' +
              '?q=' + cityStr + '&sort=newest&api-key=fda1372ca32d3b64f158b1463d8eb783:10:74255335';
    $.getJSON(nytURL, function (data) {
        $nytHeaderElem.text('New York Times Articles About ' + cityStr);
        //var items = [];
        var articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class ="article">' +
                '<a href="' + article.web_url + '">' + article.headline.main +
                '</a>' + '<p>' + article.snippet + '</p>' + '</li>');
        };
    }).error(function(e) {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("Failed to get Wikipedia Resources");
    }, 8000);

    var wikiURL =   'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr +
                    '&format=json&callback=wikiCallback';
    $.ajax({
        url: wikiURL,
        dataType: 'jsonp',
        success: function(response) {
            var articleList = response[1];
            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            };
            //console.log(response);
            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);
