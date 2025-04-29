import { create } from "zustand";

type Actions = {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setDeadline: (deadline: Date | undefined) => void;
  setImage: (image: string) => void;
  setOwnerId: (ownerId: string) => void;
  setTasks: (tasks: any) => void;
};

type State = {
  data: {
    title?: string;
    description?: string;
    deadline?: Date | undefined;
    image?: string;
    ownerId?: string;
    tasks?: any;
  };
  highestCompletedStep: number;
};

export const useNewProjectData = create<State & Actions>((set) => ({
  data: {},
  highestCompletedStep: 0,
  setTitle: (title: string) =>
    set((state) => ({ data: { ...state.data, title } })),
  setDescription: (description: string) =>
    set((state) => ({ data: { ...state.data, description } })),
  setDeadline: (deadline: Date | undefined) =>
    set((state) => ({ data: { ...state.data, deadline } })),
  setImage: (image: string) =>
    set((state) => ({ data: { ...state.data, image } })),
  setOwnerId: (ownerId: string) =>
    set((state) => ({ data: { ...state.data, ownerId } })),
  setTasks: (tasks: any) =>
    set((state) => ({ data: { ...state.data, tasks } })),
  incrementStep: () =>
    set((state) => ({ highestCompletedStep: state.highestCompletedStep + 1 })),
}));
