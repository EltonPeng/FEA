"use strict";

var index = 0;

$(document).ready(function () {
  //localStorage.removeItem("firststicker");
  $(".wall").on("click", "#createNew", createNewSticker);
  $(".wall").on("click", ".remove", removeSticker);
  $(".footer").on("click", ".setCache", setCache);
  $(".footer").on("click", ".readCache", readFromCache);

  $.ajax({
    url: 'http://localhost:8010/wall/init',
    type: 'GET',
    success: function (result) {
      console.log('DynamoDB connected');
      fetch('http://localhost:8010/wall/all').then(response => response.json()).then(res => $(res).each((_, s) => {
          index = s.id;
          insertSticker(index, s.header);
        }));
    },
    error: function (error) {
      console.log(error);
    }
  });

  // if(localStorage.stickers){
  //   $(JSON.parse(localStorage.stickers).stickers).each((_, s) => {
  //     index = s.id.substr(2);
  //     insertSticker(index, s.content);
  //   })
  // }
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
  const classRotate = "rotate" + Math.ceil(Math.random()*6);

  $("#createNew").parent().before('<div class="sticker ' + classRotate + '"><div class="remove">X</div><textarea class="tag-content"></textarea><textarea id="st' + id + '" class="sticker-content">' + content + '</textarea></div>');
}

function removeSticker(e) {
  $(e.target).parent().remove();
  commit();
}

function setCache() {
  fetch('http://localhost:8010/wall/tocache').then(console.log('Redis connected'));
}

function readFromCache() {
  fetch('http://localhost:8010/wall/history').then(response => response.text()).then(res => console.log(res));
}

function commit() {
  var stickers = new Stickers();
  $("form").find(".sticker-content").each((_, t) => {
    const id = $(t).attr("id");
    const content = $(t).val();
    stickers.push(new Sticker({id, content}));
  });  

  //localStorage.stickers = JSON.stringify(stickers);
  //alert("saved"); 
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