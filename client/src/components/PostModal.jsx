// import React, { useState } from "react";

// const PostModal = ({ isOpen, onClose, onSubmit }) => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [content, setContent] = useState("");
//   const [tags, setTags] = useState("");
//   const [authorName, setAuthorName] = useState("");
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);

//       // Create preview URL
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleRemoveImage = () => {
//     setImage(null);
//     setImagePreview("");
//   };

//   // const uploadImageToServer = async (file) => {
//   //   const formData = new FormData();
//   //   formData.append("image", file);

//   //   try {
//   //     const response = await fetch("http://localhost:5009/api/upload", {
//   //       method: "POST",
//   //       body: formData,
//   //     });

//   //     if (!response.ok) {
//   //       throw new Error("Failed to upload image");
//   //     }

//   //     const data = await response.json();
//   //     return data.imageUrl; // Assuming your backend returns { imageUrl: 'path/to/image' }
//   //   } catch (error) {
//   //     console.error("Error uploading image:", error);
//   //     throw error;
//   //   }
//   // };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   if (!title || !description || !authorName) {
//   //     alert("Please fill in all required fields");
//   //     return;
//   //   }

//   //   setIsUploading(true);

//   //   try {
//   //     let imageUrl = "";

//   //     // Upload image if selected
//   //     if (image) {
//   //       imageUrl = await uploadImageToServer(image);
//   //     }

//   //     // Prepare post data
//   //     const postData = {
//   //       title,
//   //       description,
//   //       content,
//   //       image: imageUrl,
//   //       tags: tags
//   //         .split(",")
//   //         .map((tag) => tag.trim())
//   //         .filter((tag) => tag !== ""),
//   //       author: {
//   //         name: authorName,
//   //         avatar: `https://i.pravatar.cc/50?${authorName}`, // Generate avatar based on name
//   //       },
//   //     };

//   //     await onSubmit(postData);

//   //     // Reset form
//   //     setTitle("");
//   //     setDescription("");
//   //     setContent("");
//   //     setTags("");
//   //     setAuthorName("");
//   //     setImage(null);
//   //     setImagePreview("");
//   //   } catch (error) {
//   //     console.error("Error submitting post:", error);
//   //     alert("Failed to create post. Please try again.");
//   //   } finally {
//   //     setIsUploading(false);
//   //   }
//   // };

//   const uploadImageToServer = async (file) => {
//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       console.log("Uploading image...", file.name);

//       const response = await fetch("http://localhost:5009/api/upload", {
//         method: "POST",
//         body: formData,
//       });

//       console.log("Upload response status:", response.status);

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("Upload failed:", errorText);
//         throw new Error(`Failed to upload image: ${response.status} - ${errorText}`);
//       }

//       const data = await response.json();
//       console.log("Upload successful:", data);
//       return data.imageUrl;
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       throw error;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Basic validation
//     if (!title || title.length < 5) {
//       alert("Title is required and must be at least 5 characters");
//       return;
//     }

//     if (!description || description.length < 20) {
//       alert("Description is required and must be at least 20 characters");
//       return;
//     }

//     if (!authorName) {
//       alert("Author name is required");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       // Minimal post data - only what's absolutely required
//       const postData = {
//         title: title.trim(),
//         description: description.trim(),
//         author: {
//           name: authorName.trim(),
//         },
//       };

//       // Add optional fields only if they have values
//       if (content.trim()) postData.content = content.trim();
//       if (tags.trim()) {
//         postData.tags = tags
//           .split(",")
//           .map((tag) => tag.trim())
//           .filter((tag) => tag !== "");
//       }
//       if (imageUrl.trim()) postData.image = imageUrl.trim();

//       console.log("Minimal post data:", postData);

//       await onSubmit(postData);

//       // Reset form on success
//       setTitle("");
//       setDescription("");
//       setContent("");
//       setTags("");
//       setAuthorName("");
//       setImageUrl("");
//     } catch (error) {
//       console.error("Error creating post:", error);
//       alert(`Failed to create post: ${error.message}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleClose = () => {
//     // Reset form when closing
//     setTitle("");
//     setDescription("");
//     setContent("");
//     setTags("");
//     setAuthorName("");
//     setImage(null);
//     setImagePreview("");
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         <h3 className="text-2xl font-bold mb-6 text-gray-800">Add a New Post</h3>

//         <form onSubmit={handleSubmit}>
//           {/* Image Upload Section */}
//           <div className="mb-6">
//             <label className="block text-gray-700 text-sm font-semibold mb-2">Featured Image</label>
//             <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
//               {imagePreview ? (
//                 <div className="relative">
//                   <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
//                   <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>
//               ) : (
//                 <div>
//                   <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
//                     <path
//                       d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
//                       strokeWidth={2}
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                   <div className="flex text-sm text-gray-600 justify-center">
//                     <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
//                       <span>Upload an image</span>
//                       <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
//                     </label>
//                     <p className="pl-1">or drag and drop</p>
//                   </div>
//                   <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Required Fields */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-gray-700 text-sm font-semibold mb-2">Title *</label>
//               <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
//             </div>

//             <div>
//               <label className="block text-gray-700 text-sm font-semibold mb-2">Author Name *</label>
//               <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
//             </div>
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-semibold mb-2">Description *</label>
//             <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" required />
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-semibold mb-2">Content</label>
//             <textarea
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               rows="6"
//               placeholder="Write your full blog post content here..."
//             />
//           </div>

//           <div className="mb-6">
//             <label className="block text-gray-700 text-sm font-semibold mb-2">Tags (comma-separated)</label>
//             <input
//               type="text"
//               value={tags}
//               onChange={(e) => setTags(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="React, JavaScript, Web Development"
//             />
//           </div>

//           <div className="flex justify-end space-x-4">
//             <button type="button" onClick={handleClose} disabled={isUploading} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50">
//               Cancel
//             </button>
//             <button type="submit" disabled={isUploading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center">
//               {isUploading ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Creating...
//                 </>
//               ) : (
//                 "Create Post"
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PostModal;

import React, { useState } from "react";

const PostModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState(""); // Add this missing state

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview("");
  };

  const uploadImageToServer = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      console.log("Uploading image...", file.name);

      const response = await fetch("http://localhost:5009/api/upload", {
        method: "POST",
        body: formData,
      });

      console.log("Upload response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed:", errorText);
        throw new Error(`Failed to upload image: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Upload successful:", data);
      return data.imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!title || title.length < 5) {
      alert("Title is required and must be at least 5 characters");
      return;
    }

    if (!description || description.length < 20) {
      alert("Description is required and must be at least 20 characters");
      return;
    }

    if (!authorName) {
      alert("Author name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      let finalImageUrl = imageUrl;

      // If file is uploaded, use the upload function
      if (image) {
        finalImageUrl = await uploadImageToServer(image);
      }
      // If no image URL provided, generate one based on tags
      else if (!finalImageUrl && tags) {
        const firstTag = tags.split(",")[0]?.trim();
        finalImageUrl = `https://source.unsplash.com/800x400/?${firstTag || "blog"}`;
      }

      // Minimal post data - only what's absolutely required
      const postData = {
        title: title.trim(),
        description: description.trim(),
        author: {
          name: authorName.trim(),
        },
      };

      // Add optional fields only if they have values
      if (content.trim()) postData.content = content.trim();
      if (tags.trim()) {
        postData.tags = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "");
      }
      if (finalImageUrl) postData.image = finalImageUrl;

      console.log("Final post data:", postData);

      await onSubmit(postData);

      // Reset form on success
      setTitle("");
      setDescription("");
      setContent("");
      setTags("");
      setAuthorName("");
      setImage(null);
      setImagePreview("");
      setImageUrl("");
    } catch (error) {
      console.error("Error creating post:", error);
      alert(`Failed to create post: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setTitle("");
    setDescription("");
    setContent("");
    setTags("");
    setAuthorName("");
    setImage(null);
    setImagePreview("");
    setImageUrl("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Add a New Post</h3>

        <form onSubmit={handleSubmit}>
          {/* Image Upload Section */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Featured Image</label>

            {/* Image URL Input */}
            <div className="mb-4">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Or enter image URL (optional)"
              />
              <p className="text-xs text-gray-500 mt-1">Enter an image URL or upload a file below</p>
            </div>

            {/* File Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                  <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div>
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                      <span>Upload an image</span>
                      <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Required Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Title *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Author Name *</label>
              <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Description *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" required />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="6"
              placeholder="Write your full blog post content here..."
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="React, JavaScript, Web Development"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button type="button" onClick={handleClose} disabled={isSubmitting} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostModal;
