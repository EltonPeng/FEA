"use strict";

var index = 0;

$(document).ready(function () {
  //localStorage.removeItem("firststicker");
  $(".wall").on("click", "#createNew", createNewSticker);
  $(".wall").on("click", ".remove", removeSticker);
  if(localStorage.stickers){
    $(JSON.parse(localStorage.stickers).stickers).each((_, s) => {
      index = s.id.substr(2);
      insertSticker(index, s.content);
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
  insertSticker(++index, '');
}

function insertSticker(id, content) {
  $("#createNew").parent().before('<div class="sticker"><div class="remove">Remove</div><textarea id="st' + id + '" class="sticker-content">' + content + '</textarea></div>');
}

function removeSticker(e) {
  $(e.target).parent().remove();
  commit();
}

function commit() {
  var stickers = new Stickers();
  $("form").find("textarea").each((_, t) => {
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