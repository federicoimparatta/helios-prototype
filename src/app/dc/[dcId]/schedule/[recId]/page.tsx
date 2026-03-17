import { dataCenters, recommendations } from "@/lib/mock-data";
import RecDetailClient from "@/components/RecDetailClient";

export function generateStaticParams() {
  return dataCenters.flatMap((dc) =>
    recommendations.map((rec) => ({ dcId: dc.id, recId: rec.id }))
  );
}

export default function RecommendationDetailPage() {
  return <RecDetailClient />;
}
