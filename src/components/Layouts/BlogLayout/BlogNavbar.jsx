import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { Link } from "react-router-dom";
import { LuSearch as MagnifyingGlassIcon } from "react-icons/lu";

const menuItems = [
    { label: "Home", path: "/" },
    { label: "React JS", path: "/react" },
    { label: "Next JS", path: "/next" },
];

const BlogNavbar = ({ activeMenu, onLoginClick }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm py-4 px-7 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* LEFT: LOGO */}
        <div className="flex items-center gap-3">
            <button className="md:hidden text-black -mt-1" onClick={() => setOpenSideMenu(!openSideMenu)}>
                {openSideMenu ? <HiOutlineX className="text-2xl" /> : <HiOutlineMenu className="h-6 w-6" />}
            </button>
            <Link to="/" className="text-2xl font-bold text-sky-600 tracking-wider">
                Time To Program
            </Link>
        </div>


        {/* CENTER: MENU LIST */}
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item, index) => {
            return (
              <Link to={item?.path} key={index} className="relative group">
                <li className={`text-[15px] font-medium list-none ${activeMenu === item.label ? "text-sky-600" : "text-gray-700 hover:text-sky-500"}`}>
                  {item.label}
                  <span className={`absolute inset-x-0 -bottom-1 h-[2px] bg-sky-500 transition-transform duration-300 origin-left ${activeMenu === item.label ? "scale-x-100" : "scale-x-0"} group-hover:scale-x-100`}></span>
                </li>
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: SEARCH + LOGIN */}
        <div className="flex items-center gap-6">
          <button className="hover:text-sky-500 cursor-pointer">
            <MagnifyingGlassIcon className="text-[22px]" />
          </button>

          <button onClick={onLoginClick} className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
            Login / SignUp
          </button>
        </div>
      </div>
    </header>
  );
};

export default BlogNavbar;