$(document).ready(function() {
    createCookie("ld-show", "false", 365);
    var likeinterval = null;
    var moreLogging = false;

    $("#maindiv").css("background-color","#f1f1f1");
    $("#maindiv .toggleD").prop("disabled", true);

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
        clearInterval(likeInterval);
      } else {
        $("#maindiv").css("background-color","#ffffff");
        $("#maindiv .toggleD").prop("disabled", false);
        likeInterval = setInterval(function(){
          compareAndLike();
        }, 1000);
      }
      //likeButton[0].click();
      //log("","liked at: " + calculatePercentage() + " %");
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
      var valueToAdd = getCreatorName();
      if (!creatorIsWhitelisted(valueToAdd)) {
        addCreatorToWhitelist(valueToAdd);
      } else {
        return;
      }
      var activeOption = new Option(valueToAdd);
      activeOption.setAttribute("selected", "true");
      list.append(activeOption);
    });

    $("#remFrList").click(function(){
      var option = $("#list > option:selected");
      removeCreatorFromWhitelist(option.text());
      if($("#list").children().length > 1) option.remove();
    });
});

function getCreatorName(){
  var linkname = $("#top-row > ytd-video-owner-renderer > a")[0].href;
  var fromIdx = linkname.lastIndexOf("/") + 1;
  return linkname.substring(fromIdx, linkname.length)
}

function compareAndLike(){
  if (!videoLiked() && creatorIsWhitelisted(getCreatorName()) && thresholdReached()) {
    log("","!videoLiked:" + !videoLiked() +", creatorIsWhitelisted: "+ creatorIsWhitelisted() +", thresholdReached: "+ thresholdReached());
    likeVideo();
  }
  if ($('#moreLogging').val()=="true") log("l","current threshold: "+ $("#ranger").val() + ", current percentage: " + calculatePercentage());
}

function videoLiked() {
  return $("#top-level-buttons > ytd-toggle-button-renderer:nth-child(1) > a > button").attr("aria-pressed") == "true";
}

function creatorIsWhitelisted(creatorName) {
  var creatorList = $("#creatorList").val();
  if (creatorList.indexOf(creatorName) >= 0) return true;
  return false;
}

function addCreatorToWhitelist(valueToAdd) {
  var creatorList = $("#creatorList").val();
  $("#creatorList").val(creatorList + ";" + valueToAdd);
}

function removeCreatorFromWhitelist(valueToRemove) {
  var creatorList = $("#creatorList").val();
  var cutStart = creatorList.indexOf(valueToRemove);
  var cutStop = cutStart + valueToRemove.length + 1;
  $("#creatorList").val(creatorList.substring(0,cutStart) + creatorList.substring(cutStop, creatorList.length));
}

function thresholdReached() {
  var thresholdCurrent = parseInt($("#ranger").val());
  var videoCurrent = calculatePercentage();
  return thresholdCurrent < videoCurrent;
}

function calculatePercentage(){
  var videoPlayer = $("video").get(0);
  return videoPlayer.currentTime / videoPlayer.duration * 100;
}

function likeVideo(){
  $("#top-level-buttons > ytd-toggle-button-renderer:nth-child(1) > a")[0].click();
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
}

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
