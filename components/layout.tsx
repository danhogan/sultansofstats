import React, { ReactNode } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "./header";

type Props = {
    children: ReactNode;
    title?: string;
};

const Layout = ({ children, title = "Sultans of Stats" }: Props) => (
    <>
        <Head>
            <title>{title}</title>
        </Head>
        <div className="container">
            {/* <header>
                <div className="header-content">
                    <Link href="/">
                        <a className="logo">
                            <img src="/logo.png" />
                        </a>
                    </Link>
                    <h1>
                        <span className="light">Stripe Sample</span>
                        <br />
                        Next.js, TypeScript, and Stripe 🔒💸
                    </h1>
                </div>
            </header> */}
            <Header></Header>
            {children}
        </div>
        {/* <div className="banner">
            <span>
                This is a{" "}
                <a href="https://github.com/stripe-samples" target="_blank" rel="noopener noreferrer">
                    Stripe Sample
                </a>
                .{" View code on "}
                <a
                    href="https://github.com/vercel/next.js/tree/canary/examples/with-stripe-typescript"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub
                </a>
                .
            </span>
        </div> */}
    </>
);

export default Layout;
