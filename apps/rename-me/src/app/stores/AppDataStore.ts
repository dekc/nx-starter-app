import { makeAutoObservable } from 'mobx';
import { makePersistable, stopPersisting } from 'mobx-persist-store';

interface State {
  leftSideDrawerOpen: boolean;
  authenticated: boolean;
}

class AppDataStore {
  private state: State = {
    leftSideDrawerOpen: false,
    authenticated: false,
  };

  constructor() {
    console.debug('AppDataStore.constructor');
    makeAutoObservable(this);
    makePersistable(this.state, {
      name: 'AppDataStore',
      properties: ['leftSideDrawerOpen'],
      storage: window.localStorage,
    });
  }

  get leftSideDrawerOpen() {
    return this.state.leftSideDrawerOpen;
  }

  get authenticated() {
    return this.state.authenticated;
  }

  setLeftSideDrawerOpen(leftSideDrawerOpen: boolean) {
    this.state.leftSideDrawerOpen = leftSideDrawerOpen;
  }

  toggleLeftSideDrawer() {
    this.state.leftSideDrawerOpen = !this.state.leftSideDrawerOpen;
  }

  dispose() {
    console.debug('AppDataStore.dispose');
    stopPersisting(this.state);
  }
}

export { AppDataStore };
