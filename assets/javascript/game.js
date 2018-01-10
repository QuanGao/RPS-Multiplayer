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
  var userID = 1;
  var connectedRef = database.ref(".info/connected");
  var connectionsRef = database.ref("/connections");

  $(".signInButton").on("click",function(){
    event.preventDefault();
    var userName = $(".name").val();
 
})
  function writePlayer(userID, name){
    database.ref("players/" + userID).set({
      playerName: userName,
      wins:0,
      losses:0
    })
  }  


  connectedRef.on("value",function(snap){
    console.log(snap.val());
    if(snap.val()){
      var con = connectionsRef.push(true);
      console.log("user connected");
      con.onDisconnect().remove()
    }   
  })
  var numPlayers;
  connectionsRef.on("value",function(snap){
    numPlayers = snap.numChildren();
    console.log(numPlayers);
  })
 

}) 
