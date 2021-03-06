(function () {
  /* global io */
  // Get country container
  var countryContainer = document.getElementById('countryTweetCounter');
  // Get hash container
  var hashtagList = document.getElementById('hashtagList');
  // Error container
  var errorContainer = document.getElementById('error');
  // Filter Container
  var filterContainer = document.getElementById('filterSelection');
  // Check if socket is available
  if (document.getElementById('socketScript')) {
    var socket = io();
    // Generate country list, this will only be emited when the user is connecting
    // Check if country container exist
    if (countryContainer) {
      socket.on('country_code_list', function (list) {
        // Empty container
        // Make for each country a list item
        for (var i = 0; i < list.length; i++) {
          // Update country when their is an update is available.
          if (list[i].count !== 0) {
            // If country count is higher then 0 show them otherwise it's hidden
            document.getElementById(list[i].code).style.display = 'flex';
          }
          // Count number of total Tweets
          document.getElementById(list[i].code).style.order = '-' + list[i].count;
        }
      });
    }
    // Update only the counter if changed, this is only to update current connections
    socket.on('country_code_list_count', function (listCount, totalCount) {
      // Update total Tweets counter
      document.getElementById('totalCounts').innerHTML = totalCount;
      // Update specific countries
      // Check if country container exist
      if (countryContainer) {
        for (var i = 0; i < listCount.length; i++) {
          // Get each counter of the countries
          var targetCounter = document.getElementById(listCount[i].code).getElementsByClassName('counterCode')[0];
          // Check if counter exist
          if (Number(targetCounter.innerHTML) !== listCount[i].count) {
            // Check if counter is 0 and if is 0 show it because it will be +1 after this loop
            if (Number(targetCounter.innerHTML) === 0) {
              // If targetCounter count is 0 and after this code it isn't so it needs to be displayed
              document.getElementById(listCount[i].code).style.display = 'flex';
            }
            // Update the counter for the selected country
            targetCounter.innerHTML = listCount[i].count;
            // Order the countries on most Tweets, with flex order negative (CSS ordering).
            document.getElementById(listCount[i].code).style.order = '-' + listCount[i].count;
            // Indicate that in the selected country there is an update
            document.getElementById(listCount[i].code).classList.toggle('update');
          }
        }
      }
    });
    // Update country top 5 hashtags when click on country
    countryContainer.addEventListener('click', function (event) {
      topHashCounter(socket, event.target.id);
    });
    // Update counter based on the Hash that is generated from the country code, update after every 500ms
    setInterval(function () {
      var gethashID = window.location.hash.substr(8);
      if (gethashID) {
        topHashCounter(socket, gethashID);
      }
    }, 500);
    // Handle errors in when something went wrong with the Twitter streaming API
    socket.on('error_handle', function () {
      // Show error container
      errorContainer.style.display = 'block';
      // Hide count containers
      countryContainer.style.display = 'none';
      filterContainer.style.display = 'none';
    });
  }
  // Hash counter for top 5 hashtags blockID = the id of the country block
  function topHashCounter(socket, blockID) {
    // Request for top hashtags of country
    socket.emit('get_top_hashtags', socket.id, blockID);
    // Response from server for top hashtags of the selected country
    socket.on('response_top_hashtags', function (countryName, topHashtags) {
      // Fill in the selected country name
      document.getElementById('topHashTitle').innerHTML = countryName;
      // Empty container
      // Make list item for each hashtag [0] = hashtag name, [1] = total counts of the hashtag
      var getTagElements = document.getElementsByClassName("tag");
      // Check if their are hashtags saved
      if(topHashtags){
        // Fill in the top Hash counters
        for (var i = 0; i < topHashtags.length; i++) {
          getTagElements[i].innerHTML = '<span>#' + topHashtags[i][0] + '</span> <span class="counterTag">' + topHashtags[i][1] + '</span>';
        }
      }
    });
  }
})();
