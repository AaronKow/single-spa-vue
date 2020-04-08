<template>
    <div id="app1">
        Single SPA is working.
        Click below to show the app's page

        <div v-show="($route.path !== '/page1' && $route.path !== '/page2')">
            <div>
                <router-link to="/page1">Show App1 page</router-link>
            </div>

            <div>
                <router-link to="/page2">Show App2 page</router-link>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: "App"
};
</script>

<style style="scss" scoped>
#app1 {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>