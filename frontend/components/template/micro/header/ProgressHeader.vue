<template>
  <section id="progress-header" :style="`width: ${size}%`">
      <div class="container">
          <div class="d-flex align-items-center">
              <template v-if="getSteps">
                  <template v-for="(step, index) in getSteps">
                      <div :class="['d-flex align-items-center', labelDirection === 'vertical' ? 'flex-column' : 'gap-2']" :key="step?.key">
                          <div :class="`number-box ${step.status == 'notStarted' ? 'not-started' : ''}${step.status == 'inProgress' ? 'in-progress' : ''}${step.status == 'completed' ? 'completed' : ''}`">
                              <i class="ri-check-fill" v-if="step.status == 'completed'"></i>
                              <span class="number" v-else>{{ ++index }}</span>
                          </div>
                          <p :class="`step-label mb-0 ${step.status == 'inProgress' || step.status == 'completed' ? 'text-primary' : ''}`" style="white-space: nowrap;">{{ step.name }}</p>
                      </div>
                      <span v-if="index < getSteps.length" :class="`divider ${step.status == 'notStarted' || step.status == 'inProgress' ? 'divider-notstarted' : ''}${step.status == 'completed' ? 'divider-completed' : ''}`" style="margin:0px 24px;" :key="index"></span>
                  </template>
              </template>
          </div>
      </div>
  </section>
</template>

<script>
// import { STEPS_BUNDLE } from '~/commons/constants/course';

export default {
    props:{
        getSteps: {
          type: Array,
          default: [],
        },
        size: {
            type: Number,
            default: 50
        },
        labelDirection: {
            type: String,
            default: 'horizontal'
        }
    },
    created(){
    //   console.log(this.getSteps, 33);  
    },
    watch:{
      getSteps(newValue, oldValue){
        console.log(newValue, 37);
      }
    },
    data(){
        return{
            // getSteps: STEPS_BUNDLE,
        }
    }
}
</script>

<style lang="scss" scoped>
#progress-header{
//   width: 50%;

  .number-box{
      width: 29px;
      height: 29px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
  }

  .not-started{
      border: 1px solid rgba(0, 0, 0, .5);
  }

  .in-progress{
      box-shadow: 0px 0px 15px -5px var(--bs-primary);
      border: 1px solid var(--bs-primary);
      
      span{
          color: var(--bs-primary);
      }
  }

  .completed{
      background-color: var(--bs-primary);
      color: white;
  }

  .step-label{
      font-size: 14px;
      font-weight: 400;
  }

  .divider {
      flex-grow: 1;
      height: 1px;
  }

  .divider-notstarted{
      border-bottom: 2px dashed rgba(0, 0, 0, .3);
  }

  .divider-completed{
      border-bottom: 2px dashed var(--bs-primary);
  }
}
</style>