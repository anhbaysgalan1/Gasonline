const _fileDownload = (data, filename, type, bom) => {
    var blobData = (typeof bom !== 'undefined') ? [bom, data] : [data];
    var blob = new Blob(blobData, {type: type || 'application/octet-stream'});

    _saveFile(blob);
}

const _saveFile = (blob, filename) => {
    if(blob instanceof Blob) {
        if(typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(blob, filename);
        } else {
            var blobURL = window.URL.createObjectURL(blob);
            var tempLink = document.createElement('a');
            tempLink.style.display = 'none';
            tempLink.href = blobURL;
            tempLink.setAttribute('download', filename); 
        
            if (typeof tempLink.download === 'undefined') {
                tempLink.setAttribute('target', '_blank');
            }
            
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            window.URL.revokeObjectURL(blobURL);        // remove object window.URL.createObjectURL(blob)
        }
    } else {
        var tempLink = document.createElement('a');
        tempLink.style.display = 'none';
        tempLink.href = blob;   // url
        tempLink.setAttribute('download', filename); 
    
        if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank');
        }
        
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
    }
}

export const saveFile = _saveFile;
export const fileDownload = _fileDownload;