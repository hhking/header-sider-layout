/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */

import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  SettingDrawer,
  PageHeaderWrapper,
} from '../../../src/index';
import React, { useState } from 'react';

import Link from 'umi/link';
import history from 'umi/router';
import RightContent from '@/components/GlobalHeader/RightContent';
import logo from '../assets/logo.svg';

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};

const headerMenuData = [
  {
    path: 'https://pro.ant.design/',
    icon: 'project',
    name: 'Ant Design Pro',
    target: '_blank',
    key: 1,
  },
  {
    path: 'https://ant.design/index-cn',
    icon: 'project',
    name: 'Ant Design',
    key: 2,
    children: [
      {
        path: 'https://ant.design/docs/react/introduce-cn',
        icon: 'control',
        name: '组件',
        key: 3,
      },
      {
        path: 'https://ant.design/docs/spec/introduce-cn',
        icon: 'control',
        name: '设计语言',
        key: 4,
      },
    ],
  },
];

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const [collapsed, handleMenuCollapse] = useState<boolean>(true);
  const [settings, setSettings] = useState<Partial<Settings>>({});
  return (
    <>
      <ProLayout
        disableMobile
        menuProps={{
          mode: 'inline',
        }}
        logo={logo}
        collapsed={collapsed}
        onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) =>
          menuItemProps.isUrl ? (
            defaultDom
          ) : (
            <Link to={menuItemProps.path}>{defaultDom}</Link>
          )
        }
        rightContentRender={rightProps => (
          <RightContent {...rightProps} {...settings} />
        )}
        onMenuHeaderClick={() => history.push('/')}
        {...props}
        {...settings}
        headerMenuData={headerMenuData}
        headerMenuProps={{
          selectedKeys: ['1'],
        }}
        layout="both"
      >
        <PageHeaderWrapper>{props.children}</PageHeaderWrapper>
      </ProLayout>
      <SettingDrawer
        settings={settings}
        onSettingChange={config => setSettings(config)}
      />
    </>
  );
};

export default BasicLayout;
