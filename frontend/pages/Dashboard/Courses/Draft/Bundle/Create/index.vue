<template>
  <div class="container-fluid mt-4">

      <div class="w-100 d-flex justify-content-center mb-3 align-items-center py-4">
        <ProgressHeader 
          :getSteps="steps"
        />
      </div>
          
      <BundleForm 
        :getSteps="steps" 
        :activeStep="activeStep" 
        @nextSteps="nextStep"
        @previousStep="previousStep"
      />

  </div>
</template>

<script>
import ProgressHeader from "~/components/template/micro/header/ProgressHeader.vue"
import ContentHeader from "@/components/template/dashboard/ContentHeader.vue"
import BundleForm from "@/components/template/micro/form/BundleForm.vue"

import { STEPS_BUNDLE } from '~/commons/constants/course';
import { toEncrypt ,toDecrypt } from '~/commons/utils'


export default {
  layout: 'dashboard',
  components: {
    ProgressHeader,
    ContentHeader,
    BundleForm
  },
  data(){
    return{
      steps: [],
      activeStep: '',
    }
  },
  created(){
    this.initializeSteps();
  },
  methods: {
    initializeSteps(){
        this.steps = JSON.parse(JSON.stringify(STEPS_BUNDLE));
        const activeStep = toDecrypt(localStorage.getItem("active_step"));
        let stopLoop = false;

        if(!!activeStep){
            this.steps.map((item) => {
                if(item.key == activeStep){
                    stopLoop = true;
                    item.status = "inProgress";
                    this.activeStep = item.key;
                }else if(!stopLoop){
                    item.status = "completed"
                }
            })
        }
        else{
            this.steps.map((item) => {
              if(item.status == 'inProgress') this.activeStep = item.key;
              // if(item.status == 'inProgress') localStorage.setItem("active_step", toEncrypt(item.key)), this.activeStep = item.key;
            });
        }
    },
    nextStep(nextStep){
      let stopLoop = false;

      this.steps.map((item, index) => {
          if(item.key == nextStep){
              stopLoop = true;
              item.status = 'inProgress';
              // localStorage.setItem("active_step", toEncrypt(item.key));
              this.activeStep = item.key;
          }else if(!stopLoop){
              item.status = "completed";
          }else{
              item.status = "notStarted";
          }
      })
    },
    previousStep(){
      let stopLoop = false;

      this.steps.map((item, index) => {
          if(this.activeStep != this.steps[0]?.key){
              if(this.steps[index + 1]?.key == this.activeStep){
                  stopLoop = true;
                  item.status = "inProgress";
                  // localStorage.setItem("active_step", toEncrypt(item.key));
                  this.activeStep = item.key;
              }else if(!stopLoop){
                  item.status = "completed";
              }else{
                  item.status = "notStarted";
              }
          }else{
              item.key == this.steps[0].key  ? item.status = "inProgress"  : item.status = "notStarted";
          }
      });
    },
  },
  beforeDestroy(){
    localStorage.removeItem("active_step");
  }
}
</script>