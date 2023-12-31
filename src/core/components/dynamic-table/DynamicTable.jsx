import { SearchOutlined } from '@ant-design/icons';
import { Input, Table } from 'antd';
import { useMemo, useState } from 'react';
import { useDebounce } from '../../hooks';

const DynamicTable = ({
  cols,
  dataSrc = [],
  hasFilters = false,
  searchByFields = [],
  pageSize = 10,
  rowKey = null,
  hasBorder = false,
}) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const filteredData = useMemo(() => {
    if (!debouncedQuery.trim() || !searchByFields.length || !hasFilters) {
      return dataSrc;
    }
    const regex = new RegExp(query.trim(), 'ig');
    const results = dataSrc.filter((item) => {
      return searchByFields.some((key) => {
        const value = item[key];
        return typeof value === 'string' && value.match(regex);
      });
    });
    return results;
  }, [debouncedQuery, dataSrc]);

  return (
    <>
      {hasFilters && (
        <Input
          placeholder={`Tìm kiếm`}
          prefix={<SearchOutlined />}
          onChange={handleQueryChange}
          size='large'
        />
      )}
      <div className='py-3'>
        <Table
          rowKey={rowKey}
          columns={cols}
          dataSource={filteredData}
          pagination={{ position: ['bottomRight'], pageSize, hideOnSinglePage: true }}
          bordered={hasBorder}
        />
      </div>
    </>
  );
};

export default DynamicTable;
