
export default class GlitchArt {
    constructor(dom,url,maxoffset=10){
      // console.log(dom,url)
      this._canvas = null;
      this._ctx = null;
      this._dom = dom;
      this._maxoffset = maxoffset;
      this.initCanvas(dom);
      this.setBg(url);
    }
  initCanvas(dom) {
    this._dom = document.querySelector(dom);
    // console.log(this._dom.getBoundingClientRect())
    this._canvas = document.createElement('canvas');
    this._dom.appendChild(this._canvas);
    if (this._canvas != null) {
      this._ctx = this._canvas.getContext('2d');
      let { width: cssWidth, height: cssHeight, top: _top, left: _left } = this._dom.getBoundingClientRect();
      // console.log(cssWidth, cssHeight)
      this._canvas.width = cssWidth ;
      this._canvas.height = cssHeight ;
      let st = `width:100%;height:100%`;
      this._canvas.style = st;
      
    } else {
      console.log('canvas null')
    }
  }
  setBg(url){
    let img = new Image();
    img.src = url;
    img.onload = () =>{
      if (IsPC()){
        this._dom.dpr = 1;
        this._dom.width = img.width;
        this._dom.height = img.height;
      }else{
        this._dom.dpr = this._canvas.width / img.width;
        this._dom.width = img.width * this._dom.dpr;
        this._dom.height = img.height * this._dom.dpr;
      }

      this.animation(img)
    };
  }
  animation(img){
    let totalTime = 1000;
    let currentTime = 0;
    const render = ()=>{
      setTimeout(() => {
        if (currentTime < totalTime) {
          this.draw(img);
          currentTime += 100;
          render();
        } else {
          this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
          this._ctx.drawImage(img, 0, 0, this._dom.width, this._dom.height);
          setTimeout(() => {
            currentTime = 0;
            render();
          }, 2000);
        }
      }, 30);
    }
    render()
  }
  draw(img) {
    let totolHeight = 0;
    this._ctx.clearRect(0, 0, this._dom.width, this._dom.height);
    while (totolHeight < img.height){
      let randHeight = this.getRandom(3, ~~(img.height/100*20));
      var horizOffset = this.getRandom(-Math.abs(this._maxoffset), this._maxoffset);
      this._ctx.drawImage(img, 0, totolHeight, img.width, randHeight, horizOffset, totolHeight * this._dom.dpr, this._dom.width, randHeight*this._dom.dpr);
      totolHeight += randHeight;
    }
  }
  getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
// 平台判断
function IsPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
  }
  return flag;
}