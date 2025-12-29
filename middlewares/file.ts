const dotenv = require("dotenv");
dotenv.config();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Multer storage configuration
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export interface IFile {
  uri: string;
  name: string;
  type: string;
}

export const mapFiles = async (files: any) => {
  let fls: IFile[] = [];

  if (files && files?.length > 0) {
    for await (let file of files) {
      fls.push({
        name: file?.name,
        type: file?.type,
        uri: file?.uri.includes("res.cloudinary.com")
          ? file?.uri
          : await upLoadFiles(file?.uri, file?.name),
      });
    }
  }

  return fls;
};

export const upLoadFiles = async (file: any, fileName?: any) => {
  const uri = await cloudinary.uploader.upload(file, { public_id: fileName });

  return uri?.secure_url as string;
};

export const uploadBuffer = async (buffer: Buffer, fileName?: string) => {
  return new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { public_id: fileName },
      (error: any, result: any) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};
