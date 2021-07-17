import { Lineage } from "~/api/atlas/lineage";

export default function useLineage(
  guid: string,
  depth: number,
  direction: string
) {
  const { data, error } = Lineage.getLineageAPI({
    cache: "",
    guid,
    depth,
    direction,
  });

  return { data, error };
}
