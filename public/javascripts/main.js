(function () {
  /* global io */
  // Check if socket is available
  if (document.getElementById('socketScript')) {
    var socket = io();
    // Generate country list, this will only be emited when the user is connecting
    socket.on('country_code_list', function (list) {
      // Empty container
      document.getElementById('countryTweetCounter').innerHTML = '';
      // Make for each country a list item
      for (var i = 0; i < list.length; i++) {
        // Make list item for single country
        document.getElementById('countryTweetCounter').innerHTML += '<div id="' + list[i].code + '" class="country"><span>' + list[i].name + '</span> <span class="counterCode">' + list[i].count + '</span></div>';
        if (list[i].count !== 0) {
          // If country count is higher then 0 show them otherwise it's hidden
          document.getElementById(list[i].code).style.display = 'block';
        }
        // Count number of total Tweets
        document.getElementById(list[i].code).style.order = '-' + list[i].count;
      }

    });

    // Update only the counter if changed, this is only to update current connections
    socket.on('country_code_list_count', function (listCount, totalCount) {
      // Update total Tweets counter
      document.getElementById('totalCounts').innerHTML = totalCount;
      // Update specific countries
      for (var i = 0; i < listCount.length; i++) {
        var targetCounter = document.getElementById(listCount[i].code).getElementsByClassName("counterCode")[0];
        if (Number(targetCounter.innerHTML) !== listCount[i].count) {
          if (Number(targetCounter.innerHTML) === 0) {
            // If targetCounter count is 0 and after this code it isn't so it needs to be displayed
            document.getElementById(listCount[i].code).style.display = 'block';
          }
          // Update the counter for the selected country
          targetCounter.innerHTML = listCount[i].count;
          // Order the countries on most Tweets, with flex order negative (CSS ordering).
          document.getElementById(listCount[i].code).style.order = '-' + listCount[i].count;
          // Indicate that in the selected country there is an update
          document.getElementById(listCount[i].code).classList.toggle('update');
        }
      }
    });
  }

})();
