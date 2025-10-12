// components/pages/Admin/components/BlogPosts/PostModal.jsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const PostModal = ({ isOpen, onClose, onSubmit, initialData, currentUser }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("draft");
  const [activeTab, setActiveTab] = useState("write"); // "write" or "preview"

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Editing mode - populate form with existing data
        setTitle(initialData.title || "");
        setDescription(initialData.description || "");
        setContent(initialData.content || "");
        setTags(initialData.tags ? initialData.tags.join(", ") : "");
        setImageUrl(initialData.image || "");
        setImagePreview(initialData.image || "");
        setStatus(initialData.status || "draft");
      } else {
        // Create mode - reset form
        setTitle("");
        setDescription("");
        setContent("");
        setTags("");
        setImage(null);
        setImagePreview("");
        setImageUrl("");
        setStatus("draft");
        setActiveTab("write");
      }
    }
  }, [isOpen, initialData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      // Create preview URL (this is temporary, won't be saved as base64)
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
    setImageUrl("");
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

  // Improved markdown parser
  const parseMarkdown = (text) => {
    if (!text) return "";

    let html = text;

    // Process line by line to handle lists properly
    const lines = html.split("\n");
    let inList = false;
    let inOrderedList = false;

    const processedLines = lines.map((line, index) => {
      const trimmedLine = line.trim();

      // Handle unordered lists
      if (trimmedLine.match(/^[-*+]\s/)) {
        const listItem = trimmedLine.replace(/^[-*+]\s/, "");
        if (!inList) {
          inList = true;
          return `<ul><li>${listItem}</li>`;
        }
        return `<li>${listItem}</li>`;
      }

      // Handle ordered lists
      else if (trimmedLine.match(/^\d+\.\s/)) {
        const listItem = trimmedLine.replace(/^\d+\.\s/, "");
        if (!inOrderedList) {
          inOrderedList = true;
          return `<ol><li>${listItem}</li>`;
        }
        return `<li>${listItem}</li>`;
      }

      // Close lists when we encounter a non-list line
      else {
        let result = "";
        if (inList) {
          result += "</ul>";
          inList = false;
        }
        if (inOrderedList) {
          result += "</ol>";
          inOrderedList = false;
        }

        // Handle regular lines
        if (trimmedLine) {
          result += processInlineMarkdown(line);
        } else {
          result += "<br>";
        }

        return result;
      }
    });

    // Close any open lists at the end
    let finalHtml = processedLines.join("");
    if (inList) finalHtml += "</ul>";
    if (inOrderedList) finalHtml += "</ol>";

    // Wrap in paragraphs if needed
    if (!finalHtml.includes("<ul>") && !finalHtml.includes("<ol>") && !finalHtml.includes("<h")) {
      finalHtml = finalHtml.replace(/<br>/g, "</p><p>");
      finalHtml = `<p>${finalHtml}</p>`;
    }

    return finalHtml;
  };

  // Helper function for inline markdown
  const processInlineMarkdown = (text) => {
    return (
      text
        // Headers
        .replace(/^### (.*$)/gim, "<h3>$1</h3>")
        .replace(/^## (.*$)/gim, "<h2>$1</h2>")
        .replace(/^# (.*$)/gim, "<h1>$1</h1>")
        // Bold
        .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
        .replace(/\_\_(.*?)\_\_/gim, "<strong>$1</strong>")
        // Italic
        .replace(/\*(.*?)\*/gim, "<em>$1</em>")
        .replace(/\_(.*?)\_/gim, "<em>$1</em>")
        // Links
        .replace(/\[([^\[]+)\]\(([^\)]+)\)/gim, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>')
        // Code blocks (inline first)
        .replace(/`([^`]+)`/gim, '<code class="bg-gray-100 px-1 rounded text-sm font-mono">$1</code>')
        // Blockquotes
        .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">$1</blockquote>')
    );
  };

  // Format text with markdown syntax
  const formatText = (type, field) => {
    const textarea = document.getElementById(field);
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let formattedText = "";
    let newCursorPos = 0;

    switch (type) {
      case "bold":
        formattedText = `**${selectedText}**`;
        newCursorPos = start + 2;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        newCursorPos = start + 1;
        break;
      case "link":
        formattedText = `[${selectedText || "link text"}](https://)`;
        newCursorPos = start + 1;
        break;
      case "code":
        formattedText = selectedText.includes("\n") ? `\`\`\`\n${selectedText}\n\`\`\`` : `\`${selectedText}\``;
        newCursorPos = start + (selectedText.includes("\n") ? 4 : 1);
        break;
      case "header1":
        formattedText = `# ${selectedText}`;
        newCursorPos = start + 2;
        break;
      case "header2":
        formattedText = `## ${selectedText}`;
        newCursorPos = start + 3;
        break;
      case "header3":
        formattedText = `### ${selectedText}`;
        newCursorPos = start + 4;
        break;
      case "list":
        formattedText = selectedText
          ? selectedText
              .split("\n")
              .map((line) => `- ${line}`)
              .join("\n")
          : "- ";
        newCursorPos = start + 2;
        break;
      default:
        formattedText = selectedText;
    }

    const newValue = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);

    if (field === "description") {
      setDescription(newValue);
    } else if (field === "content") {
      setContent(newValue);
    }

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos + (selectedText ? selectedText.length : 0));
    }, 0);
  };

  const handleSubmit = async (e, submitStatus = status) => {
    e.preventDefault();

    // Basic validation
    if (!title || title.length < 5) {
      toast.warning("Title is required and must be at least 5 characters");
      return;
    }

    if (!content || content.length < 20) {
      toast.warning("Content is required and must be at least 20 characters");
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

      // Prepare author data - only send URL avatars
      const authorData = {
        name: currentUser?.name || currentUser?.username || "Unknown Author",
        email: currentUser?.email || "",
        avatar: currentUser?.avatar || "",
      };

      // Prepare post data - FIXED: Include content directly since it's required
      const postData = {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(), // This was missing - content is required
        status: submitStatus,
        author: authorData,
      };

      // Add optional fields only if they have values
      if (tags.trim()) {
        postData.tags = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "");
      }
      if (finalImageUrl) postData.image = finalImageUrl;

      console.log("Final post data:", postData);

      await onSubmit(postData);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(`Failed to create post: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = (e) => {
    handleSubmit(e, "published");
  };

  const handleSaveDraft = (e) => {
    handleSubmit(e, "draft");
  };

  const handleClose = () => {
    onClose();
  };

  // Close modal when clicking on the background
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={handleBackdropClick}>
      {/* Blurry Backdrop */}
      <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-all duration-300"></div>

      {/* Modal Content */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 relative z-10">
        {/* Header with Close Button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-xl sticky top-0 z-10">
          <h3 className="text-2xl font-bold text-gray-800">{initialData ? "Edit Post" : "Add a New Post"}</h3>
          <button type="button" onClick={handleClose} disabled={isSubmitting} className="text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Author Info Display */}
        {currentUser && (
          <div className="px-6 pt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Author:</strong> {currentUser.name || currentUser.username}
                {currentUser.email && ` (${currentUser.email})`}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          {/* Image Upload Section */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Featured Image</label>

            {/* Image URL Input */}
            <div className="mb-4">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImagePreview(e.target.value);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter image URL (optional)"
              />
              <p className="text-xs text-gray-500 mt-1">Enter an image URL or upload a file below</p>
            </div>

            {/* File Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors duration-200">
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow-md" />
                  <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200 shadow-lg">
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
                    <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none transition-colors duration-200">
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
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Content *</label>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-2">
              <button type="button" onClick={() => setActiveTab("write")} className={`px-4 py-2 text-sm font-medium ${activeTab === "write" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
                Write
              </button>
              <button type="button" onClick={() => setActiveTab("preview")} className={`px-4 py-2 text-sm font-medium ${activeTab === "preview" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
                Preview
              </button>
            </div>

            {/* Markdown Toolbar */}
            {activeTab === "write" && (
              <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 rounded-lg border">
                <button type="button" onClick={() => formatText("bold", "content")} className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100" title="Bold">
                  <strong>B</strong>
                </button>
                <button type="button" onClick={() => formatText("italic", "content")} className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100" title="Italic">
                  <em>I</em>
                </button>
                <button type="button" onClick={() => formatText("header1", "content")} className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100" title="Heading 1">
                  H1
                </button>
                <button type="button" onClick={() => formatText("header2", "content")} className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100" title="Heading 2">
                  H2
                </button>
                <button type="button" onClick={() => formatText("header3", "content")} className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100" title="Heading 3">
                  H3
                </button>
                <button type="button" onClick={() => formatText("link", "content")} className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100" title="Link">
                  🔗
                </button>
                <button type="button" onClick={() => formatText("code", "content")} className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100 font-mono" title="Code Block">
                  {`</>`}
                </button>
                <button type="button" onClick={() => formatText("list", "content")} className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100" title="List">
                  • List
                </button>
              </div>
            )}

            {/* Content Area */}
            {activeTab === "write" ? (
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-sm"
                rows="8"
                required
                placeholder="Write your blog post content using Markdown..."
              />
            ) : (
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white min-h-[200px] prose max-w-none" dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }} />
            )}

            {/* Markdown Help Text */}
            <div className="mt-2 text-xs text-gray-500">
              <p>Supports Markdown: **bold**, *italic*, # headers, [links](url), `code`, ```code blocks```, - lists</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Description</label>

            {/* Markdown Toolbar for Description */}
            <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 rounded-lg border">
              <button type="button" onClick={() => formatText("bold", "description")} className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100" title="Bold">
                <strong>B</strong>
              </button>
              <button type="button" onClick={() => formatText("italic", "description")} className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100" title="Italic">
                <em>I</em>
              </button>
              <button type="button" onClick={() => formatText("link", "description")} className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100" title="Link">
                🔗
              </button>
              <button type="button" onClick={() => formatText("code", "description")} className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100 font-mono" title="Code">
                {`</>`}
              </button>
            </div>

            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-sm"
              rows="3"
              placeholder="Write a brief description..."
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="React, JavaScript, Web Development"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancel</span>
            </button>

            {/* Save as Draft Button */}
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  <span>Save as Draft</span>
                </>
              )}
            </button>

            {/* Publish Button */}
            <button
              type="button"
              onClick={handlePublish}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Publishing...</span>
                </>
              ) : initialData ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Update Post</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  <span>Publish</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostModal;

// <div className="mb-4">
//   <label className="block text-gray-700 text-sm font-semibold mb-2">Description *</label>

//   {/* Tab Navigation for Description */}
//   <div className="flex border-b border-gray-200 mb-2">
//     <button type="button" onClick={() => setActiveTab("write")} className={`px-4 py-2 text-sm font-medium ${activeTab === "write" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
//       Write
//     </button>
//     <button type="button" onClick={() => setActiveTab("preview")} className={`px-4 py-2 text-sm font-medium ${activeTab === "preview" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
//       Preview
//     </button>
//   </div>

//   {/* Markdown Toolbar for Description */}
//   {activeTab === "write" && (
//     <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 rounded-lg border">
//       <button type="button" onClick={() => formatText("bold", "description")} className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100" title="Bold">
//         <strong>B</strong>
//       </button>
//       <button type="button" onClick={() => formatText("italic", "description")} className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100" title="Italic">
//         <em>I</em>
//       </button>
//       <button type="button" onClick={() => formatText("header1", "description")} className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100" title="Heading 1">
//         H1
//       </button>
//       <button type="button" onClick={() => formatText("header2", "description")} className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100" title="Heading 2">
//         H2
//       </button>
//       <button type="button" onClick={() => formatText("header3", "description")} className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100" title="Heading 3">
//         H3
//       </button>
//       <button type="button" onClick={() => formatText("link", "description")} className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100" title="Link">
//         🔗
//       </button>
//       <button type="button" onClick={() => formatText("code", "description")} className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100 font-mono" title="Code Block">
//         {`</>`}
//       </button>
//       <button type="button" onClick={() => formatText("list", "description")} className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100" title="List">
//         • List
//       </button>
//     </div>
//   )}

//   {/* Description Area */}
//   {activeTab === "write" ? (
//     <textarea
//       id="description"
//       value={description}
//       onChange={(e) => setDescription(e.target.value)}
//       className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-sm"
//       rows="6"
//       required
//       placeholder="Write your blog post description... (supports Markdown)"
//     />
//   ) : (
//     <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white min-h-[200px] prose max-w-none" dangerouslySetInnerHTML={{ __html: parseMarkdown(description) }} />
//   )}

//   {/* Markdown Help Text */}
//   <div className="mt-2 text-xs text-gray-500">
//     <p>Supports Markdown: **bold**, *italic*, # headers, [links](url), `code`, ```code blocks```, - lists</p>
//   </div>
// </div>

// <div className="mb-4">
//   <label className="block text-gray-700 text-sm font-semibold mb-2">Content</label>

//   {/* Simple textarea for Content (since it's optional) */}
//   <textarea
//     value={content}
//     onChange={(e) => setContent(e.target.value)}
//     className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//     rows="3"
//     placeholder="Write your full blog post content here... (optional)"
//   />
// </div>
