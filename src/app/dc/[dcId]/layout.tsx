import { dataCenters } from "@/lib/mock-data";
import DCDetailLayoutClient from "@/components/DCDetailLayoutClient";

export function generateStaticParams() {
  return dataCenters.map((dc) => ({ dcId: dc.id }));
}

export default function DCDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DCDetailLayoutClient>{children}</DCDetailLayoutClient>;
}
