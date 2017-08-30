if (chrome.extension){
  var url = chrome.extension.getURL('likebar.html');
  var height = "40px";
  var div = "<div w3-include-html='"+url+"'></div>";

  $('body').prepend(div);
  w3.includeHTML();
}

window.onload = function() {
  console.log("onload" + Date())
}

$('#body-container').css({
  '-webkit-transform': 'translateY('+height+')'
});

function onChangeFun(){
  console.log("on otr off: " + $("#blendin").attr("checked"));
};

console.log("popup.js - loaded!");
