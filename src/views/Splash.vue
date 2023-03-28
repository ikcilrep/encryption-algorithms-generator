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
      console.log(this.diffusionLayerSize);
      console.log(this.numberOfDoubles);
      this.$router.push({
        name: 'Completed', query: {
          blockSize: this.diffusionLayerSize / 8 * Math.pow(2, this.numberOfDoubles),
          diffusionMatrix: this.generateMatrix(),
          sBox: this.generateSBox(),
        }
      });
    },
    multiplyInFiniteField(a, b) {
      let p = 0;
      while (a != 0 && b != 0) {
        if (b & 1) /* if the polynomial for b has a constant term, add the corresponding a to p */
          p ^= a; /* addition in GF(2^m) is an XOR of the polynomial coefficients */

        if (a & 0x80) /* GF modulo: if a has a nonzero term x^7, then must be reduced when it becomes x^8 */
          a = (a << 1) ^ 0x11b; /* subtract (XOR) the primitive polynomial x^8 + x^4 + x^3 + x + 1 (0b1_0001_1011) – you can change it but it must be irreducible */
        else
          a <<= 1; /* equivalent to a*x */
        b >>= 1;
      }
      return p;
    },

    cubeInFiniteField(a) {
      const squared = this.multiplyInFiniteField(a, a);
      return this.multiplyInFiniteField(a, squared);
    },

    inverseInFiniteField(a) {
      let result = this.cubeInFiniteField(this.cubeInFiniteField(this.cubeInFiniteField(this.cubeInFiniteField(this.cubeInFiniteField(a)))));
      for (let i = 0; i < 11; i++) {
        result = this.multiplyInFiniteField(a, result);
      }
      return result;
    },

    generateSBox() {
      const sbox = [];
      if (this.nonLinearTransformationType === "Inwersja") {
        for (let i = 0; i < 256; i++) {
          const element = this.multiplyInFiniteField(this.inverseInFiniteField(i), this.affineCoefficient) ^ this.affineConstant;
          sbox.push(element);
        }
      } else if (this.nonLinearTransformationType === "Potęga trzecia") {
        for (let i = 0; i < 256; i++) {
          const element = this.multiplyInFiniteField(this.cubeInFiniteField(i), this.affineCoefficient) ^ this.affineConstant;
          sbox.push(element);
        }
      }
      return sbox;
    },
    generateMatrix() {
      const matrix = [];
      if (this.linearTransformationType === "Cykliczna") {
        for (let i = 0; i < this.diffusionLayerSize / 8; i++) {
          const row = [];
          for (let j = 0; j < this.diffusionLayerSize / 8; j++) {
            row.push((i + j) % (this.diffusionLayerSize / 8) + 1);
          }
          matrix.push(row);
        }
        return matrix;
      } else {
        for (let i = 0; i < this.diffusionLayerSize / 8; i++) {
          const row = [];
          for (let j = 0; j < this.diffusionLayerSize / 8; j++) {
            const a = 2 * i;
            const b = 2 * j + 1;
            row.push(this.inverseInFiniteField(a ^ b));
          }
          matrix.push(row);
        }
        return matrix;
      }
    }
  },
  mounted() {
    console.log(this.generateSBox());
    console.log(this.linearTransformationType);
    console.log(this.generateMatrix());
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
