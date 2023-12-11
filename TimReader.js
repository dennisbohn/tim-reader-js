/**
 * TimReader 1.0
 * Creates canvas from a TIM-File
 *
 * Copyright 2023, Dennis Bohn
 * bohn.media
 * https://www.bohnmedia.de/
 *
 * Licensed under MIT
 *
 * Released on: December 12, 2023
 */

class TimReader {
  constructor() {
    this._images = [];
  }

  createCanvas(imageIndex = 0) {
    const data = this._images[imageIndex];

    const canvas = document.createElement("canvas");
    canvas.width = data.imageWidth;
    canvas.height = data.imageHeight;

    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < data.imageColors.length; i++) {
      ["r", "g", "b"].forEach((key, index) => {
        imageData.data[index + i * 4] = data.imageColors[i][key];
      });
      imageData.data[3 + i * 4] = 255;
    }

    ctx.putImageData(imageData, 0, 0);

    return canvas;
  }

  readArrayBuffer(arrayBuffer) {
    this._uint32Array = new Uint32Array(arrayBuffer);
    this._parse();
  }

  get length() {
    return this._images.length;
  }

  _read(bits = 32) {
    const block = Math.floor(this._pointer / 32);
    const offset = this._pointer % 32;
    const bitmask = (1 << bits) - 1 || 0xffffffff;
    const data = (this._uint32Array[block] >> offset) & bitmask;
    this._pointer += bits;
    return data;
  }

  _skip(bits) {
    this._pointer += bits;
  }

  _rewind() {
    this._pointer = 0;
  }

  _parse() {
    this._rewind();

    this._images.splice(0, this._images.length);

    while (this._read(8) === 16) {
      const image = {};

      image.version = this._read(8);

      this._skip(16);

      image.bpp = this._read(2);
      image.clp = this._read(2);

      this._skip(28);

      if (image.clp) {
        image.clutLength = this._read(32);
        image.clutX = this._read(16);
        image.clutY = this._read(16);
        image.clutWidth = this._read(16);
        image.clutHeight = this._read(16);
        image.clutColors = this._readColors(image.clutWidth * image.clutHeight, TimReader.BPP_16_BIT);
      }

      image.imageLength = this._read(32);
      image.imageX = this._read(16);
      image.imageY = this._read(16);
      image.imageWidth = this._read(16);
      image.imageHeight = this._read(16);
      switch (image.bpp) {
        case TimReader.BPP_4_BIT:
          image.imageWidth *= 4;
          break;
        case TimReader.BPP_8_BIT:
          image.imageWidth *= 2;
          break;
        case TimReader.BPP_24_BIT:
          image.imageWidth /= 1.5;
          break;
      }

      image.imageColors = this._readColors(image.imageWidth * image.imageWidth, image.bpp, image.clutColors);

      this._images.push(image);
    }
  }

  _readColors(length, bpp, clp) {
    const colors = [];
    for (let i = 0; i < length; i++) {
      switch (bpp) {
        case TimReader.BPP_4_BIT:
          colors.push(clp[this._read(4)]);
          break;
        case TimReader.BPP_8_BIT:
          colors.push(clp[this._read(8)]);
          break;
        case TimReader.BPP_16_BIT:
          colors.push({
            r: Math.round((this._read(5) / 0x1f) * 0xff),
            g: Math.round((this._read(5) / 0x1f) * 0xff),
            b: Math.round((this._read(5) / 0x1f) * 0xff),
            stp: this._read(1),
          });
          break;
        case TimReader.BPP_24_BIT:
          colors.push({
            r: this._read(8),
            g: this._read(8),
            b: this._read(8),
          });
          break;
      }
    }
    return colors;
  }
}

// Define constants
TimReader.BPP_4_BIT = 0;
TimReader.BPP_8_BIT = 1;
TimReader.BPP_16_BIT = 2;
TimReader.BPP_24_BIT = 3;