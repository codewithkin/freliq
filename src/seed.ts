import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient();

export const seedData = async (userId: string) => {
  try {
    // Ensure the user exists before seeding data
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // 1. Seed 40 Projects for the user
    const projects = [];
    for (let i = 1; i <= 40; i++) {
      const project = await prisma.project.create({
        data: {
          title: `Project ${i}`,
          description: `Description for project ${i}`,
          ownerId: user.id, // Relating the project to the user
        },
      });
      projects.push(project); // Store the created projects for later use
    }

    // 2. Seed 40 Tasks related to those projects
    for (let i = 1; i <= 40; i++) {
      const project = projects[i % projects.length]; // Loop through the created projects
      await prisma.task.create({
        data: {
          title: `Task ${i}`,
          description: `Description for task ${i}`,
          projectId: project.id, // Relating task to a project
          creatorId: user.id, // Relating task to the user (as the creator)
        },
      });
    }

    // 3. Seed 40 Comments related to those tasks
    const tasks = await prisma.task.findMany({
      where: {
        creatorId: user.id,
      },
    });

    for (let i = 1; i <= 40; i++) {
      const task = tasks[i % tasks.length]; // Loop through the created tasks
      await prisma.comment.create({
        data: {
          content: `Comment for task ${i}`,
          authorId: user.id, // Relating comment to the user
          taskId: task.id, // Relating comment to the task
        },
      });
    }

    // 4. Seed 40 Kickoff Checklists for the user
    for (let i = 1; i <= 40; i++) {
      const project = projects[i % projects.length]; // Loop through the created projects
      await prisma.kickoffChecklist.create({
        data: {
          title: `Kickoff Checklist ${i}`,
          completed: false, // Default to false
          projectId: project.id, // Relating checklist to the project
          userId: user.id, // Relating checklist to the user
        },
      });
    }

    // 5. Seed 40 Polls for the user
    for (let i = 1; i <= 40; i++) {
      await prisma.poll.create({
        data: {
          question: `Poll Question ${i}`,
          options: JSON.stringify(["Option 1", "Option 2", "Option 3"]),
          responses: JSON.stringify([]), // Initial empty responses
          userId: user.id, // Relating poll to the user
        },
      });
    }

    // 6. Seed 40 Notifications for the user
    for (let i = 1; i <= 40; i++) {
      await prisma.notification.create({
        data: {
          type: `system`, // Example, this can be changed based on needs
          priority: `medium`, // Example priority, can also vary
          message: `Notification message for ${i}`,
          userId: user.id, // Relating notification to the user
        },
      });
    }

    // 7. Seed 40 Files for the user (if applicable)
    for (let i = 1; i <= 40; i++) {
      await prisma.file.create({
        data: {
          name: `File ${i}.txt`,
          url: `http://example.com/file${i}`,
          type: `DOCUMENT`,
          uploaderId: user.id, // Relating file to the user
        },
      });
    }

    console.log("Seeding completed successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
};
