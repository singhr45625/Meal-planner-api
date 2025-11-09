const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Handle base64 image upload
router.post('/base64', async (req, res) => {
  try {
    const { image, fileName } = req.body;
    
    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'No image data provided'
      });
    }

    // Extract base64 data
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Generate unique filename
    const fileExtension = image.split(';')[0].split('/')[1];
    const uniqueFileName = `meal-${Date.now()}.${fileExtension}`;
    const filePath = path.join('uploads', uniqueFileName);
    
    // Save file (in production, you'd upload to cloud storage like AWS S3)
    const fs = require('fs').promises;
    await fs.writeFile(filePath, buffer);
    
    // Return the URL (in production, return cloud storage URL)
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${uniqueFileName}`;
    
    console.log('Image uploaded successfully:', imageUrl);
    
    res.json({
      success: true,
      data: {
        url: imageUrl,
        fileName: uniqueFileName
      }
    });
    
  } catch (error) {
    console.error('Base64 upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image'
    });
  }
});

// Handle multipart form data upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    console.log('Multipart image uploaded:', imageUrl);
    
    res.json({
      success: true,
      data: {
        url: imageUrl,
        fileName: req.file.filename
      }
    });
    
  } catch (error) {
    console.error('Multipart upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image'
    });
  }
});

module.exports = router;