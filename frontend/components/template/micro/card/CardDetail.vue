<template>
  <div class="row">
    <div class="col">
      <div class="card card-stats">
        <!-- Card body -->
        <div class="card-body">
          <div class="row">
            <div class="col">
              <h5 class="card-title text-uppercase text-muted mb-0">Pendaftaran</h5>
              <span class="h2 font-weight-bold mb-0">{{ registration }}</span>
            </div>
            <div class="col">
              <h5 class="card-title text-uppercase text-muted mb-0">Pelaksanaan</h5>
              <span class="h2 font-weight-bold mb-0">{{ schedule }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    // sementara String
    registration: String,
    // sementara String
    schedule: String,
    items: Array
  }
}
</script>

<style>

</style>