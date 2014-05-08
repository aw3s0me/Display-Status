String.prototype.toNum = function() {
   return parseInt(this);
}

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

function defaultFor(arg, val) {
    return typeof arg !== 'undefined' ? arg : val;
}
