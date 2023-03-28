<template>
  <v-container class="align-center flex-column text-center mt-10 pb-15">
    <v-row justify="center">
      <v-col cols="6">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="11">
              <v-slider v-model="diffusionLayerSize" thumb-label="always" label="Liczba bitów siatki dyfuzji" max="1024"
                min="16" step="8"></v-slider>
            </v-col>
            <v-col>
              <v-tooltip location="end">
                <template v-slot:activator="{ props }">
                  <v-icon icon="mdi-help-circle" v-bind="props"></v-icon>
                </template>
                <p>Wymiar kwadratowej macierzy przekształcenia liniowego.</p>
                <p>Im większa jest to liczba, tym mniejsza wydajność,</p>
                <p>ale większy rozmiar bloku.</p>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="11">
              <v-slider v-model="numberOfDoubles" thumb-label="always" label="Liczba podwojeń" max="10" min="0"
                v-bind="props" step="1"></v-slider>
            </v-col>
            <v-col>
              <v-tooltip location="end">
                <template v-slot:activator="{ props }">
                  <v-icon icon="mdi-help-circle" v-bind="props"></v-icon>
                </template>
                <p>
                  Liczba podwojeń wielkości siatki dyfuzji czyli równoznacznie
                </p>
                <p>
                  wielkości bloku.
                </p>
              </v-tooltip>
            </v-col>
          </v-row>

          <v-select v-model="linearTransformationType" :items="linearTransformations"
            :rules="[v => !!v || 'To pole jest wymagane']" label="Macierz dyfuzji" required>
          </v-select>

          <v-select v-model="nonLinearTransformationType" :items="nonLinearTransformations"
            :rules="[v => !!v || 'To pole jest wymagane']" label="Nieliniowe przekształcenie" required>
          </v-select>
          <v-text-field v-model="affineCoefficient" :rules="coefficientRules" :counter="10"
            label="Współczynnik przekształcenia afinicznego" required></v-text-field>
          <v-text-field v-model="affineConstant" :rules="constantRules" :counter="11"
            label="Stała przekształcenia afinicznego" required></v-text-field>
          <v-progress-linear v-model="fullProgress" color="primary" class="text-white" height="30">
            Blok {{ numberOfBitsText(Math.pow(2, this.numberOfDoubles) * this.diffusionLayerSize) }}
          </v-progress-linear>
          <br />
          <v-tooltip text="Minimalna liczba rund, która jest konieczna w procesie szyfrowania." location="bottom">
            <template v-slot:activator="{ props }">
              <v-progress-linear v-model="fullProgress" color="secondary" class="text-black" height="30" v-bind="props">
                {{ numberOfRounds() }} runda
              </v-progress-linear>
            </template>
          </v-tooltip>
          <v-container class="pa-12" fluid>
            <v-tooltip text="Kliknij aby wygenerować kod szyfrujący w Pythonie">
              <template v-slot:activator="{ props }">
                <v-btn :disabled="!valid" color="success" @click="validate" v-bind="props">
                  Wygeneruj
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
      'Inwersja',
      'Potęga trzecia'
    ],
    linearTransformations: [
      'Cykliczna',
      'Vandermond\'a',
      'Cauchy\'iego'
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
        return (!isNaN(coefficient) && coefficient.toString() === v && coefficient < 256 && coefficient > 0) || 'Współczynnik musi być liczbą naturalną mniejszą niż 256';
      }
    ],
    constantRules: [
      v => {
        const constant = parseInt(v);
        return (!isNaN(constant) && constant.toString() === v && constant < 256 && constant > 0) || 'Stała musi być liczbą naturalną mniejszą niż 256';
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
      return (number > 1000 || number < 100) && number % 10 < 5 && number % 10 > 1 ? number + ' bity' : number + ' bitów'
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
