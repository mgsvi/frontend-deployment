import "./globals.css";
import { Inter } from "next/font/google";
import Sidebar from "./sidebar";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Children, Suspense } from "react";
const { Header, Content, Footer, Sider } = Layout;
import StyledComponentsRegistry from "./AntdRegistry";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        style={{ background: "#EBEEF3", height: "100Vh", width: "100vw" }}
      >
        <StyledComponentsRegistry>
          <Layout
            hasSider
            style={{
              height: "100vh",
              overflow: "hidden",
            }}
          >
            <Sidebar />
            <div className="w-full bg-[#EBEEF3] overflow-auto">{children}</div>
          </Layout>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
