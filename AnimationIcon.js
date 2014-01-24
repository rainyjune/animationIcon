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
  this.playerStatus = 'end';
  this.videoid = null;
  this.callback = null;
  this.image = null; // image tag
  this.ctx = null;
  this.canvas = null; // canvas container div
  this.timer = null;

  this.floatdiv = null;
  this.canvasdiv = null;
  this.coverdiv = null;

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
}
AnimationIcon.prototype.initImage = function(){
  var image = document.createElement('img');
  image.src = this.imageSrc;
  image.onload = function() {
    setTimeout(function(){
      console.log("The image loaded!");
    }, 1000);
  };
  this.image = image;
}
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
}
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
}