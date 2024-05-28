<script>
    import { compare } from 'bcryptjs';

    import { toast } from "vue3-toastify";
    import "vue3-toastify/dist/index.css";

    export default {
        name: 'Login page',
        emits: ['updateMecanicoID', 'updateMecanicoEspecialidades'],
        data() {
            return {
                post_nr: 1,
                id: '',
                password: ''
            }
        },
        methods: {
            errorMessage(message) {
                toast(message, {
                    "type": "error",
                    "autoClose": 3000,
                    "transition": "slide",
                    "dangerouslyHTMLString": true
                });
            },
            login() {
                fetch(`http://localhost:3000/mechanics/${this.id}`)
                    .then(response => response.json())
                    .then(async data => {
                        const match = await compare(this.password, data.password);  // todas as passwords na BD são "1234"
                        if (match) {
                            this.$emit('updateMecanicoID', data.id);
                            this.$emit('updateMecanicoEspecialidades', data.especialidades);
                            this.$router.push('/assigned-services')
                        } else {
                            this.errorMessage("Palavra-passe incorreta");
                            this.password = '';
                        }
                    })
                    .catch(() => {
                        this.errorMessage('ID não encontrado')
                        this.id = '';
                        this.password = '';
                    })
            }
        }
    }
</script>


<template>
    <div id="login-page">
        <img class="logo" src="../assets/logo-v2.png" alt="Logo">
        <div class="font-conf-1 title">Posto nº {{ post_nr }}</div>
        <hr class="line">
        <div id="card" class="card">
            <input v-model="id" class="input font-conf-1" type="text" placeholder="ID" @keyup.enter="login()"/>
            <input v-model="password" class="input font-conf-1" type="password" placeholder="Palavra-passe" @keyup.enter="login()"/>
        </div>
        <Button class="font-conf-1" @click="login()" :width="250">
            Log-in
            <div style="width: 5%;"></div>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0z"></path>
                <path fill-rule="evenodd" d="M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708z"></path>
            </svg>
        </Button>
    </div>
</template>

<style>
    .Toastify__toast-body {
        font-family: "Outfit", "Roboto", sans-serif;
    }

    .Toastify__progress-bar--error {
        background-color: var(--light-red);
    }

    .Toastify__progress-bar--success {
        background-color: var(--accent-color);
    } 
    :root {
        --toastify-icon-color-error: var(--light-red);
        --toastify-icon-color-success: var(--accent-color);
    }
</style>


<style scoped>
    #login-page {
        padding:0;
        margin:0;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background: linear-gradient(-45deg, #c4daee, #fcfdfe);
        background-size: 400% 400%;
        animation: gradient 22s ease infinite;
        height: 100vh;
    }

    .logo {
        width: 350px;
        margin-bottom: 40px;
    }

    @keyframes gradient {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    .title {
        font-size: 27px;
        font-weight: 700;
        margin: 0;
    }

    .line {
        width: 20%;
        height: 2px;
        background-color: var(--accent-color);
        border-color: var(--accent-color);
        border-style: solid;
        border-radius: 2px;
        margin-bottom: 50px;
    }

    .card {
        width: 25%;
        min-width: 300px;
        border-radius: 25px;
        color:var(--text-color);
        background: #6da2d1ca;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-direction: column;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 30px;
        padding-bottom: 30px;
        margin-bottom: 40px;
    }

    .input {
        font-size: 20px;
        width:80%;
        border-radius: 10px;
        margin:20px auto;
        padding:15px;
        background: #F8FBFE;
        color: var(--text-dim-color);
        border:0;
    }

    .input::placeholder {
        color: var(--text-dim-color);
    }

    .input:focus {
        outline: none;
    }

    .bi {
        display: inline-block;
        vertical-align: -.125em;
        fill: currentcolor;
    }

    @media screen and (max-width: 600px) {
        .logo {
            width: 250px;
        }   
    }
</style>