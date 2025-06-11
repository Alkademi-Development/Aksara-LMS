const getFilename = (path) => {
    // example path: https://nama-domain/path/path/nama-file.pdf
    const arrayPath = path.split('/')

    // output: nama-file.pdf
    if (arrayPath.length === 0) return path
    return arrayPath[arrayPath.length - 1]
}

const removeExtFilename = (filename) => {
    // example filename: nama-file.pdf

    // output: nama-file
    return filename.split('.').slice(0, -1).join('.')
}

const originalFileExt = (filename) => {
    return filename.substring(filename.lastIndexOf('.') + 1);
}

const getFileType = (filename) => {
    // example filename: nama-file.pdf
    
    // get original file extension
    const fileExt = originalFileExt(filename)

    // constant file type for feature chat
    const fileTypeMap = {
        doc: 'document',
        docx: 'document',
        xls: 'document', //untuk excel versi lama
        xlsx: 'document',
        pdf: 'document',
        csv: 'document',
        jpg: 'image',
        jpeg: 'image',
        png: 'image',
        ppt: 'slide',
        pptx: 'slide',
        mp4: 'video',
        mov: 'video',
        avi: 'video'
    };

    // mapping file extension
    const lowercaseExtension = fileExt.toLowerCase();

    // output: document or image or slide or video or any
    return fileTypeMap[lowercaseExtension] || 'any';
}

const humanizeFileSize = (size) => {
    // example size value: 1024 (in bytes)
    const fileSize = size;

    if (fileSize === 0) return '0 Bytes';

    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(fileSize) / Math.log(1024));
    const formattedSize = parseFloat((fileSize / Math.pow(1024, i)).toFixed(2));

    // output: 1KB
    return `${formattedSize} ${units[i]}`;
}

const downloadFile = (path) => {
    // example path: https://nama-domain/path/path/nama-file.pdf
    const filename = getFilename(path)

    fetch(path)
    .then(response => response.blob())
    .then(blob => {
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    })
    .catch(error => {
        console.error('Download attachment failed:', error);
    });
}

export {
    getFilename,
    removeExtFilename,
    getFileType,
    humanizeFileSize,
    originalFileExt,
    downloadFile
}