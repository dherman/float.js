// a mirror on a number that introspects its floating-point representation
function Float(n) {
    var bytes = [].map.call(new Uint8Array((new Float64Array([n])).buffer), function(b) {
        for (var s = b.toString(2), i = s.length; i < 8; i++) {
            s = "0" + s;
        }
        return s;
    });
    if (Float.LITTLE_ENDIAN) {
        bytes = bytes.reverse();
    }
    this.value = n;
    this.bytes = bytes;
    this.negative = bytes[0][0] === "1";
    this.exponent = bytes[0].substring(1) + bytes[1].substring(0, 4);
    this.mantissa = bytes[1].substring(4) + bytes.slice(2).join("");
}

// typed arrays are endianness-sensitive!
Float.LITTLE_ENDIAN = !!(new Uint8Array((new Uint32Array([1])).buffer));

Float.prototype.LITTLE_ENDIAN = Float.LITTLE_ENDIAN;

// allow auto-conversion back to type number
Float.prototype.valueOf = function() {
    return this.value;
}

// toString should be consistent with valueOf
Float.prototype.toString = function() {
    return String(this.value);
};

Float.prototype.toBitString = function() {
    return (this.negative ? "1" : "0") +
           this.exponent +
           this.mantissa;
};

Number.prototype.introspect = function() {
    return new Float(+this);
};

