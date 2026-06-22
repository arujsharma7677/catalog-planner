// Client-side image compression used at photo upload time, before files are
// previewed or sent to the analyzer API.

export const compressImage = async (
  base64: string,
  { quality = 1, type = 'image/jpeg' } = {},
) => {
  // Create an image from base64 string
  const image = new Image();

  // Return a promise that resolves when the image is loaded
  const loadImage = new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = err => reject(err);
    image.src = base64; // Set the base64 string as the source
  });

  const img = await loadImage;

  // Create a canvas element to draw the image
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Set canvas dimensions to match the image
  canvas.width = img.width;
  canvas.height = img.height;

  // Draw the image onto the canvas
  ctx.drawImage(img, 0, 0);

  // Compress the image by creating a Blob with the specified quality and type
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Blob creation failed'));
        }
      },
      type,
      quality,
    );
  });

  // Convert the Blob back into a File
  const file = new File([blob], 'compressed-image.jpg', { type: blob.type });

  return file;
};

const fileToDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// Compress a File picked from a file input. Falls back to the original file if
// compression fails for any reason (e.g. unsupported format).
export const compressFile = async (
  file: File,
  opts: { quality?: number; type?: string } = { quality: 0.8 },
): Promise<File> => {
  try {
    const dataUrl = await fileToDataURL(file);
    return await compressImage(dataUrl, opts);
  } catch (err) {
    console.error('Image compression failed, using original file', err);
    return file;
  }
};
