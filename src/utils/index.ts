import fs from 'fs';
import FastGlob from 'fast-glob';
import path from 'path';

const FILE_EXT = ['ts', 'js', 'tsx', 'jsx', 'vue', 'scss', 'sass', 'html', 'json'];

const BASE_URL = 'src/**/*';

/**
 * @description: 扫描所有指定文件并返回所有出现过的字符
 * @param {*} options
 */
export const getCodes = async options => {
  const codeSet = new Set<string>();

  if (!options) {
    options = { include: BASE_URL };
  }
  if (!options.include) {
    options.include = BASE_URL;
  }

  const getFileCodeSet: (newFilePath: string) => Promise<Set<string>> = newFilePath => {
    return new Promise(resolve => {
      const str = fs.readFileSync(newFilePath, 'utf-8');
      const newSet = new Set(str.split(''));
      resolve(newSet);
    });
  };

  const setCodeSet = async () => {
    const files = await fileScanner(options!);
    const setters = files.map(
      filePath =>
        new Promise(async resolve => {
          const newSet = await getFileCodeSet(filePath);
          newSet.forEach(c => {
            if (!codeSet.has(c)) {
              codeSet.add(c);
            }
          });
          resolve(true);
        })
    );

    await Promise.all(setters);
  };

  await setCodeSet();
  return Array(...codeSet).join('');
};

const toStringArray = (str: string | string[]): string[] => {
  if (typeof str === 'string') {
    return [str];
  }
  return str;
};

const toFixExt = (fileUrls: string | string[], fileExt: string) => {
  return toStringArray(fileUrls).map(i => {
    const infos = i.split(path.sep);
    const endInfo = infos[infos.length - 1];
    if (endInfo.includes('.')) {
      return i;
    }
    if (endInfo === '**') {
      return i;
    }
    return `${i}.${fileExt}`;
  });
};

const getFileExt = (fileExt?: string | string[]): string => {
  if (!fileExt) {
    return `{${FILE_EXT.join(',')}}`;
  }
  if (fileExt instanceof Array) {
    if (fileExt.length === 0) {
      return '*';
    }
    if (fileExt.length === 1) {
      return fileExt[0];
    }
  }
  return `{${toStringArray(fileExt).join(',')}}`;
};

/**
 * @description: get all request files
 * @param {*} options
 */
export async function fileScanner(options) {
  const fileExt = getFileExt(options.fileExt);
  const includes = toFixExt(options.include!, fileExt);
  const excludes = options.exclude ? toFixExt(options.exclude, fileExt) : [];
  return await FastGlob(includes, { ignore: excludes, dot: true });
}
