import axios from 'axios';

export const b64toBlob = (b64Data: any, contentType?: any, sliceSize?: any) => {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

export const cbUploadImage = async (data: any) => {
  // Split the base64 string in data and contentType
  const block = data.split(';');
  // Get the content type of the image
  const contentType = block[0].split(':')[1]; // In this case "image/gif"
  // get the real base64 content of the file
  const realData = block[1].split(',')[1]; // In this case "R0lGODlhPQBEAPeoAJosM...."
  // Convert it to a blob to upload
  const blob = b64toBlob(realData, contentType);

  const dataRequest = new FormData();
  dataRequest.append('auth_token', '970165a01aa329064b5154c75c6cbc99183ddb8c');
  dataRequest.append('source', blob);
  dataRequest.append('type', 'file');
  dataRequest.append('action', 'upload');
  dataRequest.append('timestamp', JSON.stringify(new Date().getTime()));

  const res = await axios({
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    url: 'https://imgbb.com/json',
    method: 'POST',
    data: dataRequest,
  });
  return res.data.image.display_url;
};

export const DEFAULT_PLATE_VALUE = [
  {
    children: [{ text: '' }],
    type: 'p',
  },
];
