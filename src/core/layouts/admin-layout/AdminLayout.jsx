import {
  CoffeeOutlined,
  FormOutlined,
  HomeOutlined,
  LogoutOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { storeActions } from '../../store';
import './styles.scss';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = useMemo(() => {
    return [
      {
        key: '/admin/cua-hang',
        label: 'Cửa hàng',
        icon: <HomeOutlined />,
        children: [
          {
            key: '/admin/cua-hang/thong-ke-doanh-thu',
            label: <NavLink to='cua-hang/thong-ke-doanh-thu'>Thống kê doanh thu</NavLink>,
          },
        ],
      },
      {
        key: '/admin/quan-ly-nguoi-dung',
        label: 'Quản lý người dùng',
        icon: <TeamOutlined />,
        children: [
          {
            key: '/admin/quan-ly-nguoi-dung/danh-sach-nguoi-dung',
            label: (
              <NavLink to='quan-ly-nguoi-dung/danh-sach-nguoi-dung'>Danh sách người dùng</NavLink>
            ),
          },
          {
            key: '/admin/quan-ly-nguoi-dung/tao-tai-khoan',
            label: <NavLink to='quan-ly-nguoi-dung/tao-tai-khoan'>Tạo tài khoản</NavLink>,
          },
        ],
      },
      {
        key: '/admin/quan-ly-san-pham',
        label: 'Quản lý sản phẩm',
        icon: <CoffeeOutlined />,
        children: [
          {
            key: '/admin/quan-ly-san-pham/danh-sach-san-pham',
            label: <NavLink to='quan-ly-san-pham/danh-sach-san-pham'>Danh sách sản phẩm</NavLink>,
          },
          {
            key: '/admin/quan-ly-san-pham/them-san-pham',
            label: <NavLink to='quan-ly-san-pham/them-san-pham'>Thêm sản phẩm</NavLink>,
          },
          {
            key: '/admin/quan-ly-san-pham/loai-san-pham',
            label: <NavLink to='quan-ly-san-pham/loai-san-pham'>Loại sản phẩm</NavLink>,
          },
          {
            key: '/admin/quan-ly-san-pham/markers',
            label: <NavLink to='quan-ly-san-pham/markers'>Markers</NavLink>,
          },
        ],
      },
      {
        key: '/admin/quan-ly-don-hang',
        label: <NavLink to='quan-ly-don-hang'>Quản lý đơn hàng</NavLink>,
        icon: <FormOutlined />,
      },
    ];
  }, []);
  const [mainMenuKey, setMainMenuKey] = useState('');
  const [subMenuKey, setSubMenuKey] = useState('');
  const location = useLocation();

  const handleOpenKeyChange = (keys) => {
    const lastItem = keys[keys.length - 1];
    setMainMenuKey(lastItem);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    dispatch(storeActions.resetCurrentUser());
    dispatch(storeActions.resetCart());
    return navigate('/');
  };

  useEffect(() => {
    const pathname = location.pathname;
    if (pathname.includes('chi-tiet-nguoi-dung')) {
      setSubMenuKey('/admin/quan-ly-nguoi-dung/danh-sach-nguoi-dung');
      setMainMenuKey('/admin/quan-ly-nguoi-dung');
    } else if (pathname.includes('cap-nhat-san-pham')) {
      setSubMenuKey('/admin/quan-ly-san-pham/danh-sach-san-pham');
      setMainMenuKey('/admin/quan-ly-san-pham');
    } else {
      setSubMenuKey(pathname);
      setMainMenuKey(pathname.slice(0, pathname.lastIndexOf('/')));
    }
  }, [location.pathname]);

  return (
    <>
      <div className='vh-100 vw-100 bg-white'>
        <Layout className='h-100 w-100'>
          <Layout.Sider className='h-100 admin-sidebar'>
            <div className='h-100 d-flex flex-column justify-content-between align-items-start'>
              <div className='d-flex flex-column justify-content-start align-items-center pt-4 pl-3'>
                <NavLink to='/' className='text-center'>
                  <h3 className='text-white pt-3'>LAKONG ADMIN</h3>
                </NavLink>
                <div className='pt-2'>
                  <Menu
                    theme='dark'
                    mode='inline'
                    items={menuItems}
                    selectedKeys={[subMenuKey]}
                    openKeys={[mainMenuKey]}
                    onOpenChange={handleOpenKeyChange}
                    key='menu'
                  />
                </div>
              </div>
              <div className='p-3 w-100'>
                <Button
                  danger
                  size='large'
                  type='primary'
                  className='w-100'
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </div>
            </div>
          </Layout.Sider>
          <Layout.Content>
            <div className='layout-content'>
              <Outlet />
            </div>
          </Layout.Content>
        </Layout>
      </div>
    </>
  );
};

export default AdminLayout;
