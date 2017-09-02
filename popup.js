if (chrome.extension){
  var url = chrome.extension.getURL('likebar.html');
  var height = "40px";
  var div = "<div w3-include-html='"+url+"'></div>";

  $('body').prepend(div);
  w3.includeHTML();
  $(document).ready(function(){
      $('body').append(mainAnchor());
  });
}

function mainAnchor(){
  var oLink = document.createElement("a");

  oLink.title = "show / hide settings"
  oLink.text = "❤";
  oLink.id = "thea";

  oLink.onclick = function(){
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
