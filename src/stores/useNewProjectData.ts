import { create } from "zustand";

type Actions = {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setDeadline: (deadline: Date | undefined) => void;
  setImage: (image: string) => void;
  setOwnerId: (ownerId: string) => void;
  setID: (id: string) => void;
  setTasks: (tasks: any) => void;
  incrementStep: () => void;
  decrementStep: () => void;
  clear: () => void; // ← add this
};

type State = {
  data: {
    title?: string;
    description?: string;
    deadline?: Date | undefined;
    image?: string;
    ownerId?: string;
    tasks?: any;
    id?: string | null;
  };
  highestCompletedStep: number;
};

export const useNewProjectData = create<State & Actions>((set) => ({
  data: {
    title: "",
    description: "",
    deadline: new Date(),
    id: null,
  },
  highestCompletedStep: 1,
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
  setID: (id: string) =>
    set((state) => ({
      data: { ...state.data, id },
    })),
  incrementStep: () =>
    set((state) => ({ highestCompletedStep: state.highestCompletedStep + 1 })),
  decrementStep: () =>
    set((state) => ({ highestCompletedStep: state.highestCompletedStep - 1 })),
  clear: () =>
    set(() => ({
      data: {
        title: "",
        description: "",
        deadline: new Date(),
        id: null,
      },
      highestCompletedStep: 1,
    })),
}));
