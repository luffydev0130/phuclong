import { Form } from 'antd';
import React, { memo } from 'react';
import { Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const FormTextArea = ({ label, name, placeholder, control, error, rules }) => {
  return (
    <>
      <Form.Item label={label} validateStatus={error ? 'error' : ''} help={error && error.message}>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field }) => (
            <ReactQuill
              {...field}
              placeholder={placeholder}
              style={{ maxHeight: 300, overflowY: 'auto' }}
            />
          )}
        />
      </Form.Item>
    </>
  );
};

export default memo(FormTextArea);
