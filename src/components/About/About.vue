<template>
  <font-awesome-icon
    class="popup__button transition-2 tv-color"
    :icon="faInfoCircle"
    @click="open_modal"
  />
  <section class="popup" :class="{ 'popup--open': showModal }">
    <div>
      <p>
        MusicHours est un site vous permettant, à partir d'une ville de votre
        choix, d'avoir une musique et un thème s'adaptant à l'heure et à la
        météo de celle-ci !
      </p>
      <p>
        La totalité des musiques présentes sur le site, viennent de l'OST du jeu
        Animal Crossing : New Leaf, propriété de Nintendo.
      </p>
      <p>
        <span class="lang">Site réalisé par </span>
        <a href="https://theomigeat.com/" id="rainbow" target="_blank">
          Théo Migeat
        </a>
        et réécrit par
        <a href="https://github.com/Vahelnir" id="rainbow" target="_blank">
          Vahelnir
        </a>
      </p>
      <p>
        <span>
          Si vous avez la moindre question, n'hésitez pas à nous contacter sur
          twitter
        </span>
        <a href="https://twitter.com/STM3900" target="_blank">Théo</a>
        et
        <a href="https://twitter.com/Vahelnir" target="_blank">Vahelnir</a>
        !
      </p>
      <button @click="close_modal">Ok !</button>
    </div>
  </section>
</template>

<script lang="ts" src="./About.ts" />
