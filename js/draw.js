var canvas;
var context;
var img1 = [];
var canX;
var canY;

$("#canvas").attr("width", $(window).get(0).innerWidth);
$("#canvas").attr("height", $(window).get(0).innerHeight);

var c = document.querySelector('#canvas'); // 获取canvas
var CclientRect = c.getBoundingClientRect(); // 获取canvas的各种坐标值
// -------------------上传背景图----------


var input1 = document.getElementById("upload");

if (typeof FileReader === 'undefined') {
  alert("抱歉，你的浏览器不支持 FileReader");
  input1.setAttribute('disabled', 'disabled');
} else {
  input1.addEventListener('change', readFile, false);
}
function readFile() {
  var file = this.files[0];//获取上传文件列表中第一个文件
  // var fileTypes = [".jpg", ".png", ".webp", ".bmp"];
  if (!/image\/\w+/.test(file.type)) {
    //图片文件的type值为image/png或image/jpg
    alert("文件必须为图片！");
    return false; //结束进程
  }

  var size = file.size / 1024;
  if (size > 10240) {
    alert("图片大小不能大于10M！");

    return false;
  }


  var reader = new FileReader();//实例一个文件对象
  reader.readAsDataURL(file);//把上传的文件转换成url
  //当文件读取成功便可以调取上传的接口
  reader.onload = function (e) {
    var image = new Image();
    // 设置src属性 
    // image.src = e.target.result;
    image.src = this.result;
    // 绑定load事件，加载完成后执行，避免同步问题
    image.onload = function () {
      var width = image.width;
      var height = image.height;
      if (width >= 640 | height >= 480) {
        // alert("文件尺寸符合！");
      } else {
        layer.alert("图片必须大于640X480！");
        return false;
      }
      let canvas = document.getElementById("canvas");
      let ctx = canvas.getContext("2d");
      console.log($(canvas).width())
      let w = $(canvas).width();
      let h = $(canvas).height() - 50;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, w, h);
    };
  }
};


// -----------------end-----------------
var drawX; // 初始画鼠标按下的起始点
var drawY;
$(function () {
  canvas = $('#canvas')[0];
  context = canvas.getContext('2d');
  canX = canvas.offsetLeft;
  canY = canvas.offsetTop;
  var paint = Object.create(Line);
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = 5;
  $('#Line').click(function (event) {
    context.lineWidth = 5;
    paint = Object.create(Line);
    context.strokeStyle = $("#color").val();
    $(this).parent().addClass('toolbar-active').siblings().removeClass('toolbar-active');
    $('.note-box').remove()
  });
  $('#xpc').click(function (event) {
    context.lineWidth = 10;
    paint = Object.create(xpc);
    context.strokeStyle = "#FFF";
    console.log(context.lineWidth);
    $(this).parent().addClass('toolbar-active').siblings().removeClass('toolbar-active')
    $('.note-box').remove()
  });
  $('#qingping').click(function (event) {
    context.clearRect(0, 0, canvas.width, canvas.height);
  });
  $('#chexiao').click(function () {
    console.log(img1)
    context.putImageData(img1.pop(), 0, 0);
    console.log(img1)
    $('.note-box').remove()
  });
  paint.draw();
  $("#xiazai").click(function (event) {
    xiazai.draw();
  });
  context.font = "normal normal bold 28px Arial";
  $("#note").click(function (e) {
    // context.font = "normal normal normal 22px Arial";
    // paint = Object.create(note);
    note.draw();
    // context.font = "normal normal bold 18px Arial";
    // context.fontsize="28px"


    let div = '<div id="ftSize" style="	position: absolute;top: -50px;left: 110px;border: 1px solid rgba(34, 34, 34, .1);width: 115px;padding: 10px;border-radius: 23px;background: #fff;" class="fontSize">' +
      '<div onclick="fontSize(this)" class="fontItem" style="text-align: center;	width: 24px;height: 24px;background: rgba(34, 34, 34, .1);float: left;border-radius: 50%;position: relative;margin-right: 10px;cursor: pointer;" eid="22">22</div>' +
      '<div  onclick="fontSize(this)" style="text-align: center;	width: 24px;height: 24px;background:rgb(43, 144, 239) ;float: left;border-radius: 50%;position: relative;margin-right: 15px;cursor: pointer;" class="fontItem" eid="28">28</div>' +
      '<div  onclick="fontSize(this)" style="text-align: center;	width: 24px;height: 24px;background: rgba(34, 34, 34, .1);float: left;border-radius: 50%;position: relative;margin-right: 15px;cursor: pointer;" class="fontItem" eid="36">36</div>' +
      '</div>'
    $('#kuang').append(div)

    context.fillStyle = $("#color").val();

    $(this).parent().addClass('toolbar-active').siblings().removeClass('toolbar-active')
  });


});
let numFont = 28;
function fontSize(e) {
  $(e).css('background-color', 'rgb(43, 144, 239)').siblings().css('background-color', 'rgba(34, 34, 34, .1)')
  numFont = $(e).attr('eid')
  if ($(e).attr('eid') == '22') {
    context.font = "normal normal bold 22px Arial";
  } else if ($(e).attr('eid') == '28') {
    context.font = "normal normal bold 28px Arial";
  } else if ($(e).attr('eid') == '36') {
    context.font = "normal normal bold 36px Arial";
  }
  $(e).parent().remove()
}

var note = {
  name: "note",
  draw: function () {
    var painting = false;
    var p_x;
    var p_y;

    $('#canvas').mousemove(function (e) {
      if (painting === true) {
        var x = e.pageX;
        var y = e.pageY;
        context.lineTo(x - canX, y - canY);
        context.stroke();
      }
    });
    $('#canvas').mousedown(function (e) {
      if ($('#note').parent().hasClass('toolbar-active')) {
        painting = true;
        p_x = e.pageX;
        p_y = e.pageY;
        context.beginPath();
        context.moveTo(p_x - canX, p_y - canY);
        $('#canvas').css('cursor', 'pointer');

        drawX = e.pageX - CclientRect.x;
        drawY = e.pageY - CclientRect.y;
        $('#ftSize').remove()
        let col = $("#color").val();
        let n = 0;
        const noteBox = '<div class="note-box" style="left:' + drawX + 'px;top:' + drawY + 'px; "><textarea  onblur="addCanFont(this, ' + drawX + ', ' + drawY + ')"  style="font-size:' + numFont + 'px;"  fcon="true" rows="2" cols="15"></textarea></div>'

        $('body').append(noteBox)


        const txtarea = document.querySelector('.note-box').querySelector('textarea')

        txtarea.focus()

        txtarea.onfocus = function () {
          n++
          console.log(n)

       
        }
        txtarea.onblur = function () {
          console.log(137)
 
        }

      } else {
        console.log('3333')
      }

    });
    $('#canvas').mouseup(function (e) {
      painting = false;
      context.closePath();
      $('#canvas').css('cursor', '');
    });
    $('#canvas').mouseleave(function (e) {
      painting = false;
      context.closePath();
      $('#canvas').css('cursor', '');
    });
    $('#canvas').mouseup(function (e) {

      painting = false;
      context.closePath();
      $('#canvas').css('cursor', '');
    });


  }
}

function addCanFont(e, x, y) {
  console.log('172')
  var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
  img1.push(imgData);
  console.log(img1)

  let t = $(e).val()

  console.log(t)

  $(e).parent().remove()
  context.fillText(t, x + 15, y + 10);


}
var Line = {
  name: "line",
  draw: function () {
    var painting = false;
    var p_x;
    var p_y;
    $('#canvas').mousemove(function (e) {
      if (painting === true) {
        var x = e.pageX;
        var y = e.pageY;
        context.lineTo(x - canX, y - canY);
        context.stroke();
      }
    });
    $('#canvas').mousedown(function (e) {
      painting = true;
      p_x = e.pageX;
      p_y = e.pageY;
      context.beginPath();
      context.moveTo(p_x - canX, p_y - canY);
      $('#canvas').css('cursor', 'pointer');
      var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
      img1.push(imgData);
    });
    $('#canvas').mouseup(function (e) {
      painting = false;
      context.closePath();
      $('#canvas').css('cursor', '');
    });
    $('#canvas').mouseleave(function (e) {
      painting = false;
      context.closePath();
      $('#canvas').css('cursor', '');
    });
    $("#color").change(function (event) {
      context.strokeStyle = $(this).val();
    });
    $("#cuxi").change(function (event) {
      context.lineWidth = $(this).val();
    });
  }
}
var xpc = {
  name: "xpc",
  draw: function () {
    var painting = false;
    var p_x;
    var p_y;
    console.log(context.strokeStyle);
    context.lineWidth = $("#cuxi").val();
    console.log(context.lineWidth)
    $('#canvas').mousemove(function (e) {
      if (painting === true) {
        var x = e.pageX;
        var y = e.pageY;
        context.lineTo(x - canX, y - canY);
        context.stroke();
      }
    });
    $('#canvas').mousedown(function (e) {
      painting = true;
      p_x = e.pageX;
      p_y = e.pageY;
      context.beginPath();
      context.moveTo(p_x - canX, p_y - canY);
      $('#canvas').css('cursor', 'pointer');
      var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
      img1.push(imgData);
    });
    $('#canvas').mouseup(function (e) {
      painting = false;
      context.closePath();
      $('#canvas').css('cursor', '');
    });
    $('#canvas').mouseleave(function (e) {
      painting = false;
      context.closePath();
    });
    $("#cuxi").change(function (event) {
      context.lineWidth = $(this).val();
    });
  }
}
var xiazai = {
  draw: function () {
    var type = 'png';
    var imgData = $('#canvas')[0].toDataURL(type);
    var _fixType = function (type) {
      type = type.toLowerCase().replace(/jpg/i, 'jpeg');
      var r = type.match(/png|jpeg|bmp|gif/)[0];
      return 'image/' + r;
    };
    imgData = imgData.replace(_fixType(type), 'image/octet-stream');
    var saveFile = function (data, filename) {
      var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
      save_link.href = data;
      save_link.download = filename;
      var event = document.createEvent('MouseEvents');
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      save_link.dispatchEvent(event);
    };
    var filename = '电子白板' + (new Date()).getTime() + '.' + type;
    saveFile(imgData, filename);
  }
}

