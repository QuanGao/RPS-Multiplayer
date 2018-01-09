$(document).ready(function(){
  var config = {
    apiKey: "AIzaSyA7ta-TS3GcFmLzxhl1SwZuEVIqDbzmHfc",
    authDomain: "rps-qg.firebaseapp.com",
    databaseURL: "https://rps-qg.firebaseio.com",
    projectId: "rps-qg",
    storageBucket: "rps-qg.appspot.com",
    messagingSenderId: "946643017034"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  $(".signInButton").on("click",function(){
      var userName = $(".name").val();
      if(database.ref("/players"))
  })
}) 
