import { dataSizeToImageSize } from './utils';
import { fileToArray } from '@beenotung/tslib/file';

export async function getData(): Promise<number[]> {
  let input = document.getElementById('file') as HTMLInputElement;
  return fileToArray(input.files[0]);
}

export async function initUI() {
  let fileInput = document.getElementById('file') as HTMLInputElement;
  fileInput.onchange = () => {
    draw();
  };
  let numRepeat = document.getElementById('numRepeat') as HTMLInputElement;
  let btnRepeat = document.getElementById('btnRepeat') as HTMLButtonElement;
  btnRepeat.onclick = () => {
    smoother(numRepeat.valueAsNumber);
  };
}

async function draw() {
  let canvas = document.getElementById('drawBoard') as HTMLCanvasElement;
  let data = await getData();
  let [width, height] = dataSizeToImageSize(data.length);
  canvas.setAttribute('width', width.toString());
  canvas.setAttribute('height', height.toString());
  // canvas.style.width = width + 'px';
  // canvas.style.height = height + 'px';
  let context = canvas.getContext('2d');
  let imageData = context.createImageData(width, height);
  let dataOffset = 0;
  for (let i = 0; i < width * height; i++) {
    let x = i % width;
    let y = (i - x) / width;
    let offset = (x + y * width) * 4;
    imageData.data[offset + 0] = data[dataOffset++];
    imageData.data[offset + 1] = data[dataOffset++];
    imageData.data[offset + 2] = data[dataOffset++];
    imageData.data[offset + 3] = 255;
  }
  context.putImageData(imageData, 0, 0);
}

function smoother(n: number) {
  let canvas = document.getElementById('drawBoard') as HTMLCanvasElement;
  let context = canvas.getContext('2d');
  let width = +canvas.getAttribute('width').split('px')[0];
  let height = +canvas.getAttribute('height').split('px')[0];
  let imageData = context.getImageData(0, 0, width, height);
  let oldImageData = imageData.data.slice();
  // let newImageData = oldImageData.slice();
  let getPx = (x: number, y: number) => {
    let offset = (x + y * width) * 4;
    return [
      oldImageData[offset + 0],
      oldImageData[offset + 1],
      oldImageData[offset + 2],
    ];
  };
  for (let i = 0; i < n; i++) {
    console.log(`smoother ${i}/${n}`);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let pxList = [getPx(x, y)];
        let add = (x: number, y: number) => {
          if (0 <= x && x <= width && 0 <= y && y <= height) {
            pxList.push(getPx(x, y));
          }
        };
        add(x - 1, y);
        add(x + 1, y);
        add(x, y - 1);
        add(x, y + 1);
        let n = pxList.length;
        let accR = 0;
        let accG = 0;
        let accB = 0;
        pxList.forEach(([r, g, b]) => {
          accR += r;
          accB += b;
          accG += g;
        });
        let offset = (x + y * width) * 4;
        // newImageData[offset + 0] = Math.round(accR / n);
        // newImageData[offset + 1] = Math.round(accG / n);
        // newImageData[offset + 2] = Math.round(accB / n);
        imageData.data[offset + 0] = Math.round(accR >>> n);
        imageData.data[offset + 1] = Math.round(accG >>> n);
        imageData.data[offset + 2] = Math.round(accB >>> n);
      }
      // oldImageData = newImageData.slice();
      oldImageData = imageData.data.slice();
    }
  }
  // for (let i = 0; i < imageData.data.length; i++) {
  //   imageData.data[i] = newImageData[i];
  // }
  context.putImageData(imageData, 0, 0);
}
