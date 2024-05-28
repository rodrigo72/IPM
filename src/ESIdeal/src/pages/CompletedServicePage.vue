<script>
    import Fieldset from 'primevue/fieldset';
    import PickList from 'primevue/picklist';

    import { toast } from "vue3-toastify";
    import "vue3-toastify/dist/index.css";

    export default {
        name: 'Assigned Services page',
        props: {
            id: {
                type: String,
                required: true
            },
            m_id: {
                type: String,
                required: true
            },
            currentServiceId: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                client: {},
                vehicle: {},
                serviceDefinition: {},
                service: {},
                borderColor: 'rgba(0, 0, 0, 0.1)',
                servicesDefinitions: [],
                availableServices: [[], []],
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
            async initAux(path, keys, errorMessage) {
                try {
                    const response = await fetch(path);
                    const data = await response.json();
                    keys.forEach(key => { if (!data[key]) data[key] = '-'; });
                    return data;
                } catch (error) {
                    console.error(error);
                    this.errorMessage(errorMessage);
                    return null;
                }
            },
            async init() {
                this.service = await this.initAux(
                    'http://localhost:3000/services/' + this.id, 
                    ['descrição'],
                    'Erro ao carregar serviço'
                )
                if (!this.service) return;

                this.vehicle = await this.initAux(
                    'http://localhost:3000/vehicles/' + this.service.vehicleId,
                    ['id', 'clientId', 'vehicle-typeId', 'potencia', 'cilindrada', 'kms'],
                    'Erro ao carregar veículo'
                )
                if (!this.vehicle) return;

                this.client = await this.initAux(
                    'http://localhost:3000/clients/' + this.vehicle.clientId,
                    ['id', 'nome', 'email', 'telefone'],
                    'Erro ao carregar cliente'
                )
                if (!this.client) return;

                this.serviceDefinition = await this.initAux(
                    'http://localhost:3000/service-definitions/' + this.service['service-definitionId'],
                    ['duração', 'descr'],
                    'Erro ao carregar definições de serviço'
                )
                if (!this.serviceDefinition) return;

                let vehicleType = this.vehicle['vehicle-typeId'];
                let servicesForVehicleType = {};

                try {
                    const response = await fetch('http://localhost:3000/vehicle-types/' + vehicleType);
                    const data = await response.json();
                    servicesForVehicleType = data;
                } catch (error) {
                    console.error(error);
                    this.errorMessage('Erro ao carregar tipos de veículos');
                    return;
                }

                try {
                    const response = await fetch('http://localhost:3000/service-definitions');
                    this.servicesDefinitions = await response.json();
                } catch (error) {
                    console.error(error);
                    this.errorMessage('Erro ao carregar definições de serviço');
                }

                for (let i = 0; i < servicesForVehicleType['serviços'].length; i++) {
                    let item = {}
                    item.id = servicesForVehicleType['serviços'][i];
                    item.descr = this.getDescr(item.id);
                    this.availableServices[0].push(item);
                }

                if (this.service['recomendações']) {
                    for (let i = 0; i < this.service['recomendações'].length; i++) {
                        let item = {}
                        item.id = this.service['recomendações'][i];
                        item.descr = this.getDescr(item.id);
                        this.availableServices[1].push(item);
                    }
                }
            },
            servicoRealizado() {
                return this.service['estado'] === 'realizado';
            },
            voltar() {
                this.$router.go(-1);
            },
            isChangeable() {
                if (this.service['data']) {
                    let currentDate = new Date();
                    const { dia, mes, ano, hora, minutos } = this.service['data'];
                    let serviceDate = new Date(ano, mes - 1, dia, hora, minutos);
                    return Math.abs(currentDate - serviceDate) < 5 * 60 * 1000;
                }
                return false;
            },
            getDescr(id) {
                let s = this.servicesDefinitions.find(service => service.id === id);
                if (s && s['descr']) return s['descr'];
                if (s && s['id']) return s['id'];
                return 'Serviço não encontrado';
            },
            wasScheduled() {
                return this.service['agendamento'] === 'programado';
            },
            editar() {
                let date = new Date();
                try {
                    if (this.servicoRealizado()) {
                        fetch('http://localhost:3000/services/' + this.service.id, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                data: {
                                    dia: date.getDate(),
                                    mes: date.getMonth() + 1,
                                    ano: date.getFullYear(),
                                    hora: date.getHours(),
                                    minutos: date.getMinutes()
                                },
                                realizadoPor: this.m_id,
                                recomendações: this.availableServices[1].map((service) => {
                                    return service.id;
                                }),
                            })
                        })                    
                    } else {
                        fetch('http://localhost:3000/services/' + this.service.id, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                motivo: this.service.motivo,
                                data: {
                                    dia: date.getDate(),
                                    mes: date.getMonth() + 1,
                                    ano: date.getFullYear(),
                                    hora: date.getHours(),
                                    minutos: date.getMinutes()
                                },
                                realizadoPor: this.m_id
                            })
                        })
                    
                    }

                    toast("Serviço editado com sucesso", {
                        "type": "success",
                        "transition": "slide",
                        "dangerouslyHTMLString": true
                    });

                } catch (error) {
                    console.error(error);
                    this.errorMessage('Erro ao editar serviço');
                    return;
                }
            },
            anular() {
                fetch('http://localhost:3000/services/' + this.service.id, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        estado: 'nafila',
                        data: null,
                        realizadoPor: null,
                        recomendações: [],
                        motivo: null
                    })
                })
                this.$router.go(-1);
            },
            parseAction(action) {
                if (action === 'Editar') {
                    this.editar();
                } else if (action === 'Anular') {
                    this.anular();
                }
            },
            confirmEditar() {
                this.$refs.modalDialog.updateMessage('Tem a certeza que deseja editar o serviço?');
                this.$refs.modalDialog.updateAction('Editar');
                this.$refs.modalDialog.open();
            },
            confirmAnular() {
                this.$refs.modalDialog.updateMessage('Tem a certeza que deseja anular o serviço?');
                this.$refs.modalDialog.updateButtonColor('var(--light-red)');
                this.$refs.modalDialog.updateAction('Anular');
                this.$refs.modalDialog.open();
            }
        },
        async mounted() {
            await this.init();
            if (this.servicoRealizado()) {
                this.borderColor = 'var(--accent-color-2)';
            } else {
                this.borderColor = 'rgba(194, 53, 53, 0.251)';
            }
        },
        components: {
            Fieldset,
            PickList
        }
    }
</script>

<template>
    <ModalConfirmDialog ref="modalDialog" @action="parseAction"></ModalConfirmDialog>
     <div id="service-page">
        <HeaderSection :title="'Serviço ' + id" :currentServiceId="currentServiceId"/>
        <div class="card-1">
            <div class="cliente card-1-element">
                <div class="card-element-title">Cliente</div>
                <div class="keys">
                    <div class="card-element-line">Nome: </div>
                    <div class="card-element-line">Email: </div>
                    <div class="card-element-line">Telefone: </div>
                </div>
                <div class="values">
                    <div class="values-line">{{ client.nome }}</div>
                    <div class="values-line">{{ client.email }}</div>
                    <div class="values-line">{{ client.telefone }}</div>
                </div>
            </div>
            <div class="veiculo card-1-element">
                <div class="card-element-title">Veículo</div>
                <div class="keys">
                    <div class="card-element-line">Matrícula: </div>
                    <div class="card-element-line">Tipo: </div>
                    <div class="card-element-line">Cilindrada: </div>
                    <div class="card-element-line">Kms: </div>
                    <div class="card-element-line">Potência: </div>
                </div>
                <div class="values">
                    <div class="values-line">{{ vehicle.id }}</div>
                    <div class="values-line">{{ vehicle['vehicle-typeId'] }}</div>
                    <div class="values-line">{{ vehicle.cilindrada }}</div>
                    <div class="values-line">{{ vehicle.kms }}</div>
                    <div class="values-line">{{ vehicle.potencia }}</div>
                </div>
            </div>
            <div class="info card-1-element">
                <div class="card-element-title">Serviço</div>
                <div class="keys">
                    <div class="card-element-line">Duração: </div>
                    <div class="card-element-line">Tipo de serviço: </div>
                    <div class="card-element-line">Descrição: </div>
                </div>
                <div class="values">
                    <div class="values-line">{{ serviceDefinition['duração'] }} min</div>
                    <div class="values-line">{{ serviceDefinition['descr'] }}</div>
                    <div class="values-line">{{ service['descrição'] }}</div>
                </div>
            </div>
        </div>
        <div class="card-2" v-if="servicoRealizado()">
            <div class="title-container">
                <div class="success-title">
                    Serviço realizado com sucesso.
                </div>
            </div>
            <Fieldset legend="Serviços recomendados" class="box-info" :toggleable="true" v-if="!isChangeable()">
                <div class="recomendation-item"v-for="(row, index) in this.service['recomendações']">
                    {{ getDescr(row) }}
                </div>
            </Fieldset>
            <Fieldset legend="Serviços recomendados" class="box-info" :toggleable="true" v-else>
                <PickList v-model="availableServices" dataKey="id" listStyle="height:330px" >
                    <template #sourceHeader>
                        Serviços Disponíveis
                    </template>
                    <template #targetHeader>
                        Serviços Selecionados
                    </template>
                    <template #item="slotProps">
                        <div class="item">{{slotProps.item.descr}}</div>
                    </template>
                </PickList>
            </Fieldset>
        </div>
        <div class="card-2" v-else>
            <div class="title-container">
                <div class="fail-title">
                    Não foi possível realizar o serviço.
                </div>
            </div>
            <Fieldset legend="Motivo" class="box-info" :toggleable="true">
                <textarea v-model="service.motivo" class="textarea" :disabled="!isChangeable()"></textarea>
            </Fieldset>
        </div>
        <div class="buttons">
            <Button @click="voltar" :width="170" class="btn font-conf-1"  background-color="var(--background-color)" textColor="var(--accent-color)" customBorder="3px solid var(--accent-color)">Voltar</Button>
            <Button class="btn font-conf-1" :width="170" @click="confirmEditar()" :disabled="!isChangeable()">Editar</Button>
            <Button class="btn font-conf-1" :width="170" backgroundColor="var(--light-red)" @click="confirmAnular()" :disabled="!isChangeable() || wasScheduled()">Anular</Button>
        </div>
     </div>
</template>

<style>
    .p-fieldset-legend,
    .p-fieldset {
        border: 2px solid v-bind(borderColor);
        background-color: var(--background-color);
        overflow-y: auto;
    }

    .p-picklist-list,
    .p-picklist-list-wrapper,
    .p-picklist-source-wrapper {
        border-radius: 10px;
        font-family: "Outfit", "Roboto", sans-serif;
        font-size: 18px;
    }
    .p-picklist-list {
        width: 220px;
    }

    .p-picklist .p-picklist-list .p-picklist-item.p-highlight {
        color: var(--background-color);
        background: var(--accent-color);
    }
</style>

<style scoped>
    #service-page {
        display: grid;
        background-color: var(--background-color);
        grid-template-areas: 
        "nav nav nav nav"
        ". . . ."
        ". card1 card2 ."
        ". buttons buttons ."
        ". . . .";
        grid-template-rows: 70px 5px auto 100px 5px;
        grid-template-columns: 4fr 20fr 20fr 4fr;
        height: 100vh;
        row-gap: 20px;
        column-gap: 20px;
    }

    .card-1 {
        grid-area: card1;
        display: grid;
        grid-template-areas: 
        "cliente"
        "veiculo"
        "info";
        background-color: #dbe8f4;
        border-radius: 20px;
        grid-template-rows: 1fr 1.3fr 1fr;
        grid-row-gap: 20px;
        border-radius: 20px;
        padding: 20px;
        overflow-y: auto;
        overflow-x: auto;
    }

    .card-1-element {
        background-color: var(--background-color);
        border-radius: 20px;
        display: grid;
        grid-template-areas: 
        "title title"
        "keys values";
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 3fr;
        grid-column-gap: 20px;
        padding: 20px;
    }

    .cliente {
        grid-area: cliente;
    }

    .veiculo {
        grid-area: veiculo;
    }

    .info {
        grid-area: info;
    }

    .card-element-title {
        display: flex;
        justify-content: center;
        align-items: center;
        grid-area: title;
        font-size: 24px;
        font-weight: 500;
    }

    .keys {
        grid-area: keys;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: end;
    }

    .values {
        grid-area: values;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: start;
    }

    .card-element-line {
        font-size: 22px;
        color: rgb(100, 108, 114);
    }

    .values-line {
        font-size: 22px;
        color: rgb(64, 64, 64);
    }

    .card-2 {
        grid-area: card2;
        display: grid;
        grid-template-areas: 
        "state-title"
        "state-info";
        grid-template-rows: 1fr 4fr;
        row-gap: 20px;
        background-color: #dbe8f4;
        border-radius: 20px;
        padding: 20px;
        overflow-y: auto;
        overflow-x: auto;
    }

    .title-container {
        display: flex;
        justify-content: center;
        align-items: center;
        grid-area: state-title;
    }

    .fail-title {
        font-size: 22px;
        font-weight: 500;
        background-color: var(--light-red);
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 20px;
        padding-right: 20px;
        color: var(--text-color-2);
        border-radius: 10px;
        margin-top: 10px;
    }

    .success-title {
        font-size: 22px;
        font-weight: 500;
        background-color: var(--accent-color);
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 20px;
        padding-right: 20px;
        color: var(--text-color-2);
        border-radius: 10px;
        margin-top: 10px;
    }

    .box-info {
        grid-area: state-info;
        font-size: 21px;
        font-family: "Outfit", sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .buttons {
        grid-area: buttons;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    .textarea {
        border: 2px dashed rgba(194, 53, 53, 0.251);
        height: 100%;
        width: 80%;
        border-radius: 20px;
        padding: 20px;
        outline: none;
        overflow: auto;
        font-size: 18px;
        font-family: "Outfit", "Roboto", sans-serif;
        margin-bottom: 20px;
    }

    .recomendation-item {
        font-size: 20px;
        font-family: "Outfit", sans-serif;
        padding: 10px;
        border-radius: 10px;
        margin-bottom: 10px;
        border: 2px dashed #d3e2f0;
        margin: 20px;
    }
</style>