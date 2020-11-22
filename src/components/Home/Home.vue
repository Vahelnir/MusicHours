<template>
  <section
    class="background"
    :class="[timeClassName, weatherClassName]"
    id="home"
  >
    <div class="foreground foreground--trees"></div>
    <img
      class="astre"
      :class="[astrePosition]"
      src="/images/Soleil.png"
      alt=""
    />
    <img class="cloud cloud--1" src="/images/nuage1.png" alt="" />
    <img class="cloud cloud--2" src="/images/nuage2.png" alt="" />
    <img class="stars" src="/images/BgStars.png" alt="" />

    <div class="tv-color" style="position: absolute; left: 0; top: 0">
      {{ timer }}
    </div>
    <lang-selector />
    <section class="pre-page tv-color">
      <h1>Entrez votre ville :</h1>
      <h4>Ou votre code postal</h4>
      <form name="form">
        <div class="input-group">
          <input
            type="text"
            class="input city"
            v-model="city"
            placeholder="Ex : Grenoble, Paris, 38180"
          />
          <input
            :class="{ 'zip--hidden': !cityNotEmpty }"
            v-model="zip"
            class="input zip"
            type="text"
            placeholder="ID Pays"
          />
        </div>
        <h2 class="c1 formError"></h2>
        <button class="button button--tv">Confirmer</button>
      </form>
      <h3>(Elle sera sauvegardée sur votre appareil.)</h3>
    </section>
    <about />
  </section>
</template>

<script lang="ts" src="./Home.ts" />
