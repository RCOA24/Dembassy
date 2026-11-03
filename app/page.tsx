import Home from "../components/pages/Home";
import { metadataFor } from "../lib/site";

export const metadata = metadataFor("");

export default function HomePage() {
  return <Home />;
}
