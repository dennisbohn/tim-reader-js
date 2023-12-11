# PS1 TIM File Reader in JavaScript
This JavaScript class generates a canvas from a TIM file. A TIM file is an image file format used by the PlayStation 1 game console.

The class provides the following methods and properties:

| Method | Description |
| --- | --- |
| `readArrayBuffer(arrayBuffer)` | Reads the TIM file from an ArrayBuffer. |
| `createCanvas()` | Creates a canvas element for the DOM. |

| Property | Description |
| --- | --- |
| `length` | Number of images in the set. |

## Examples

### Create Canvas from URL

```javascript
const timReader = new TimReader();
const url = 'EXAMPLE.TIM';

// Get file from server
fetch(url)
  .then(response => response.arrayBuffer())
  .then((arrayBuffer) => {

    // Parse the file
    timReader.readArrayBuffer(arrayBuffer);

    // Generate the canvas
    const canvas = timReader.createCanvas();

    // Append the canvas to the document body
    document.body.appendChild(canvas);
  });
```

### Create canvas from form file

```javascript
const timReader = new TimReader();
const input = document.querySelector('input[type="file"]');

// Get file from input
file.addEventListener("change", () => {
    const reader = new FileReader();
    reader.onload = function(e) {

        // Parse the file
        timReader.readArrayBuffer(reader.result);

        // Generate the canvas
        const canvas = timReader.createCanvas();

        // Append the canvas to the document body
        document.body.appendChild(canvas);
    }
    reader.readAsArrayBuffer(file.files[0])
});
```

## Working with multiple images

A TIM file can contain a set of images. By using `createCanvas()` you can always extract the first image of the set. By using `createCanvas(index)` you can make a selection. By using the property `length` you get the number of images in the set.

### Example

```javascript
// Parse the file
timReader.readArrayBuffer(arrayBuffer);

// Loop through the images
for (let i = 0; i < timReader.length; i++) {

    // Generate the canvas
    const canvas = timReader.createCanvas(i);

    // Append the canvas to the document body
    document.body.appendChild(canvas);
}
```