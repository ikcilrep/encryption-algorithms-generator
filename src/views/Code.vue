<template>
  {{ code }}
</template>

<script>

import code from '@/assets/encryption.txt';
console.log(code);
export default {
  data: () => ({
    code
  }),
  mounted() {
    this.saveFile();
  },
  methods: {
    async saveFile() {
      const data = await fetch(code);
      const text= await data.text();
      const blob = new Blob([], { type: 'text/plain' })
      const e = document.createEvent('MouseEvents'),
        a = document.createElement('a');
      a.download = "encryption.py";
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    }
  }
}
</script>
