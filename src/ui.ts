import { dataSizeToImageSize } from './utils';
import { fileToArray, fileToArrayBuffer } from '@beenotung/tslib/file';
import { Random } from '@beenotung/tslib/random';

export async function getData(): Promise<number[]> {
  let input = document.getElementById('file') as HTMLInputElement;
  return fileToArray(input.files[0]);
}

export async function initUI() {
  let input = document.getElementById('file') as HTMLInputElement;
  input.onchange = () => {
    initUI();
  };
  let canvas = document.getElementById('drawBoard') as HTMLCanvasElement;
  let data = await getData();
  let [width,height] = dataSizeToImageSize(data.length);
  canvas.setAttribute('width', width + 'px');
  canvas.setAttribute('height', height + 'px');
  // canvas.style.width = width + 'px';
  // canvas.style.height = height + 'px';
  let context = canvas.getContext('2d');
  let imageData = context.createImageData(width, height);
  let dataOffset = 0;
  console.log('before loop');
  for (let i = 0; i < width * height; i++) {
    let x = i % width;
    let y = (i - x) / width;
    let offset = (x + y * width) * 4;
    imageData.data[offset + 0] = data[dataOffset++];
    imageData.data[offset + 1] = data[dataOffset++];
    imageData.data[offset + 2] = data[dataOffset++];
    imageData.data[offset + 3] = 255;
  }
  console.log('after loop');
  context.putImageData(imageData, 0, 0);
  console.log('after put image');
}
