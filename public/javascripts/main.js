(function () {
  /* global io */
  // Check if socket is available
  if (document.getElementById('socketScript')) {
    var socket = io();

    socket.on('sun_count', function (sunCount) {
      document.getElementById('sunCounter').innerHTML = sunCount;
    });
    socket.on('rain_count', function (rainCount) {
      document.getElementById('rainCounter').innerHTML = rainCount;
    });
  }
})();
