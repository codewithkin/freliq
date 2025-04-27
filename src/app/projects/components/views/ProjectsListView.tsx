interface Project {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

interface ProjectsListViewProps {
  projects: Project[];
}

export function ProjectsListView({ projects }: ProjectsListViewProps) {
  return (
    <ul className="space-y-4">
      {projects.map((project) => (
        <li key={project.id} className="border-b pb-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{project.name}</p>
              <p className="text-xs text-gray-400">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className="text-sm">{project.status}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
