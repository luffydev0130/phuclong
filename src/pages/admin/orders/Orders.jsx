import { ClearOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Tag, Image, Table, Descriptions } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  DynamicTable,
  FormDatePicker,
  FormDropdown,
  FormInput,
  FormRangePicker,
} from '../../../core/components';
import {
  DeliveryOptions,
  DeliveryStatus,
  OrderStatus,
  PaymentMethods,
  PaymentStatus,
} from '../../../core/constants';
import moment from 'moment';
import { NumericFormat } from 'react-number-format';
import { useDispatch } from 'react-redux';
import { storeActions } from '../../../core/store';
import { AlertService, OrdersService } from '../../../core/services';

const deliveryTypeOptions = [
  {
    label: DeliveryOptions.PICKUP,
    value: DeliveryOptions.PICKUP,
  },
  {
    label: DeliveryOptions.DELIVERY,
    value: DeliveryOptions.DELIVERY,
  },
];

const deliveryStatusOptions = [
  {
    label: DeliveryStatus.IN_PROGRESS,
    value: DeliveryStatus.IN_PROGRESS,
  },
  {
    label: DeliveryStatus.DELIVERED_SUCCESS,
    value: DeliveryStatus.DELIVERED_SUCCESS,
  },
  {
    label: DeliveryStatus.DELIVERED_FAILED,
    value: DeliveryStatus.DELIVERED_FAILED,
  },
];

const paymentMethodOptions = [
  {
    label: PaymentMethods.CastAtShop,
    value: PaymentMethods.CastAtShop,
  },
  {
    label: PaymentMethods.CashOnDelivery,
    value: PaymentMethods.CashOnDelivery,
  },
  {
    label: PaymentMethods.Credit,
    value: PaymentMethods.Credit,
  },
];

const paymentMethodStatusOptions = [
  {
    label: PaymentStatus.NOT_YET_PAY,
    value: PaymentStatus.NOT_YET_PAY,
  },
  {
    label: PaymentStatus.PAID,
    value: PaymentStatus.PAID,
  },
  {
    label: PaymentStatus.REFUNDED,
    value: PaymentStatus.REFUNDED,
  },
];

const orderStatusOptions = [
  {
    label: OrderStatus.IN_PROGRESS,
    value: OrderStatus.IN_PROGRESS,
  },
  {
    label: OrderStatus.SUCCESS,
    value: OrderStatus.SUCCESS,
  },
  {
    label: OrderStatus.FAILED,
    value: OrderStatus.FAILED,
  },
];

const DEFAULT_FILTER_OPTIONS = {
  search: '',
  deliveryType: null,
  deliveryStatus: null,
  paymentMethod: null,
  paymentStatus: null,
  orderStatus: null,
  startDate: null,
  endDate: null,
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filterOptions, setFilterOptions] = useState({ ...DEFAULT_FILTER_OPTIONS });
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { ...DEFAULT_FILTER_OPTIONS },
  });

  const handleClearFilterOptions = () => {
    reset({ ...DEFAULT_FILTER_OPTIONS });
    setFilterOptions({ ...DEFAULT_FILTER_OPTIONS });
  };

  const mainTableColumns = useMemo(() => {
    return [
      {
        title: 'ID',
        key: '_id',
        dataIndex: '_id',
        render: (value) => value.slice(0, 8),
        align: 'center',
      },
      {
        title: 'Tình trạng đơn hàng',
        key: 'orderStatus',
        dataIndex: 'orderStatus',
        render: (value) => (
          <Tag>
            <span className='text-capitalize'>{value}</span>
          </Tag>
        ),
        align: 'center',
      },
      {
        title: 'Tổng tiền',
        key: 'totalBill',
        dataIndex: 'totalBill',
        render: (value) => <NumericFormat value={value} displayType='text' thousandSeparator=',' />,
        align: 'center',
      },
      {
        title: 'Ngày đặt',
        key: 'createdAt',
        dataIndex: 'createdAt',
        render: (value) => moment(value).format('HH:mm - DD/MM/YYYY'),
        align: 'center',
      },
      {
        title: 'Ghi chú',
        key: 'notes',
        dataIndex: 'notes',
      },
      {
        title: '',
        key: 'actions',
        dataIndex: null,
        render: (_, order) => (
          <Button size='large' type='primary'>
            Cập nhật
          </Button>
        ),
        align: 'center',
      },
    ];
  }, [orders.length]);

  const subTableColumns = useMemo(() => {
    return [
      {
        title: 'Tên sản phẩm',
        dataIndex: 'productName',
        key: 'productName',
      },
      {
        title: 'Hỉnh ảnh',
        dataIndex: 'image',
        key: 'image',
        render: (value) => (
          <Image src={value} style={{ width: 120, height: 120, objectFit: 'contain' }} />
        ),
        align: 'center',
      },
      {
        title: 'Kích cỡ',
        dataIndex: 'size',
        key: 'size',
        align: 'center',
      },
      {
        title: 'Số lượng',
        dataIndex: 'amount',
        key: 'amount',
        align: 'center',
      },
      {
        title: 'Đơn giá',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
      },
      {
        title: 'Tổng tiền',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        align: 'center',
      },
    ];
  }, []);

  const getOrders = async () => {
    try {
      dispatch(storeActions.showLoading());
      const orders = await OrdersService.getOrders(filterOptions);
      setOrders(orders);
    } catch (error) {
      AlertService.error(error?.response?.data?.message || error.message);
    } finally {
      dispatch(storeActions.hideLoading());
    }
  };

  const handleSearchProducts = (formValues) => {
    setFilterOptions({ ...formValues });
  };

  useEffect(() => {
    getOrders();
  }, [filterOptions]);

  return (
    <>
      <h2 className='pt-3 pl-3 m-0 text-uppercase'>Quản lý đơn hàng</h2>
      <hr />
      <div className='pt-2 px-3'>
        <Form
          layout='vertical'
          className='search-bar-form'
          onFinish={handleSubmit(handleSearchProducts)}>
          <div className='row'>
            <div className='col-md-12 col-xs-12'>
              <div className='row'>
                <div className='col-md-3 col-xs-12'>
                  <FormInput
                    label='Tìm đơn hàng'
                    placeholder='Mã đơn hàng, tên, số điện thoại'
                    name='search'
                    control={control}
                    error={errors.search}
                  />
                </div>
                <div className='col-md-3 col-xs-12'>
                  <FormDropdown
                    label='Trạng thái đơn hàng'
                    placeholder='Trạng thái đơn hàng'
                    name='orderStatus'
                    control={control}
                    error={errors.orderStatus}
                    dropdownOptions={orderStatusOptions}
                  />
                </div>
                <div className='col-md-3 col-xs-12'>
                  <FormDatePicker
                    label='Từ ngày'
                    name='startDate'
                    control={control}
                    placeholder='Từ ngày'
                  />
                </div>
                <div className='col-md-3 col-xs-12'>
                  <FormDatePicker
                    label='Đến ngày'
                    name='endDate'
                    control={control}
                    placeholder='Đến ngày'
                  />
                </div>
              </div>
            </div>
            <div className='col-md-3 col-xs-12'>
              <FormDropdown
                label='Hình thức vận chuyển'
                placeholder='Hình thức vận chuyển'
                name='deliveryType'
                control={control}
                error={errors.deliveryType}
                dropdownOptions={deliveryTypeOptions}
              />
            </div>
            <div className='col-md-3 col-xs-12'>
              <FormDropdown
                label='Trạng thái vận chuyển'
                placeholder='Trạng thái vận chuyển'
                name='deliveryStatus'
                control={control}
                error={errors.deliveryStatus}
                dropdownOptions={deliveryStatusOptions}
              />
            </div>
            <div className='col-md-3 col-xs-12'>
              <FormDropdown
                label='Hình thức thanh toán'
                placeholder='Hình thức thanh toán'
                name='paymentMethod'
                control={control}
                error={errors.paymentMethod}
                dropdownOptions={paymentMethodOptions}
              />
            </div>
            <div className='col-md-3 col-xs-12'>
              <FormDropdown
                label='Trạng thái thanh toán'
                placeholder='Trạng thái thanh toán'
                name='paymentStatus'
                control={control}
                error={errors.paymentStatus}
                dropdownOptions={paymentMethodStatusOptions}
              />
            </div>
            <div className='col-md-12 col-xs-12 text-center'>
              <Button htmlType='submit' type='primary' size='large' icon={<SearchOutlined />}>
                Tìm kiếm
              </Button>
              <Button
                danger
                className='ml-3'
                htmlType='button'
                type='primary'
                size='large'
                icon={<ClearOutlined />}
                onClick={handleClearFilterOptions}>
                Bỏ lọc
              </Button>
            </div>
          </div>
        </Form>
      </div>
      <div className='pt-4 px-3'>
        <Table
          rowKey='_id'
          columns={mainTableColumns}
          dataSource={orders}
          pagination={{ pageSize: 12, hideOnSinglePage: true }}
          expandable={{
            expandedRowRender: (order) => (
              <>
                <Descriptions title='Thông tin thanh toán' column={1}>
                  <Descriptions.Item label='Hình thức thanh toán'>
                    {order.paymentMethod}
                  </Descriptions.Item>
                  <Descriptions.Item label='Trạng thái'>
                    <Tag>
                      <span className='text-capitalize'>{order.paymentStatus}</span>
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
                <Descriptions title='Thông tin vận chuyển' column={1}>
                  <Descriptions.Item label='Hình thức vận chuyên'>
                    {order.deliveryType}
                  </Descriptions.Item>
                  <Descriptions.Item label='Tình trạng'>
                    <Tag>
                      <span className='text-capitalize'>{order.deliveryStatus}</span>
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
                <Descriptions title='Thông tin người nhận' column={1}>
                  <Descriptions.Item label='Người nhận'>{order.fullName}</Descriptions.Item>
                  <Descriptions.Item label='Số điện thoại'>{order.phone}</Descriptions.Item>
                  <Descriptions.Item label='Địa chỉ giao hàng'>
                    {order.deliveryAddress}
                  </Descriptions.Item>
                </Descriptions>
                <hr />
                <h5 className='text-center page-title'>Chi Tiết Sản Phẩm</h5>
                <DynamicTable cols={subTableColumns} dataSrc={order.products} rowKey='_id' />
              </>
            ),
          }}
        />
      </div>
    </>
  );
};

export default Orders;
