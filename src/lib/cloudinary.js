const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export async function uploadToCloudinary(file, options = {}) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'portfolio_preset'); // Create this in Cloudinary
  
  if (options.folder) {
    formData.append('folder', options.folder);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return response.json();
}

export function getCloudinaryUrl(publicId, transformations = {}) {
  const baseUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;
  
  const transforms = [];
  if (transformations.width) transforms.push(`w_${transformations.width}`);
  if (transformations.height) transforms.push(`h_${transformations.height}`);
  if (transformations.quality) transforms.push(`q_${transformations.quality}`);
  
  const transformStr = transforms.join(',');
  
  return `${baseUrl}/${transformStr ? transformStr + '/' : ''}${publicId}`;
}