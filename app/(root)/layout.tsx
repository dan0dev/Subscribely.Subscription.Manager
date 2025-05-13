import Head from "next/head";
import { ReactNode } from "react";

const Rootlayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </Head>
      <div className="min-h-screen bg-dark-500 w-full">{children}</div>
    </>
  );
};

export default Rootlayout;
