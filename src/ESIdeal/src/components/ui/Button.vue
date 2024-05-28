<script>
    export default {
        props: {
            width: {
                type: Number,
                default: 200
            },
            backgroundColor: {
                type: String,
                default: 'var(--accent-color)'
            },
            textColor: {
                type: String,
                default: 'var(--text-color-2)'
            },
            customBorder: {
                type: String,
                default: 'none'
            }
        },
        data() {
            return {};
        }
    }
</script>

<template>
    <button type="button" :style="{'width': width + 'px'}">
        <slot></slot>
    </button>
</template>

<style scoped>
    button {
        background-color: v-bind(backgroundColor);
        color: v-bind(textColor);
        border: v-bind(customBorder);
        border-radius: 10px;
        font-size: 24px;
        padding: 10px;
        cursor: pointer;
        -webkit-transition: ease-out 0.4s;
        -moz-transition: ease-out 0.4s;
        transition: ease-out 0.4s;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    button:hover {
        box-shadow: inset 400px 0 0 0 var(--dark-color);
        border-color: var(--dark-color);
        color: var(--background-color);
    }

    button:active {
        box-shadow: inset 400px 0 0 0 #abc9ec;
        border-color: #abc9ec;
        color: var(--background-color);
    }

    button:disabled {
        background-color: #cde1f1;
        color: #ffffffe0;
        border: none;
        cursor: not-allowed;
    }

    button:disabled:hover {
        box-shadow: none;
    }

</style>