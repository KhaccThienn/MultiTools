// pages/api/convert.js

import nextConnect from 'next-connect';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';

ffmpeg.setFfmpegPath(ffmpegStatic);

const upload = multer({ dest: '/tmp' });

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('file'));

apiRoute.post(async (req, res) => {
  const { format } = req.body;
  const inputFile = req.file.path;
  const outputFile = `/tmp/output.${format}`;

  ffmpeg(inputFile)
    .output(outputFile)
    .on('end', () => {
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename=converted.${format}`);
      const fileStream = fs.createReadStream(outputFile);
      fileStream.pipe(res);

      // Clean up temporary files
      fileStream.on('close', () => {
        fs.unlinkSync(inputFile);
        fs.unlinkSync(outputFile);
      });
    })
    .on('error', (err) => {
      fs.unlinkSync(inputFile);
      res.status(500).json({ error: `Conversion error: ${err.message}` });
    })
    .run();
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disable built-in body parser for file uploads
  },
};
