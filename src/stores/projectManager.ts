import Project from '@/calculator/model/project';
import { defineStore } from 'pinia';
import { useCounterStore } from './counter';
import { useAlarmStore } from './alarm';
import { message } from 'ant-design-vue';

export const useProjectStore = defineStore('projectMgr', {
  // 推荐使用 完整类型推断的箭头函数
  state: () => {
    return {
      projectList: Array<string>(),
      currentProject: '$Project',
      loaded: false,
      firstUse: false
    };
  },
  getters: {
    selectedKey: (state) => {
      return [state.currentProject];
    }
  },
  actions: {
    init() {
      const rawProjectList = localStorage.getItem('project_list');
      if (rawProjectList) this.projectList = JSON.parse(rawProjectList);
      else this.firstUse = true;

      const rawCurrentProject = localStorage.getItem('current_project');
      if (rawCurrentProject) {
        this.currentProject = rawCurrentProject;
      }
    },
    save() {
      localStorage.setItem('project_list', JSON.stringify(this.projectList));
      localStorage.setItem('current_project', this.currentProject);
    },
    switchProject(name: string) {
      if (name === this.currentProject) return;

      this.saveProject();

      this.currentProject = name;
      this.loadProejct();
      this.save();
    },
    async loadProejct() {
      const counterStore = useCounterStore();
      const alarmStore = useAlarmStore();
      const rawProject = localStorage.getItem(this.currentProject);
      if (rawProject) {
        const project = JSON.parse(rawProject);
        await counterStore.loadProject(project);
        await alarmStore.loadProject(project);
      } else {
        counterStore.reset();
        alarmStore.reset();
      }
      this.loaded = true;
    },
    newProject(name: string) {
      if (this.projectList.length > 0) {
        this.saveProject();
      }
      if (this.projectList.indexOf(name) == -1) {
        this.projectList.push(name);
        this.currentProject = name;
        this.save();
      }
    },
    saveProject() {
      if (this.loaded) {
        const counterStore = useCounterStore();
        const alarmStore = useAlarmStore();
        if (this.projectList.length != 0) {
          new Project(
            this.currentProject,
            counterStore.itemList,
            counterStore.materialGraph,
            Array.from(alarmStore.alarmIdSet)
          ).save();
          message.success(`${this.currentProject} 保存成功`);
        }
      }
    },
    deleteProject(name: string) {
      const counterStore = useCounterStore();
      const alamrStore = useAlarmStore();
      localStorage.removeItem(name);
      if (name === this.currentProject) {
        if (this.projectList.length == 1) {
          counterStore.reset();
          alamrStore.reset();
          this.currentProject = 'Project';
          this.projectList = [];
        } else {
          const prevIdx = this.projectList.indexOf(name);
          const idx = this.projectList.length == prevIdx + 1 ? 0 : prevIdx;
          this.projectList.splice(prevIdx, 1);
          this.currentProject = this.projectList[idx];
          this.loadProejct();
        }
      } else {
        const prevIdx = this.projectList.indexOf(name);
        this.projectList.splice(prevIdx, 1);
      }
      this.save();
      return this.projectList.length == 0;
    }
  }
});
