import { useParams } from "react-router-dom";
import LocalCollection from "./LocalCollection";

// All collection pages now use LocalCollection which fetches from Supabase
export default function CollectionsRouter() {
  const { handle = "all" } = useParams<{ handle: string }>();
  void handle;
  return <LocalCollection />;
}
