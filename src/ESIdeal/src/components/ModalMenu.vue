<script>
export default {
    name: 'Modal',
    props: {
        rows: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            isOpen: false,
            isOpenVShow: false
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
        redirect(row) {
            this.$router.push(row.redirect);
        },
    },
};
</script>


<template>
    <transition name="fade">
        <div v-show="isOpenVShow" class="modal-backdrop" @click="close">
            <div :class="['modal', isOpen ? 'slide-in' : 'slide-out']" @click.stop>
                <div v-for="(row, index) in rows" :key="index" class="row">
                    <div :class="{'row-title': true, 'disabled': row.disabled}" @click="!row.disabled && redirect(row)">
                        {{ row.title }}
                    </div>
                    <hr class="dashed-line" v-if="index < rows.length - 1"></hr>
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
        cursor: pointer;
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
        width: 301px;
        height: 400px;
        position: fixed;
        top: 70px;
        right: 35px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        border-radius: 10px;
        padding: 20px;
        padding-bottom: 0px;
        overflow-y: auto;
        transition: transform 0.2s ease-in-out;
        cursor: default;
    }

    .slide-in {
        animation: slideIn 0.2s forwards;
    }

    @keyframes slideIn {
        from {
            transform: translateX(200%)
        }
        to {
            transform: translateX(0);
        }
    }

    .slide-out {
        animation: slideOut 0.2s forwards;
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
        }
        to {
            transform: translateX(200%);
        }
    }

    .dashed-line {
        border: 2px dashed #d3e2f0;
        width: 100%;
    }

    .row-title {
        font-size: 26px;
        font-weight: 500;
        cursor: pointer;
    }

    .disabled {
        color: rgb(113, 113, 113);
        cursor: not-allowed;
    }

    .row {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 20px;
    }
</style>