
const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');

// Get all vendors
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (isNaN(limit) || limit <= 0) {
      return res.status(400).json({ message: 'Invalid limit parameter' });
    }

    // Get the total count of documents
    const totalDocsCount = await Vendor.countDocuments();

    const totalPages = Math.ceil(totalDocsCount / limit);

    if (page > totalPages) {
      return res.status(400).json({ message: 'Page number exceeds total pages' });
    }

    const skip = (page - 1) * limit;

    const vendors = await Vendor.find()
      .skip(skip)
      .limit(limit);

    res.json({ vendors, totalPages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get a specific vendor
router.get('/:id', getVendor, (req, res) => {
  res.json(res.vendor);
});

// Create a vendor
router.post('/', async (req, res) => {
  const vendor = new Vendor(req.body);

  try {
    const newVendor = await vendor.save();
    res.status(201).json(newVendor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a vendor
router.patch('/:id', getVendor, async (req, res) => {
  if (req.body.vendorName != null) {
    res.vendor.vendorName = req.body.vendorName;
  }
  // Update other fields similarly

  try {
    const updatedVendor = await res.vendor.save();
    res.json(updatedVendor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a vendor
router.delete('/:id', async (req, res) => {
  const vendorId = req.params.id;

  try {
    // Use findByIdAndDelete to delete the vendor by _id
    const deletedVendor = await Vendor.findByIdAndDelete(vendorId);

    if (!deletedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json({ message: 'Vendor deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware function to get vendor by ID
async function getVendor(req, res, next) {
  let vendor;
  try {
    vendor = await Vendor.findById(req.params.id);
    if (vendor == null) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.vendor = vendor;
  next();
}

module.exports = router;
