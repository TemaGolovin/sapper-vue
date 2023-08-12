<template>
  <nav>
    <router-link to="/">Игра</router-link>
    <router-link to="/leaderboard">Таблица лидеров</router-link>
  </nav>
  <router-view />
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: rgb(211, 252, 238);
}

nav {
  width: 20%;
  padding: 20px;
  display: flex;
  margin: auto;
  justify-content: space-around;
  font-size: 24px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
