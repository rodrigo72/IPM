<template>
    <div id="error-page">
        <div class="centered-content">
        <div class="logo">
            <img src="../assets/logo-v2.png" alt="Logo">
        </div>
        <div class="message-container">
            <h2>404 Error. Esta página não existe.</h2>
        </div>
    </div>
    </div>
</template>

<style scoped>

#error-page {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(-45deg, #c4daee, #fcfdfe);
}

.centered-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.logo {
    margin-bottom: 40px;
}

.logo img {
    width: 700px;
    height: auto;
}

h2 {
    text-align: center;
    font-size: 40px;
}
</style>
