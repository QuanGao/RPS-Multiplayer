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
  var player1Name;
  var player1Wins;
  var player1Losses;
  var player2Name;
  var player2Wins;
  var player2Losses;

  var playersRef = database.ref("/playerData");
  var player1Ref = database.ref("/playerData/1");
  var player2Ref = database.ref("/playerData/2"); 
  var turnsRef = database.ref("/turns"); 
  var numPlayers;
  var playerSignInRef = database.ref("/signIn"); 

player1Ref.on("value",function(snap){
  if(snap.child("name").exists()){
    player1Name = snap.val().name;
    player1Wins = snap.val().wins;
    player1Losses = snap.val().losses;
    $(".player1").find("h3").text(player1Name); 
  } else { 
    $(".player1").find("h3").text("Waiting or Player 1");
  }
})

player2Ref.on("value",function(snap){
  if(snap.child("name").exists()){
    player2Name = snap.val().name;
    player2Wins = snap.val().wins;
    player2Losses = snap.val().losses;
    $(".player2").find("h3").text(player2Name);
  } else {
    $(".player2").find("h3").text("Waiting or Player 2"); 
  }
})

  $(".signInButton").on("click",function(){
    event.preventDefault();
    var userName = $(".name").val();
    if(!player1Name){
      player1Ref.set({
        name: userName,
        wins:0,
        losses:0,
      });
    } else if(!player2Name){
      player2Ref.set({
        name: userName,
        wins:0,
        losses:0
      });
    } else {
      console.log("already has enough players!")
    }
  })




  // function displayNameScore(){
  //   $(".player"+userID).find("h3").text(userName)
  //   database.ref("players/" + userID)
  // }

  // function displayOptions(){
  //   var rock = $("<p>").text("Rock")
  //   var paper = $("<p>").text("Paper")
  //   var scissors = $("<p>").text("Scissors")
  //   $(".player"+userID).append(rock).append(paper).append(scissors);
  // }



//monitor how many people are on the RPS sites.
  var connectedRef = database.ref(".info/connected");
  var connectionsRef = database.ref("/connections");
  connectedRef.on("value",function(snap){
    console.log(snap.val());
    if(snap.val()){
      var con = connectionsRef.push(true);
      console.log("user connected");
      con.onDisconnect().remove()
    }   
  })
  var numConnections;
  connectionsRef.on("value",function(snap){
    numConnections = snap.numChildren();
    console.log(numConnections);
  })
 

}) 
