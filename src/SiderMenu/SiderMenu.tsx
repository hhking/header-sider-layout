import React, { Component } from 'react';
import { Layout, Icon } from 'antd';
import debounce from 'lodash/debounce';
import classNames from 'classnames';
import { MenuProps } from 'antd/lib/menu';

import './index.less';
import { WithFalse } from '../typings';
import BaseMenu, { BaseMenuProps } from './BaseMenu';
import { getDefaultCollapsedSubMenus } from './SiderMenuUtils';
import { isBrowser } from '../utils/utils';

const { Sider } = Layout;

let firstMount = true;

export const defaultRenderLogo = (logo: React.ReactNode): React.ReactNode => {
  if (typeof logo === 'string') {
    return <img src={logo} alt="logo" />;
  }
  if (typeof logo === 'function') {
    return logo();
  }
  return logo;
};

export const defaultRenderLogoAndTitle = (
  logo: React.ReactNode,
  title: React.ReactNode,
  menuHeaderRender: SiderMenuProps['menuHeaderRender'],
): React.ReactNode => {
  if (menuHeaderRender === false) {
    return null;
  }
  const logoDom = defaultRenderLogo(logo);
  const titleDom = <h1>{title}</h1>;

  if (menuHeaderRender) {
    return menuHeaderRender(logoDom, titleDom);
  }
  return (
    <a href="/">
      {logoDom}
      {titleDom}
    </a>
  );
};

const defaultRenderCollapsedButton = (collapsed?: boolean) => (
  <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
);

export interface SiderMenuProps
  extends Pick<BaseMenuProps, Exclude<keyof BaseMenuProps, ['onCollapse']>> {
  logo?: React.ReactNode;
  siderWidth?: number;
  menuHeaderRender?: WithFalse<
    (logo: React.ReactNode, title: React.ReactNode) => React.ReactNode
  >;
  onMenuHeaderClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  collapsedButtonRender?: WithFalse<(collapsed?: boolean) => React.ReactNode>;

  /**
   * 要给菜单的props, 参考antd-menu的属性。https://ant.design/components/menu-cn/
   */
  menuProps?: MenuProps;
}

interface SiderMenuState {
  pathname?: string;
  openKeys?: string[] | false;
  flatMenuKeysLen?: number;
}

export default class SiderMenu extends Component<
  SiderMenuProps,
  SiderMenuState
> {
  static defaultProps: Partial<SiderMenuProps> = {
    flatMenuKeys: [],
    isMobile: false,
    collapsed: false,
    menuData: [],
  };

  static getDerivedStateFromProps(
    props: SiderMenuProps,
    state: SiderMenuState,
  ): SiderMenuState | null {
    const { pathname, flatMenuKeysLen } = state;
    const { location = { pathname: '/' }, flatMenuKeys = [] } = props;
    if (
      location.pathname !== pathname ||
      flatMenuKeys.length !== flatMenuKeysLen
    ) {
      return {
        pathname: location.pathname,
        flatMenuKeysLen: flatMenuKeys.length,
        openKeys: getDefaultCollapsedSubMenus(props),
      };
    }
    return null;
  }

  constructor(props: SiderMenuProps) {
    super(props);
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(props),
    };
  }

  triggerResizeEvent = debounce(() => {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    if (isBrowser()) {
      window.dispatchEvent(event);
    }
  });

  componentDidMount(): void {
    firstMount = false;
  }

  componentWillUnmount(): void {
    this.triggerResizeEvent.cancel();
  }

  isMainMenu: (key: string) => boolean = key => {
    const { menuData = [] } = this.props;
    return menuData.some(item => {
      if (key) {
        return item.key === key || item.path === key;
      }
      return false;
    });
  };

  handleOpenChange: (openKeys: string[]) => void = openKeys => {
    const { onOpenChange, openKeys: defaultOpenKeys } = this.props;
    if (onOpenChange) {
      onOpenChange(openKeys);
      return;
    }
    // if defaultOpenKeys existence, don't change
    if (defaultOpenKeys !== undefined) {
      return;
    }
    const moreThanOne =
      openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    if (moreThanOne) {
      this.setState({
        openKeys: [openKeys.pop()].filter(item => item) as string[],
      });
    } else {
      this.setState({ openKeys: [...openKeys] });
    }
  };

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    if (onCollapse) onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  renderCollapsedButton = () => {
    const {
      collapsed,
      collapsedButtonRender = defaultRenderCollapsedButton,
      layout,
    } = this.props;

    if (collapsedButtonRender !== false && layout === 'both') {
      return (
        <div className="ant-pro-sider-menu-collapsed">
          <span
            className={classNames('ant-pro-sider-menu-trigger', { collapsed })}
            onClick={this.toggle}
          >
            {collapsedButtonRender(collapsed)}
          </span>
        </div>
      );
    }

    return null;
  };

  render(): React.ReactNode {
    const {
      collapsed,
      fixSiderbar,
      onCollapse,
      theme,
      siderWidth = 256,
      isMobile,
      layout,
      logo = 'https://gw.alipayobjects.com/zos/antfincdn/PmY%24TNNDBI/logo.svg',
      title,
      menuHeaderRender: renderLogoAndTitle,
      onMenuHeaderClick,
    } = this.props;
    const { openKeys } = this.state;
    const isBoth = layout === 'both';
    // 如果收起，并且为顶部布局，openKeys 为 false 都不控制 openKeys
    const defaultProps =
      collapsed || layout === 'topmenu' || openKeys === false
        ? {}
        : { openKeys };

    const siderClassName = classNames('ant-pro-sider-menu-sider', {
      'fix-sider-bar': fixSiderbar,
      light: theme === 'light',
      'with-header': isBoth,
    });

    return (
      <Sider
        collapsible
        trigger={null}
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={collapse => {
          if (firstMount || !isMobile) {
            if (onCollapse) {
              onCollapse(collapse);
            }
          }
        }}
        width={siderWidth}
        theme={theme}
        className={siderClassName}
      >
        {!isBoth && (
          <div
            className="ant-pro-sider-menu-logo"
            onClick={onMenuHeaderClick}
            id="logo"
          >
            {defaultRenderLogoAndTitle(logo, title, renderLogoAndTitle)}
          </div>
        )}
        {this.renderCollapsedButton()}
        <BaseMenu
          {...this.props}
          mode="inline"
          type="sider"
          handleOpenChange={this.handleOpenChange}
          onOpenChange={this.handleOpenChange}
          style={{ padding: '16px 0', width: '100%' }}
          {...defaultProps}
          {...this.props.menuProps}
        />
      </Sider>
    );
  }
}
