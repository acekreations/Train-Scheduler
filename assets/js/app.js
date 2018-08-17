// Initialize Firebase
var config = {
  apiKey: "AIzaSyDgrGSf0TLk9D4fsXhVmWq7g3Pkxlru7sU",
  authDomain: "train-schedule-8e1e8.firebaseapp.com",
  databaseURL: "https://train-schedule-8e1e8.firebaseio.com",
  projectId: "train-schedule-8e1e8",
  storageBucket: "train-schedule-8e1e8.appspot.com",
  messagingSenderId: "898255199621"
};
firebase.initializeApp(config);

var database = firebase.database();

function nextArrival(firstTrain, frequency) {
  var firstTrainTime = moment(firstTrain, "HH:mm");
  var difference = moment().diff(firstTrainTime, 'minutes');
  var result = ((difference / frequency) + 1) * frequency;
  result = result - difference;
  result = moment().add(result, "minutes").format("h:mma");
  return result;
}

function minutesAway(firstTrain, frequency) {
  var firstTrainTime = moment(firstTrain, "HH:mm");
  var difference = moment().diff(firstTrainTime, 'minutes');
  var result = ((difference / frequency) + 1) * frequency;
  result = result - difference;
  result = Math.round(result);
  return result;
}

$(function(){

  database.ref().on("child_added", function(snapshot){
    var tableRow = $("<tr>");
    var trainName = $("<td>").text(snapshot.val().trainName);
    var destination = $("<td>").text(snapshot.val().destination);
    var frequency = $("<td>").text(snapshot.val().frequency);
    var nextArrivalTime = $("<td>");
    var minutesAwayTime = $("<td>");

    nextArrivalTime.text(nextArrival(snapshot.val().firstTrainTime, snapshot.val().frequency));
    minutesAwayTime.text(minutesAway(snapshot.val().firstTrainTime, snapshot.val().frequency));


    tableRow.append(trainName, destination, frequency, nextArrivalTime, minutesAwayTime);

    $("#tableBody").append(tableRow);


  }, function(errorObject){
    console.log(errorObject);
  });

  $("#submitBtn").on("click", function(){
    event.preventDefault();

    var trainName = $("#trainName").val();
    var destination = $("#destination").val();
    var firstTrainTime = $("#firstTrainTime").val();
    var frequency = $("#frequency").val();



    database.ref().push({
      trainName: trainName,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequency: frequency
    });

  });




});
