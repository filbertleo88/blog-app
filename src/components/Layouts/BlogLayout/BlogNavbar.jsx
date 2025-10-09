import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { Link } from "react-router-dom";
import { LuSearch } from "react-icons/lu";
import { BLOG_NAVBAR_DATA } from "../../../utils/data";

const BlogNavbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [openSearchBar, setOpenSearchBar] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
      <div className="container mx-auto flex items-center justify-between">
        {/* LEFT: LOGO */}
        <div className="flex items-center gap-3">
          <button className="block lg:hidden text-black -mt-1" onClick={() => setOpenSideMenu(!openSideMenu)}>
            {openSideMenu ? <HiOutlineX className="text-2xl" /> : <HiOutlineMenu className="h-6 w-6 md:h-7 md:w-7" />}
          </button>

          <Link to="/" className="text-lg font-semibold text-black">
            Buleltin
          </Link>
        </div>

        {/* CENTER: MENU LIST */}
        <nav className="hidden md:flex items-center gap-10">
          {BLOG_NAVBAR_DATA.map((item, index) => {
            if (item?.onlySideMenu) return null;

            return (
              <Link to={item?.path} key={index}>
                <li className={`text-[15px] font-medium list-none relative group cursor-pointer ${activeMenu === item.label ? "text-sky-600" : "text-black hover:text-sky-500"}`}>
                  {item.label}
                  <span className={`absolute inset-x-0 bottom-0 h-[2px] bg-sky-500 transition-all duration-300 origin-left ${index === 0 ? "scale-x-100" : "scale-x-0"} group-hover:scale-x-100`}></span>
                </li>
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: SEARCH + LOGIN */}
        <div className="flex items-center gap-6">
          <button className="hover:text-sky-500 cursor-pointer" onClick={() => setOpenSearchBar(true)}>
            <LuSearch className="text-[22px]" />
          </button>

          <button className="flex items-center justify-center gap-3 bg-gradient-to-r from-sky-500 to-cyan-400 text-xs md:text-sm font-semibold text-white px-5 md:px-7 py-2 rounded-full hover:bg-black hover:text-white transition-all hover:shadow-2xl hover:shadow-cyan-200">
            Login/SignUp
          </button>
        </div>
      </div>
    </header>
  );
};

export default BlogNavbar;
