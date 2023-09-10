<template>
  <v-container class="fill-height">
    <v-container>
      <v-row align="center" justify="center" class="fill-height">
        <v-img height="200" src="logo.png" />
      </v-row>
      <v-row align="center" justify="center" class="fill-height">
        <v-col cols="1">
          <v-progress-linear v-model="percentage" color="green" height="25">
            <template v-slot:default="{ value }">
              <strong>{{ Math.ceil(value) }}%</strong>
            </template>
          </v-progress-linear>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
export default {
  props: ['nonLinearTransformationType', 'affineCoefficient', 'affineConstant', 'linearTransformationType', 'diffusionLayerSize', 'numberOfDoubles'],
  data: () => ({
    percentage: 0
  }),
  methods: {
    redirectHome() {
      this.$router.push({
        name: 'Completed', query: {
          blockSize: this.diffusionLayerSize / 8 * Math.pow(2, this.numberOfDoubles),
          nonLinearTransformationType: this.nonLinearTransformationType,
          numberOfDoubles: this.numberOfDoubles,
          diffusionLayerSize: this.diffusionLayerSize,
          affineCoefficient: this.affineCoefficient,
          affineConstant: this.affineConstant,
          linearTransformationType: this.linearTransformationType
        }
      });
    },
  },
  mounted() {
    const refreshId = setInterval(() => {
      if (this.percentage == 100) {
        setTimeout(() => {
          clearInterval(refreshId);
          this.redirectHome();
        }, 500);
      } else if (this.percentage < 100) {
        this.percentage += 1;
      }
    }, 12);
    //setTimeout(this.redirectHome, 1000);
  }
}
</script>
