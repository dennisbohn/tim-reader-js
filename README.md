# PS1 TIM File Reader in JavaScript

This JavaScript class generates a canvas from a TIM file. A TIM file is an image file format used by the PlayStation 1 game console.

The class provides the following methods and properties:

| Method                         | Description                             |
| ------------------------------ | --------------------------------------- |
| `readArrayBuffer(arrayBuffer)` | Reads the TIM file from an ArrayBuffer. |

| Property | Description                    |
| -------- | ------------------------------ |
| `images` | Array with canvas elements of all images. |

## Examples

### Create image from URL

```javascript
const timReader = new TimReader();
const url = "EXAMPLE.TIM";

// Get file from server
fetch(url)
  .then((response) => response.arrayBuffer())
  .then((arrayBuffer) => {
    // Parse the file
    timReader.readArrayBuffer(arrayBuffer);

    // Append the image to the document body
    document.body.appendChild(timReader.images[0]);
  });
```

### Create image from form file

```javascript
const timReader = new TimReader();
const input = document.querySelector('input[type="file"]');

// Get file from input
file.addEventListener("change", () => {
  const reader = new FileReader();
  reader.onload = function (e) {
    // Parse the file
    timReader.readArrayBuffer(reader.result);

    // Append the image to the document body
    document.body.appendChild(timReader.images[0]);
  };
  reader.readAsArrayBuffer(file.files[0]);
});
```

## Working with multiple images

A TIM file can contain a set of images. Because the property `images` is always an array, you can just use forEach to list all images or use `images.length` to get the number of images.

### Example

```javascript
// Parse the file
timReader.readArrayBuffer(arrayBuffer);

// Loop through the images
timReader.images.forEach((image) => {
  // Append the image to the document body
  document.body.appendChild(canvas);
});
```

## Thanks to

[rawunprotected](https://github.com/rawrunprotected) - For the "[Fast and Accurate Color Depth Conversion](https://threadlocalmutex.com/?p=48)"
