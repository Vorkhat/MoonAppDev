import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import "./reset.css";
import React from "react";
import styles from "./background.module.scss";
import Root from "../components/Root/Root";
import {toggleTheme} from "@/utils/changeTheme";
import Theme from "@/components/Theme/Theme";
import Footer from "@/components/foooter/footer";
import '../mockEnv.ts';

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <Theme>
            <body>
            <Root>
                <div className={styles.background}>
                    <main className={styles.content}>
                        {children}
                        <div className={styles.menu}></div>
                    </main>
                    <footer className={styles.footer}><Footer/></footer>
                    <div className={`${styles.background__gradient} ${styles.gradient__top_right}`}></div>
                    <div className={`${styles.background__gradient} ${styles.gradient__bottom_left}`}></div>
                </div>
            </Root>
            </body>
        </Theme>
        </html>
    );
}
