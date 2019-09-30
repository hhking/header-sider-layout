import React from 'react';

export default (): React.ReactNode => (
  <div style={{ textAlign: 'center' }}>
    Want to add more pages? Please refer to{' '}
    <a
      href="https://pro.ant.design/docs/block-cn"
      target="_blank"
      rel="noopener noreferrer"
    >
      use block
    </a>
    。
    <p style={{ height: '120vh', marginTop: '150px' }}>test content overflow</p>
  </div>
);
