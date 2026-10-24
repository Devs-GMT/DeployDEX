import { ProjectView } from "@/components/dapps/project-view";

export default async function DappPage({ params }: PageProps<"/dapps/[id]">) {
  const { id } = await params;
  return <ProjectView id={/^\d+$/.test(id) ? Number(id) : -1} />;
}
