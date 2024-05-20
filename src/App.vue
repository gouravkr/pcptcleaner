<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div>
    <header>
      <div class="wrapper">
        <nav>
          <RouterLink to="/">Home</RouterLink>
          <!-- <RouterLink to="/Conversion">Conversion</RouterLink> -->
          <RouterLink to="/about">About</RouterLink>
        </nav>
      </div>
    </header>
    <div class="container">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
header {
  line-height: 1;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid gray;
  color: gray;
  text-decoration: none;
}

nav a.router-link-exact-active {
  color: black;
  text-decoration: underline;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

header {
  position: absolute;
  top: 0px;
  left: 0px;
  display: flex;
  place-items: center;
  box-shadow: 0px 2px 8px gray;
}

header .wrapper {
  background-color: #61d7c3;
  width: 100vw;
  display: flex;
  place-items: center;
  flex-wrap: wrap;
}

nav {
  text-align: left;
  font-size: 1rem;
  padding: 0 0 1rem 0;
  margin-top: 1rem;
}

.container {
  margin-top: 1.5rem;
  overflow: hidden ;
}
</style>
