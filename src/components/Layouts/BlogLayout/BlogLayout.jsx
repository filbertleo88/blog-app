import React from "react";
import BlogNavbar from "./BlogNavbar";

const BlogLayout = ({ children, activeMenu }) => {
  return (
    <div className="bg-white pb-30">
      <BlogNavbar activeMenu={activeMenu}> </BlogNavbar>
      <div className="container mx-auto pt-5 md:px-0 mt-10">{children}</div>
    </div>
  );
};

export default BlogLayout;
