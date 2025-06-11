<template>
    <div class="col-lg-8 card-wrapper" >
        <b-form @submit="onSubmitForm">
        <div class="card">
            <div class="card-body" v-if="isLoaded">
                <b-alert
                    v-model="onEvent.show"
                    :variant="onEvent.variant"
                    dismissible
                >
                    {{ onEvent.message }}
                </b-alert>
                <div v-for="(input, index) in inputForm" :key="index" >
                    <b-form-group
                        v-if="input.type != 'select' && input.type != 'textarea'"
                    >
                        <label :for="input.name" class="d-block mb-0 mr-2">{{ input.label }}</label>
                        <p v-if="input.name == 'timer'" class="text-muted text-sm mb-2">{{ input.description }}</p>

                        <b-form-input
                            v-model="input.value"
                            :id="input.name"
                            :value="input.value"
                            :type="input.type"
                            :placeholder="input.placeholder"
                            :required='input.required'
                            min="0"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group v-if="input.name == 'associatedFileExtension'">
                        <div class="d-flex align-items-center justify-content-between">
                            <label>Pilih Bahasa Active*</label>
                            <b-button v-if="!isHtmlSelected" variant="transparent" :class="[`py-1 px-2`, isChooseAll ? `text-danger` : `text-primary`]" @click="chooseAll" style="box-shadow: none;">{{isChooseAll ? 'Hapus Semua' : 'Pilih Semua'}}</b-button>
                        </div>
                        <div id="city-selected">
                            <div class="mb-3 row">
                                <template v-for="(item, index) in ext">
                                    <div :key="index" class="col col-lg-4 mb-3">
                                        <div
                                            v-if="selectedExt.length === 0 || (!isHtmlSelected && item.value !== 'html') || (isHtmlSelected && item.value === 'html')"
                                            :class="['city-card', item.selected ? 'selected' : '']"
                                        >
                                                <span class="program" @click="setSelectedLang(item.value, index, null)">{{item.text}}</span>
                                        </div>
                                        <div v-else :class="['city-card', item.selected ? 'selected' : '']"><span class="program">{{item.text}}</span></div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </b-form-group>

                    <b-form-group
                        v-if="input.name == 'type'"
                        label="Tipe File*"
                        label-for=""
                    >
                        <div id="city-selected">
                            <div class="mb-3 row">
                            <div v-for="(item, index) in fileType" :key="index" class="col col-lg-4">
                                <div :class="['city-card', item.selected ? 'selected' : '']"><span class="program" @click="setSelectedFileType(item.id, index)">{{item.value | capitalize}}</span></div>
                            </div>
                        </div>
                        </div>
                    </b-form-group>
                </div>
            </div>
            <div class="text-center card-body" v-else>
                <b-spinner label="Spinning"></b-spinner>
            </div>
        </div>

        <div class="card" v-if="selectedExt.length != 0">
            <div class="card-header" style="padding: 0 !important">
                <ul class="nav nav-tabs">
                    <li v-for="(item, index) in selectedExt" class="nav-item" :key="index" @click="toggleTab(item.value)">
                        <div :class="`nav-link ${isTabActive == item.value ? 'active' : ''}`" style="border-top-left-radius: 0.2rem; border-top-right-radius: 0.2rem; padding: 8px 24px; cursor: pointer;"><strong v-if="isTabActive == item.value">{{item.text}}</strong><p v-else class="m-0">{{item.text}}</p></div>
                    </li>
                </ul>
            </div>
            <div class="card-body" style="padding: 0; overflow: hidden;">
                <div class="accordion" role="tablist">
                    <template v-for="(item, index) in dataTab">
                        <b-card
                            v-if="item.value == isTabActive && !isHtmlSelected"
                            no-body
                            :key="`accordion-1-${index}`"
                            class="mb-0"
                            style="box-shadow: none;
                            border-bottom: 1px solid rgba(0, 0, 0, .05);"
                        >
                            <b-card-header header-tag="header" class="p-0" role="tab">
                                <b-button
                                    block
                                    v-b-toggle.accordion-1
                                    variant="light"
                                    style="overflow-anchor: none;
                                    background-color: #f8f9fe !important;
                                    color: rgb(33, 37, 41) !important;
                                    border: none;
                                    box-shadow: none;
                                    text-align: left;"
                                >
                                    <p style="color: inherit; margin: 0;">Test Code</p>
                                </b-button>
                            </b-card-header>

                            <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
                                <b-card-body class="p-0">
                                    <!-- <MonacoEditor
                                        width="100%"
                                        height="300"
                                        automaticLayout="true"
                                        theme="vs-light"
                                        :language="item.language"
                                        :options="options"
                                        :value="item.testCode"
                                        v-model="item.testCode"
                                    ></MonacoEditor> -->

                                    <CodeEditor
                                        width="100%"
                                        height="300"
                                        v-model="item.testCode"
                                        :lang="item.language"
                                        theme="chrome"
                                        :options="options"
                                        @init="editorInit"
                                    />
                                </b-card-body>
                            </b-collapse>
                        </b-card>

                        <b-card
                            no-body
                            v-if="item.value == isTabActive && !isHtmlSelected"
                            :key="`accordion-2-${index}`"
                            class="mb-0"
                            style="box-shadow: none;
                            border-bottom: 1px solid rgba(0, 0, 0, .05);"
                        >
                            <b-card-header header-tag="header" class="p-0" role="tab">
                                <b-button block v-b-toggle.accordion-2 variant="light" style="overflow-anchor: none;
                                background-color: #f8f9fe !important;
                                color: rgb(33, 37, 41) !important;
                                border: none;
                                box-shadow: none;
                                text-align: left;">
                                    <p style="color: inherit; margin: 0;">Parameters</p>
                                </b-button>
                            </b-card-header>

                            <b-collapse id="accordion-2" visible accordion="my-accordion" role="tabpanel">
                                <b-card-body>
                                    <b-form @submit="toggleParameters">
                                        <div v-for="(paramItem, paramIndex) in parameters" :key="paramIndex" :class="[`row align-items-end mb-3`]">

                                            <div class="col-3">

                                                <b-form-group
                                                    style="margin-bottom: 0;"
                                                >
                                                    <b-form-select
                                                    :id="`select-params-${index}-${paramIndex}`"
                                                    v-model="paramItem.type"
                                                    :options="paramsType"
                                                    @change="onChangeParameters(false)"
                                                    style="box-shadow: 0 3px 2px rgba(233, 236, 239, .05);">
                                                    </b-form-select>
                                                </b-form-group>

                                            </div>
                                            <div class="col-8">

                                                <b-form-group
                                                    style="margin-bottom: 0;"
                                                >
                                                    <b-form-input
                                                        :id="`name-params-${index}-${paramIndex}`"
                                                        placeholder="Name"
                                                        v-model="paramItem.name"
                                                        :value="paramItem.name"
                                                        type="text"
                                                        @change="onChangeParameters(false)"
                                                    ></b-form-input>
                                                </b-form-group>

                                            </div>
                                            <div class="col-1 text-center">
                                                <i class="fas fa-trash mb-3" style="cursor: pointer;" @click="toggleParameters(index, paramIndex, 'remove')"></i>
                                            </div>
                                        </div>
                                        <p v-if="parametersMessage != ''" class="w-100 text-center text-danger">{{parametersMessage}}</p>
                                        <b-button class="w-100 text-center mb-2" style="background-color: #525f7f" @click="toggleParameters(index, null, 'add')">Tambah</b-button>
                                    </b-form>
                                </b-card-body>
                            </b-collapse>
                        </b-card>

                        <b-card
                            no-body
                            v-if="item.value == isTabActive && !isHtmlSelected"
                            :key="`accordion-3-${index}`"
                            class="mb-0"
                            style="box-shadow: none;
                            border-bottom: 1px solid rgba(0, 0, 0, .05);"
                        >
                            <b-card-header header-tag="header" class="p-0" role="tab">
                                <b-button block v-b-toggle.accordion-3 variant="light" style="overflow-anchor: none;
                                background-color: #f8f9fe !important;
                                color: rgb(33, 37, 41) !important;
                                border: none;
                                box-shadow: none;
                                text-align: left;">
                                    <p style="color: inherit; margin: 0;">Test Case</p>
                                </b-button>
                            </b-card-header>

                            <b-collapse id="accordion-3" visible accordion="my-accordion" role="tabpanel">
                                <b-card-body class="px-4 py-3">
                                    <div class="row">
                                        <div v-for="(caseItem, caseIndex) in testCase" :key="caseIndex" class="col-6">
                                            <div class="card">
                                                <div class="header" style="padding: 12px; border-bottom: 1px solid rgba(0, 0, 0, .05);">
                                                    <div class="d-flex align-items-center justify-content-between">
                                                        <strong>Test {{caseIndex + 1}}</strong>
                                                        <i class="fas fa-trash" style="cursor: pointer;" @click="toggleCase(index, caseIndex, 'remove')"></i>
                                                    </div>
                                                </div>
                                                <div class="card-body">

                                                    <template v-for="(parameterItem, parameterIndex) in caseItem.parameters">
                                                        <div :key="parameterIndex">
                                                            <b-form-group :class="parameterIndex == (caseItem.parameters.length - 1) ?'mb-0':''">
                                                                <b-form-select
                                                                    v-if="parameterItem.type == 'boolean'"
                                                                    :id="`case-params-${caseIndex}-${parameterIndex}`"
                                                                    v-model="parameterItem.value"
                                                                    :options="[
                                                                        {disabled: true, value: '', text: `--${parameterItem.holder == '' ? 'Params' : parameterItem.holder}--`},
                                                                        {value: 'true', text: 'True'},
                                                                        {value: 'false', text: 'False'}
                                                                        ]"
                                                                    style="box-shadow: 0 3px 2px rgba(233, 236, 239, .05);">

                                                                </b-form-select>
                                                                <b-form-input
                                                                    v-else
                                                                    :id="`case-params-${index}-${caseIndex}-${parameterIndex}`"
                                                                    :placeholder="parameterItem.holder == '' ? 'Params' : parameterItem.holder"
                                                                    v-model="parameterItem.value"
                                                                    :step="parameterItem.type == 'number' ? 0.01 : false"
                                                                    :value="parameterItem.value"
                                                                    :type="parameterItem.type == '' || parameterItem.type == 'string' || parameterItem.type == 'array' ? 'text' : parameterItem.type"
                                                                    @change="onChangeCase(index)"
                                                                ></b-form-input>
                                                            </b-form-group>
                                                        </div>
                                                    </template>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <b-button v-if="parameters.length > 0" class="w-100 text-center mb-2" style="background-color: #525f7f" @click="toggleCase(index, null, 'add')">Tambah</b-button>
                                    <p v-else class="m-0 text-muted">Tambahkan parameter terlebih dahulu</p>
                                </b-card-body>
                            </b-collapse>
                        </b-card>

                        <b-card
                            no-body v-if="item.value == isTabActive"
                            :key="`accordion-4-${index}`"
                            class="mb--1"
                            style="box-shadow: none;
                            border-bottom: 1px solid rgba(0, 0, 0, .05);"
                        >
                            <b-card-header header-tag="header" class="p-0" role="tab">
                                <b-button block v-b-toggle.accordion-4 variant="light" style="overflow-anchor: none;
                                background-color: #f8f9fe !important;
                                color: rgb(33, 37, 41) !important;
                                border: none;
                                box-shadow: none;
                                text-align: left;">
                                    <p style="color: inherit; margin: 0;">Template Code {{ isHtmlSelected ? 'HTML' : '' }}</p>
                                </b-button>
                            </b-card-header>

                            <b-collapse id="accordion-4" visible accordion="my-accordion" role="tabpanel">
                                <b-card-body class="p-0">

                                    <!-- <MonacoEditor
                                        width="100%"
                                        height="300"
                                        automaticLayout="true"
                                        theme="vs-light"
                                        :language="item.language"
                                        :options="options"
                                        :value="item.templateCode"
                                        v-model="item.templateCode"
                                    ></MonacoEditor> -->

                                    <CodeEditor
                                        width="100%"
                                        height="300"
                                        v-model="item.templateCode"
                                        :lang="item.language"
                                        theme="chrome"
                                        :options="options"
                                        @init="editorInit"
                                    />

                                </b-card-body>
                            </b-collapse>
                        </b-card>

                        <b-card
                            no-body v-if="item.value == isTabActive && isHtmlSelected"
                            :key="`accordion-css-${index}`"
                            class="mb--1"
                            style="box-shadow: none;
                            border-bottom: 1px solid rgba(0, 0, 0, .05);"
                        >
                            <b-card-header header-tag="header" class="p-0" role="tab">
                                <b-button block v-b-toggle.accordion-css variant="light" style="overflow-anchor: none;
                                background-color: #f8f9fe !important;
                                color: rgb(33, 37, 41) !important;
                                border: none;
                                box-shadow: none;
                                text-align: left;">
                                    <p style="color: inherit; margin: 0;">Template Code {{ isHtmlSelected ? 'CSS' : '' }}</p>
                                </b-button>
                            </b-card-header>

                            <b-collapse id="accordion-css" visible accordion="my-accordion" role="tabpanel">
                                <b-card-body class="p-0">

                                    <!-- <MonacoEditor
                                        width="100%"
                                        height="300"
                                        automaticLayout="true"
                                        theme="vs-light"
                                        :language="item.language"
                                        :options="options"
                                        :value="item.templateCode"
                                        v-model="item.templateCode"
                                    ></MonacoEditor> -->

                                    <CodeEditor
                                        width="100%"
                                        height="300"
                                        v-model="item.templateCodeCSS"
                                        lang="css"
                                        theme="chrome"
                                        :options="options"
                                        @init="editorInit"
                                    />

                                </b-card-body>
                            </b-collapse>
                        </b-card>

                        <b-card
                            no-body v-if="item.value == isTabActive && isHtmlSelected"
                            :key="`accordion-js-${index}`"
                            class="mb--1"
                            style="box-shadow: none;
                            border-bottom: 1px solid rgba(0, 0, 0, .05);"
                        >
                            <b-card-header header-tag="header" class="p-0" role="tab">
                                <b-button block v-b-toggle.accordion-js variant="light" style="overflow-anchor: none;
                                background-color: #f8f9fe !important;
                                color: rgb(33, 37, 41) !important;
                                border: none;
                                box-shadow: none;
                                text-align: left;">
                                    <p style="color: inherit; margin: 0;">Template Code {{ isHtmlSelected ? 'JavaScript' : '' }}</p>
                                </b-button>
                            </b-card-header>

                            <b-collapse id="accordion-js" visible accordion="my-accordion" role="tabpanel">
                                <b-card-body class="p-0">

                                    <!-- <MonacoEditor
                                        width="100%"
                                        height="300"
                                        automaticLayout="true"
                                        theme="vs-light"
                                        :language="item.language"
                                        :options="options"
                                        :value="item.templateCode"
                                        v-model="item.templateCode"
                                    ></MonacoEditor> -->

                                    <CodeEditor
                                        width="100%"
                                        height="300"
                                        v-model="item.templateCodeJS"
                                        lang="javascript"
                                        theme="chrome"
                                        :options="options"
                                        @init="editorInit"
                                    />

                                </b-card-body>
                            </b-collapse>
                        </b-card>

                        <b-card
                            no-body v-if="item.value == isTabActive && studioVersion == 2 && !isHtmlSelected"
                            :key="`accordion-5-${index}`"
                            class="mb--1"
                            style="box-shadow: none;
                            border-bottom: 1px solid rgba(0, 0, 0, .05);"
                        >
                            <b-card-header header-tag="header" class="p-0" role="tab">
                                <b-button block v-b-toggle.accordion-5 variant="light" style="overflow-anchor: none;
                                background-color: #f8f9fe !important;
                                color: rgb(33, 37, 41) !important;
                                border: none;
                                box-shadow: none;
                                text-align: left;">
                                    <p style="color: inherit; margin: 0;">Correction Code</p>
                                </b-button>
                            </b-card-header>

                            <b-collapse id="accordion-5" visible accordion="my-accordion" role="tabpanel">
                                <b-card-body class="p-0">

                                    <CodeEditor
                                        width="100%"
                                        height="300"
                                        v-model="item.correctCodeTemplate"
                                        :lang="item.language"
                                        theme="chrome"
                                        :options="options"
                                        @init="editorInit"
                                    />

                                </b-card-body>
                            </b-collapse>
                        </b-card>
                    </template>
                </div>
            </div>
        </div>

        <div v-if="isLoaded" class="card">
            <div class="card-body">
                <div v-if="!isSubmit">
                    <b-button type="submit" variant="primary">Submit</b-button>
                    <b-button type="reset" variant="danger" @click="onResetForm">Reset</b-button>
                </div>
                <div v-else class="text-center">
                    <b-spinner label="Spinning"></b-spinner>
                </div>
            </div>
        </div>
    </b-form>
    </div>
</template>

<script>
import fieldForm from '@/store/global/studio'
// import MonacoEditor from 'monaco-editor-vue';

import { toDecrypt } from '~/commons/utils'

export default {
    layout: 'dashboard',
    components: {
        // MonacoEditor,
        CodeEditor: require('vue2-ace-editor')
    },
    data() {
        return {
            action: '',
            title: '',
            studioId: null,
            moduleId: null,

            submitted: false,
            isLoaded: false,
            isSubmit: false,
            isChooseAll: false,

            onEvent: {
                message: '',
                status: true,
                show: false,
                variant: ''
            },

            inputForm: [],
            course: [],
            fileType: [
                {
                    id: 1,
                    value: 'text',
                    selected: false,
                },
                {
                    id: 2,
                    value: 'slide',
                    selected: false,
                },
            ],
            selectedFileType: [],

            ext: [],
            selectedExt: [],

            refreshCard: false,
            isTabActive: null,
            tabActiveIndex: null,
            dataTab: [],
            parametersMessage: "",
            parameters: [],
            paramsType: [
                {
                    disabled: true,
                    text: "Select Type",
                    value: "",
                },
                {
                    text: "String",
                    value: "string",
                },
                {
                    text: "Number",
                    value: "number",
                },
                {
                    text: "Boolean",
                    value: "boolean",
                },
                {
                    text: "Array",
                    value: "array",
                },
            ],
            testCase: [],
            // Monaco
            options: {
                minimap: {
                    enabled: false
                },
                readOnly: false,
            },

            studioVersion: 2,
        }
    },
    filters: {
        capitalize: function (value) {

            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)

        },
    },
    created() {
        this.getCredentials()
    },
    computed: {
        isHtmlSelected: function() {
            return this.selectedExt.find(ext => ext.value === 'html') 
        }
    },
    methods: {
        editorInit() {
            require('brace/ext/language_tools')

            require('brace/mode/html')
            require('brace/mode/javascript')
            require('brace/mode/csharp')
            require('brace/mode/dart')
            require('brace/mode/golang')
            require('brace/mode/java')
            require('brace/mode/kotlin')
            require('brace/mode/php')
            require('brace/mode/python')
            require('brace/mode/ruby')
            require('brace/mode/swift')
            require('brace/mode/typescript')
            require('brace/mode/vbscript')

            require('brace/snippets/html')
            require('brace/snippets/javascript')
            require('brace/snippets/csharp')
            require('brace/snippets/dart')
            require('brace/snippets/golang')
            require('brace/snippets/java')
            require('brace/snippets/kotlin')
            require('brace/snippets/php')
            require('brace/snippets/python')
            require('brace/snippets/ruby')
            require('brace/snippets/swift')
            require('brace/snippets/typescript')
            require('brace/snippets/vbscript')

            require('brace/theme/chrome')
        },
        chooseAll() {

            this.selectedExt = []
            this.dataTab = []
            this.ext.map((item, index) => {
                if (item.value !== 'html') {
                    item.selected = this.isChooseAll
                    this.setSelectedLang(item.value, index, null)
                }
            })
            this.isChooseAll = !this.isChooseAll

        },
        toggleTab(id) {

            this.isTabActive = id
            this.dataTab.map((item, index) => {

                if(item.value == id) this.tabActiveIndex = index

            })

        },
        toggleParameters(index, paramIndex, type) {
            if (type == "add") {

                if (this.parameters.length > 0) {

                    const type = this.parameters.find((item) => item.type == "")
                    const name = this.parameters.find((item) => item.name == "")

                    if (type || name) return this.parametersMessage = "Semua field harus diisi"

                }

                this.parameters.push({type: this.paramsType[0].value, name: ""})
                if (this.testCase.length == 0) {

                    var parametersArray = []
                    this.parameters.map((item, index) => {

                        const object = {
                            holder: "",
                            value: "",
                            type: "",
                        }

                        parametersArray.push(object)

                    })

                    this.testCase.push({parameters: parametersArray, expect: ""})

                } else {

                    this.testCase.map((item, index) => {

                        const object = {
                            holder: "",
                            value: "",
                            type: "",
                        }

                        this.testCase[index].parameters.push(object)

                    })

                }
            } else {

                this.testCase.map((item, ii) => {
                    this.testCase[ii].parameters.splice(paramIndex, 1)
                })

                this.parameters.splice(paramIndex, 1)

                if (this.parameters.length == 0) this.testCase = []

            }
            this.onChangeCase(index)
            // this.onChangeParameters(false)
        },
        toggleCase(index, caseIndex, type) {
            if (type == "add") {

                var parametersArray = []

                this.parameters.map((item, index) => {

                    const object = {
                        holder: item.name ?? 'Params',
                        value: "",
                        type: item.type == 'string' || item.type == 'array' ? 'text' : item.type,
                    }
                    parametersArray.push(object)

                })

                this.testCase.push({parameters: parametersArray, expect: ""})

            } else this.testCase.splice(caseIndex, 1)
            this.onChangeCase(index)
        },
        onChangeParameters(payload) {
            // console.log("PARAM: ", index)
            this.testCase.map((data, ii) => {
                this.parameters.map((item, i) => {

                    if ((this.testCase[ii].parameters[i].type != (item.type == 'string' || item.type == 'array' ? 'text' : item.type) && !payload)) {
                        this.testCase[ii].parameters[i].value = ""
                    }

                    this.testCase[ii].parameters[i].holder = item.name == "" ? 'Params' : item.name
                    this.testCase[ii].parameters[i].type = item.type == 'string' || item.type == 'array' ? 'text' : item.type

                })
            })

            // this.dataTab[index].parameters = this.parameters
            this.parametersMessage = ""
        },
        onChangeCase(index) {
            // console.log("CASE: ", index)
            // this.dataTab[index].testCase = this.testCase
        },
        setSelectedLang(id, i, data) {
            const studioData = this.$store.state.Studio?.studio?.template ?? [];
            this.refreshCard = true
            var backup = this.selectedExt
            this.selectedExt = []

            this.ext.map((ext, index) => {
                if(ext.value == id) {

                    this.ext[index].selected = !this.ext[index].selected

                    if(this.ext[index].selected == true) {

                        var addExt = this.ext[index]

                        backup.push(addExt)
                        this.selectedExt = backup

                        var objectTab = this.ext[index]

                        var textCode = null

                        const foundExt = this.ext.find((item) => item.value === id)

                        if (foundExt) textCode = foundExt.default

                        objectTab['templateCode'] = data != null ? data.template ?? textCode.templateCode : textCode.templateCode
                        objectTab['templateCodeCSS'] = studioData.find(_item => _item.ext === 'css')?.code ?? ''
                        objectTab['templateCodeJS'] = studioData.find(_item => _item.ext === 'js')?.code ?? ''
                        objectTab['testCode'] = data != null ? data.test ?? textCode.testCode : textCode.testCode

                        if (this.studioVersion == 2) {
                            objectTab['correctCodeTemplate'] = data != null ? data?.correctCodeTemplate ?? textCode.correctCodeTemplate : textCode.correctCodeTemplate
                        }

                        this.dataTab.push(objectTab)

                    } else if(this.ext[index].selected == false) {

                        backup.map((item, i) => {

                            if(item.value != id) this.selectedExt.push(item)
                            else this.dataTab.splice(i, 1)

                        })

                    }

                }
            })

            if (this.selectedExt.length != 0) {

                this.toggleTab(this.selectedExt[this.selectedExt.length - 1].value)

            } else {

                this.parameters = []
                this.testCase = []

            }

            this.refreshCard = false
        },
        setEvent(message, status){
            window.scrollTo(0,0)
            this.onEvent.message = message
            this.onEvent.status = status
            this.onEvent.variant = status == true ? 'success' : 'warning'
            this.onEvent.show = true
        },
        countDownChanged() {
            this.onEvent.alertCounter = 10
        },
        getCredentials() {
            const url = this.$router.currentRoute.fullPath

            var res = url.split('/')
            res.shift()

            this.title = res[1].toLowerCase()
            this.action = res[2].toLowerCase()
            this.studioId = toDecrypt(localStorage.getItem('studioId')) || res[3]
            // this.moduleId = res[5]

            this.fetchExt()
        },
        async fetchExt() {
            await this.$store.dispatch('Studio/extenstions', this.studioVersion).then(() => {
                var stateStudio = this.$store.state.Studio

                if (!stateStudio.status) {

                    console.log('Failed to fetch extension', stateStudio.message)
                    this.setEvent(stateStudio.message, stateCourse.status)
                    this.isLoaded = true

                } else {
                    var array = []

                    stateStudio.data.map((item) => {
                        var object = {
                            value: item.ext,
                            language: item.name,
                            text: item.displayName,
                            selected: false,
                            default: item.default
                        }
                        object.default['correctCodeTemplate'] = item.default?.templateCode
                        array.push(object)
                    })

                    this.ext = array
                    this.fetchForm()
                }
            })
        },
        fetchForm() {
            this.inputForm = fieldForm.inputFormStudio

            if(this.action == 'edit') {

                this.onResetForm()
                this.fetchStudioDetail()

            } else {

                this.onResetForm()
                this.isLoaded = true

            }
        },
        async fetchStudioDetail() {
            await this.$store.dispatch('Studio/studio', this.studioId)
            .then(() => {
                var stateStudio = this.$store.state.Studio

                if(!stateStudio.status) {

                    console.log('Failed get studio', stateStudio.message)
                    this.isLoaded = true

                } else {

                    const dataDetail = stateStudio.studio
                    this.studioVersion = dataDetail?.version
                    this.inputForm.map((item, index) => {

                        if(item.name == 'name') this.inputForm[index].value = dataDetail.name

                        if(item.name == 'module') this.inputForm[index].value = dataDetail.module

                        if(item.name == 'timer') this.inputForm[index].value = dataDetail.timer

                        if(item.name == 'associatedFileExtension') {
                            var codeValue = []

                            if (dataDetail.template) {

                                dataDetail.template.map((data, i) => {
                                    codeValue.push({ext: "", template: "", test: "", correctCodeTemplate: ""})
                                    codeValue[i].ext = data.ext
                                    codeValue[i].template = data.code
                                })

                            }
                            if (dataDetail.testCodeTemplate) {

                                dataDetail.testCodeTemplate.map((data, i) => {
                                    codeValue[i].test = data.code
                                })

                            }

                            if (dataDetail.correctCodeTemplate) {
                                dataDetail.correctCodeTemplate.map((data, i) => {
                                    codeValue[i].correctCodeTemplate = data.code
                                })
                            }

                            const isHtml = codeValue.find(item => item.ext === 'html')
                            codeValue.map((item, index) => {

                                if (!isHtml || item.ext === 'html') this.setSelectedLang(item.ext, index, item)

                            })

                            if (dataDetail.parameters) {

                                this.parameters = dataDetail.parameters
                                dataDetail.testCase.map((item, index) => {

                                    var objectCase = {
                                        expect: item.expect,
                                        parameters: []
                                    }

                                    item.map((param, i) => {
                                        objectCase.parameters.push({
                                            holder: "",
                                            type: "",
                                            value: param
                                        })
                                    })

                                    this.testCase.push(objectCase)

                                })

                                this.onChangeParameters(true)

                            }
                        }
                    })

                    const fileType = this.fileType.find(fileType => fileType.value === dataDetail.fileType)
                    if(fileType != undefined) this.setSelectedFileType(fileType.id)

                    this.isLoaded = true

                }
            })
        },
        setSelectedFileType(id) {

            this.fileType.map((item, i) => {
                if(item.id == id) {

                    this.fileType[i].selected = true
                    this.selectedFileType = [item]

                } else {

                    this.fileType[i].selected = false

                }
            })

        },
        async fetchApiStudio(params) {
            this.isSubmit = true

            var dispatch = ''

            if(this.action == 'edit') dispatch = 'Studio/edit'
            else dispatch = 'Studio/create'

            var customParams = {
                params: params
            }

            if(this.action == 'edit') customParams.id = this.studioId

            // console.log(customParams, "PARAMS")
            // return this.isSubmit = false

            await this.$store.dispatch(dispatch, customParams).then(() => {
                var stateStudio = this.$store.state.Studio

                if(!stateStudio.status) {

                    console.log('Failed post studio', stateStudio.message)
                    this.setEvent(stateStudio.message, stateStudio.status)
                    this.isSubmit = false

                } else {

                    var message = `Berhasil ${this.action == 'edit' ? 'Mengubah' : 'Menambah'} Data.`
                    this.setEvent(message, stateStudio.status)
                    this.isSubmit = false

                    if(this.action != 'edit') this.onResetForm()

                    setTimeout(() => {
                        this.$router.go(-1)
                    }, 1000);

                }
            })
        },
        onSubmitForm(event) {
            event.preventDefault()

            var isLanguageActive = false

            if(this.selectedExt != null && this.selectedExt.length != 0){
                isLanguageActive = true

                if (!this.isHtmlSelected) {
                    this.dataTab.map((item, index) => {
    
                        if (this.studioVersion == 2 && (item.templateCode.trim() == '' || item.testCode.trim() == '' || item.correctCodeTemplate.trim() == '')) {
                            return this.setEvent(`Template Code, Test Code, atau Correction Code pada bahasa ${item.text} masih kosong`, false)
                        }
    
                        if (item.templateCode.trim() == '' || item.testCode.trim() == '') {
    
                            return this.setEvent(`Template Code atau Test Code pada bahasa ${item.text} masih kosong`, false)
    
                        }
    
                    })
                }

            } else {
                return this.setEvent('Pilih Salah Satu Bahasa Terlebih Dahulu', false)
            }

            var isReady = true

            if (isReady) {
                var output = {}

                this.inputForm.forEach(item => {
                    if (item.name == 'associatedFileExtension') output['ext'] = this.selectedExt[0].value
                    else if (item.name == 'timer') output['timer'] = parseInt(item.value)
                    else output[item.name] = item.value
                })

                output['submitCallback'] = ""
                output['visibility'] = "private"
                output['content'] = ""
                const templateArray = []
                const testArray = []
                let correctionArray = []
                const testCodeArray = [];
                this.dataTab.map((item, index) => {
                    const templateObject = {
                        ext: item.value,
                        code: item.templateCode
                    }
                    const templateCSSObject = {
                        ext: 'css',
                        code: item.templateCodeCSS
                    }
                    const templateJSObject = {
                        ext: 'js',
                        code: item.templateCodeJS
                    }
                    const testObject = {
                        ext: item.value,
                        code: item.testCode
                    }
                    const correctionObject = {
                        ext: item.value,
                        code: item?.correctCodeTemplate
                    }
                    const testCodeObject = {
                        ext: item?.value,
                        code: item?.testCode
                    }

                    testCodeArray.push(testCodeObject);
                    correctionArray.push(correctionObject)
                    templateArray.push(templateObject)
                    if (item.value === 'html') {
                        templateArray.push(templateCSSObject)
                        templateArray.push(templateJSObject)
                    }
                    testArray.push(testObject)
                })

                var caseArray = []
                this.testCase.map((item, index) => {
                    var caseObject = []
                    item.parameters.map((data, i) => {
                        caseObject.push(data.value)
                    })
                    caseArray.push(caseObject)
                })

                if (isLanguageActive) {
                    output['template'] = templateArray
                    output['testCodeTemplate'] = testArray
                    output['parameters'] = this.parameters
                    output['testCase'] = caseArray
                    output['version'] = this.studioVersion
                    output["testCodeTemplate"] = testCodeArray
                    if (this.studioVersion == 2) output['correctCodeTemplate'] = correctionArray
                }

                // console.log(output);
                this.fetchApiStudio(output)
            }
        },
        onResetForm() {
            this.inputForm.forEach(item => {
                if (item.type == 'number') item.value = 0
                else item.value = '';
            });
            this.fileType.map((item) => {
                item.selected = false
            })
            this.ext.map((item) => {
                item.selected = false
            })
            this.selectedFileType = []
            this.selectedExt = []
            this.isTabActive = null
            this.tabActiveIndex = null
            this.parameters = []
            this.testCase = []
            this.dataTab = []

            this.isChooseAll = true
            this.chooseAll()
        }
    }

}
</script>

<style lang="scss" scope>
.monaco_editor_container {
    span {
        font-family: Menlo, Monaco, "Courier New", monospace;
    }
}
.ace_editor, .ace_editor *{
font-family: "Monaco", "Menlo", "Ubuntu Mono", "Droid Sans Mono", "Consolas", monospace !important;
font-size: 12px !important;
font-weight: 400 !important;
letter-spacing: 0 !important;
}
.city-card, .nav-link {
    user-select: none;
}
</style>
