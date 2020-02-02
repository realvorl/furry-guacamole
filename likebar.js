var currentURL = "";
var creatorName = "";
$(window).ready(function () {

    populateSelect();
    reloadLastStoredValues();

    $("#maindiv").css("background-color", "#f1f1f1");
    $("#maindiv").find(".toggleD").prop("disabled", true);

    $("#ranger").change(function () {
        var rangeValue = $("#ranger").val();
        $("#threshold").text(rangeValue + "%");
        localStorage.setItem("likeThreshold", rangeValue)
    });

    $("#likeExtButtonDelegate").click(function () {
        var signedInElement = (document.getElementsByTagName("img")[0].getAttribute("alt").toLowerCase().indexOf("avatar") >= 0);
        console.log("hot reload is a possibility");
        if (!signedInElement) {
            alert("Please sign in first. You can not like videos annonimously.");
            return;
        }
        toggleExtensionActivity($(this));
        //likeButton[0].click();
        //log("","liked at: " + calculatePercentage() + " %");
    });

    $("#addToList").click(function () {
        if (!areYouWatching()) return;
        var list = $("#list");
        var valueToAdd = getCreatorName();
        if (!creatorIsWhitelisted(valueToAdd)) {
            addCreatorToWhitelist(valueToAdd);
        } else {
            return;
        }
        if (valueToAdd.length >= 21) {
            valueToAdd = valueToAdd.substring(0, 21) + "...";
        }
        var activeOption = new Option(valueToAdd);
        activeOption.setAttribute("selected", "true");
        list.append(activeOption);
    });

    $("#remFrList").click(function () {
        var option = $("#list").find("> option:selected");
        removeCreatorFromWhitelist(option.text());
        if ($("#list").children().length > 1) option.remove();
    });
});

function reloadLastStoredValues() {

    var activeExtension = localStorage.getItem("autoLIKEactive");
    var likeThreshold = localStorage.getItem("likeThreshold");
    if (activeExtension === "true") {
        toggleExtensionActivity($("#likeExtButtonDelegate"));
    }
    if (likeThreshold) {
        $("#ranger").val(parseInt(likeThreshold));
        $("#threshold").text(likeThreshold + "%");
    }
}

function toggleExtensionActivity(jQObject) {
    jQObject.toggleClass("likeON");
    jQObject.toggleClass("likeOFF");
    $("#thea").toggleClass("ON");

    var likeInterval;
    if (jQObject.hasClass("likeOFF")) {
        $("#maindiv").css("background-color", "#f1f1f1");
        $("#maindiv").find(".toggleD").prop("disabled", true);
        clearInterval(likeInterval);
        jQObject.text("AutoLIKE OFF");
        localStorage.setItem("autoLIKEactive", "false");
    } else {
        $("#maindiv").css("background-color", "#ffffff");
        $("#maindiv").find(".toggleD").prop("disabled", false);
        jQObject.text("AutoLIKE ON");
        localStorage.setItem("autoLIKEactive", "true");
        likeInterval = setInterval(function () {
            compareAndLike();
        }, 1000);
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
                    var truncatedValue = value;
                    if (truncatedValue.length >= 21) {
                        truncatedValue = truncatedValue.substring(0, 21) + "...";
                    }
                    var option = new Option(truncatedValue);
                    select.append(option);
                    //console.log(index + ": " + value);
                }
            });
        }
    }
}

function getCreatorName() {
    content = document.getElementById("meta-contents");
    allLinks = Array.from(content.getElementsByTagName("a"));
    allLinks = allLinks.filter(
            function(inelem){ 
                if (inelem.href.indexOf("channel")>=0) 
                    return inelem;
            }
        ); 
    linkname = "";
    if(allLinks && (allLinks.length > 0)) {
        linkname = allLinks[1];
    }
    creatorName = linkname.innerText;
    return creatorName;
}

function compareAndLike() {
    if (!areYouWatching()) return;
    if (!videoLiked() && creatorIsWhitelisted(getCreatorName()) && thresholdReached()) {
        likeVideo();
    }
    if ($('#moreLogging').val() == "true") log("l", "current threshold: " + $("#ranger").val() + ", current percentage: " + calculatePercentage());
}

function videoLiked() {
    content = document.getElementById("info");
    allIcons = Array.from(document.getElementsByTagName("button"));
    allIcons = allIcons.filter(function(inelem){ 
        if (inelem.hasAttribute("aria-pressed")){ 
            return inelem;
        }});
    allIcons = allIcons.filter(function(inelem){ 
        if (inelem.getAttribute("aria-label") && inelem.getAttribute("aria-label").startsWith("like this video")){
             return inelem;
        }});
    var yesliked = false;
    if (allIcons) {
        yesliked = allIcons[0].getAttribute('aria-pressed') === "true"; 
    }    
    
    if (yesliked) {
        $("#progress").css("background-color", "#5F9EA0");
    }
    // var disLiked = $("#top-level-buttons > ytd-toggle-button-renderer:nth-child(2) > a > yt-icon-button").attr("aria-pressed") == "true";
    return yesliked;// || disLiked;
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

function log(tag, o) {
    return;
    var date = new Date();
    var tstamp = date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();
    if (o instanceof Object) {
        console.log("###likebar#" + tstamp + "> " + tag + ": " + Object.keys(o))
        return;
    }
    console.log("###likebar#" + tstamp + "> " + tag + ": " + o)
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

log("", "likebar.js - loaded!");
