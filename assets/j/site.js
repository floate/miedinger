function equalHeight($columns, className, media, context){
	/* ****
	DESCRIPTION
		Creates equal height columns for CSS layout
		Adds <style> to header of document, allowing media type targeting

	INPUT: 
		* $columns
			jQuery object of all columns
			default: NULL/nil

		* className
			name of class to add to each column (a random number is appended to this value)
			default: 'equalHeight' 

		* media
			css media to target
			default: 'screen, projection, handheld'

		* context
			css context to add to selector in <style> section
			eg context='#content' will output #content .equalHeight-xxxx {}
			default: '' (empty string)

	RETURN: className with random number appendix

	DEPENDENCIES:
		jQuery
		SOUPGIANT.base.createStyleRule()
	**** */
	if ($columns == null) {
		//function called incorrectly, exit
		return null;
	}
	$columns = $($columns);
	if (className == null) {
		className = 'equalHeight';
	}
	if (media == null) {
		media = 'screen, projection, handheld'; //default
	}
	if (context == null) {
		context = '';
	} else {
		context = ' ' + context + ' ';
	}

	var classRandom = Math.floor(Math.random()*999999),
		tallestCol = 0,classDeclaration,ie6Declaration;
	className = className + '-' + classRandom;
	$columns.each(function (){
		var $this = $(this);
		if ($this.height() > tallestCol) {
			tallestCol = $this.height();
		}
		$this.addClass(className);
	});

	//create css declaration
	// className = '.' + className;
	classDeclaration = 'min-height: ' + tallestCol + 'px; ';
	classDeclaration += '_height: ' + tallestCol + 'px;';
	createStyleRule(context + ' .' + className, classDeclaration, media);

	return className; //in case it's needed for later manipulation
}

function createStyleRule(selector, rule, media){
	/* ****
	DESCRIPTION
		Adds <style> to header of document, allowing media type targeting

	INPUT: 
		* selector
			css selector
			default: NULL/nil

		* rule
			css properties
			default: NULL/nill

		* media
			css media to target
			default: 'screen, projection, handheld'


	RETURN: NULL/nil

	DEPENDENCIES: NULL/nil

	CREDIT: http://rule52.com/2008/06/css-rule-page-load/

	changes
	- added media to passed variables

	**** */

	// create a stylesheet

	if (media == null) {
		media = 'screen, projection, handheld';
	}

	var id = 'jsgen-css-' + media.replace(/[^a-zA-Z0-9]+/g,''),
		headElement = document.getElementsByTagName("head")[0],
		styleElement = document.getElementById(id);

	if (styleElement == null) {
		styleElement = document.createElement("style");
		styleElement.id = id;
		styleElement.type = "text/css";
		styleElement.media = media;
		headElement.appendChild(styleElement);
	}


	if (selector == null || rule == null) {
		return;
	}

	if (styleElement.styleSheet) {
		if (styleElement.styleSheet.cssText == '') {
			styleElement.styleSheet.cssText = '';
		}
		styleElement.styleSheet.cssText += selector + " { " + rule + " }";
	} 
	else {
		styleElement.appendChild(document.createTextNode(selector + " { " + rule + " }"));
	}

}


    function linkify_tweet(tweet) {
		var link_exp = /(^|\s)(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		tweet = tweet.replace(link_exp, " <a href='$2'>$2</a> ");
		tweet = tweet.replace(/(^|\s|.)@(\w+)/g, " $1<a href=\"http://www.twitter.com/$2\">@$2</a> ");
		return tweet.replace(/(^|\s)#(\w+)/g, " $1<a href=\"http://search.twitter.com/search?q=%23$2\">#$2</a> ");
 };

	function relative_time(time_value) {
		var split_date = time_value.split(" "),
			the_date = new Date(split_date[1] + " " + split_date[2] + ", " + split_date[5] + " " + split_date[3] + " UTC"),
			now = new Date(),
			delta = (now.getTime() - the_date.getTime()) / 1000,
			monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
				"Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

		if(delta < 60) {
			return 'less than a minute ago';
		}
		else if(delta < 120) {
			return 'about a minute ago';
		}
		else if(delta < (45*60)) {
			return (parseInt(delta / 60)).toString() + ' minutes ago';
		}
		else if(delta < (90*60)) {
			return 'about an hour ago';
		}
		else if(delta < (24*60*60)) {
			return 'about ' + (parseInt(delta / 3600)).toString() + ' hours ago';
		}
		else if(delta < (48*60*60)) {
			return '1 day ago';
		}
		else {
			return the_date.getDate() + ' ' + monthNames[the_date.getMonth()];
			// return (parseInt(delta / 86400)).toString() + ' days ago';
		}
	}



function recent_tweets(data) {

	var out;
	out = '<h2 class="widget-title"><i class="ico ico-tw"></i> Twitter Feed</h2>';
	out = out + '<div class="widget-body"><ul class="widget-list">';

	for (var i=0;i<data.length;i++) {
		data[i].text = linkify_tweet(data[i].text);
		out = out + '<li>';
		out = out + data[i].text;
		out = out + '  <span class="widget-time">';
		out = out + '<a href=\"http://twitter.com/' + twitterUsername + '/status/';
		out = out + (data[i].id_str ? data[i].id_str : data[i].id) + '\">';
		out = out + relative_time(data[i].created_at);
		out = out + '</a>';
		out = out + '</span></li>';
	}

	out = out + '</ul></div>';

	document.getElementById("wgttw").innerHTML = out;

}
/**
 * Plugin: jquery.zRSSFeed
 * 
 * Version: 1.0.1
 * (c) Copyright 2010, Zazar Ltd
 * 
 * Description: jQuery plugin for display of RSS feeds via Google Feed API
 *              (Based on original plugin jGFeed by jQuery HowTo)
 * 
 * Modified by Richard Mackney (originally for Instagram images, see https://gist.github.com/865838)
 * Modified further by Marie Mosley for a Pinterest "gadget" for Blogger.
 * Tutorial for use with Blogspot at: http://www.codeitpretty.com/2012/03/pinterest-gadget-for-blogger.html
 **/

(function($){

	var current = null; 

	$.fn.rssfeed = function(url, options) {	

		// Set plugin defaults
		var defaults = {
			limit: 6,
			titletag: 'h3',
			content: true,
			snippet: true,
			showerror: false,
			errormsg: '',
			key: null
		};  
		var options = $.extend(defaults, options); 

		// Functions
		return this.each(function(i, e) {
			var $e = $(e);

			// Add feed class to user div
			if (!$e.hasClass('rssFeed')) $e.addClass('rssFeed');

			// Check for valid url
			if(url == null) return false;

			// Create Google Feed API address
			var api = "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q=" + url;
			if (options.limit != null) api += "&num=" + options.limit;
			if (options.key != null) api += "&key=" + options.key;

			// Send request
			$.getJSON(api, function(data){

				// Check for error
				if (data.responseStatus == 200) {

					// Process the feeds
					_callback(e, data.responseData.feed, options);
				} else {

					// Handle error if required
					if (options.showerror)
						if (options.errormsg != '') {
							var msg = options.errormsg;
						} else {
							var msg = data.responseDetails;
						};
						$(e).html('<div class="rssError"><p>'+ msg +'</p></div>');
				};
			});				
		});
	};


	// Callback function to create HTML result
	var _callback = function(e, feeds, options) {
		if (!feeds) {
			return false;
		}
		var html = '';	
		var row = 'odd';	



		// Add body
		html += '<h2 class="widget-title"><i class="ico ico-pi"></i> Recent Pins</h2>   <div class="widget-body">' +
			'<ul class="widget-list">';

		// Add feeds
		for (var i=0; i<feeds.entries.length; i++) {

			// Get individual feed
			var entry = feeds.entries[i];


			// Add feed row
			html += '<li class=\"' + row + '\">' ;
			// if (options.date) html += '<div>'+ pubDate +'</div>'
			if (options.content) {

				// Use feed snippet if available and optioned
				if (options.snippet && entry.contentSnippet != '') {
					var content = entry.contentSnippet;
				} else {
					var content = entry.content;
				}



				html += content;
			}

			html += '</li>';


			// Alternate row classes
			if (row == 'odd') {
				row = 'even';
			} else {
				row = 'odd';
			}			
		}

		html += '</ul>' +
			'</div>'

		$(e).html(html);
		equalHeight('.content,.sidebar');

		//correct href for images so they point to Pinterest
		$(function() {
  			$('#wgtpi .widget-list a[href^="/pin"]').each(function() {
    			var href = $(this).attr('href');
    			$(this).attr('href', 'http://www.pinterest.com' + href);
  			});
		});


	};
})(jQuery);





$(document).ready(function () {
	if (typeof pinterestUsername == "string") {
		$('#wgtpi').rssfeed('http://www.pinterest.com/' + pinterestUsername + '/feed.rss', {
			limit: 6,
			snippet: false,
			header: false,
			date: false
		});
	}



	equalHeight('.content,.sidebar');

});

