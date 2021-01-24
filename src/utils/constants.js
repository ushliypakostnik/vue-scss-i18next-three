const isProd = process.env.NODE_ENV === 'production';
const apiUrl = process.env.VUE_APP_API_URL;
export const API_URL = isProd ? apiUrl || 'https://???' : apiUrl || 'http://localhost:8082';

export const LOCALSTORAGE = {
  LANGUAGE: 'language',
};

/* export const SESSIONSTORAGE = {
}; */

export const LANGUAGES = [
  { id: 1, name: 'en' },
  { id: 2, name: 'ru' },
];

// Auto language
export const AUTO_LANG = localStorage.getItem(LOCALSTORAGE.LANGUAGE) || null;

export const DESIGN = {
  BREAKPOINTS: {
    desktop: 1025,
  },
  COLORS: {
    primary: '##722f37',
    primary0x: 0x722f37,
  },
  GROUND_SIZE: 5000,
  HERO_SPEED: 500,
  UNDER_FLOOR: 20,
  AMMO_GRAVITY: 5,
  NUM_AMMO: 20,
  AMMO_RADIUS: 5,
};

export const OBJECTS = {
  HORSES: {
    start: [
      // x, y
      [130, 150],
      [200, -230],
      [-160, 220],
      [150, -200],
      [-100, 220],
      [-300, 320],
      [300, 350],
    ],
    velocity: 150,
  },
  PARROTS: {
    quantity: 7,
    velocity: 100,
  },
  BOXES: {
    size: 50,
    position: [
      // x, y, z
      [-150, 20, 0],
      [-100, 20, 0],
      [-50, 20, 0],

      [50, 20, 0],
      [100, 20, 0],
      [150, 20, 0],

      [-100, 70, 0],
      [-50, 70, 0],
      [0, 70, 0],
      [50, 70, 0],
      [100, 70, 0],

      [-50, 120, 0],
      [0, 120, 0],
      [50, 120, 0],

      [0, 170, 0],
    ],
  },
  PUDDLES: [
    // x, z, r, y
    // [1300, -1300, 700, 0],
    // [-800, 933, 600,0],
    // [-1500, -1200, 800, 0],
    // [-200, -300, 150, 0],
    [0, 0, 10000, -10], // great ocean
  ],
  STONES: {
    position: [
      // x, y
      [1600, 25],
      [942, 81],
      [-50, 600],
      [76, -1483],
      [255, -695],
      [-3083, -982],
      [-1687, -334],
    ],
  },
  MOUNTAINS: {
    position: [
      // x, z, h
      [1200, 1400, 500],
      [1250, 1450, 600],
      [-1400, -1350, 450],
      [-3400, -1350, 750],
      [-3450, -1300, 400],
      [2450, -2300, 850],
      [2400, -2250, 400],
      [2500, -2200, 270],
    ],
  }
};

export const LOCALES = {
  [LANGUAGES[0].name]: {
    layout: {
      text0: 'Drinking robot',
      text1: 'Shot: LEFT MOUSE',
      text2: 'Move: WASD',
      text3: 'Jump SPACE',
      text4: 'Run: Shift',
      text5: 'Look: MOUSE',
      text6: 'Pause: Ecs',
      startbutton: 'Play',
      gadgetstext: 'You need a PC keyboard to play',
    },
    page404: {
      text: 'Page not found!!!',
    },
  },
  [LANGUAGES[1].name]: {
    layout: {
      text0: 'Робот-собутыльник',
      text1: 'Выстрел: Левая кнопка мыши',
      text2: 'Движение: WASD',
      text3: 'Прыжок SPACE',
      text4: 'Бежать: Shift',
      text5: 'Осмотреться: MOUSE',
      text6: 'Pause: Ecs',
      startbutton: 'Играть',
      gadgetstext: 'Для того чтобы играть нужна клавиатура персонального компьютера',
    },
    page404: {
      text: 'Страница не найдена!!!',
    },
  },
};
