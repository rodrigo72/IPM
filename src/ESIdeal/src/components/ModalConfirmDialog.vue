<script>
export default {
    name: 'Modal',
    emits: ['action'],
    data() {
        return {
            isOpen: false,
            isOpenVShow: false,
            message: '',
            action: '',
            buttonColor: 'var(--accent-color)'
        };
    },
    methods: {
        close() {
            this.isOpen = false;
            setTimeout(() => {
                this.isOpenVShow = false;
            }, 200);
        },
        open() {
            this.isOpen = true;
            this.isOpenVShow = true;
        },
        updateMessage(message) {
            this.message = message;
        },
        updateAction(action) {
            this.action = action;
        },
        updateButtonColor(color) {
            this.buttonColor = color;
        },
        emitAction() {
            this.$emit('action', this.action);
            this.close();
        }
    },
};
</script>


<template>
    <transition name="fade">
        <div v-show="isOpenVShow" class="modal-backdrop">
            <div :class="['modal', isOpen ? 'slide-in' : 'slide-out']" @click.stop>
                <div class="modal-title">
                    {{ message }}
                </div>
                <div class="buttons">
                    <Button @click="close()" :width="150" class="btn font-conf-1"  background-color="var(--background-color)" textColor="var(--accent-color)" customBorder="3px solid var(--accent-color)">Cancelar</Button>
                    <Button @click="emitAction()" :background-color="buttonColor"class="btn font-conf-1" :width="150">{{ action }}</Button>
                </div>
            </div>
        </div>
    </transition>
</template>


<style scoped>
    .modal-backdrop {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.3);
        z-index: 99999;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .fade-enter-active, 
    .fade-leave-active {
        transition: background-color 0.2s ease-in-out;
    }

    .fade-enter-from, 
    .fade-leave-to {
        background-color: rgba(0, 0, 0, 0.0);;
    }

    .modal {
        border: 3px solid #dbe8f4;
        background: #f4f9fc;
        min-width: 450px;
        height: auto;
        border-radius: 10px;
        padding: 20px;
        padding-bottom: 0px;
        overflow-y: auto;
        transition: transform 0.2s ease-in-out;
        cursor: default;
        display: grid;
        grid-template-areas: 
        "modaltitle"
        "buttons";
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
        row-gap: 20px;
        padding-bottom: 40px;
    }

    .btn {
        margin-left: 5px;
        margin-right: 5px;
    }

    .buttons {
        grid-area: buttons;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    .modal-title {
        grid-area: modaltitle;
        font-size: 26px;
        font-weight: 400;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: 10px;
        padding-right: 10px;
    }

    .slide-in {
        animation: slideIn 0.2s forwards;
    }

    @keyframes slideIn {
        from {
            transform: translateY(300%)
        }
        to {
            transform: translateY(0);
        }
    }

    .slide-out {
        animation: slideOut 0.2s forwards;
    }

    @keyframes slideOut {
        from {
            transform: translateY(0);
        }
        to {
            transform: translateY(300%);
        }
    }
</style>