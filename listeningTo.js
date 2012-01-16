
;(function ( $, window, document, undefined ) {

    $.fn.listeningTo = function (username, apiKey, options) {

        var settings = $.extend({
            showCount : 3
        }, options);


        return this.each(function () {
            
            var elem = this;
            //lastFM address
            var apiUrl = "http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=" 
                            + username + "&api_key=" + apiKey + "&nowplaying=true&format=json&callback=?";
            

            function formateThisDate(time)
            {       
                    //Convert to user's timezone
                    var dateNow = new Date();
                    var localOffset = -dateNow.getTimezoneOffset();
                    var adjustedDate = new Date(time);
                    var adjustedTimeToShow;
                    var hours;
                    var minutes;
                    var minutesText;
                    var hoursText;
                    adjustedDate.setMinutes(adjustedDate.getMinutes() + localOffset);
                    
                    adjustedDate = Math.round(parseInt(dateNow.getTime() - adjustedDate.getTime())/ 60000);

                    if (adjustedDate >= 60)
                    {
                        hours = Math.floor(adjustedDate/60);
                        minutes =  adjustedDate % 60;
                        hoursText = hours === 1 ? " hour" : " hours";
                        minutesText = minutes === 1 ? " minute" : " minutes";

                        adjustedTimeToShow = hours + hoursText + minutes + minutesText;
                    }
                    else
                    {
                        minutesText = adjustedDate === 1 ? " minute" : " minutes";
                        adjustedTimeToShow = adjustedDate + minutesText;
                    }

                    return adjustedTimeToShow;
            }

            console.log(apiUrl);
            $.getJSON(apiUrl, function(data) {
                var items = [];
                
                var count = settings.showCount;
                var feed = data.recenttracks.track;
                var timeToShow;
                
                for (var i=0; i<count; i++){

                  var timeToShow = feed[i].date === undefined ? "Now Playing" : feed[i].date['#text'];
                  if (timeToShow != "Now Playing")
                  {
                     timeToShow = formateThisDate(timeToShow) + ' ago';
                  }

                  

                  items.push('<li>' + feed[i].artist['#text'] + ' - ' + feed[i].name  + ' - ' + timeToShow + '</li>');
                };

                $('<ul/>', {
                  'class': 'listeningTo',
                  html: items.join('')
                }).appendTo(elem);
            });
          });

        };

})( jQuery, window, document );