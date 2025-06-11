import { capitalizeAllFirst } from "./capitalize";
import { toDateTimes, toDate, toDateShort, toDateFromNow } from "./dateConverter";
import { trimString } from "./stringTrimmer";
import { getFirstWord } from "./getFirstWord";
import { getFilename, getFileType, removeExtFilename, humanizeFileSize, originalFileExt, downloadFile } from "./fileConverter";
import { compressImageFile } from "./imageCompression";
import { toEncrypt, toDecrypt } from "./encryptData";

export {
  capitalizeAllFirst,
  toDateTimes,
  toDate,
  toDateShort,
  toDateFromNow,
  trimString,
  getFirstWord,
  getFilename,
  getFileType,
  removeExtFilename,
  humanizeFileSize,
  originalFileExt,
  downloadFile,
  compressImageFile,
  toEncrypt,
  toDecrypt,
}