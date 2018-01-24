/**
 * class used to store global reference data
 */
let instance = null;

export default class ReferenceData {
  constructor() {
    if (!instance) {
      instance = this;
    } else {
      return instance;
    }
  }
  states = [];
  activityTypes = [];
  leadTags = [];
  leadTagsMap = new Map();
  userInfo = [];
  companyUnfo = [];
  leadStages = [];
  leadStagesMap = new Map();

  static getInstance() {
    if (!instance) {
      return new ReferenceData();
    }
    return instance;
  }

  /**
   * save both the array and map
   * @param {array} tags
   */
  setLeadTags(tags) {
    this.leadTags = tags;
    // add the selection for none
    if (Array.isArray) {
      this.leadTags.push({ id: 0, name: 'none' });
    }
    // convert the array to a map
    if (Array.isArray(tags)) {
      tags.forEach((tag) => {
        this.leadTagsMap.set(tag.id, tag.name);
      });
    }
  }

  getLeadTags() {
    return this.leadTags;
  }

  lookupTagname(id) {
    return this.leadTagsMap.get(id);
  }

  setLeadStages(stages) {
    this.leadStages = stages;
    // convert array in to map
    if (Array.isArray(stages)) {
      stages.forEach((stage) => {
        this.leadStagesMap.set(stage.id, stage.name);
      });
    }
  }

  getLeadStages() {
    return this.leadStages;
  }

  lookupStageName(id) {
    return this.leadStagesMap.get(id);
  }

  setActivityTypes(types) {
    this.activityTypes = types;
  }

  getActivityTypes() {
    return this.activityTypes;
  }

  setStates(states) {
    this.states = states;
  }

  getStates() {
    return this.states;
  }

  setUserInfo(info) {
    this.userInfo = info;
  }

  getUserInfo() {
    if (Array.isArray(this.userInfo)) {
      return this.userInfo[0];
    }
    
    return this.userInfo;
  }

  getUserLocal() {
    return this.getUserInfo().lang;
  }

  setCompanyInfo(info) {
    this.companyUnfo = info;
  }

  getCompanyInfo() {
    return this.companyInfo;
  }

  /**
   * returns the default company for the user
   */
  getUserCompany() {
    const info = this.getUserInfo();
    if (info !== undefined) {
      return info.company_id[0];
    }

    return null;
  }

  getUserLanguage() {
    const info = this.getUserInfo();
    if (info !== undefined) {
      return info.lang;
    }

    return null;
  }
}

