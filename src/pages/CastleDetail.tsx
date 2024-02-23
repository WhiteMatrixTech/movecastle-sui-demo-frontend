import { useParams } from "react-router-dom";

export function CastleDetailPage() {
  const { id } = useParams();
  console.log(id);
  return <div>castle detail page {id}</div>;
}
