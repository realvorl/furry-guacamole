$(document).ready(function() {
    var likeinterval = null;
    var moreLogging = false;

    populateSelect();

    $("#maindiv").css("background-color","#f1f1f1");
    $("#maindiv .toggleD").prop("disabled", true);

    $("#ranger").change(function(){
      var rangeValue = $("#ranger").val();
      $("#threshold").val(rangeValue);
      localStorage.setItem("threshold", rangeValue)
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
      var list = $("#list");
      var valueToAdd = getCreatorName();
      if (valueToAdd.length >= 21) {
        valueToAdd = valueToAdd.substring(0,21) + "...";
      }
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

function populateSelect(){
  var select = $("#list");
  var elemCount = select.children().length;
  if(elemCount == 1){
    var currentList = localStorage.creatorList;
    if(currentList){
      var creators = currentList.split(";");
      $.each(creators, function(index, value){
        if (value) {
          var option = new Option(value);
          select.append(option);
          console.log(index + ": " + value);
        }
      });
    }
  }
}

function getCreatorName(){
  //#owner-name > a
  var linkname = $("#owner-name > a")[0].text;
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
  var yesliked = $("#top-level-buttons > ytd-toggle-button-renderer:nth-child(1) > a > button").attr("aria-pressed") == "true";
  var disLiked = $("#top-level-buttons > ytd-toggle-button-renderer:nth-child(2) > a > button").attr("aria-pressed") == "true";
  return yesliked || disLiked;
}

function creatorIsWhitelisted(creatorName) {
  var creatorList = localStorage.getItem("creatorList");
  if (creatorList && creatorList.indexOf(creatorName) >= 0) return true;
  return false;
}

function addCreatorToWhitelist(valueToAdd) {
  var creatorList = localStorage.getItem("creatorList");
  localStorage.setItem("creatorList" , (creatorList + ";" + valueToAdd));
}

function removeCreatorFromWhitelist(valueToRemove) {
  var creatorList = localStorage.getItem("creatorList");
  var cutStart = creatorList.indexOf(valueToRemove);
  var cutStop = cutStart + valueToRemove.length + 1;
  localStorage.setItem("creatorList", creatorList.substring(0,cutStart) + creatorList.substring(cutStop, creatorList.length));
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

function log(tag, o){
  return;
  var date = new Date();
  var tstamp = date.getMinutes() +":"+ date.getSeconds() + ":" + date.getMilliseconds();
  if (o instanceof Object) {
    console.log("###likebar#"+tstamp+"> " + tag +": "+ Object.keys(o))
    return;
  }
  console.log("###likebar#"+tstamp+"> " + tag +": "+ o)
}

log("", "likebar.js - loaded!");
