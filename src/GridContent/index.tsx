import './GridContent.less';

import React from 'react';
import RouteContext from '../RouteContext';
import { Settings } from '../defaultSettings';

interface GridContentProps {
  contentWidth?: Settings['contentWidth'];
  layout?: 'sidemenu' | 'topmenu' | 'both';
  children: React.ReactNode;
}

const GridContent: React.SFC<GridContentProps> = props => (
  <RouteContext.Consumer>
    {value => {
      const {
        children,
        contentWidth: propsContentWidth,
        layout: propsLayout,
      } = props;
      console.log(value);
      const contentWidth = propsContentWidth || value.contentWidth;
      const layout = propsLayout || value.layout;
      let className = 'ant-pro-grid-content';
      if (contentWidth === 'Fixed' && layout === 'sidemenu') {
        className = 'ant-pro-grid-content wide';
      }
      return <div className={className}>{children}</div>;
    }}
  </RouteContext.Consumer>
);

export default GridContent;
