# Image Gallery

This project is a simple image gallery built with **TypeScript**, **Next.js**, and **Material UI**. A responsive grid layout allows users to upload, view, and delete images. The gallery integrates Cloudinary to ensure consistency and reliability in managing images.

## Features

- **Image Upload**  
  - Users can upload an image through the "Upload" button. 
  - The application integrates with a third-party service, Cloudinary, to handle the storage and management of images.

- **Gallery Display**  
  - Uploaded images are displayed in a responsive grid format.
  - Clicking on any image opens a modal to view the image in a larger preview.
  - A search bar is added in the navbar to allow users to filter images by title or tags.

- **Image Deletion**  
  - Users can delete images with a confirmation prompt to prevent accidental deletion.

- **Infinite Scroll**  
  - The gallery supports infinite scrolling for a seamless experience when browsing large numbers of images.

- **Responsive Design**  
  - The gallery is fully responsive, ensuring it works across different devices and screen sizes.

## Tech Stack

- **TypeScript**: Provides type safety and improves the development process.
- **Next.js**: A React-based framework for building static and server-rendered applications.
- **Material UI**: A popular React UI framework for creating clean and modern user interfaces.
- Cloudinary: Used to manage image uploads and storage seamlessly.

## Live URL

The live URL of this project: https://image-gallary-blue.vercel.app

## Installation

To run the project locally, follow these steps:

Clone the repo:

```bash
git clone https://github.com/RakibMojumder/image-gallery.git
cd image-gallery
```

Install the dependencies:

```bash
pnpm install
```

Set the environment variables:

```bash
NEXT_PUBLIC_MONGODB_URI=mongodb+srv://Admin:admin@cluster0.zzty5cj.mongodb.net/image-gallery
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=de4g6jmk4
NEXT_PUBLIC_CLOUDINARY_API_KEY=693662919513483
NEXT_PUBLIC_CLOUDINARY_API_SECRET=2s3bMgs2LAcfYp7XtNFpXzF_vzU
NEXT_PUBLIC_CLOUDINARY_FOLDER=image_gallery
NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN=vercel_blob_rw_4Z5mSKXQA5A5ois6_yu73VlAeArmnmxN7HmBjtDQFk4R5ru
NEXT_PUBLIC_PROJECT_URL=http://localhost:3000
```

Running in development:

```bash
pnpm dev
```
