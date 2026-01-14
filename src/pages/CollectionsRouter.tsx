import { useParams } from "react-router-dom";
import LocalCollection from "./LocalCollection";
import ShopifyCollection from "./ShopifyCollection";

const LOCAL_HANDLES = new Set(["all", "rings", "necklaces", "earrings", "bracelets"]);

export default function CollectionsRouter() {
  const { handle = "all" } = useParams<{ handle: string }>();
  const key = (handle || "all").toLowerCase();

  if (LOCAL_HANDLES.has(key)) {
    return <LocalCollection />;
  }

  return <ShopifyCollection />;
}
