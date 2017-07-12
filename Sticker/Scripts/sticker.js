"use strict";

var index = 0;

$(document).ready(function () {
  //localStorage.removeItem("firststicker");
  $(".wall").on("click", "#createNew", createNewSticker);
  if(localStorage.stickers){
    $(JSON.parse(localStorage.stickers).stickers).each((_, s) => {
      $("#createNew").parent().before('<div class="sticker"><textarea id="' + s.id + '" class="sticker-content">' + s.content + '</textarea></div>');
    })
  }
})

$(document).keydown(keydown)

function keydown(e) {
  if(e.keyCode === 13){
  	$("form").submit();
    return false;
  }
}

function createNewSticker() {
  $("#createNew").parent().before('<div class="sticker"><textarea id="st' + ++index + '" class="sticker-content"></textarea></div>');
}

function commit(sticker) {
  var stickers = new Stickers();
  $(sticker).find("textarea").each((_, t) => {
    const id = $(t).attr("id");
    const content = $(t).val();
    stickers.push(new Sticker({id, content}));
  });  

  localStorage.stickers = JSON.stringify(stickers);
  alert("saved"); 
  return false;
}

class Sticker {
  constructor({id, content}) {
    this.id = id;
    this.content = content;
  }
}

class Stickers {
  constructor() {
    this.stickers = [];
  }

  push(sticker) {
    this.stickers.push(sticker);
  }
}