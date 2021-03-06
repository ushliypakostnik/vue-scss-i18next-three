const initialState = {
  isGameLoaded: false,

  isHeroLoaded: false,
  isStoneLoaded: false,
  isSandLoaded1: false,
  isSandLoaded2: false,
  isGrassLoaded: false,
  isWaterLoaded: false,
  isTree1Loaded: false,
  isTree2Loaded: false,
  isAnemoneLoaded: false,
  isCrocusLoaded: false,
  isDaffodilLoaded: false,
  isTulipLoaded: false,
  isHorseLoaded: false,
  isParrotLoaded: false,
  isBoatLoaded: false,
  isWomanLoaded: false,
  isRobotsLoaded: false,
  isMetalLoaded: false,
  isFireLoaded: false,
  isPurpleLoaded: false,

  isMashaComplete: false,
  isStepComplete: false,
  isRunComplete: false,
  isWaterStepComplete: false,
  isWaterRunComplete: false,
  isJumpComplete: false,
  isWaterJumpComplete: false,
  isSpitComplete: false,
  isDropComplete: false,
  isOceanComplete: false,
  isWindComplete: false,
  isDamageComplete: false,
  isPickComplete: false,
  isHorseRunComplete: false,
  isHorseWaterRunComplete: false,
  isHorseFrComplete: false,
  isHorseCryComplete: false,
  isParrotFlyComplete: false,
  isParrotCryComplete: false,
  isParrotCry2Complete: false,
  isRobotsRunComplete: false,
  isRobotsNoizeComplete: false,
  isDancerOffComplete: false,
  isBoomComplete: false,
  isRotateComplete: false,
  isFireComplete: false,
  isEnergyComplete: false,
  isAirComplete: false,

  isAmmoBuilt: false,
  isGrassBuilt: false,
  isStonesBuilt: false,
  isSandsBuilt: false,
  isWatersBuilt: false,
  isTressBuilt: false,
  isAnemonesBuilt: false,
  isCrocusesBuilt: false,
  isDaffodilsBuilt: false,
  isTulipsBuilt: false,
  isBottlesBuilt: false,
  isBoatBuilt: false,
  isWomanBuilt: false,
  isHorsesBuilt: false,
  isParrotsBuilt: false,
  isRobotsBuilt: false,
  isMinesBuilt: false,
  isCannonsBuilt: false,
  isDronesBuilt: false,
};

const state = initialState;

let stateCopy;
let result;

const getters = {
  isGameLoaded: state => state.isGameLoaded,
};

const actions = {
  preloadOrBuilt: ({ commit }, field) => {
    commit('preloadOrBuilt', field);
  },

  isAllLoadedAndBuilt: ({ commit }) => {
    commit('isAllLoadedAndBuilt');
  },
};

const mutations = {
  preloadOrBuilt: (state, field) => {
    state[field] = true;
  },

  isAllLoadedAndBuilt: (state) => {
    stateCopy = Object.assign({}, state);
    delete stateCopy.isGameLoaded;
    result = Object.values(stateCopy).every(field => field === true);
    if (result) state.isGameLoaded = true;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
