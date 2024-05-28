<script>
export default {
    name: 'ESIdeal',
    data() {
        return {
            m_id: 'm1', // by default (for testing purposes)
            m_especialidades: ['geral'], // by default (for testing purposes)
            dt_language: {
                lengthMenu: "Mostrar _MENU_ registos por página",
                zeroRecords: "Nenhum registo encontrado",
                info: "Página _PAGE_ de _PAGES_",
                infoEmpty: "Sem registos disponíveis",
                infoFiltered: "(filtrado de _MAX_ registos)",
                search: "Procurar: ",
                select: {
                    rows: {
                        _: "Serviço selecionado",
                        0: "Nenhum serviço selecionado",
                    }
                }
            },
            currentServiceId: ''
        }
    },
    methods: {
        updateMecanicoID(m_id) {
            this.m_id = m_id;
        },
        updateMecanicoEspecialidades(especialidades) {
            this.m_especialidades = especialidades;
        },
        updateCurrentServiceId(service) {
            this.currentServiceId = service;
        }
    }
}
</script>

<template>
    <router-view 
        @updateMecanicoID="updateMecanicoID" 
        @updateMecanicoEspecialidades="updateMecanicoEspecialidades"
        @updateCurrentServiceId="updateCurrentServiceId"
        :currentServiceId="currentServiceId"
        :m_id="m_id" 
        :m_especialidades="m_especialidades" 
        :dt_language="dt_language" 
    />
</template>
