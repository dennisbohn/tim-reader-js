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

    _read(bits = 32) {
        const block = Math.floor(this._pointer / 32);
        const offset = this._pointer % 32;
        const bitmask = (1 << bits) - 1 || 0xFFFFFFFF;
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

        this._data = {};

        this._data.tag = this._read(8);
        this._data.version = this._read(8);

        this._skip(16);

        this._data.bpp = this._read(2);
        this._data.clp = this._read(2);

        this._skip(28);

        if (this._data.clp) {
            this._data.clutLength = this._read(32);
            this._data.clutX = this._read(16);
            this._data.clutY = this._read(16);
            this._data.clutWidth = this._read(16);
            this._data.clutHeight = this._read(16);
            this._data.clutColors = this._readColors(this._data.clutWidth * this._data.clutHeight, 2);
        }

        this._data.imageLength = this._read(32);
        this._data.imageX = this._read(16);
        this._data.imageY = this._read(16);
        this._data.imageWidth = this._read(16);
        this._data.imageHeight = this._read(16);
        switch (this._data.bpp) {
            case 0:
                this._data.imageWidth *= 4;
                break;
            case 1:
                this._data.imageWidth *= 2;
                break;
            case 3:
                this._data.imageWidth /= 1.5;
                break;
        }

        this._data.imageColors = this._readColors(this._data.imageWidth * this._data.imageWidth, this._data.bpp);
    }

    _readColors(length, bpp) {
        const colors = [];
        for (let i = 0; i < length; i++) {
            switch (bpp) {
                case 0:
                    colors.push(this._data.clutColors[this._read(4)]);
                    break;
                case 1:
                    colors.push(this._data.clutColors[this._read(8)]);
                    break;
                case 2:
                    colors.push({
                        r: Math.round(this._read(5) / 0x1F * 0xFF),
                        g: Math.round(this._read(5) / 0x1F * 0xFF),
                        b: Math.round(this._read(5) / 0x1F * 0xFF),
                        stp: this._read(1)
                    });
                    break;
                case 3:
                    colors.push({
                        r: this._read(8),
                        g: this._read(8),
                        b: this._read(8)
                    });
                    break;
            }
        }
        return colors;
    }

    createCanvas() {
        const data = this._data;

        const canvas = document.createElement('canvas');
        canvas.width = data.imageWidth;
        canvas.height = data.imageHeight;

        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < data.imageColors.length; i++) {
            ['r', 'g', 'b'].forEach((key, index) => {
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
}