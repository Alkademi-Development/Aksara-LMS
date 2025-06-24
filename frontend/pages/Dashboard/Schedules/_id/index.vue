<template>
    <div>

        <div class="event container-fluid mt-4">
                
            <DetailEvent :eventSlug="eventSlug" />
            

        </div>

    </div>
</template>

<script>
import { toDecrypt } from '@/commons/utils'
import DetailEvent from "@/components/events/DetailEvent"

export default {
  async asyncData({ params }){
    const eventSlug = params?.id;

    return { eventSlug }
  },
  layout: 'dashboard',
  components: {
    DetailEvent
  }

}
</script>
