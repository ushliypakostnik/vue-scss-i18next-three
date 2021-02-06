import storage from '@/utils/storage';

import { DESIGN } from '@/utils/constants';

const initialState = {
  language: null,
  isPause: true,
  isDrone: false,
  isGameOver: false,
  messages: [],
  message: 1,
};

const state = initialState;

const getters = {
  language: state => state.language,
  isPause: state => state.isPause,
  isDrone: state => state.isDrone,
  messages: state => state.messages,
  message: state => state.message,
  isGameOver: state => state.isGameOver,
};

let messages;
let index;

const actions = {
  changeLanguage: ({ commit }, language) => {
    commit('changeLanguage', language);
    storage.rememberLanguage(language);
  },

  togglePause: ({ commit }, isPause) => {
    commit('togglePause', isPause);
  },

  toggleDrone: ({ commit }, isDrone) => {
    commit('toggleDrone', isDrone);
  },

  showMessage: ({ commit }, { id, view, name }) => {
    commit('showMessage', { id, view, name });
  },

  hideMessageByView: ({ commit }, view) => {
    commit('hideMessageByView', view);
  },

  hideMessageById: ({ commit }, id) => {
    commit('hideMessageById', id);
  },

  setGameOver: ({ commit }, isGameOver) => {
    commit('setGameOver', isGameOver);
  },

  layoutReload: ({ commit }) => {
    commit('layoutReload');
  },
};

const mutations = {
  changeLanguage: (state, language) => {
    state.language = language;
  },

  togglePause: (state, isPause) => {
    state.isPause = isPause;
  },

  toggleDrone: (state, isDrone) => {
    state.isDrone = isDrone;
  },

  showMessage: (state, { id, view, name }) => {
    messages = state.messages;
    messages.push([id, view, name]);
    state.messages = messages;
  },

  hideMessageByView: (state, view) => {
    messages = state.messages;
    index = messages.find(message => message[1] === view);
    if (index) messages.splice(messages.indexOf(index), 1);
    state.messages = messages;
  },

  hideMessageById: (state, id) => {
    messages = state.messages;
    index = messages.find(message => message[0] === id);
    if (index) messages.splice(messages.indexOf(index), 1);
    state.messages = messages;
  },

  setGameOver: (state, isGameOver) => {
    state.isGameOver = isGameOver;
  },

  layoutReload: (state) => {
    state.isPause = true;
    state.isDrone = false;
    state.isGameOver = false;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
