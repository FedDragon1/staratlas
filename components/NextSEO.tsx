import { FC } from "react";
import Head from "next/head";

interface Props {
    title?: string;
    description?: string;
}

export const NextSEO: FC<Props> = ({ title, description }) => {
    return (
        <>
            <Head>
                <title>{title ?? "Star At Last"}</title>
                <meta name="description" content={description ?? "Next.js + Ts + Three"} />
            </Head>
        </>
    )
}