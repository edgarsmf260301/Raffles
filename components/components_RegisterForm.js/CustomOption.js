import React from 'react';

const CustomOption = (props) => {
  const { data, innerRef, innerProps } = props;
  return (
    <div ref={innerRef} {...innerProps} style={{ display: 'flex', alignItems: 'center', padding: 10 }}>
      <img src={data.imageUrl} alt="flag" style={{ width: 15, height: 15, marginRight: 5 }} />
      <span style={{ fontSize: '15px' }}>{data.code}</span>
    </div>
  );
};

export default CustomOption;