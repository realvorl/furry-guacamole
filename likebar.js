$(document).ready(function() {
    createCookie("ld-show", "false", 365);

    $("#ranger").change(function(){
      $("#threshold").text($(this).val() + "%")
    })

    $("#setThreshold").click(function(){
      createCookie("threshold", $("#ranger").val(), 365)
    })

    $("#likeExtButtonDelegate").click(function(){
      $(this).toggleClass("like");
      $(this).toggleClass("dislike");
      if($(this).hasClass("dislike")){
        $("#maindiv").css("background-color","#f1f1f1");
        $("#maindiv .toggleD").prop("disabled", true);
      } else {
        $("#maindiv").css("background-color","#ffffff");
        $("#maindiv .toggleD").prop("disabled", false);
      }
      //likeButton[0].click();
      log("","liked at: " + percentage + " %");
    });

    $("#disLikeExtButtonDelegate").click(function(){
      var videoPlayer = $("video").get(0);
      var dislikeButton = $("#watch8-sentiment-actions > span > span:nth-child(3) > button");
      var percentage = videoPlayer.currentTime / videoPlayer.duration * 100;
      dislikeButton.click();
      log("","disliked at: " + percentage + " %");
    });

    $("#addToList").click(function(){
      var cookieName = "LikeList";
      var list = $("#list");
      var valueToAdd = $("#owner-name > a").text();
      list.append(new Option(valueToAdd));
      var listFromCookie = readCookie(cookieName);
      if (listFromCookie) {
        if(listFromCookie.indexOf(valueToAdd) < 0){
          listFromCookie = listFromCookie + "; " + valueToAdd;
        }
        createCookie(cookieName,"",-1);
        createCookie(cookieName, listFromCookie, 365);
      } else {
        createCookie(cookieName, valueToAdd, 365);
      }
    });

    $("#remFrList").click(function(){
      var option = $("#list > option:selected");
      if($("#list").children().length > 1) option.remove();
    });
});

function calculatePercentage(){
  var videoPlayer = $("video").get(0);
  return videoPlayer.currentTime / videoPlayer.duration * 100;
}

function createCookie(name, value, days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "; expires=" + date.toGMTString();
  }
  else var expires = "";
  document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}setThreshold

function updateCookie(name){
  var cookie = readCookie(name);
}

function log(tag, o){
  var date = new Date();
  var tstamp = date.getMinutes() +":"+ date.getSeconds() + ":" + date.getMilliseconds();
  if (o instanceof Object) {
    console.log("###likebar#"+tstamp+"> " + tag +": "+ Object.keys(o))
    return;
  }
  console.log("###likebar#"+tstamp+"> " + tag +": "+ o)
}

log("", "likebar.js - loaded!");
