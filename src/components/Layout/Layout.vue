<template>
  <div
    v-if="isDesktop && isChromeOrYandex"
    class="layout"
  >
    <Preloader>
      <Scene />

      <Game v-if="!isDrone" />

      <Drone v-else />

      <div
        v-if="isPause"
        class="layout__blocker"
      >
        <div class="layout__instructions">
          <h1>{{ $t('layout.text0') }} {{ version }}</h1>
          <h4>{{ $t('layout.text1') }}</h4>
          <h4>{{ $t('layout.text2') }}</h4>
          <h4>{{ $t('layout.text3') }}</h4>
          <h4>{{ $t('layout.text4') }}</h4>
          <h4>{{ $t('layout.text5') }}</h4>
          <h4>{{ $t('layout.text6') }}</h4>
          <h4>{{ $t('layout.text7') }}</h4>
          <h4>{{ $t('layout.text8') }}</h4>
          <h4>{{ $t('layout.text9') }}</h4>
          <h4>{{ $t('layout.text10') }}</h4>
          <button
            class="button"
            type="button"
            @click.prevent.stop="play"
          >{{ $t('layout.startbutton') }}</button>
          <div class="switch__wrapper">
            <LangSwitch />
          </div>
          <h5>
            <span class="layout__link">
              {{ $t('layout.author') }}
              <a href="https://github.com/ushliypakostnik" target="_blank">{{ $t('layout.authorlink') }}</a>
            </span>
            <span class="layout__link">
              {{ $t('layout.music') }}
              <a href="https://kafedra.bandcamp.com" target="_blank">{{ $t('layout.musiclink') }}</a>
            </span>
          </h5>
          <div class="layout__attention">{{ $t('layout.attention') }}</div>
        </div>
      </div>
    </Preloader>
  </div>

  <Gate
    v-else-if="!isDesktop"
    face="gadgets"
  />
  <Gate
    v-else
    face="chrome"
  />
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { DESIGN } from '@/utils/constants';
import ScreenHelper from '@/utils/screen-helper';

import Gate from '@/components/Layout/Gate.vue';
import Preloader from '@/components/Layout/Preloader.vue';
import Scene from '@/components/Three/Scene/Scene.vue';
import LangSwitch from '@/components/Layout/LangSwitch.vue';
import Game from '@/components/Layout/Game.vue';
import Drone from '@/components/Layout/Drone.vue';

export default {
  name: 'Layout',

  components: {
    Gate,
    Preloader,
    Scene,
    LangSwitch,
    Game,
    Drone,
  },

  data() {
    return {
      isDesktop: null,
      isChromeOrYandex: ScreenHelper.isChromeOrYandex(),
    };
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onWindowResize, false);
  },

  mounted() {
    window.addEventListener('resize', this.onWindowResize, false);
    this.onWindowResize();
  },

  computed: {
    ...mapGetters({
      isPause: 'layout/isPause',
      isDrone: 'layout/isDrone',
    }),

    version() {
      return DESIGN.V;
    },
  },

  methods: {
    ...mapActions({
      togglePause: 'layout/togglePause',
    }),

    onWindowResize() {
      this.isDesktop = !!ScreenHelper.isDesktop();
    },

    play() {
      if (!this.isDrone) this.$eventHub.$emit('lock');
      this.togglePause(false);
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_main.scss";

.layout {
  position: fixed;
  @include size(100vw, 100vh);

  &__blocker {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $colors__gate;
    display: flex;
    justify-content: center;
    align-items: center;
    @include size(100%, 100%);
  }

  &__instructions {
    text-align: center;
    color: $colors__white;
  }

  &__attention {
    position: absolute;
    bottom: $gutter;
    left: 0;
    right: 0;
    text-align: center;
    @include text($font-size--xsmall * 0.75);
  }

  &__link:not(:first-child) {
    margin-left: $gutter;
  }
}

.button {
  margin-top: $gutter * 1.5;
  margin-bottom: $gutter * 1.5;
}

h3,
h4 {
  margin: 0;
}
</style>
