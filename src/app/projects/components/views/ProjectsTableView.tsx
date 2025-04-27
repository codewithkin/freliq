interface Project {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

interface ProjectsTableViewProps {
  projects: Project[];
}

export function ProjectsTableView({ projects }: ProjectsTableViewProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td className="px-4 py-2">{project.name}</td>
              <td className="px-4 py-2">{project.status}</td>
              <td className="px-4 py-2">
                {new Date(project.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
