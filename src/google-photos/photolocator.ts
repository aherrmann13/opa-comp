import * as fs from 'fs-extra';
import * as path from 'path';
import { Photo } from './photo';
import { Trampoline, execute, Done, More } from '../core/trampoline';

const photoRegex = /.*\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;

function isPicture(filename: string): boolean {
  return filename.match(photoRegex) !== null;
}

// worried about getting into appdata or something like that so trampoline
// tail recursion would be easier but it seems it is not implemented in most browsers
// https://stackoverflow.com/questions/37224520/are-functions-in-javascript-tail-call-optimized
// https://stackoverflow.com/questions/42788139/es6-tail-recursion-optimisation-stack-overflow/42788286#42788286
function findPhotosTrampoline(paths: string[]): Trampoline<Photo[]> {
  if (paths.length === 0) {
    return new Done([]);
  } else {
    const files = fs.readdirSync(paths[0], { withFileTypes: true });
    const newPaths = [
      ...files.filter(x => x.isDirectory()).map(x => path.join(paths[0], x.name)),
      ...paths.slice(1, paths.length)
    ];
    const newPhotos = files
      .filter(x => x.isFile() && isPicture(x.name))
      .map(x => ({ path: paths[0], filename: x.name }));
    return new More(() => findPhotosTrampoline(newPaths)).map(x => [...x, ...newPhotos]);
  }
}

export function findPhotos(filepath: string): Photo[] {
  return execute(findPhotosTrampoline([filepath]));
}
