<script>
export default {
    props: {
        title: {
            type: String,
            required: true
        },
        currentServiceId: {
            type: String,
            required: true
        },
    },
    data() {
        let b = this.currentServiceId === '' ? true : false;
        return {
            isModalVisible: false,
            rows: [
                { title: "Serviço atual", disabled: b, redirect: "/service/" +  this.currentServiceId },
                { title: "Serviços atribuídos", disabled: false, redirect: "/assigned-services" },
                { title: "Serviços terminados", disabled: false, redirect: "/completed-services" }, // mudar este quando houver uma página de serviços terminados
                { title: "Log-out", disabled: false, redirect: "/login"}
            ]
        };
    },
    methods: {
        openModal() {
            this.$refs.modal.open();
        },
    }
}
</script>


<template>
    <div class="nav-container">
        <img src="../assets/logo-v2.png" class="logo">
        <div class="title-container">
            <div class="title font-conf-1">{{ title }}</div>
            <hr class="line">
        </div>
        <div class="nav-icons-container">
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
            </svg>
            <svg @click="openModal" class="nav-icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                    d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
            </svg>
        </div>
    </div>
    <ModalMenu 
        ref="modal"
        :rows="rows"
    ></ModalMenu>
</template>


<style scoped>
.nav-container {
    grid-area: nav;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-right: 20px;
    padding-left: 20px;
}

.logo {
    height: 100%;
}

.nav-icons-container {
    max-height: 100%;
    margin-left: 5%;
}

.title-container {
    text-align: center;
}

.title {
    font-size: 27px;
}

.line {
    width: 400px;
    height: 2px;
    background-color: var(--accent-color);
    border-color: var(--accent-color);
    border-style: solid;
    border-radius: 2px;
}

.nav-icon {
    width: 55px;
    height: 55px;
    padding: 10px;
    cursor: pointer;
}

@media screen and (width <=800px) {
    .logo {
        height: 80%;
    }

    .line {
        width: 100%
    }

    .title {
        font-size: 23px;
    }

    .nav-icon {
        width: 37px;
        height: 37px;
        padding: 5px;
    }
}
</style>