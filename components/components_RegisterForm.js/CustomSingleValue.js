import React from 'react';

const CustomSingleValue = ({ data }) => (
  <div style={{ display: 'flex', alignItems: 'center', position: 'relative', top: '-25px' }}>
    <img src={data.imageUrl} alt="flag" style={{ width: 15, height: 15, marginRight: 5 }} />
    <span style={{ fontSize: '17px' }}>{data.code}</span>
  </div>
);

export default CustomSingleValue;