if (chrome.extension){
  var url = chrome.extension.getURL('likebar.html');
  var height = "40px";
  var div = "<div w3-include-html='"+url+"'></div>";

  $('body').prepend(div);
  w3.includeHTML();
  log("profile icon: ", $("#buttons > ytd-topbar-menu-button-renderer:nth-child(4) > button"));

  $(document).ready(function(){
    log("p","document ready")
    $('body').append(mainAnchor());
    $("#buttons > ytd-topbar-menu-button-renderer:nth-child(4)").ready(function(){
      log("p", "hardest thing ever in the history of FUCK!");
      $("img#img").ready(function(){
          log("p","img ready man!");
          $("img#img").click(function(){
            log("p", "hardest thing ever in the history of FUCK!");
            var toggle = $("#maindiv").css("display");
            if(toggle == "none") {
              $("#maindiv").show("slow","swing", function(){
                $('ytd-app').css({
                  '-webkit-transform': 'translateY(40px)'
                });
              });
              $("input#search").focus(function(){
                $("#maindiv").hide("slow","swing", function(){
                  $('ytd-app').css({
                    '-webkit-transform': 'translateY(0)'
                  });
                });
              })
            }
          })
      })
    })
  });
}

function mainAnchor(){
  var oLink = document.createElement("a");
  oLink.style.position = "absolute";
  oLink.id = "thea";
  oLink.style.left = "0";
  oLink.style.top = "0";
  oLink.style.height = "20px";
  oLink.style.width = "20px";
  oLink.style.fontSize = "20px";
  oLink.style.widthWeight = "bolder";
  oLink.text = "❤";
  oLink.style.backgroundColor = "#FFFFFF";
  oLink.style.color = "#1f1f1f";
  oLink.style.borderRadius = "20px";
  oLink.style.zIndex = "99999";
  oLink.style.cursor = "pointer";
  oLink.style.opacity = ".5";

  oLink.onclick = function(){
    log("p", "hardest thing ever in the history of FUCK!");
    var toggle = $("#maindiv").css("display");
    if(toggle == "none") {
      $("#maindiv").show("slow","swing", function(){
        $('ytd-app').css({
          '-webkit-transform': 'translateY(40px)'
        });
      });
      $("input#search").focus(function(){
        $("#maindiv").hide("slow","swing", function(){
          $('ytd-app').css({
            '-webkit-transform': 'translateY(0)'
          });
        });
      })
    } else {
      $("#maindiv").hide("slow","swing", function(){
        $('ytd-app').css({
          '-webkit-transform': 'translateY(0)'
        });
      });
    }

  }
  return oLink;
}

log("","popup.js - loaded!");
