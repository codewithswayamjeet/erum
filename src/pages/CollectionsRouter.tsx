import { useParams } from "react-router-dom";
import LocalCollection from "./LocalCollection";

export default function CollectionsRouter() {
  const { handle = "all" } = useParams<{ handle: string }>();
  void handle;
  return <LocalCollection />;
}
