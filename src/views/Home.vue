<template>
  <v-container class="align-center flex-column text-center mt-10 pb-15">
    <v-row justify="center">
      <v-col cols="6">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="11">
              <v-slider v-model="diffusionLayerSize" thumb-label="always" label="Diffusion layer size (bits)" max="1024"
                min="16" step="8"></v-slider>
            </v-col>
            <v-col>
              <v-tooltip location="end">
                <template v-slot:activator="{ props }">
                  <v-icon icon="mdi-help-circle" v-bind="props"></v-icon>
                </template>
                <p>Dimension of the linear transformation's square matrix.</p>
                <p>The bigger the number, the less efficient the cipher is,</p>
                <p>but the block size is bigger.</p>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="11">
              <v-slider v-model="numberOfDoubles" thumb-label="always" label="The number of doublings" max="10" min="0"
                v-bind="props" step="1"></v-slider>
            </v-col>
            <v-col>
              <v-tooltip location="end">
                <template v-slot:activator="{ props }">
                  <v-icon icon="mdi-help-circle" v-bind="props"></v-icon>
                </template>
                <p>
                  The number of times the diffusion layer and the block is doubled.
                </p>
              </v-tooltip>
            </v-col>
          </v-row>

          <v-select v-model="linearTransformationType" :items="linearTransformations"
            :rules="[v => !!v || 'To pole jest wymagane']" label="Diffusion matrix" required>
          </v-select>

          <v-select v-model="nonLinearTransformationType" :items="nonLinearTransformations"
            :rules="[v => !!v || 'To pole jest wymagane']" label="Non-linear transformation" required>
          </v-select>
          <v-text-field v-model="affineCoefficient" :rules="coefficientRules" :counter="10"
            label="The affine transformation coefficient" required></v-text-field>
          <v-text-field v-model="affineConstant" :rules="constantRules" :counter="11"
            label="The affine transformation constant" required></v-text-field>
          <v-progress-linear v-model="fullProgress" color="primary" class="text-white" height="30">
            {{ numberOfBitsText(Math.pow(2, this.numberOfDoubles) * this.diffusionLayerSize) }} block
          </v-progress-linear>
          <br />
          <v-progress-linear v-model="fullProgress" color="red" class="text-white" height="30">
            {{ (0.25 + (Math.pow(this.diffusionLayerSize, 2) * 2)/8192).toFixed(2)}} kB RAM memory required 
          </v-progress-linear>
          <br />
          <v-tooltip text="Minimal number of rounds required." location="bottom">
            <template v-slot:activator="{ props }">
              <v-progress-linear v-model="fullProgress" color="secondary" class="text-black" height="30" v-bind="props">
                {{ numberOfRounds() }} round 
              </v-progress-linear>
            </template>
          </v-tooltip>
          <v-container class="pa-12" fluid>
            <v-tooltip text="Click to generate code in Python">
              <template v-slot:activator="{ props }">
                <v-btn :disabled="!valid" color="success" @click="validate" v-bind="props">
                  Generate 
                </v-btn>
              </template>
            </v-tooltip>
          </v-container>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  data: () => ({
    fullProgress: 100,
    valid: false,
    nonLinearTransformations: [
      'Inversion',
      'Cube'
    ],
    linearTransformations: [
      'Cyclic',
      'Vandermonde',
      'Cauchy'
    ],
    nonLinearTransformationType: null,
    linearTransformationType: null,
    affineCoefficient: null,
    affineConstant: null,
    numberOfDoubles: 1,
    diffusionLayerSize: 64,

    coefficientRules: [
      v => {
        const coefficient = parseInt(v);
        return (!isNaN(coefficient) && coefficient.toString() === v && coefficient < 256 && coefficient > 0) || 'The factor has to be a natural number smaller than 256';
      }
    ],
    constantRules: [
      v => {
        const constant = parseInt(v);
        return (!isNaN(constant) && constant.toString() === v && constant < 256 && constant > 0) || 'The constant has to be a natural number smaller than 256';
      }
    ]
  }),
  methods: {
    numberOfRounds() {
      const q = 1 / 8;
      const p = 1 / 64;
      const c = this.diffusionLayerSize / 8;
      const n = this.numberOfDoubles;
      const bl = c + 1;
      const bs = c + 1;
      const a = (1 - c * Math.pow(2, n)) / (Math.pow(3, n) * bl) * Math.log(2) / Math.log(p);
      const b = (- c * Math.pow(2, n - 1)) / (Math.pow(3, n) * bs) * Math.log(2) / Math.log(q);
      return Math.ceil(Math.max(a, b));
    },
    numberOfBitsText(number) {
      return number + ' bits';
    },
    validate() {
      this.$refs.form.validate()
      console.log("Number of doubles", this.numberOfDoubles);
      this.$router.push({
        name: 'Splash', query: {
          nonLinearTransformationType: this.nonLinearTransformationType,
          affineCoefficient: this.affineCoefficient,
          affineConstant: this.affineConstant,
          linearTransformationType: this.linearTransformationType,
          diffusionLayerSize: this.diffusionLayerSize,
          numberOfDoubles: this.numberOfDoubles,
        }
      });
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
  }
}
</script>
