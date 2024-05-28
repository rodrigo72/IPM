<script>    
    export default {
        name: 'Assigned Services page',
        props: {
            m_id: {
                type: String,
                required: true
            },
            m_especialidades: {
                type: Array,
                required: true
            },
            dt_language: {
                type: Object,
                required: true
            },
            currentServiceId: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                title: 'Serviços atribuídos',
                pathAbrir: '/service',
                options: {
                    responsive: true,
                    select: {
                        style: 'single'
                    }
                },
                columns: [
                   { data: "id", title: "ID serviço" },
                   { data: "vehicleId", title: "ID veículo" },
                   { data: "service-description", title: "Definição do serviço"},
                   { data: "service-duration", title: "Duração do serviço"},
                   { data: "estado", title: "Estado" },
                   { data: "agendamento", title: "Agendamento" },
                   { data: "data", title: "Data" },
                   { data: "descrição", title: "Descrição" }
                ],
                json_data: [],
                selectedServiceID: '',
                not_selected: true
            }
        },
        methods: {
            async getData() {

                this.options.language = this.dt_language;

                const vehicleTypes = {};

                try {
                    const response = await fetch('http://localhost:3000/vehicle-types');
                    const data = await response.json();
                    data.forEach(element => {
                        vehicleTypes[element.id] = element["serviços"];
                    });
                } catch (error) {
                    console.error(error);
                    alert('Erro ao carregar tipos de veículo');
                    return;
                }

                const serviceDefinitions = {};

                try {
                    const response = await fetch('http://localhost:3000/service-definitions');
                    const data = await response.json();
                    data.forEach(element => {
                        serviceDefinitions[element.id] = element
                    });
                } catch (error) {
                    console.error(error);
                    alert('Erro ao carregar definições de serviço');
                    return;
                }

                try {
                    const response1 = await fetch('http://localhost:3000/mechanics/' + this.m_id);
                    let m_data = await response1.json();

                    const response2 = await fetch('http://localhost:3000/services');
                    let data = await response2.json();

                    data = data.filter(element => element.estado !== "realizado" && element.estado !== "cancelado" && !m_data.ids_serviços.includes(element.id));

                    if (!this.m_especialidades.includes("geral")) {
                        data = data.filter(element => { 
                            for (let i = 0; i < this.m_especialidades.length; i++) {
                                return vehicleTypes[this.m_especialidades[i]].includes(element['service-definitionId']);
                            }
                        });
                    }

                    data.forEach(element => {
                        if (element.data && typeof element.data === 'object') {
                            const { dia, mes, ano, hora, minutos } = element.data;
                            const dateString = `${dia}/${mes}/${ano} ${hora}:${minutos}`;
                            element.data = dateString;
                        } else {
                            element.data = '-';
                        }

                        switch(element.estado) {
                            case 'nafila':
                                element.estado = 'Na fila';
                                break;
                            case 'realizado':
                                element.estado = 'Realizado';
                                break;
                            case 'parado':
                                element.estado = 'Parado';
                                break;
                            case 'programado':
                                element.estado = 'Programado';
                                break;
                        }

                        switch(element.agendamento) {
                            case 'programado':
                                element.agendamento = 'Programado';
                                break;
                            case 'filaDeEspera':
                                element.agendamento = 'Fila de espera';
                                break;
                        }

                        const service = serviceDefinitions[element['service-definitionId']];
                        if (service) {
                            element['service-description'] = service['descr'];
                            element['service-duration'] = service['duração']
                        } else {
                            element['service-description'] = element['service-definitionId'].toUpperCase();
                            element['service-duration'] = '-';
                        }

                    });
                    this.json_data = data;
                } catch (error) {
                    console.error(error);
                    alert('Erro ao carregar serviços');
                    return;
                }
            },  
            selected(id) {
                this.selectedServiceID = id;
                this.not_selected = false;
            },
            deselected() {
                this.selectedServiceID = '';
                this.not_selected = true;
            },
        },
        async created() {
            await this.getData();
        }
    }
</script>


<template>
    <div id="assigned-services-page">
        <HeaderSection :title="title" :currentServiceId="currentServiceId"/>
        <ServicesTable
            :options="options"
            :json_data="json_data"
            :columns="columns"
            :pathAbrir="pathAbrir"
            @selected="selected"
            @deselected="deselected"
        ></ServicesTable>
    </div>
</template>


<style scoped>
    #assigned-services-page {
        display: grid;
        background-color: var(--background-color);
        grid-template-areas: 
        "nav nav nav"
        ". . ."
        ". table ."
        ". abrir ."
        ". . .";
        grid-template-rows: 70px 20px auto 90px 20px;
        grid-template-columns: 1fr 12fr 1fr;
        height: 100vh;
    }

    @media screen and (width <= 800px) {
        #assigned-services-page {
            grid-template-columns: 1fr 23fr 1fr;
        }
    }
</style>