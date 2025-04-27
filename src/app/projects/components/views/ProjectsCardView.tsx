interface Project {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

interface ProjectsCardViewProps {
  projects: Project[];
}

export function ProjectsCardView({ projects }: ProjectsCardViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <div key={project.id} className="border p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold">{project.name}</h3>
          <p className="text-sm text-gray-500">{project.status}</p>
          <p className="text-xs text-gray-400">
            {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
