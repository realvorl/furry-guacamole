if (chrome.extension){
  var url = chrome.extension.getURL('likebar.html');
  var height = "40px";
  var div = "<div w3-include-html='"+url+"'></div>";

  $('body').prepend(div);
  w3.includeHTML();
  log("profile icon: ", $("#buttons > ytd-topbar-menu-button-renderer:nth-child(4) > button"));
  $("#buttons > ytd-topbar-menu-button-renderer:nth-child(4) > button").click();
}

$(window).on('load', function() {
  log("","onload")
  //log("", $("#buttons > ytd-topbar-menu-button-renderer:nth-child(4) > button").innerHTML);
})

function onChangeFun(){
  log("","on otr off: " + $("#blendin").attr("checked"));
};

log("","popup.js - loaded!");


function log(tag, o){
  var date = new Date();
  var tstamp = date.getMinutes() +":"+ date.getSeconds() + ":" + date.getMilliseconds();
  if (o instanceof Object) {
    console.log("###popup#"+tstamp+"> " + tag +": "+ Object.keys(o))
    return;
  }
  console.log("###popup#"+tstamp+"> " + tag +": "+ o)
}
