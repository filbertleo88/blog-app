import React, { useState } from "react";
import BlogNavbar from "./BlogNavbar";
import Sidebar from "./Sidebar";
import AuthModal from "../../Auth/AuthModal";

const BlogLayout = ({ children, activeMenu }) => {
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);

  return (
    <div className="bg-white pb-20">
      <BlogNavbar activeMenu={activeMenu} onLoginClick={() => setIsAuthModalVisible(true)} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-8 py-6">
        {/* Main Content (Blog Feed) */}
        <div className="lg:col-span-2">{children}</div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Sidebar />
        </div>
      </div>
      
      <AuthModal 
        isVisible={isAuthModalVisible} 
        onClose={() => setIsAuthModalVisible(false)} 
      />
    </div>
  );
};

export default BlogLayout;
