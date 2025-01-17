import { ReactNode, useState } from "react";
import type { MenuProps } from "antd";
import { Layout, Menu, theme, Badge } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { CiShoppingCart } from "react-icons/ci";
import { useSelector } from "react-redux";


const { Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

export default function Navbar({ children }: { children: ReactNode }) {
  const location = useLocation();

  window.onpageshow = function (event) {
    if (event.persisted) {
      window.location.reload();
    }
  };

  const [activeMenu, setActiveMenu] = useState(
    location.pathname.replace("/", "")
  );

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  }
  const items: MenuItem[] = [
    getItem("Главная", ""),
    getItem("Категории", "categories",),
    getItem("Товар", "products",),
    getItem("Корзина", "cart",),
  ];


  const navigate = useNavigate();

  const onClickMenu: MenuProps["onClick"] = (e) => {
    setActiveMenu(e.key);
    navigate(`/${e.key}`);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const cart = useSelector((state: {
    cart: {
      items: unknown[];
    };
  }) => state.cart.items);

  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
        className="b1234567"
      >
        <div className="demo-logo-vertical" />

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[activeMenu]}
          items={items}
          onClick={onClickMenu}
          style={{ width: "100%" }}
        />
      </Sider>
      <Layout style={{ marginLeft: 280, minHeight: "100vh" }}>
        <div
          style={{
            backgroundColor: colorBgContainer,
            padding: "20px",
            display: "flex",
            justifyContent: 'end'
          }}
        >
          <div className="flex items-center"> 
          <Badge count={cart.length}>
     <CiShoppingCart size={30}/>
    </Badge>
          </div>
        </div>

        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Mega ©{new Date().getFullYear()} Created by Mega Team
        </Footer>
      </Layout>
    </Layout>
  );
}
