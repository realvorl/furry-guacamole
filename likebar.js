$(document).ready(function() {
    var likeinterval = null;
    var moreLogging = false;

    populateSelect();
    reloadLastStoredValues();

    $("#maindiv").css("background-color","#f1f1f1");
    $("#maindiv .toggleD").prop("disabled", true);

    $("#ranger").change(function(){
      var rangeValue = $("#ranger").val();
      $("#threshold").text(rangeValue + "%");
      localStorage.setItem("likeThreshold", rangeValue)
    })

    $("#likeExtButtonDelegate").click(function(){

      if($(this).hasClass("likeOFF") && !areYouWatching()) {
        alert("Start watching a video before you enable me.");
        return;
      }
      var signedInElement = $("#buttons > ytd-topbar-menu-button-renderer:nth-child(4)");
      if (signedInElement == null || signedInElement.length == 0) {
        alert("Please sign in first. You can not like videos annonimously.");
        return;
      }
      toggleExtensionActivity($(this));
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
      if (!areYouWatching()) return;
      var list = $("#list");
      var valueToAdd = getCreatorName();
      if (!creatorIsWhitelisted(valueToAdd)) {
        addCreatorToWhitelist(valueToAdd);
      } else {
        return;
      }
      if (valueToAdd.length >= 21) {
        valueToAdd = valueToAdd.substring(0,21) + "...";
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

function reloadLastStoredValues(){

  var activeExtension = localStorage.getItem("autoLIKEactive");
  var likeThreshold = localStorage.getItem("likeThreshold");
  if (activeExtension == "true") {
    toggleExtensionActivity($("#likeExtButtonDelegate"));
  }
  if (likeThreshold) {
    $("#ranger").val(parseInt(likeThreshold));
    $("#threshold").text(likeThreshold + "%");
  }
}

function toggleExtensionActivity(jQObject){
  jQObject.toggleClass("likeON");
  jQObject.toggleClass("likeOFF");
  $("#thea").toggleClass("ON");

  if(jQObject.hasClass("likeOFF")){
    $("#maindiv").css("background-color","#f1f1f1");
    $("#maindiv .toggleD").prop("disabled", true);
    clearInterval(likeInterval);
    jQObject.text("AutoLIKE OFF");
    localStorage.setItem("autoLIKEactive","false");
  } else {
    var videoPlaing = $("video");
    $("#maindiv").css("background-color","#ffffff");
    $("#maindiv .toggleD").prop("disabled", false);
    jQObject.text("AutoLIKE ON");
    localStorage.setItem("autoLIKEactive","true");
    likeInterval = setInterval(function(){
      compareAndLike();
    }, 1000);
  }
}

function areYouWatching(){
  return (window.location.href.indexOf("/watch?") > 0);
}

function populateSelect(){
  var select = $("#list");
  var elemCount = select.children().length;
  if(elemCount == 1){
    var currentList = localStorage.creatorList;
    if(currentList){
      var creators = currentList.split(";");
      $.each(creators, function(index, value){
        if (value) {
          var truncatedValue = value;
          if (truncatedValue.length >= 21) {
            truncatedValue = truncatedValue.substring(0,21) + "...";
          }
          var option = new Option(truncatedValue);
          select.append(option);
          //console.log(index + ": " + value);
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
  if (!areYouWatching()) return;
  if (!videoLiked() && creatorIsWhitelisted(getCreatorName()) && thresholdReached()) {
    likeVideo();
  }
  if ($('#moreLogging').val()=="true") log("l","current threshold: "+ $("#ranger").val() + ", current percentage: " + calculatePercentage());
}

function videoLiked() {
  var yesliked = $("#top-level-buttons > ytd-toggle-button-renderer:nth-child(1) > a > button").attr("aria-pressed") == "true";
  if (yesliked) {
    $("#progress").css("background-color", "#5F9EA0");
  }
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
  var creatorArray = creatorList.split(";");
  creatorArray.push(valueToAdd);
  sortCreators(creatorArray);
  localStorage.setItem("creatorList", creatorArray.join(";"));
}

function removeCreatorFromWhitelist(valueToRemove) {
  var creatorList = localStorage.getItem("creatorList");
  var creatorArray = creatorList.split(";");
  creatorArray.filter(function(creator){return !(creator==valueToRemove)});
  localStorage.setItem("creatorList", creatorArray);
}

function thresholdReached() {
  var thresholdCurrent = parseInt($("#ranger").val());
  var videoCurrent = calculatePercentage();
  $("#progress").text(videoCurrent.toFixed(1)+"%");
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

function sortCreators(array){
  if (array) {
    array.sort(ascending)
  }
}

function ascending(a, b){
  var nameA = a.toUpperCase();
  var nameB = b.toUpperCase();
  if (nameA < nameB) {
    return -1;
  } else {
    return 1
  }
}

log("", "likebar.js - loaded!");
