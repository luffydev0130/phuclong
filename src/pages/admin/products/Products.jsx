import React from 'react';
import { Outlet } from 'react-router-dom';

const Products = () => {
  return (
    <>
      <h2>Quản lý sản phẩm</h2>
      <hr />
      <Outlet />
    </>
  );
};

export default Products;
