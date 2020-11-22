<template>
  <div class="lang-selector">
    <button
      v-for="lang in available_langs"
      :key="lang"
      class="lang-selector__button button button--tv"
      :class="{ 'lang-selector__button--active': selectedLang === lang }"
      @click="selectLang(lang)"
    >
      {{ lang }}
    </button>
  </div>
</template>

<script lang="ts" src="./LangSelector.ts" />
