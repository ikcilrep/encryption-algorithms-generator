<template>
  <v-container class="fill-height">
    <v-container>
      <v-row align="center" justify="center" class="fill-height">
        <v-icon size="200" color="green darken-2" icon="mdi-check"></v-icon>
      </v-row>
      <v-row align="center" justify="center" class="fill-height">
        Ukończono generację programu!
      </v-row>
      <v-container class="pt-15" fluid>
        <v-row align="center" justify="center" class="fill-height">
          <v-btn color="primary" @click="saveFile">
            Pobierz kod
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
  props: ['diffusionMatrix', 'blockSize', 'sBox'],
  methods: {
    async saveFile() {
      const data = await fetch(code);
      let text = await data.text();
      text = text.replace('DIFFUSION_MATRIX',  `[${this.diffusionMatrix.map(row => `[${row}]`)}]`);
      text = text.replace('BLOCK_SIZE', this.blockSize);
      text = text.replace('S_BOX', `[${this.sBox}]`);
      const blob = new Blob([text], { type: 'text/plain' })
      const e = document.createEvent('MouseEvents'),
        a = document.createElement('a');
      a.download = "encryption.py";
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    }
  }
}
</script>
