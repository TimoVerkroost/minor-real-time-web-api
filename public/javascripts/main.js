(function () {
  /* global io */
  // Check if socket is available
  if (document.getElementById('socketScript')) {
    var socket = io();

    socket.on('country_list', function (list) {
      document.getElementById('countryList').innerHTML = list;
    });
    socket.on('country_code_list', function (list) {
      document.getElementById('countryCodeList').innerHTML = list;
    });
  }
})();
