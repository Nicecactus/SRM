import { action, Action, createContextStore, thunk, Thunk } from "easy-peasy";
import EventEmiter, { IEventEmiter } from "./event";

export type Messages = { [term: string]: string };

export type LoadMessagesFunction = (lang: string) => Messages;

export type Events = { [value: string]: any };
export type EventsSubscribe = { [value: string]: any };

export type ListenEventFunction = (data: any) => Events;

export interface ContextStoreModel {
  sendEvent: (id: string, ...args: Array<any>) => Promise<any>;
  navigate: (
    commands: string | Array<string>,
    options?: { queryParams?: any }
  ) => any;
  basename: string;
  setBasename: Action<ContextStoreModel, string | undefined>;
  language: string;
  setLanguage: Action<ContextStoreModel, string | undefined>;
  loadMessages: LoadMessagesFunction;
  eventEmiter: IEventEmiter;
  messages: Messages;
  setEventState: Action<ContextStoreModel, any | undefined>;
  setEvent: Thunk<ContextStoreModel, any | undefined, any>;
  event: any;
}

const ContextStore = createContextStore<ContextStoreModel>(
  (initialData) =>
    initialData || {
      sendEvent: async () => {},
      navigate: () => {},
      basename: "/",
      setBasename: action<ContextStoreModel>((state, value) => {
        state.basename = value || "/";
      }),
      language: "en",
      setLanguage: action<ContextStoreModel>((state, value) => {
        state.language = value || "en";
        state.messages = state.loadMessages?.(state.language);
      }),
      loadMessages: () => ({}),
      messages: {},
      event: {},
      eventEmiter: new EventEmiter(),
      setEventState: action<ContextStoreModel>((state, value) => {
        state.event = value;
      }),
      setEvent: thunk(async (actions, payload, helpers) => {
        const state = await (helpers.getState());
        state.eventEmiter.dispatch(payload.type, payload.data);
        actions.setEventState(payload);
      })
    }
);

export default ContextStore;
