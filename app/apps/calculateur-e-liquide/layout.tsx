import type { Metadata } from "next";

export const metadata : Metadata = {
    title: "Calculateur e-liquide",
    manifest: "/manifest-eliquide.json",
};
export default function CalculateurELiquidelayout({
    children,
}:{
    children: React.ReactNode;
}) {
    return <>{children}</>;
}