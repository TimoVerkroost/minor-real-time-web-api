(function () {
  /* global io */
  // Check if socket is available
  if (document.getElementById('socketScript')) {
    var socket = io();
    var data = [120,230,34,45,56];
    // Generate country list
    socket.on('country_code_list', function (list, totalCount) {
      document.getElementById('countryTweetCounter').innerHTML = '';
      for (var i = 0; i < list.length; i++) {
        document.getElementById('countryTweetCounter').innerHTML += '<div id="' + list[i].code + '" class="country"><span>' + list[i].name + '</span> <span class="counterCode">' + list[i].count + '</span></div>';
        if (list[i].count !== 0) {
          document.getElementById(list[i].code).style.display = 'block';
        }
        document.getElementById(list[i].code).style.order = '-' + list[i].count;
      }

    });

    // Update only the counter if changed
    socket.on('country_code_list_count', function (listCount, totalCount) {
      document.getElementById('totalCounts').innerHTML = totalCount;
      for (var i = 0; i < listCount.length; i++) {
        var targetCounter = document.getElementById(listCount[i].code).getElementsByClassName("counterCode")[0];
        if (Number(targetCounter.innerHTML) !== listCount[i].count) {
          if (Number(targetCounter.innerHTML) === 0) {
            document.getElementById(listCount[i].code).style.display = 'block';
          }
          targetCounter.innerHTML = listCount[i].count;
          document.getElementById(listCount[i].code).style.order = '-' + listCount[i].count;
          document.getElementById(listCount[i].code).classList.toggle('update');
        }
      }
    });
  }

})();
