<script>
    import PickList from 'primevue/picklist';

    import Stepper from 'primevue/stepper';
    import StepperPanel from 'primevue/stepperpanel';

    import { toast } from "vue3-toastify";
    import "vue3-toastify/dist/index.css";
    
    export default {
        name: 'ServicePage',
        emits: ['updateCurrentServiceId'],
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
                service: {},
                vehicle: {},
                client: {},
                serviceDefinition: {},
                optionSucess: true,
                optionFail: false,
                availableServices: [[], []],
                servicesForVehicleType: {},
                updatedAvailableServices: false,
                motivo: ''
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

                if (this.currentServiceId === this.id) {
                    console.log('current service', this.currentServiceId, this.id);
                    this.$refs.stepper.updateActiveStep({}, 1)
                    this.iniciar();
                }

            },
            voltar() {
                this.$router.go(-1);
            },
            async iniciar() {
                this.$emit('updateCurrentServiceId', this.id)

                if (!this.updatedAvailableServices) {
                    let vehicleType = this.vehicle['vehicle-typeId'];

                    try {
                        const response = await fetch('http://localhost:3000/vehicle-types/' + vehicleType);
                        const data = await response.json();
                        this.servicesForVehicleType = data;
                    } catch (error) {
                        console.error(error);
                        this.errorMessage('Erro ao carregar tipos de veículos');
                        return;
                    }

                    this.availableServices = [[], []];

                    for (let i = 0; i < this.servicesForVehicleType['serviços'].length; i++) {
                        let item = {}
                        item.id = this.servicesForVehicleType['serviços'][i];

                        try {
                            const response = await fetch('http://localhost:3000/service-definitions/' + item.id);
                            const data = await response.json();
                            item.definition = data.descr;
                            this.availableServices[0].push(item);
                        } catch (error) {
                            console.error(error);
                            this.errorMessage('Erro ao carregar definições de serviço');
                            return;
                        }
                    }
                }

                this.$refs.stepper.updateActiveStep({}, 1)
            },
            confirmarIniciar() {
                this.$refs.modalDialog.updateMessage('Tem a certeza que deseja iniciar o serviço?');
                this.$refs.modalDialog.updateAction('Iniciar');
                this.$refs.modalDialog.open();
            },
            confirmarTerminar() {
                this.$refs.modalDialog.updateMessage('Tem a certeza que deseja terminar o serviço?');
                this.$refs.modalDialog.updateAction('Terminar');
                this.$refs.modalDialog.open();
            },
            confirmarRemover() {
                this.$refs.modalDialog.updateMessage('Tem a certeza que deseja remover o serviço?');
                this.$refs.modalDialog.updateAction('Remover');
                this.$refs.modalDialog.open();
            },
            isCurrentService() {
                return this.currentServiceId === this.id;
            },
            alreadyStartedAService() {
                return this.currentServiceId !== '';
            },
            async terminar() {
                let date = new Date();
                let estado = this.optionSucess ? 'realizado' : 'cancelado';
                console.log(this.availableServices[1]);
                fetch('http://localhost:3000/services/' + this.currentServiceId, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        estado: estado,
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
                        motivo: this.optionFail ? this.motivo : ''
                    })
                })

                this.$emit('updateCurrentServiceId', "")
                this.$router.go(-1);
            },
            async remover() {

                fetch('http://localhost:3000/mechanics/' + this.m_id, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ids_serviços: [this.id]
                    })
                })
                
                this.$emit('updateCurrentServiceId', "")
                this.$router.go(-1);
            },
            handleCheckboxChange(option) {
                if (option === true) { // success
                    this.optionFail = false;
                } else { // fail
                    this.optionSucess = false;
                }
            },
            parseAction(action) {
                if (action === 'Iniciar') {
                    console.log('iniicar');
                    this.iniciar();
                } else if (action === 'Terminar') {
                    console.log('terminar');
                    this.terminar();
                } else if (action === 'Remover') {
                    console.log('remover');
                    this.remover();
                }
            }
        },
        async mounted() {
            await this.init();
        },
        components: {
            PickList,
            Stepper,
            StepperPanel
        }
    }
</script>


<template>
    <ModalConfirmDialog ref="modalDialog" @action="parseAction"></ModalConfirmDialog>
    <div id="service-page">
        <HeaderSection :title="'Serviço ' + id" :currentServiceId="currentServiceId"/>
        <div class="stepper-card">
            <Stepper ref="stepper" linear>
                <StepperPanel header="Iniciar">
                    <template #content="{ nextCallback }">
                        <div class="stepper-inside">
                            <div class="card">
                                <div class="cliente card-element">
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
                                <div class="veiculo card-element">
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
                                <div class="info card-element">
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

                            <div class="buttons">
                                <Button @click="voltar" :width="170" class="btn font-conf-1"  background-color="var(--background-color)" textColor="var(--accent-color)" customBorder="3px solid var(--accent-color)">Voltar</Button>
                                <Button class="btn font-conf-1" :width="170" @click="confirmarIniciar()" :disabled="alreadyStartedAService()">Iniciar</Button>
                                <Button class="btn font-conf-1" :width="170" backgroundColor="var(--light-red)" @click="confirmarRemover()" :disabled="alreadyStartedAService()">Remover</Button> 
                            </div>
                        </div>
                    </template>
                </StepperPanel>
                <StepperPanel header="Terminar">
                    <template #content="{ prevCallback }">
                        <div class="stepper-inside">
                            <div class="card-terminar">
                                <div class="card-element-terminar">
                                    <div class="pretty p-default p-round p-smooth">
                                        <input type="checkbox" v-model="optionSucess" @change="handleCheckboxChange(true)"/>
                                        <div class="state p-primary">
                                            <label>Serviço foi realizado com sucesso</label>
                                        </div>
                                    </div>
                                    <div></div>
                                    <div class="pretty p-default p-round p-smooth">
                                        <input type="checkbox" v-model="optionFail" @change="handleCheckboxChange(false)"/>
                                        <div class="state p-danger-o">
                                            <label>Não foi possível realizar o serviço</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-element-terminar" v-if="optionSucess">
                                    <div class="element-title">Adicionar recomendações</div>
                                    <PickList v-model="availableServices" dataKey="id" listStyle="height:330px" >
                                        <template #sourceHeader>
                                            Serviços Disponíveis
                                        </template>
                                        <template #targetHeader>
                                            Serviços Selecionados
                                        </template>
                                        <template #item="slotProps">
                                            <div class="item">{{slotProps.item.definition}}</div>
                                        </template>
                                    </PickList>
                                </div>
                                <div class="card-element-terminar" v-if="optionFail">
                                    <div class="element-title">Motivo</div>
                                    <textarea v-model="motivo" class="textarea"></textarea>
                                </div>
                            </div>
                                
                            <div class="buttons">
                                <Button @click="voltar" :width="170" class="btn font-conf-1" background-color="var(--background-color)" textColor="var(--accent-color)" customBorder="3px solid var(--accent-color)">Voltar</Button>
                                <Button class="btn font-conf-1" :width="170" @click="confirmarTerminar()">Terminar</Button>
                            </div>
                        </div>
                    </template>
                </StepperPanel>
            </Stepper>
        </div>
    </div>
</template>



<style>
    .p-picklist-list,
    .p-picklist-list-wrapper,
    .p-picklist-source-wrapper {
        border-radius: 10px;
        font-family: "Outfit", "Roboto", sans-serif;
        font-size: 18px;
    }
    .p-picklist-list {
        width: 300px;
    }

    .p-picklist .p-picklist-list .p-picklist-item.p-highlight {
        color: var(--background-color);
        background: var(--accent-color);
    }

    .p-stepper {
        width: 100%;
    }

    .p-stepper .p-stepper-header .p-stepper-action {
        background-color: #dbe8f4;
        font-size: 22px;
        font-family: "Outfit", "Roboto", sans-serif;
    }

    .p-stepper .p-stepper-header.p-highlight .p-stepper-title {
        color: var(--accent-color);
    }

    .p-stepper-number {
        font-size: 18px;
        font-family: "Outfit", "Roboto", sans-serif;
        color: var(--accent-color);
    }

    .p-stepper-panels {
        background-color: #dbe8f400;
        border-radius: 20px;
        padding: 0px;
        margin: 0px;
    }

    .p-stepper-separator {
        background-color: var(--accent-color-2)
    }

    .p-stepper-action {
        padding: 3px;
        padding-right: 10px;
    }
</style>

<style scoped>
    @import '../assets/pretty-checkbox.min.css';

    .textarea {
        border: 2px solid #dbe8f4;
        height: 80%;
        width: 80%;
        border-radius: 20px;
        padding: 20px;
        outline: none;
        overflow: auto;
        font-size: 18px;
        font-family: "Outfit", "Roboto", sans-serif;
        margin-bottom: 20px;
    }

    .stepper-card {
        grid-area: stepper;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .stepper-inside {
        display: grid;
        grid-template-areas: 
        "pannel"
        "buttons";   
        grid-template-rows: 640px 100px;
    }

    .element-title {
        text-decoration-line: underline;
    }

    #service-page {
        display: grid;
        background-color: var(--background-color);
        grid-template-areas: 
        "nav nav nav"
        ". . ."
        ". stepper ."
        ". . .";
        grid-template-rows: 70px 10px auto 20px;
        grid-template-columns: 4fr 12fr 4fr;
        height: 100vh;
    }

    .buttons {
        margin-top: 25px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        grid-area: buttons;
    }

    .card-terminar {
        grid-area: pannel;
        display: grid;
        grid-template-areas:
        "estado"
        "extra";
        grid-template-rows: 1fr 3fr;
        grid-row-gap: 20px;
        background-color: #dbe8f4;
        border-radius: 20px;
        padding: 20px;
        overflow-y: auto;
        margin-bottom: 10px;
    }

    .card-element-terminar {
        background-color: var(--background-color);
        border-radius: 20px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        font-size: 22px;
        row-gap: 5px;
    }

    .card {
        grid-area: pannel;
        display: grid;
        grid-template-areas:
        "cliente"
        "veiculo"
        "info";
        grid-template-rows: 1fr 1.3fr 1fr;
        grid-row-gap: 20px;
        background-color: #dbe8f4;
        border-radius: 20px;
        padding: 20px;
        overflow-y: auto;
    }

    .card-element {
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

    .card-element-title {
        display: flex;
        justify-content: center;
        align-items: center;
        grid-area: title;
        font-size: 24px;
        font-weight: 500;
        font-family: "Outfit", "Roboto", sans-serif;
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
        font-family: "Outfit", "Roboto", sans-serif;
    }

    .values-line {
        font-size: 22px;
        color: rgb(64, 64, 64);
    }

    .cliente {
        grid-area: cliente;
    }

    .cliente-info {
        width: 100%;
    }

    .veiculo {
        grid-area: veiculo;
    }

    .info {
        grid-area: info;
    }

    .btn {
        margin-right: 5px;
        margin-left: 5px;
    }
</style>