var currentURL = "";
var creatorName = "";
var likeInterval = null;
var wasInitialised = false;
var watchdog = null;

if (chrome.extension) {
  //console.log("chrome.extension");
  var url = chrome.extension.getURL('likebar.html');
  var height = "40px";
  var div = "<div w3-include-html='" + url + "'></div>";
  //var script = "<script src=\""+scriptUrl+"\" type=\"text/javascript\"></script>\"";
  $('body').prepend(div);
  w3.includeHTML();
  $(document).ready(function () {
    //console.log("popup.js:: document ready");
    $('body').append(mainAnchor());
  });

  watchdog = setInterval(function () {
    if (wasInitialised) {
      clearInterval(watchdog);
      console.log("AUTOLIKE:: Initialised!");
    }
    if ($("#ranger")) {
      doItAll();
      wasInitialised = true;
    } 
  }, 1000);
}

function mainAnchor() {
  var oLink = document.createElement("a");

  oLink.title = "AUTOlike v2 Settings.";
  oLink.text = "❤";
  oLink.id = "thea";

  oLink.onclick = function () {

    //console.log("popup.js:: onclick ❤ ");
    var toggle = $("#maindiv").css("display");
    if (toggle == "none") {
      //console.log("popup.js:: doing it all");
      $("#maindiv").show("slow", "swing", function () {
        $('ytd-app').css({
          '-webkit-transform': 'translateY(40px)'
        });
      });
    } else {
      $("#maindiv").hide("slow", "swing", function () {
        $('ytd-app').css({
          '-webkit-transform': 'translateY(0)'
        });
      });
    }
  }
  return oLink;
}

function doItAll() {

  //console.log("likebar.js:: window.ready")
  if (wasInitialised) {
    return;
  } else {
    wasInitialised = true;
  }

  populateSelect();
  reloadLastStoredValues();

  document.getElementById("ranger").addEventListener("input", function () {
    var rangeValue = $("#ranger").val();
    $("#threshold").text(rangeValue + "%");
    localStorage.setItem("likeThreshold", rangeValue)
  });

  if (!likeInterval) {
    likeInterval = setInterval(function () {
      compareAndLike();
    }, 1000);
  }

  $("#addToList").click(function () {
    doItAll
    if (!areYouWatching()) {
      alert("This only works when you are watching a video");
      return;
    }
    var list = $("#list");
    var valueToAdd = getCreatorName();
    if (creatorIsWhitelisted(valueToAdd)) {
      alert(valueToAdd + " is already on your AUTOLIKE creator list")
      return;
    } else {
      addCreatorToWhitelist(valueToAdd);
    }
    //console.log("will add:" + valueToAdd);
    var activeOption = new Option(valueToAdd);
    activeOption.setAttribute("selected", "true");
    list.append(activeOption);
  });

  $("#remFrList").click(function () {
    var option = $("#list").find("> option:selected");
    removeCreatorFromWhitelist(option.text());
    if ($("#list").children().length > 0) option.remove();
  });
}

function reloadLastStoredValues() {

  var likeThreshold = localStorage.getItem("likeThreshold");

  if (likeThreshold) {
    $("#ranger").val(parseInt(likeThreshold));
    $("#threshold").text(likeThreshold + "%");
  }

}

function areYouWatching() {
  return (window.location.href.indexOf("/watch?") > 0);
}

function populateSelect() {
  var select = $("#list");
  var elemCount = select.children().length;
  if (elemCount == 1) {
    var currentList = localStorage.creatorList;
    if (currentList) {
      var creators = currentList.split(",");
      $.each(creators, function (index, value) {
        if (value) {
          var option = new Option(value);
          select.append(option);
          //console.log(index + ": " + value);
        }
      });
    }
  }
}

function getCreatorName() {
  chelment = document.getElementById("meta-contents");
  links = Array.from(chelment.getElementsByTagName("a"));
  ret = "";
  for (i in links) {
    link = links[i];
    if (link.text)
      if (link.href.indexOf("channel") > 0) {
        //console.log(link.text);
        ret = link.text;
        break;
      }
  }
  return ret;
}

function compareAndLike() {
  if (!areYouWatching()) return;
  if (thresholdReached() && !videoLiked() && creatorIsWhitelisted(getCreatorName())) {
    likeVideo();
  }
}

function videoLiked() {
  menuContainer = document.getElementById("menu-container");
  allIcons = Array.from(menuContainer.getElementsByTagName("button"));
  var yesliked = false;
  if (allIcons) {
    yesliked = allIcons[0].getAttribute('aria-pressed') === "true";
  }
  return yesliked;
}

function creatorIsWhitelisted(creatorName) {
  var creatorList = localStorage.getItem("creatorList");
  if (creatorList && creatorList.indexOf(creatorName) >= 0) return true;
  return false;
}

function addCreatorToWhitelist(valueToAdd) {
  var creatorList = localStorage.getItem("creatorList");
  if (creatorList) {
    creatorList = creatorList.replace("null,", "").trim();
    var creatorArray = creatorList.split(",");
    creatorArray.push(valueToAdd);
    sortCreators(creatorArray);
    localStorage.setItem("creatorList", creatorArray.join(","));
  } else {
    localStorage.setItem("creatorList", valueToAdd);
  }

}

function removeCreatorFromWhitelist(valueToRemove) {
  var creatorList = localStorage.getItem("creatorList");
  if (creatorList) {
    creatorList = creatorList.replace("null,", "").trim();
    var creatorArray = creatorList.split(",");
    creatorArray = creatorArray.filter(function (creator) {
      return !(creator == valueToRemove)
    });
    localStorage.setItem("creatorList", creatorArray);
  }
}

function thresholdReached() {
  var thresholdCurrent = parseInt($("#ranger").val());
  var videoCurrent = calculatePercentage();
  $("#progress").text(videoCurrent.toFixed(1) + "%");
  return thresholdCurrent < videoCurrent;
}

function calculatePercentage() {
  var videoPlayer = $("video").get(0);
  return videoPlayer.currentTime / videoPlayer.duration * 100;
}

function likeVideo() {
  $("#top-level-buttons > ytd-toggle-button-renderer:nth-child(1) > a")[0].click();
}

function sortCreators(array) {
  if (array) {
    array.sort(ascending)
  }
}

function ascending(a, b) {
  var nameA = a.toUpperCase();
  var nameB = b.toUpperCase();
  if (nameA < nameB) {
    return -1;
  } else {
    return 1
  }
}
