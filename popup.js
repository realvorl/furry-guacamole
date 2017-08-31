if (chrome.extension){
  var url = chrome.extension.getURL('likebar.html');
  var height = "40px";
  var div = "<div w3-include-html='"+url+"'></div>";

  $('body').prepend(div);
  w3.includeHTML();
  log("profile icon: ", $("#buttons > ytd-topbar-menu-button-renderer:nth-child(4) > button"));

  $(document).ready(function(){
    log("p","document ready")

    $("#buttons > ytd-topbar-menu-button-renderer:nth-child(4)").ready(function(){
      log("p", "hardest thing ever in the history of FUCK!");
      $(this).click();
      $(this).click(function(){
        log("p", "hardest thing ever in the history of FUCK!");
        var toggle = $("#maindiv").css("display");
        if(toggle == "none") {
          $("#maindiv").show("slow","swing", function(){
            $('ytd-app').css({
              '-webkit-transform': 'translateY(36px)'
            });
          });
        }
      })
    })

    log("p","document ready CLICK ON PROFILE")
    $("#buttons > ytd-topbar-menu-button-renderer:nth-child(4) > button").click(function(){
      log("profile-click","!")
    });
  });
}

function onChangeFun(){
  log("","on otr off: " + $("#blendin").attr("checked"));
};

log("","popup.js - loaded!");
