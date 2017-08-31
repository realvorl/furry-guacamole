
$(function() {
    createCookie("ld-show", "false", 365);

    $("#ranger").change(function(){
      $("#threshold").text($(this).val() + "%")
    })

    var dlikeButton = $("#watch8-sentiment-actions > span > span:nth-child(2) > button");
    var ddislikeButton = $("#watch8-sentiment-actions > span > span:nth-child(4) > button");

    $("#setThreshold").click(function(){
      createCookie("threshold", $("#ranger").val(), 365)
    })

    $("#likeExtButtonDelegate").click(function(){
      var videoPlayer = $("video").get(0);
      var likeButton = $("#watch8-sentiment-actions > span > span:nth-child(1) > button");
      var percentage = videoPlayer.currentTime / videoPlayer.duration * 100;
      likeButton.click();
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
      var valueToAdd = $(".yt-user-info > a").text();
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

    var Li = document.createElement("li");
    Li.innerHTML = '<li id="likeExtensionInjected" class="guide-channel guide-notification-item overflowable-list-item" role="menuitem"><a style="padding-bottom: 5px;" class="guide-item yt-uix-sessionlink yt-valign spf-link" href="#" title="AutoLike"><span class="yt-valign-container"><button id="autoLikeEnable" class="thumb guide-likes-playlist-icon yt-sprite" style="padding: 0;"></button><button id="autoLikeSettings" class="yt-uix-button-icon yt-uix-button-icon-icon-account-settings yt-sprite" ></button><span class="display-name  no-count"><span>AutoLIKE</span><span id="autoLikeFeedback"> OFF</span></span></span></a></li>';
    log("generated LI",Li);

    $("#guide-button").click(function(){
      if (document.getElementById("likeExtensionInjected") === null) {
        $("div#items")[0].append(Li);
        $("#autoLikeEnable").click(function(){
           var toggle = $(this).css("backgroundColor");
           if(toggle == "rgba(0, 0, 0, 0)") {
             $(this).css("backgroundColor","red");
             $("#autoLikeFeedback").text(" ON");
           } else {
             $(this).css("backgroundColor","");
             $("#autoLikeFeedback").text(" OFF");
           }
        });
        $("#autoLikeSettings").click(function(){
           var toggle = $("#maindiv").css("display");
           if(toggle == "none") {
             $("#maindiv").show("slow","swing", function(){
               $('ytd-app').css({
                 '-webkit-transform': 'translateY(36px)'
               });
             });
           } else {
             $("#maindiv").hide("slow","swing",function(){
               $('ytd-app').css({
                 '-webkit-transform': 'translateY(0px)'
               });
             });
           }
        });
      };
    });

});

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
    console.log("###popup#"+tstamp+"> " + tag +": "+ Object.keys(o))
    return;
  }
  console.log("###popup#"+tstamp+"> " + tag +": "+ o)
}

log("", "likebar.js - loaded!");
