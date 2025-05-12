import { MediaConnection } from "peerjs";
import { create } from "zustand";

type IncomingCall = {
  call: MediaConnection & { id: string };
};

type IncomingCallState = {
  incomingCalls: IncomingCall[];
};

type IncomingCallActions = {
  addIncomingCall: (incomingCall: IncomingCall) => void;
  removeIncomingCall: (callId: string) => void;
  answer: (callId: string) => void;
  reject: (callId: string) => void;
};

const useIncomingCallStore = create<IncomingCallState & IncomingCallActions>(
  (set, get) => ({
    incomingCalls: [],
    addIncomingCall: (incomingCall) =>
      set((state) => ({
        incomingCalls: [...state.incomingCalls, incomingCall],
      })),
    removeIncomingCall: (callId) =>
      set((state) => ({
        incomingCalls: state.incomingCalls.filter(
          (incomingCall: any) => incomingCall?.id !== callId,
        ),
      })),

    answer: (callId) => {
      const incomingCall = get().incomingCalls.find(
        (call: any) => call?.id === callId,
      );

      if (incomingCall) {
        incomingCall.call.answer();
        get().removeIncomingCall(callId);
      }
    },
    reject: (callId) => {
      const incomingCall = get().incomingCalls.find(
        (call: any) => call?.id === callId,
      );
      if (incomingCall) {
        incomingCall.call.close();
        get().removeIncomingCall(callId);
      }
    },
  }),
);

export default useIncomingCallStore;
