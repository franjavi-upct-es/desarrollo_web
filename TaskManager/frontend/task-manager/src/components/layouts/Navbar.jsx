import React from "react";

const Navbar = ({ activeMenu }) => {
  return (
    <div>
      <button
        className=""
        onClick={() => {
          setOpenSideMenu(!openSideMenu);
        }}
      >
        {openSideMenu ? (
          <HiOutlineX className="" />
        ) : (
          <HiOutlineMenu className="" />
        )}
      </button>

      <h2 className=""></h2>
    </div>
  );
};

export default Navbar;
