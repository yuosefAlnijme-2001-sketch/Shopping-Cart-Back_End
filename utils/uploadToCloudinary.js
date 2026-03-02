const cloudinary = require("./cloudinary");

const uploadImage = async (file) => {
  const result = await cloudinary.uploader.upload(file.path, {
    folder: "products",
  });

  return result.secure_url;
};

module.exports = uploadImage;
