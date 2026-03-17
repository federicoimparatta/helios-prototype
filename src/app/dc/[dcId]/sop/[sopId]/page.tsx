import { dataCenters, sops } from "@/lib/mock-data";
import SOPDetailClient from "@/components/SOPDetailClient";

export function generateStaticParams() {
  return dataCenters.flatMap((dc) =>
    sops.map((sop) => ({ dcId: dc.id, sopId: sop.id }))
  );
}

export default function SOPDetailPage() {
  return <SOPDetailClient />;
}
