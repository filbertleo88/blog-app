import { LuLayoutDashboard, LuGalleryVerticalEnd, LuMessageSquareQuote, LuLayoutTemplate, LuTag } from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    link: "/admin/dashboard",
  },

  {
    id: "02",
    label: "Blog Posts",
    icon: LuGalleryVerticalEnd,
    link: "/admin/blog-posts",
  },

  {
    id: "03",
    label: "Comments",
    icon: LuMessageSquareQuote,
    link: "/admin/comments",
  },
];

export const BLOG_NAVBAR_DATA = [
  {
    id: "01",
    label: "Home",
    icon: LuLayoutTemplate,
    path: "/",
  },

  {
    id: "02",
    label: "React JS",
    icon: LuTag,
    path: "/tag/React",
  },

  {
    id: "03",
    label: "Next JS",
    icon: LuTag,
    path: "/tag/Next.js",
  },
];
