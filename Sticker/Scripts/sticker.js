"use strict";

var index = 0;

$(document).ready(function () {
  $(".wall").on("click", "#createNew", createNewSticker);
  localStorage.times = "0";
})

$(document).keydown(keydown)

function keydown(e) {
  if(e.keyCode === 13){
  	$("form").submit();
  }
}

function createNewSticker() {
  $("#createNew").parent().before('<div class="sticker"><textarea id="st' + ++index + '" class="sticker-content"></textarea></div>');
}

function commit(sticker) {
  const content = $(sticker).find("textarea")[0].innerhtml;
  const id = $($(sticker).find("textarea")[0]).attr("id");
  const first_sticker = new Sticker({id, content});

  localStorage.firststicker = first_sticker;
  alert("storage " + localStorage.firststicker.getContent());
  return false;
}

class Sticker {
  constructor({id, content}) {
    this.id = id;
    this.content = content;
  }

  getContent() {
  	return this.content;
  }
}