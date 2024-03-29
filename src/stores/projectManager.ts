import Project from '@/calculator/model/project';
import { defineStore } from 'pinia';
import { useCounterStore } from './counter';
import { message } from 'ant-design-vue';

export const useProjectStore = defineStore('projectMgr', {
  // 推荐使用 完整类型推断的箭头函数
  state: () => {
    return {
      projectList: Array<string>(),
      currentProject: '$Project',
      loaded: false,
      first_use: false
    };
  },
  getters: {
    selectedKey: (state) => {
      return [state.currentProject];
    }
  },
  actions: {
    init() {
      const raw_project_list = localStorage.getItem('project_list');
      if (raw_project_list) this.projectList = JSON.parse(raw_project_list);
      else {
        this.first_use = true;
      }
      const raw_current_project = localStorage.getItem('current_project');
      if (raw_current_project) {
        this.currentProject = raw_current_project;
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
      const raw_project = localStorage.getItem(this.currentProject);
      if (raw_project) {
        await counterStore.loadProject(JSON.parse(raw_project));
      } else {
        counterStore.reset();
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
        if (this.projectList.length != 0) {
          new Project(
            this.currentProject,
            counterStore.itemList,
            counterStore.materialGraph
          ).save();
          message.success(`${this.currentProject} 保存成功`);
        }
      }
    },
    deleteProject(name: string) {
      const counterStore = useCounterStore();
      localStorage.removeItem(name);
      if (name === this.currentProject) {
        if (this.projectList.length == 1) {
          counterStore.reset();
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
