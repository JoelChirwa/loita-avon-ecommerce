import { v2 as cloudinary } from 'cloudinary';

// @desc    Upload product images to Cloudinary
// @route   POST /api/upload/products
// @access  Private/Admin
export const uploadProductImages = async (req, res) => {
  try {
    // Configure cloudinary with environment variables
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log('Upload request received');
    console.log('Files:', req.files?.length);
    console.log('Cloudinary config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set',
    });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    const uploadPromises = req.files.map(
      (file) =>
        new Promise((resolve, reject) => {
          console.log('Uploading file:', file.originalname, 'Size:', file.size);
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'loita-shop/products',
              transformation: [
                { width: 800, height: 800, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' },
              ],
            },
            (error, result) => {
              if (error) {
                console.error('Cloudinary error for file:', file.originalname, error);
                reject(error);
              } else {
                console.log('Upload successful:', result.secure_url);
                resolve({
                  url: result.secure_url,
                  publicId: result.public_id,
                  alt: req.body.altText || 'Product image',
                });
              }
            }
          );
          uploadStream.end(file.buffer);
        })
    );

    const uploadedImages = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      images: uploadedImages,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload images',
      error: error.toString(),
    });
  }
};

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/:publicId
// @access  Private/Admin
export const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    await cloudinary.uploader.destroy(publicId);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message,
    });
  }
};
