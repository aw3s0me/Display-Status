function widget() {
    this.e = document.createElement('div');

    this.init = function(dx, dy) {
        this.e.style.width  = dx*50 + 'px';
        this.e.style.height = dy*50 + 'px';
        return this;
    }

    this.setClass = function(classname) {
        this.e.className = classname;
        return this;
    }

    this.setScale = function(s) {
        this.e.style.width = this.e.style.width.toNum()*s + 'px';
        this.e.style.height = this.e.style.height.toNum()*s + 'px';
        return this;
    }
}

function sensor() {}
sensor.prototype = new widget();

function text() {}
text.prototype = new widget();
text.prototype.init = function(dx) {
    this.e.style.position = 'absolute';
    this.e.style.width = dx*50 + 'px';
    this.e.style.height = '50px';
    this.e.style.fontSize = '44px';
    this.e.innerHTML = '&nbsp';
    return this;
}
text.prototype.setScale = function(s) {
    this.e.style.width = this.e.style.width.toNum()*s + 'px';
    this.e.style.height = this.e.style.height.toNum()*s + 'px';
    this.e.style.fontSize = this.e.style.fontSize.toNum()*s + 'px';
    return this;
}
text.prototype.setText = function(t) {
    this.e.innerHTML = '&nbsp';
    this.e.innerHTML += t;
    return this;
}
