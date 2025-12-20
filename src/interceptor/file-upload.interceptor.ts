import { BadRequestException, Type } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

interface FileUploadOptions {
  destination: string;
  fileNamePrefix?: string; // optional prefix
  maxSize?: number; // in bytes
  allowedMimeTypes?: string[]; // default to images
}

export function FileUploadInterceptor(options: FileUploadOptions) {
  const {
    destination,
    fileNamePrefix,
    maxSize = 2 * 1024 * 1024,
    allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'],
  } = options;

  return FileInterceptor('file', {
    storage: diskStorage({
      destination,
      filename: (req, file, cb) => {
        const uniqueName = `${fileNamePrefix ? fileNamePrefix + '-' : ''}${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, uniqueName + extname(file.originalname));
      },
    }),
    limits: {
      fileSize: maxSize,
    },
    fileFilter: (req, file, cb) => {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new BadRequestException('Invalid file type'), false);
      }
      cb(null, true);
    },
  });
}
