import React, { useEffect } from 'react';

const InputFile = ({ setFile, type }) => {
  const [src, setSrc] = React.useState(null);
  const [accept, setAccept] = React.useState(null);

  useEffect(() => {
    switch (type) {
      case 'Image':
        setSrc('https://img.icons8.com/?size=100&id=53386&format=png&color=000000');
        setAccept('.png, .jpg, .jpeg, .webp');
        break;
      case 'Audio':
        setSrc('https://img.icons8.com/?size=100&id=2795&format=png&color=000000');
        setAccept('.mp3, .wav, .flac, .aac');
        break;
      case 'Video':
        setSrc('https://img.icons8.com/?size=100&id=35090&format=png&color=000000');
        setAccept('.mp4, .avi, .mkv, .mov');
        break;
      default:
        setSrc(null);
        setAccept(null);
        break;
    }
  }, [type]); // Runs only when 'type' changes

  const handleUploadFile = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl">
      <div className="md:flex">
        <div className="w-full p-3">
          <div className="relative h-48 rounded-lg border-2 border-blue-500 bg-gray-50 flex justify-center items-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <div className="absolute flex flex-col items-center">
              <img alt="File Icon" className="mb-3" src={src} />
              <span className="block text-gray-500 font-semibold">Drag &amp; drop your files here</span>
              <span className="block text-gray-400 font-normal mt-1">or click to upload</span>
            </div>
            <input
              className="h-full w-full opacity-0 cursor-pointer"
              type="file"
              accept={accept} // Use 'accept' based on 'type'
              onChange={handleUploadFile}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputFile;
