import { create } from "zustand";

type RemoteStreamState = {
  remoteStream: MediaStream | null;
};

type RemoteStreamActions = {
  setRemoteStream: (remoteStream: MediaStream | null) => void;
};

export const useRemoteStream = create<RemoteStreamState & RemoteStreamActions>(
  (set) => ({
    remoteStream: null,
    setRemoteStream: (remoteStream) => set({ remoteStream }),
  }),
);
