import { makeAutoObservable } from 'mobx';
import { makePersistable, stopPersisting } from 'mobx-persist-store';

export type ThemeMode = 'light' | 'dark';

interface State {
  mode: ThemeMode;
}

class ThemeDataStore {
  private state: State = {
    mode: 'dark',
  };

  constructor() {
    console.debug('ThemeDataStore.constructor');
    makeAutoObservable(this);
    makePersistable(this.state, {
      name: 'ThemeDataStore',
      properties: ['mode'],
      storage: window.localStorage,
    });
  }

  get mode() {
    return this.state.mode;
  }

  setMode(mode: ThemeMode) {
    this.state.mode = mode;
  }

  toggleMode() {
    this.state.mode = this.state.mode === 'light' ? 'dark' : 'light';
  }

  dispose() {
    console.debug('ThemeDataStore.dispose');
    stopPersisting(this.state);
  }
}

export { ThemeDataStore };
