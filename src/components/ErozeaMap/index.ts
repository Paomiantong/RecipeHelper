import { createVNode, render, ref } from 'vue';
import ErozeaMap, { erozeaMap } from '@/components/ErozeaMap/ErozeaMap.vue';

declare global {
  interface Window {
    YZWF: any;
  }
}

// 准备装载dom得容器
const el = document.createElement('div'); // 创建div
el.id = 'map-wrapper'; // 修改ID
document.body.appendChild(el); // 把div加到body中

const vref = ref(null);
const vnode = createVNode(ErozeaMap, { ref: vref });
render(vnode, el);

export default erozeaMap;
