<template>
  <v-container class="fill-height">
    <v-container>
      <v-row align="center" justify="center" class="fill-height">
        <v-icon size="200" color="green darken-2" icon="mdi-check"></v-icon>
      </v-row>
      <v-row align="center" justify="center" class="fill-height">
        Code generation completed!
      </v-row>
      <v-container class="pt-15" fluid>
        <v-row align="center" justify="center" class="fill-height">
          <v-btn color="primary" @click="saveFile">
            Download the code
            <v-icon icon="mdi-download"></v-icon>
          </v-btn>
        </v-row>
      </v-container>
    </v-container>
  </v-container>
</template>

<script>

import code from '@/assets/encryption.txt';
export default {
  props: ['nonLinearTransformationType', 'affineCoefficient', 'affineConstant', 'linearTransformationType', 'diffusionLayerSize', 'numberOfDoubles', 'blockSize'],
  methods: {
    async saveFile() {
      const data = await fetch(code);
      let text = await data.text();
      const diffusionMatrix = this.generateMatrix();
      const sBox = this.generateSBox();

      text = text.replace('DIFFUSION_MATRIX', `[${diffusionMatrix.map(row => `[${row}]`)}]`);
      text = text.replace('BLOCK_SIZE', this.blockSize);
      text = text.replace('S_BOX', `[${sBox}]`);
      const blob = new Blob([text], { type: 'text/plain' })
      const e = document.createEvent('MouseEvents'),
        a = document.createElement('a');
      a.download = "encryption.py";
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
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
      if (this.nonLinearTransformationType === "Inversion") {
        for (let i = 0; i < 256; i++) {
          const element = this.multiplyInFiniteField(this.inverseInFiniteField(i), this.affineCoefficient) ^ this.affineConstant;
          sbox.push(element);
        }
      } else if (this.nonLinearTransformationType === "Cube") {
        for (let i = 0; i < 256; i++) {
          const element = this.multiplyInFiniteField(this.cubeInFiniteField(i), this.affineCoefficient) ^ this.affineConstant;
          sbox.push(element);
        }
      }
      return sbox;
    },

    powerInFiniteField(a, b) {
      let result = 1;
      for (let i = 0; i < b; i++) {
        result = this.multiplyInFiniteField(a, result);
      }
      return result;
    },
    generateMatrix() {
      const matrix = [];
      if (this.linearTransformationType === "Cyclic") {
        for (let i = 0; i < this.diffusionLayerSize / 8; i++) {
          const row = [];
          for (let j = 0; j < this.diffusionLayerSize / 8; j++) {
            row.push((i + j) % (this.diffusionLayerSize / 8) + 1);
          }
          matrix.push(row);
        }
        return matrix;
      } else if (this.linearTransformationType == "Vandermonde") {
        for (let i = 0; i < this.diffusionLayerSize / 8; i++) {
          const row = [];
          for (let j = 0; j < this.diffusionLayerSize / 8; j++) {
            row.push(this.powerInFiniteField(i, j));
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
  }
}
</script>
