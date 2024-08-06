import React, { useState } from 'react';
import "./Uploader.css";

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("Not selected any file");
  const [asciiArt, setAsciiArt] = useState('');

  const handleFileChange = (event) => {
    const files = event.target.files;

    if (files.length > 0) {
      const selectedFile = files[0];
      setFileName(selectedFile.name);
      const imageUrl = URL.createObjectURL(selectedFile);
      setImage(imageUrl);

      generateAsciiArt(imageUrl);
    }
  };

  const generateAsciiArt = (imageUrl) => {
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64; // Reduced width
      canvas.height = 32; // Reduced height
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const ascii = convertToAscii(imageData);
      setAsciiArt(ascii);
    };
  };

  const convertToAscii = (imageData) => {
    const { data, width, height } = imageData;
    const asciiCharacters = ' .:-=*+&#%@'; // Optional: Customize this list
    let ascii = '';

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const offset = (y * width + x) * 4;
        const r = data[offset];
        const g = data[offset + 1];
        const b = data[offset + 2];
        const avg = (r + g + b) / 3;
        const charIndex = Math.floor((avg / 255) * (asciiCharacters.length - 1));
        ascii += asciiCharacters[charIndex];
      }
      ascii += '\n';
    }

    return ascii;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(asciiArt).then(
      () => console.log('ASCII art copied to clipboard!'),
      (err) => console.error('Failed to copy ASCII art:', err)
    );
  };

  return (
    <>
      <form onClick={() => { document.querySelector(".inputField").click() }}>
        <input
          type="file"
          accept="image/*"
          className="inputField"
          hidden
          onChange={handleFileChange}
        />
        {image ? (
          <>
            {/* <img src={image} width={350} height={200} alt={fileName} /> */}
            <pre style={{ fontSize: '0.4rem' }}>{asciiArt}</pre> {/* Adjust font size for smaller ASCII art */}
           
          </>
        ) : (
          <>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTycnhFt5e4Je_VN3IdTeYROZ52KZ9No0Hi0Q&s" alt="Placeholder" />
            <p>Browse Files to Upload</p>
          </>
        )}
      </form>
      {image&&
      <button onClick={copyToClipboard} style={{ marginTop: '10px' }}>Copy ASCII Art</button>}
    </>
  );
};

export default ImageUploader;
