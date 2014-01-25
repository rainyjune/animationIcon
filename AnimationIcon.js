/**
 * Class Constructor.
 * @param object options
 * {
 *  cssSelectors:
    {
      'floatdivId': '',
      'canvasdivId': '',
      'coverdivId': '',
      'animationCanvasId': ''
    },
    image: '',
 * }
 * @return undefined
 */
function AnimationIcon(options) {
  this.start  = 0;
  this.end    = 0;
  this.playStatus = 'none'; // play statu, possible values: ['ending', 'none']
  this.videoid = '0'; // current video ID
  this.callback = null; // callback function.
  this.image = null; // image tag (Safe)
  this.ctx = null; // an object that provides methods and properties for drawing on the canvas
  this.canvas = null; // canvas container div
  this.timer = null; // animation timer

  this.floatdiv = null;
  this.canvasdiv = null;
  this.coverdiv = null;
  this.animationCanvas = null;

  /* Default configurations. */
  this.floatdivId = 'float_div';
  this.canvasdivId = 'canvas_div';
  this.coverdivId = 'cover_div';
  this.animationCanvasId = 'animation_canvas';
  this.imageSrc = '';

  this.userOptions = options || {};
  this.init();
}

/**************************Init functions**********************************************************/

AnimationIcon.prototype.init = function() {
  this.initUserOptions();
  this.initImage();
  this.initContainer();
  this.initCanvas();
};
AnimationIcon.prototype.initUserOptions = function() {
  var options = this.userOptions;
  var selectors = options.cssSelectors;
  var image = options.image;
  if (selectors) {
    if (selectors.floatdivId) {      this.floatdivId = selectors.floatdivId;    }
    if (selectors.canvasdivId) {      this.canvasdivId = selectors.canvasdivId;    }
    if (selectors.coverdivId) {      this.coverdivId = selectors.coverdivId;    }
    if (selectors.animationCanvasId) { this.animationCanvasId = selectors.animationCanvasId; }
  }
  if (window.innerWidth < 747) {
    this.imageSrc = "./img/play_phone.png";
  } else {
    this.imageSrc = "./img/play.png";
  }
  if (image && typeof image == 'string') {
    this.imageSrc = image;
  }
};
AnimationIcon.prototype.initImage = function(){
  var image = document.createElement('img');
  image.src = this.imageSrc;
  image.onload = function() {
    setTimeout(function(){
      console.log("The image loaded!");
    }, 1000);
  };
  this.image = image;
};
AnimationIcon.prototype.initContainer = function() {
  var canvas_div = document.createElement('div');
  canvas_div.id = this.canvasdivId;
  var animation_canvas = document.createElement('canvas');
  animation_canvas.id = this.animationCanvasId;
  canvas_div.appendChild(animation_canvas);
  var float_div = document.createElement('div');
  float_div.id = this.floatdivId;
  var cover_div = document.createElement('div');
  cover_div.id = this.coverdivId;
  document.body.appendChild(canvas_div);
  document.body.appendChild(float_div);
  document.body.appendChild(cover_div);

  this.floatdiv = $(float_div);
  this.canvasdiv = $(canvas_div);
  this.coverdiv = $(cover_div);
  this.animationCanvas = $(animation_canvas);
};
AnimationIcon.prototype.initCanvas = function() {
  var canvas = document.getElementById(this.animationCanvasId);
  if (!canvas) return ;
  if (window.innerWidth < 747) {
    canvas.width = 184;
    canvas.height = 34;
  } else {
    canvas.width = 309;
    canvas.height = 50;
  }
  this.canvas = canvas;
  this.ctx = canvas.getContext("2d");
};

/**************************************************************************************************/
/**
 * This function should be call after playback end.
 * @return undefined
 */
AnimationIcon.prototype.playEnd = function(){
  this.videoid="0";
  this.animationsEnd();
};
/**
 * Play video
 * @param object message
 * @return undefined
 */
AnimationIcon.prototype.playVideo = function(message){
  var floatdiv= this.floatdiv;
  floatdiv.text(message.title);
  floatdiv.attr("status","playing");
  this.videoid=message.videoid;
  this.play();
};
/**
 * Animation end.
 */
AnimationIcon.prototype.animationsEnd = function(){
  var that = this;
  this.start=1;
  this.end=6;
  this.playStatus="ending";
  this.videoid="0";
  var floatdiv = this.floatdiv;
  var canvasdiv= this.canvasdiv;
  this.callback=function(){
    that.playStatus="none";
    clearTimeout(that.timer);
    floatdiv.unbind("click");
    floatdiv.fadeOut("slow");
    floatdiv.removeAttr("status");
    canvasdiv.hide();
    if(that.videoid!="0") {
      that.play();
    }
  };
  this.playAnimation();
},
AnimationIcon.prototype.playingLoop = function(){
  var that = this;
  this.start=36;
  this.end=85;
  this.callback=function(){
    that.playingLoop();
  };
  this.playAnimation();
};
AnimationIcon.prototype.canvasClearRect = function() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

/**
 *
 * @param number width
 * @param number height
 * @return undefined
 */
AnimationIcon.prototype.redrawAnimationImage = function(width,height){
  this.canvasClearRect();
  var row = Math.floor(this.start / 3);
  var col = this.start - row * 3;
  var offw = col * width;
  var offh = row * height;
  this.ctx.drawImage(this.image, offw, offh, width, height, 0, 0, width, height);
};
/**
 * Play animation.
 * @return undefined
 *
 */
AnimationIcon.prototype.playAnimation = function() {
  var that = this;
  this.redrawAnimationImage(this.canvas.width,this.canvas.height);
  this.start++;
  if (this.start >= this.end) {
    this.callback();
  }else{
    clearTimeout(this.timer);
    this.timer=setTimeout($.proxy(that.playAnimation, that),1000/24);
  }
};
/**
 * Before play.
 * @return undefined
 */
AnimationIcon.prototype.play = function(){
  var that = this;
  if(this.playStatus=="ending") return;
  this.canvasClearRect();
  var canvasdiv=this.canvasdiv;
  var floatdiv= this.floatdiv;
  var coverdiv= this.coverdiv;
  canvasdiv.show();
  this.start=15;
  this.end=27;
  this.callback=function(){
    floatdiv.fadeIn("fast",function(){
      setTimeout(function(){
        floatdiv.fadeOut("fast",function(){
          that.start=28;
          that.end=36;
          that.callback=function(){
            coverdiv.show();
            coverdiv.unbind("click").click(function(){
              clearTimeout(that.timer);
              coverdiv.hide();
              that.start=86;
              that.end=95;
              that.callback=that.play;
              that.playAnimation();
            });
            that.playingLoop();
          };
          that.playAnimation();
        })
      },1500);
    })
  };
  that.playAnimation();
};

/******** Not in used functions **************************************/
AnimationIcon.prototype.animationsClick = function(){
  var that = this;
  this.start=86;
  this.end=95;
  var floatdiv= this.floatdiv;
  var canvasdiv= this.canvasdiv;
  this.callback=function(){
    floatdiv.unbind("click");
    floatdiv.fadeOut("slow");
    floatdiv.removeAttr("status");
    if(that.videoid!="0"){
      that.play();
    } else{
      canvasdiv.hide();
    }
  };
};
AnimationIcon.prototype.checkPlay = function(){
  var floatdiv= this.floatdiv;
  var status = floatdiv.attr("status");
  if(status=="playing"){
    floatdiv.show();
  }
};
AnimationIcon.prototype.getPlayStatus = function(){
  var floatdiv= this.floatdiv;
  if(floatdiv.attr("status")=="playing"){
    return true;
  }
  return false;
};