<template>
  <input type="number" v-model="value" ref="input" :class="styles['amount-input']" />
</template>

<script lang="ts">
import type { ICellEditorParams } from 'ag-grid-community';
import { nextTick, ref, defineComponent } from 'vue';
import type { PropType } from 'vue';

import styles from './styles.module.css';

export default defineComponent({
  props: {
    params: { type: Object as PropType<ICellEditorParams>, required: true }
  },
  setup(props) {
    // the current/initial value of the cell (before editing)
    const value = ref(props.params.value);
    const input = ref<HTMLInputElement>();

    /* Component Editor Lifecycle methods */
    // the final value to send to the grid, on completion of editing
    const getValue = () => {
      // this simple editor doubles any value entered into the input
      return value.value;
    };

    // Gets called once before editing starts, to give editor a chance to
    // cancel the editing before it even starts.
    const isCancelBeforeStart = () => {
      return false;
    };

    // Gets called once when editing is finished (eg if Enter is pressed).
    // If you return true, then the result of the edit will be ignored.
    const isCancelAfterEnd = () => {
      // our editor will reject any value greater than 1000
      return value.value > 999;
    };

    return {
      styles,
      value,
      input,
      getValue,
      isCancelBeforeStart,
      isCancelAfterEnd
    };
  },
  mounted() {
    // focus on the input field once editing starts
    nextTick(() => this.input?.focus());
  }
});
</script>
