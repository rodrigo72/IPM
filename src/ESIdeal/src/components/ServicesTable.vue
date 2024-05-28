<script>
    import DataTable from 'datatables.net-vue3';
    import DataTablesCore from 'datatables.net';
    import 'datatables.net-buttons';
    import 'datatables.net-responsive';
    import 'datatables.net-select';
    
    DataTable.use(DataTablesCore);

    export default {
        name: 'Table Component',
        emits: ['selected', 'deselected'],
        props: {
            options: {
                type: Object,
                required: true
            },
            json_data: {
                type: Array,
                required: true
            },
            columns: {
                type: Array,
                required: true
            },
            pathAbrir: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                selectedServiceID: '',
                not_selected: true
            }
        },
        methods: {
            selected() {
                this.selectedServiceID = this.$refs.table.dt.row(".selected").data().id;
                this.not_selected = false;
                this.$emit('selected', this.selectedServiceID);
            },
            deselected() {
                this.selectedServiceID = '';
                this.not_selected = true;
                this.$emit('deselected');
            },
            abrir() {
                if (!this.not_selected) {
                    this.$router.push(`${this.pathAbrir}/${this.selectedServiceID}`);
                }
            }
        },
        components: {
            DataTable
        },
    }
</script>


<template>
    <div class="table-container">
        <DataTable 
            ref="table"
            @select="selected()"
            @deselect="deselected()"
            class="display nowrap"
            :columns="columns" 
            :options="options" 
            :data="json_data">
        </DataTable>
    </div>
    <div class="abrir-btn-container">
        <Button class="font-conf-1" :width="200" :disabled="not_selected" @click="abrir">
            Abrir
        </Button>
    </div>
</template>


<style scoped>
    .table-container {
        grid-area: table;
        background-image: linear-gradient(to bottom right,#6da2d113,  #6da2d100, #6da2d122);
        border: 1px solid #6da2d13d;
        padding: 40px;
        border-radius: 20px;
        margin-bottom: 20px; 
        overflow-x: hidden;
    }

    .datatable {
        margin-top: 30px;
        font-size: 18px;
        font-family: "Outfit", sans-serif;
    }

    .abrir-btn-container {
        grid-area: abrir;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

<style>
    @import 'datatables.net-dt';
    @import 'datatables.net-buttons-dt';
    @import 'datatables.net-responsive-dt';
    @import 'datatables.net-select-dt';
    :root {
        --dt-row-selected: 109, 162, 209;
    }
</style>