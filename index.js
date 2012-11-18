var spawn = require('child_process').spawn;

function gs() {
  return {
    "options": [],
    "_input": null,
    "batch": function() {
      this.options.push('-dBATCH');
      return this;
    },
    "diskfonts": function() {
      this.options.push('-dDISKFONTS');
      return this;
    },
    "nobind": function() {
      this.options.push('-dNOBIND');
      return this;
    },
    "nocache": function() {
      this.options.push('-dNOCACHE');
      return this;
    },
    "nodisplay": function() {
      this.options.push('-dNODISPLAY');
      return this;
    },
    "nopause": function() {
      this.options.push('-dNOPAUSE');
      return this;
    },
    "device": function(dev) {
      dev = dev || 'txtwrite';
      this.options.push('-sDEVICE=' + dev);
      return this;
    },
    "input": function(file) {
      this._input = file;
      return this;
    },
    "output": function(file) {
      file = file || '-';
      this.options.push('-sOutputFile=' + file);
      return this;
    },
    "exec": function(cb) {
      var self = this;
      if (!this._input) return cb.call(self, 'No input specified');

      var proc = spawn('gs', this.options.concat([this._input]));
      proc.stdin.on('error', cb);
      proc.stdout.on('error', cb);

      var _data = [];
      var totalBytes = 0;
      proc.stdout.on('data', function(data) { totalBytes += data.length; _data.push(data); });
      proc.on('close', function() {
        var buf = Buffer.concat(_data, totalBytes);
        var _datas = buf.toString().split('\n');
        _datas = _datas.slice(4); //strip out cra

        return cb.call(self, null, _datas.join('\n'));
      });
      process.on('exit', function() {
        proc.kill();
      });
    }
  };
}

module.exports = exports = gs;
